import { NextRequest, NextResponse } from 'next/server';
import { AssistantRequestSchema, AssistantResponseSchema } from '@/lib/types';
import { analyzeWithGemini } from '@/lib/gemini';
import { demoScenarios } from '@/lib/demo-data';

// Rate limiting (simple in-memory per-IP)
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    // Parse and validate body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON format in request body.' },
        { status: 400 }
      );
    }
    const parseResult = AssistantRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parseResult.error.issues.map((i) => i.message) },
        { status: 400 }
      );
    }

    const validatedRequest = parseResult.data;

    // Demo mode: check for matching scenario first
    if (validatedRequest.scenarioId) {
      const scenario = demoScenarios.find((s) => s.id === validatedRequest.scenarioId);
      if (scenario) {
        return NextResponse.json(scenario.response);
      }
    }

    // Check for sufficient input
    if (!validatedRequest.text && !validatedRequest.imageBase64 && !validatedRequest.documentText) {
      return NextResponse.json(
        { error: 'Please provide text, an image, or a document to analyze.' },
        { status: 400 }
      );
    }

    // Check API key (server env or client header)
    const customKey = request.headers.get('x-gemini-key') || undefined;
    const apiKey = customKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'API_KEY_MISSING',
          message: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your .env.local file, or try Demo Mode with one of the sample scenarios.',
        },
        { status: 503 }
      );
    }

    // Call Gemini
    const rawResponse = await analyzeWithGemini(validatedRequest, apiKey);

    // Parse the JSON response from Gemini
    let parsedResponse: Record<string, unknown>;
    try {
      let jsonString = rawResponse.trim();
      const codeBlockMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        jsonString = codeBlockMatch[1].trim();
      } else {
        const firstBrace = jsonString.indexOf('{');
        const lastBrace = jsonString.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          jsonString = jsonString.slice(firstBrace, lastBrace + 1);
        }
      }
      parsedResponse = JSON.parse(jsonString);
    } catch {
      console.error('Failed to parse Gemini response as JSON');
      return NextResponse.json(
        { error: 'The AI returned an invalid response format. Please try again.' },
        { status: 502 }
      );
    }

    // Add requestId if missing
    if (!parsedResponse.requestId) {
      parsedResponse.requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Set isDemo to false for live responses
    parsedResponse.isDemo = false;

    // Normalize category
    const validCategories = [
      'government_schemes', 'education_support', 'disaster_assistance',
      'medical_information', 'public_services', 'legal_guidance',
      'transport_disruption', 'financial_assistance', 'general_inquiry',
    ];
    if (typeof parsedResponse.category !== 'string' || !validCategories.includes(parsedResponse.category)) {
      parsedResponse.category = 'general_inquiry';
    }

    // Normalize urgency
    const validUrgencies = ['routine', 'time_sensitive', 'urgent'];
    if (typeof parsedResponse.urgency !== 'string' || !validUrgencies.includes(parsedResponse.urgency)) {
      parsedResponse.urgency = 'routine';
    }
    parsedResponse.urgencyExplanation = parsedResponse.urgencyExplanation || 'Based on the circumstances provided.';

    // Normalize extractedFacts
    if (Array.isArray(parsedResponse.extractedFacts)) {
      parsedResponse.extractedFacts = parsedResponse.extractedFacts.map((f: Record<string, unknown>) => {
        let conf = typeof f.confidence === 'number' ? f.confidence : parseFloat(String(f.confidence));
        if (isNaN(conf)) conf = 0.9;
        if (conf > 1) conf = conf / 100;
        conf = Math.max(0, Math.min(1, conf));

        let src = String(f.source || '');
        if (src === 'user' || src === 'text') src = 'user_input';
        if (src === 'doc') src = 'document';
        if (!['user_input', 'document', 'image', 'ai_inference'].includes(src)) {
          src = 'user_input';
        }

        return {
          fact: typeof f.fact === 'string' ? f.fact : String(f.fact || ''),
          source: src,
          confidence: conf,
        };
      });
    } else {
      parsedResponse.extractedFacts = [];
    }

    // Normalize sources
    if (Array.isArray(parsedResponse.sources)) {
      parsedResponse.sources = parsedResponse.sources.map((s: Record<string, unknown>, idx: number) => ({
        id: s.id || `src-${idx + 1}`,
        title: s.title || 'Official Civic Resource',
        publisher: s.publisher || undefined,
        url: typeof s.url === 'string' && s.url.startsWith('http') ? s.url : null,
        supports: s.supports || 'General guidance',
        verificationStatus: ['official', 'community', 'unverified'].includes(String(s.verificationStatus))
          ? s.verificationStatus
          : 'unverified',
        checkedAt: s.checkedAt || null,
        publishedAt: s.publishedAt || null,
      }));
    } else {
      parsedResponse.sources = [];
    }

    // Normalize actions
    if (Array.isArray(parsedResponse.actions)) {
      parsedResponse.actions = parsedResponse.actions.map((a: Record<string, unknown>, i: number) => ({
        id: a.id || `action-${i + 1}`,
        stepNumber: typeof a.stepNumber === 'number' ? a.stepNumber : i + 1,
        title: a.title || `Action Step ${i + 1}`,
        description: a.description || '',
        whyItMatters: a.whyItMatters || undefined,
        requiredDocuments: Array.isArray(a.requiredDocuments) ? a.requiredDocuments : undefined,
        priority: ['low', 'normal', 'high', 'critical'].includes(String(a.priority)) ? a.priority : 'normal',
        status: 'pending',
        deadline: a.deadline || null,
        sourceIds: Array.isArray(a.sourceIds) ? a.sourceIds : [],
      }));
    } else {
      parsedResponse.actions = [];
    }

    parsedResponse.uncertainties = Array.isArray(parsedResponse.uncertainties) ? parsedResponse.uncertainties : [];
    parsedResponse.followUpQuestions = Array.isArray(parsedResponse.followUpQuestions) ? parsedResponse.followUpQuestions : [];
    parsedResponse.disclaimer = parsedResponse.disclaimer || 'This is AI-generated guidance. Please verify all information with official sources.';
    parsedResponse.language = parsedResponse.language || 'en';

    // Validate with Zod
    const validateResult = AssistantResponseSchema.safeParse(parsedResponse);
    if (!validateResult.success) {
      console.warn('Zod validation warning, returning normalized response:', validateResult.error.issues);
      return NextResponse.json(parsedResponse);
    }

    return NextResponse.json(validateResult.data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    console.error('Assistant API error:', message);

    let statusCode = 502;
    let safeMessage = 'An error occurred while communicating with Gemini API. Please try again.';

    if (message.includes('API key') || message.includes('PERMISSION_DENIED') || message.includes('403') || message.includes('401')) {
      statusCode = 401;
      safeMessage = 'Gemini API authentication failed. Please check your API key.';
    } else if (message.includes('Rate limit') || message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
      statusCode = 429;
      safeMessage = 'Gemini API rate limit exceeded. Please wait a moment and try again.';
    } else if (message.includes('timed out') || message.includes('AbortError')) {
      statusCode = 504;
      safeMessage = 'The request to Gemini timed out. Please try again with a shorter prompt or retry.';
    }

    return NextResponse.json(
      { error: safeMessage },
      { status: statusCode }
    );
  }
}

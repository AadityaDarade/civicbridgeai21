import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const shouldTest = searchParams.get('test') === 'true';

  const apiKey = process.env.GEMINI_API_KEY;
  const configured = Boolean(apiKey && apiKey.trim().length > 0);
  const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

  const baseStatus = {
    service: 'CivicBridge AI Assistant Health',
    configured,
    primaryModel,
    timestamp: new Date().toISOString(),
  };

  if (!shouldTest) {
    return NextResponse.json(baseStatus);
  }

  if (!configured || !apiKey) {
    return NextResponse.json(
      {
        ...baseStatus,
        ok: false,
        errorType: 'MISSING_API_KEY',
        message: 'GEMINI_API_KEY is not configured on the server.',
      },
      { status: 503 }
    );
  }

  const startTime = Date.now();
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = Array.from(new Set([
      primaryModel,
      'gemini-3.8-flash',
      'gemini-3.5-flash',
      'gemini-3.7-flash',
      'gemini-flash-latest',
    ]));

    let responseText = '';
    let usedModel = primaryModel;
    let lastError: unknown = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { maxOutputTokens: 10, temperature: 0.1 },
        });
        const result = await model.generateContent('ping');
        responseText = result.response.text();
        usedModel = modelName;
        break;
      } catch (err) {
        lastError = err;
        continue;
      }
    }

    if (!responseText && lastError) {
      throw lastError;
    }

    const latencyMs = Date.now() - startTime;
    return NextResponse.json({
      ...baseStatus,
      ok: true,
      modelUsed: usedModel,
      latencyMs,
      message: 'Successfully connected to Google Gemini API.',
    });
  } catch (error: unknown) {
    const latencyMs = Date.now() - startTime;
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    let errorType = 'API_ERROR';
    if (errMsg.includes('API key') || errMsg.includes('403') || errMsg.includes('PERMISSION_DENIED')) {
      errorType = 'INVALID_OR_RESTRICTED_KEY';
    } else if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
      errorType = 'RATE_LIMIT_OR_QUOTA_EXCEEDED';
    } else if (errMsg.includes('503') || errMsg.includes('high demand')) {
      errorType = 'SERVICE_OVERLOADED';
    }

    return NextResponse.json(
      {
        ...baseStatus,
        ok: false,
        latencyMs,
        errorType,
        message: 'Gemini API test call failed. Check model availability or quota.',
      },
      { status: 502 }
    );
  }
}

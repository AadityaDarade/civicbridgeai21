import { NextRequest, NextResponse } from 'next/server';
import { chatWithGemini, type ChatMessage } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON format in request body.' },
        { status: 400 }
      );
    }

    const { message, history = [], context = '', language = 'en' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required.' },
        { status: 400 }
      );
    }

    const customKey = request.headers.get('x-gemini-key') || undefined;
    const apiKey = customKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'API_KEY_MISSING',
          message: 'Gemini API key is not configured.',
        },
        { status: 503 }
      );
    }

    const reply = await chatWithGemini({
      message,
      history: history as ChatMessage[],
      context,
      language,
      apiKey,
    });

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Chat error';
    console.error('Chat API Error:', errMsg);
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    );
  }
}

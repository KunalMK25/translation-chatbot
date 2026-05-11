import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { text, targetLanguage, history } = await req.json();

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: 'Missing text or targetLanguage' }, { status: 400 });
    }

    const systemPrompt = `You are LinguaBot, an expert AI translation assistant. Your job is to translate text accurately and naturally.

When the user sends text to translate:
1. Translate the text into ${targetLanguage} naturally and accurately
2. After the translation, add a short note about any important cultural context, idiomatic nuances, or alternative phrasings if relevant
3. If the user asks a question about language or translation (e.g. "how do you say X in Y"), answer helpfully and directly
4. Keep responses clear and well-structured
5. Format: Start with the translation prominently, then add notes below if helpful

Always be friendly, accurate, and educational.`;

    const messages = [
      ...(history || []).slice(-10),
      { role: 'user' as const, content: `Translate to ${targetLanguage}: "${text}"` },
    ];

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const translation = response.content[0].type === 'text' ? response.content[0].text : '';

    return NextResponse.json({ translation });
  } catch (error: unknown) {
    console.error('Translation error:', error);
    const message = error instanceof Error ? error.message : 'Translation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

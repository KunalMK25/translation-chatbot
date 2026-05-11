import { NextRequest, NextResponse } from 'next/server';
import { LANG_CODES } from './lang-codes';

export { LANG_CODES };

const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

export async function POST(req: NextRequest) {
  try {
    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: 'Missing text or targetLanguage' }, { status: 400 });
    }

    const langCode = LANG_CODES[targetLanguage];
    if (!langCode) {
      return NextResponse.json({ error: `Unsupported language: ${targetLanguage}` }, { status: 400 });
    }

    // MyMemory uses bare ISO codes for most languages, but Hindi needs the full
    // locale pair (en-US|hi-IN) to return Devanagari script instead of Romanized text.
    const LOCALE_OVERRIDES: Record<string, string> = {
      hi: 'en-US|hi-IN',
    };
    const langpair = LOCALE_OVERRIDES[langCode] ?? `en|${langCode}`;
    const url = `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=${langpair}`;

    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });

    if (!res.ok) {
      return NextResponse.json({ error: 'Translation service unavailable. Please try again.' }, { status: 502 });
    }

    const data = await res.json();

    if (data.responseStatus !== 200) {
      return NextResponse.json({ error: data.responseDetails || 'Translation failed' }, { status: 500 });
    }

    const translation: string = data.responseData.translatedText;

    if (!translation || translation.trim().toLowerCase() === text.trim().toLowerCase()) {
      return NextResponse.json({ error: 'Could not translate this text. Please try a different phrase.' }, { status: 500 });
    }

    return NextResponse.json({ translation });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Translation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

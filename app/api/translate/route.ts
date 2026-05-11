import { NextRequest, NextResponse } from 'next/server';
import { LANG_CODES } from './lang-codes';

export { LANG_CODES };

const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

// Languages where MyMemory returns Romanized text — use Google Translate unofficial endpoint instead
const GOOGLE_TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single';
const USE_GOOGLE_FOR: Set<string> = new Set(['hi', 'kn']);

async function translateWithGoogle(text: string, targetLang: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      client: 'gtx',
      sl: 'en',
      tl: targetLang,
      dt: 't',
      q: text,
    });
    const res = await fetch(`${GOOGLE_TRANSLATE_URL}?${params}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    // Response format: [[[translatedText, originalText, ...], ...], ...]
    const translation: string = data?.[0]
      ?.map((chunk: any) => chunk?.[0] ?? '')
      .join('') ?? '';
    return translation.trim() || null;
  } catch {
    return null;
  }
}

async function translateWithMyMemory(text: string, langCode: string): Promise<string | null> {
  try {
    const url = `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=en|${langCode}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.responseStatus !== 200) return null;
    const translation: string = data.responseData.translatedText ?? '';
    return translation.trim() || null;
  } catch {
    return null;
  }
}

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

    let translation: string | null = null;

    if (USE_GOOGLE_FOR.has(langCode)) {
      // Use Google Translate for Hindi and Kannada — MyMemory returns Romanized text for these
      translation = await translateWithGoogle(text, langCode);
      // Fall back to MyMemory if Google fails
      if (!translation) {
        translation = await translateWithMyMemory(text, langCode);
      }
    } else {
      // Use MyMemory for all other languages
      translation = await translateWithMyMemory(text, langCode);
      // Fall back to Google if MyMemory fails
      if (!translation) {
        translation = await translateWithGoogle(text, langCode);
      }
    }

    if (!translation || translation.trim().toLowerCase() === text.trim().toLowerCase()) {
      return NextResponse.json(
        { error: 'Could not translate this text. Please try a different phrase.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ translation });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Translation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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

    // MyMemory requires bare ISO 639-1 codes in the langpair (e.g. en|hi, en|kn)
    // Using locale codes like hi-IN breaks the API and causes transliteration
    const url = `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=en|${langCode}`;

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

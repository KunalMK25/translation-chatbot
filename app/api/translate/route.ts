import { NextRequest, NextResponse } from 'next/server';
import { LANG_CODES } from './lang-codes';

export { LANG_CODES };

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

    // Use full locale codes for better accuracy (e.g. zh-CN, hi-IN, kn-IN)
    const FULL_LOCALE: Record<string, string> = {
      es: 'es-ES', fr: 'fr-FR', de: 'de-DE', it: 'it-IT',
      pt: 'pt-BR', ja: 'ja-JP', zh: 'zh-CN', ar: 'ar-SA',
      hi: 'hi-IN', ko: 'ko-KR', ru: 'ru-RU', nl: 'nl-NL',
      tr: 'tr-TR', pl: 'pl-PL', sv: 'sv-SE', kn: 'kn-IN',
    };
    const targetLocale = FULL_LOCALE[langCode] ?? langCode;

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en-GB|${targetLocale}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.responseStatus !== 200) {
      return NextResponse.json({ error: data.responseDetails || 'Translation failed' }, { status: 500 });
    }

    const translation = data.responseData.translatedText;

    // MyMemory occasionally returns the source text unchanged — detect and error
    if (translation.trim().toLowerCase() === text.trim().toLowerCase()) {
      return NextResponse.json({ error: 'Translation unavailable for this language pair. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ translation });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Translation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

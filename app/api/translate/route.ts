import { NextRequest, NextResponse } from 'next/server';
import { LANG_CODES } from './lang-codes';

export { LANG_CODES };

// LibreTranslate public instance — free, no API key required
const LIBRETRANSLATE_URL = 'https://libretranslate.com/translate';

// Fallback: MyMemory (also free, no key)
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

    // Try LibreTranslate first
    try {
      const libreRes = await fetch(LIBRETRANSLATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: langCode,
          format: 'text',
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (libreRes.ok) {
        const libreData = await libreRes.json();
        const translation = libreData.translatedText;
        if (translation && translation.trim().toLowerCase() !== text.trim().toLowerCase()) {
          return NextResponse.json({ translation });
        }
      }
    } catch {
      // LibreTranslate failed or timed out — fall through to MyMemory
    }

    // Fallback: MyMemory with full locale codes for better script accuracy
    const FULL_LOCALE: Record<string, string> = {
      es: 'es-ES', fr: 'fr-FR', de: 'de-DE', it: 'it-IT',
      pt: 'pt-BR', ja: 'ja-JP', zh: 'zh-CN', ar: 'ar-SA',
      hi: 'hi-IN', ko: 'ko-KR', ru: 'ru-RU', nl: 'nl-NL',
      tr: 'tr-TR', pl: 'pl-PL', sv: 'sv-SE', kn: 'kn-IN',
    };
    const targetLocale = FULL_LOCALE[langCode] ?? langCode;

    const mmUrl = `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=en|${targetLocale}`;
    const mmRes = await fetch(mmUrl, { signal: AbortSignal.timeout(8000) });
    const mmData = await mmRes.json();

    if (mmData.responseStatus !== 200) {
      return NextResponse.json({ error: mmData.responseDetails || 'Translation failed' }, { status: 500 });
    }

    const translation = mmData.responseData.translatedText;

    if (!translation || translation.trim().toLowerCase() === text.trim().toLowerCase()) {
      return NextResponse.json({ error: 'Translation unavailable for this language pair. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ translation });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Translation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

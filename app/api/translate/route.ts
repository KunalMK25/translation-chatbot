import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: 'Missing text or targetLanguage' }, { status: 400 });
    }

    const LANG_CODES: Record<string, string> = {
      Spanish: 'es', French: 'fr', German: 'de', Italian: 'it',
      Portuguese: 'pt', Japanese: 'ja', Chinese: 'zh', Arabic: 'ar',
      Hindi: 'hi', Korean: 'ko', Russian: 'ru', Dutch: 'nl',
      Turkish: 'tr', Polish: 'pl', Swedish: 'sv',
    };

    const langCode = LANG_CODES[targetLanguage];
    if (!langCode) {
      return NextResponse.json({ error: `Unsupported language: ${targetLanguage}` }, { status: 400 });
    }

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${langCode}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.responseStatus !== 200) {
      return NextResponse.json({ error: data.responseDetails || 'Translation failed' }, { status: 500 });
    }

    const translation = data.responseData.translatedText;
    return NextResponse.json({ translation });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Translation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

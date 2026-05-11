import { useState, useEffect, useCallback } from 'react';

export const SPEECH_LOCALES: Record<string, string> = {
  es: 'es-ES', fr: 'fr-FR', de: 'de-DE', it: 'it-IT',
  pt: 'pt-BR', ja: 'ja-JP', zh: 'zh-CN', ar: 'ar-SA',
  hi: 'hi-IN', ko: 'ko-KR', ru: 'ru-RU', nl: 'nl-NL',
  tr: 'tr-TR', pl: 'pl-PL', sv: 'sv-SE', kn: 'kn-IN',
};

// Languages where TTS voice availability is limited — fall back to a related locale
const LOCALE_FALLBACKS: Record<string, string> = {
  'kn-IN': 'hi-IN',  // Kannada → Hindi (both Indic, better availability)
};

/** Pick the best available voice for a locale, with fallback */
function getBestVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // Exact locale match first (e.g. hi-IN)
  let voice = voices.find(v => v.lang === lang);
  if (voice) return voice;

  // Language prefix match (e.g. hi)
  const prefix = lang.split('-')[0];
  voice = voices.find(v => v.lang.startsWith(prefix));
  if (voice) return voice;

  // Try fallback locale
  const fallback = LOCALE_FALLBACKS[lang];
  if (fallback) {
    voice = voices.find(v => v.lang === fallback);
    if (voice) return voice;
    const fallbackPrefix = fallback.split('-')[0];
    voice = voices.find(v => v.lang.startsWith(fallbackPrefix));
    if (voice) return voice;
  }

  return null;
}

interface UseSpeechSynthesisReturn {
  isSupported: boolean;
  speakingId: string | null;
  speak: (id: string, text: string, lang: string) => void;
  stop: () => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  const speak = useCallback((id: string, text: string, lang: string) => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Wait for voices to load if needed, then pick best available
    const doSpeak = () => {
      const voice = getBestVoice(lang);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = lang;
      }
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      doSpeak();
    } else {
      // Voices not loaded yet — wait for the event
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        doSpeak();
      };
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, [isSupported]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { isSupported, speakingId, speak, stop };
}

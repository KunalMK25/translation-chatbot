import { useState, useEffect, useCallback } from 'react';

export const SPEECH_LOCALES: Record<string, string> = {
  es: 'es-ES', fr: 'fr-FR', de: 'de-DE', it: 'it-IT',
  pt: 'pt-BR', ja: 'ja-JP', zh: 'zh-CN', ar: 'ar-SA',
  hi: 'hi-IN', ko: 'ko-KR', ru: 'ru-RU', nl: 'nl-NL',
  tr: 'tr-TR', pl: 'pl-PL', sv: 'sv-SE', kn: 'kn-IN',
};

interface UseSpeechSynthesisReturn {
  isSupported: boolean;
  speakingId: string | null;
  speak: (id: string, text: string, lang: string) => void;
  stop: () => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  // Start false so server and client initial render match, then set after mount
  const [isSupported, setIsSupported] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  const speak = useCallback((id: string, text: string, lang: string) => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onend = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
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

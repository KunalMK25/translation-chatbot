'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis, SPEECH_LOCALES } from './hooks/useSpeechSynthesis';
import { VoiceButton } from './components/VoiceButton';
import { SpeakButton } from './components/SpeakButton';

export const LANGUAGES = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
];

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  targetLang?: string;
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hello! I'm your translation assistant. Type any text, pick a target language, and I'll translate it instantly — completely free, no sign-up needed. Try: \"Good morning, how are you?\" → Japanese",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [targetLang, setTargetLang] = useState('es');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Voice input callbacks
  const onFinalResult = useCallback((transcript: string) => {
    setInput(transcript);
  }, []);

  const onError = useCallback((message: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: message,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const {
    isSupported: speechRecognitionSupported,
    isRecording,
    interimTranscript,
    startRecognition,
    stopRecognition,
  } = useSpeechRecognition(onFinalResult, onError);

  const {
    isSupported: speechSynthesisSupported,
    speakingId,
    speak,
    stop,
  } = useSpeechSynthesis();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      targetLang,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: input.trim(),
          targetLanguage: LANGUAGES.find((l) => l.code === targetLang)?.name,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.translation || data.error || 'Something went wrong.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Error connecting to the translation service. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  const handleSpeak = (msg: Message) => {
    if (speakingId === msg.id) {
      stop();
    } else {
      const locale = SPEECH_LOCALES[targetLang] ?? 'en-US';
      speak(msg.id, msg.content, locale);
    }
  };

  const selectedLang = LANGUAGES.find((l) => l.code === targetLang);

  // Show interim transcript in textarea while recording
  const textareaValue = isRecording && interimTranscript ? interimTranscript : input;

  return (
    <div className="app-wrapper">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🌐</span>
            <div>
              <h1 className="logo-title">LinguaBot</h1>
              <p className="logo-subtitle">AI Translation Assistant</p>
            </div>
          </div>
          <div className="lang-selector-wrap">
            <label className="lang-label">Translate to</label>
            <select
              className="lang-select"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="chat-area">
        <div className="messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-row ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="avatar bot-avatar">🌐</div>
              )}
              <div className={`bubble ${msg.role}`}>
                <p className="bubble-text">{msg.content}</p>
                {msg.role === 'assistant' && (
                  <SpeakButton
                    messageId={msg.id}
                    isSupported={speechSynthesisSupported}
                    isSpeaking={speakingId === msg.id}
                    onClick={() => handleSpeak(msg)}
                  />
                )}
                <span className="bubble-time">
                  {mounted ? msg.timestamp.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }) : ''}
                </span>
              </div>
              {msg.role === 'user' && (
                <div className="avatar user-avatar">{selectedLang?.flag}</div>
              )}
            </div>
          ))}

          {loading && (
            <div className="message-row assistant">
              <div className="avatar bot-avatar">🌐</div>
              <div className="bubble assistant typing-bubble">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      <footer className="input-area">
        <div className="input-row">
          <textarea
            ref={inputRef}
            className="message-input"
            placeholder={`Type text to translate to ${selectedLang?.name}...`}
            value={textareaValue}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <VoiceButton
            isSupported={speechRecognitionSupported}
            isRecording={isRecording}
            onClick={handleVoiceToggle}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            {loading ? '⏳' : '➤'}
          </button>
        </div>
        <p className="input-hint">Press Enter to send · Shift+Enter for new line</p>
      </footer>
    </div>
  );
}

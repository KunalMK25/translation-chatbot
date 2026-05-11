import { useRef, useState, useEffect, useCallback } from 'react';

interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isRecording: boolean;
  interimTranscript: string;
  startRecognition: () => void;
  stopRecognition: () => void;
}

export function useSpeechRecognition(
  onFinalResult: (transcript: string) => void,
  onError: (message: string) => void
): UseSpeechRecognitionReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setIsSupported(
      typeof window !== 'undefined' &&
      !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    );
  }, []);

  const startRecognition = useCallback(() => {
    if (!isSupported) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionCtor: any =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const transcript: string = result[0].transcript;
          onFinalResult(transcript);
          setInterimTranscript('');
          recognition.stop();
          return;
        } else {
          interim += result[0].transcript;
        }
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      const errorMessages: Record<string, string> = {
        'not-allowed': 'Microphone access was denied. Please allow microphone permission and try again.',
        'no-speech': 'No speech was detected. Please try again.',
        'network': 'A network error occurred during voice recognition. Please check your connection.',
        'audio-capture': 'No microphone was found. Please connect a microphone and try again.',
        'aborted': 'Voice recognition was aborted.',
      };
      const message: string = errorMessages[event.error] || `Voice recognition error: ${event.error}.`;
      onError(message);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [isSupported, onFinalResult, onError]);

  const stopRecognition = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  return { isSupported, isRecording, interimTranscript, startRecognition, stopRecognition };
}

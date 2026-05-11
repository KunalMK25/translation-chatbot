/**
 * Property tests for useSpeechRecognition
 * Feature: voice-translation
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useSpeechRecognition } from '../../app/hooks/useSpeechRecognition';

// Helper to create a mock SpeechRecognition instance
function createMockRecognition() {
  return {
    lang: '',
    interimResults: false,
    continuous: false,
    start: vi.fn(),
    stop: vi.fn(),
    abort: vi.fn(),
    onresult: null as any,
    onerror: null as any,
    onend: null as any,
  };
}

// Creates a constructor function (not an arrow fn) that returns the mock instance
function makeMockCtor(mock: ReturnType<typeof createMockRecognition>) {
  return function MockSpeechRecognition(this: any) {
    Object.assign(this, mock);
    // Proxy property assignments back to mock so tests can read them
    return mock;
  };
}

function simulateResult(recognition: any, transcript: string, isFinal: boolean) {
  const event = {
    resultIndex: 0,
    results: [
      Object.assign([{ transcript }], { isFinal }),
    ],
  };
  recognition.onresult?.(event);
}

function simulateError(recognition: any, errorCode: string) {
  recognition.onerror?.({ error: errorCode });
}

describe('Property 1: Final transcript populates input field', () => {
  it('onFinalResult is called with the exact transcript for any non-empty string', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (transcript) => {
        const mockRecognition = createMockRecognition();
        vi.stubGlobal('SpeechRecognition', makeMockCtor(mockRecognition));

        const onFinalResult = vi.fn();
        const onError = vi.fn();

        const { result } = renderHook(() => useSpeechRecognition(onFinalResult, onError));
        act(() => result.current.startRecognition());
        act(() => simulateResult(mockRecognition, transcript, true));

        expect(onFinalResult).toHaveBeenCalledWith(transcript);
        vi.unstubAllGlobals();
      }),
      { numRuns: 10 }
    );
  });
});

describe('Property 2: Interim transcript is displayed while recording', () => {
  it('interimTranscript equals the interim string while isRecording is true', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (interim) => {
        const mockRecognition = createMockRecognition();
        vi.stubGlobal('SpeechRecognition', makeMockCtor(mockRecognition));

        const onFinalResult = vi.fn();
        const onError = vi.fn();

        const { result } = renderHook(() => useSpeechRecognition(onFinalResult, onError));
        act(() => result.current.startRecognition());
        act(() => simulateResult(mockRecognition, interim, false));

        expect(result.current.isRecording).toBe(true);
        expect(result.current.interimTranscript).toBe(interim);
        vi.unstubAllGlobals();
      }),
      { numRuns: 10 }
    );
  });
});

describe('Property 3: Speech recognition errors produce chat error messages', () => {
  it('onError is called with a non-empty string for any error code', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('not-allowed', 'no-speech', 'network', 'audio-capture', 'aborted', 'bad-grammar', 'language-not-supported', 'service-not-allowed'),
        (errorCode) => {
          const mockRecognition = createMockRecognition();
          vi.stubGlobal('SpeechRecognition', makeMockCtor(mockRecognition));

          const onFinalResult = vi.fn();
          const onError = vi.fn();

          const { result } = renderHook(() => useSpeechRecognition(onFinalResult, onError));
          act(() => result.current.startRecognition());
          act(() => simulateError(mockRecognition, errorCode));

          expect(onError).toHaveBeenCalledOnce();
          const message = onError.mock.calls[0][0];
          expect(typeof message).toBe('string');
          expect(message.length).toBeGreaterThan(0);
          vi.unstubAllGlobals();
        }
      ),
      { numRuns: 10 }
    );
  });
});

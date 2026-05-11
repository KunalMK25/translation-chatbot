import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSpeechRecognition } from '../../app/hooks/useSpeechRecognition';

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

// Creates a proper constructor (not an arrow fn) that returns the mock instance
function makeMockCtor(mock: ReturnType<typeof createMockRecognition>) {
  return function MockSpeechRecognition(this: any) {
    return mock;
  };
}

describe('useSpeechRecognition unit tests', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('isSupported is false when SpeechRecognition is absent from window', () => {
    vi.stubGlobal('SpeechRecognition', undefined);
    vi.stubGlobal('webkitSpeechRecognition', undefined);
    const { result } = renderHook(() => useSpeechRecognition(vi.fn(), vi.fn()));
    expect(result.current.isSupported).toBe(false);
  });

  it('startRecognition calls recognition.start()', () => {
    const mock = createMockRecognition();
    vi.stubGlobal('SpeechRecognition', makeMockCtor(mock));
    const { result } = renderHook(() => useSpeechRecognition(vi.fn(), vi.fn()));
    act(() => result.current.startRecognition());
    expect(mock.start).toHaveBeenCalledOnce();
  });

  it('stopRecognition calls recognition.stop()', () => {
    const mock = createMockRecognition();
    vi.stubGlobal('SpeechRecognition', makeMockCtor(mock));
    const { result } = renderHook(() => useSpeechRecognition(vi.fn(), vi.fn()));
    act(() => result.current.startRecognition());
    act(() => result.current.stopRecognition());
    expect(mock.stop).toHaveBeenCalledOnce();
  });

  it('a final result event sets isRecording to false', () => {
    const mock = createMockRecognition();
    vi.stubGlobal('SpeechRecognition', makeMockCtor(mock));
    const { result } = renderHook(() => useSpeechRecognition(vi.fn(), vi.fn()));
    act(() => result.current.startRecognition());
    expect(result.current.isRecording).toBe(true);
    act(() => {
      mock.onend?.();
    });
    expect(result.current.isRecording).toBe(false);
  });

  it('recognition.lang is set to en-US on start', () => {
    const mock = createMockRecognition();
    vi.stubGlobal('SpeechRecognition', makeMockCtor(mock));
    const { result } = renderHook(() => useSpeechRecognition(vi.fn(), vi.fn()));
    act(() => result.current.startRecognition());
    expect(mock.lang).toBe('en-US');
  });
});

import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSpeechSynthesis } from '../../app/hooks/useSpeechSynthesis';

describe('useSpeechSynthesis unit tests', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('isSupported is false when speechSynthesis is absent from window', () => {
    // Remove speechSynthesis from window
    const original = (window as any).speechSynthesis;
    delete (window as any).speechSynthesis;
    const { result } = renderHook(() => useSpeechSynthesis());
    expect(result.current.isSupported).toBe(false);
    (window as any).speechSynthesis = original;
  });

  it('clicking stop while speaking calls speechSynthesis.cancel()', () => {
    const mockSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn(() => []),
      speaking: false,
      pending: false,
      paused: false,
    };
    vi.stubGlobal('speechSynthesis', mockSynthesis);
    vi.stubGlobal('SpeechSynthesisUtterance', vi.fn().mockImplementation(function (this: any, t: string) {
      this.text = t; this.lang = ''; this.onend = null;
    }));

    const { result } = renderHook(() => useSpeechSynthesis());
    act(() => result.current.speak('msg-1', 'hello', 'en-US'));
    act(() => result.current.stop());
    expect(mockSynthesis.cancel).toHaveBeenCalled();
  });
});

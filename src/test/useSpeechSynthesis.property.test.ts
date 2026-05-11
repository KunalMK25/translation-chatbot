/**
 * Property tests for useSpeechSynthesis
 * Feature: voice-translation
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useSpeechSynthesis, SPEECH_LOCALES } from '../../app/hooks/useSpeechSynthesis';
import { LANGUAGES } from '../../app/page';

function createMockSpeechSynthesis() {
  return {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn(() => []),
    speaking: false,
    pending: false,
    paused: false,
  };
}

describe('Property 5: Speak uses the correct locale for the target language', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('speechSynthesis.speak is called with utterance.lang === SPEECH_LOCALES[langCode]', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...LANGUAGES.map((l) => l.code)),
        fc.string({ minLength: 1 }),
        (langCode, text) => {
          const mockSynthesis = createMockSpeechSynthesis();
          let capturedUtterance: any = null;

          const MockUtterance = vi.fn().mockImplementation(function (this: any, t: string) {
            this.text = t;
            this.lang = '';
            this.onend = null;
            capturedUtterance = this;
          });

          vi.stubGlobal('speechSynthesis', mockSynthesis);
          vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance);

          const { result } = renderHook(() => useSpeechSynthesis());
          const locale = SPEECH_LOCALES[langCode];
          act(() => result.current.speak('msg-1', text, locale));

          expect(mockSynthesis.speak).toHaveBeenCalledOnce();
          expect(capturedUtterance?.lang).toBe(locale);
          vi.unstubAllGlobals();
        }
      ),
      { numRuns: 10 }
    );
  });
});

describe('Property 6: Speaking a new message cancels the previous one', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('speechSynthesis.cancel() is called before the second speak', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        (text1, text2) => {
          const mockSynthesis = createMockSpeechSynthesis();
          const callOrder: string[] = [];
          mockSynthesis.cancel.mockImplementation(() => callOrder.push('cancel'));
          mockSynthesis.speak.mockImplementation(() => callOrder.push('speak'));

          vi.stubGlobal('speechSynthesis', mockSynthesis);
          vi.stubGlobal('SpeechSynthesisUtterance', vi.fn().mockImplementation(function (this: any, t: string) {
            this.text = t; this.lang = ''; this.onend = null;
          }));

          const { result } = renderHook(() => useSpeechSynthesis());
          act(() => result.current.speak('msg-1', text1, 'en-US'));
          act(() => result.current.speak('msg-2', text2, 'en-US'));

          // cancel should appear before the second speak
          const secondSpeakIdx = callOrder.lastIndexOf('speak');
          const lastCancelBeforeSecondSpeak = callOrder.slice(0, secondSpeakIdx).lastIndexOf('cancel');
          expect(lastCancelBeforeSecondSpeak).toBeGreaterThanOrEqual(0);
          vi.unstubAllGlobals();
        }
      ),
      { numRuns: 10 }
    );
  });
});

describe('Property 7: Speak button returns to inactive state after playback ends', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('speakingId is null after utterance.onend fires', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (text) => {
        const mockSynthesis = createMockSpeechSynthesis();
        let capturedUtterance: any = null;

        vi.stubGlobal('speechSynthesis', mockSynthesis);
        vi.stubGlobal('SpeechSynthesisUtterance', vi.fn().mockImplementation(function (this: any, t: string) {
          this.text = t; this.lang = ''; this.onend = null;
          capturedUtterance = this;
        }));

        const { result } = renderHook(() => useSpeechSynthesis());
        act(() => result.current.speak('msg-1', text, 'en-US'));
        expect(result.current.speakingId).toBe('msg-1');

        act(() => capturedUtterance?.onend?.());
        expect(result.current.speakingId).toBeNull();
        vi.unstubAllGlobals();
      }),
      { numRuns: 10 }
    );
  });
});

/**
 * Tests for SpeakButton component
 * Feature: voice-translation
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import React from 'react';
import { SpeakButton } from '../../app/components/SpeakButton';

// --- Property 9: Speak button aria-label reflects speaking state ---
describe('Property 9: Speak button aria-label reflects speaking state', () => {
  it('aria-label matches expected value for each speaking state', () => {
    fc.assert(
      fc.property(fc.boolean(), fc.string({ minLength: 1 }), (isSpeaking, _content) => {
        const { unmount } = render(
          <SpeakButton messageId="msg-1" isSupported={true} isSpeaking={isSpeaking} onClick={() => {}} />
        );
        const btn = screen.getByRole('button');
        expect(btn.getAttribute('aria-label')).toBe(
          isSpeaking ? 'Stop speaking' : 'Speak translation'
        );
        unmount();
      }),
      { numRuns: 10 }
    );
  });
});

// --- Unit tests ---
describe('SpeakButton unit tests', () => {
  it('renders when isSupported is true', () => {
    render(<SpeakButton messageId="msg-1" isSupported={true} isSpeaking={false} onClick={() => {}} />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('does not render when isSupported is false', () => {
    render(<SpeakButton messageId="msg-1" isSupported={false} isSpeaking={false} onClick={() => {}} />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('is a <button> element (keyboard-accessible)', () => {
    render(<SpeakButton messageId="msg-1" isSupported={true} isSpeaking={false} onClick={() => {}} />);
    const btn = screen.getByRole('button');
    expect(btn.tagName.toLowerCase()).toBe('button');
  });
});

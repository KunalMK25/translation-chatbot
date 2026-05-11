/**
 * Tests for VoiceButton component
 * Feature: voice-translation
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import React from 'react';
import { VoiceButton } from '../../app/components/VoiceButton';

// --- Property 8: Voice button ARIA attributes reflect recording state ---
describe('Property 8: Voice button ARIA attributes reflect recording state', () => {
  it('aria-label and aria-pressed match expected values for each recording state', () => {
    fc.assert(
      fc.property(fc.boolean(), (isRecording) => {
        const { unmount } = render(
          <VoiceButton isSupported={true} isRecording={isRecording} onClick={() => {}} />
        );
        const btn = screen.getByRole('button');
        expect(btn.getAttribute('aria-label')).toBe(
          isRecording ? 'Stop voice input' : 'Start voice input'
        );
        expect(btn.getAttribute('aria-pressed')).toBe(isRecording ? 'true' : 'false');
        unmount();
      }),
      { numRuns: 10 }
    );
  });
});

// --- Unit tests ---
describe('VoiceButton unit tests', () => {
  it('renders when isSupported is true', () => {
    render(<VoiceButton isSupported={true} isRecording={false} onClick={() => {}} />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('does not render when isSupported is false', () => {
    render(<VoiceButton isSupported={false} isRecording={false} onClick={() => {}} />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('is a <button> element (keyboard-accessible)', () => {
    render(<VoiceButton isSupported={true} isRecording={false} onClick={() => {}} />);
    const btn = screen.getByRole('button');
    expect(btn.tagName.toLowerCase()).toBe('button');
  });
});

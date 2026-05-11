/**
 * Unit tests for Kannada language support
 * Validates: Requirements 1.1, 1.2
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// jsdom does not implement scrollIntoView; mock it globally so the
// page component's useEffect doesn't throw.
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = () => {};
});

// ---------------------------------------------------------------------------
// 1. LANGUAGES array – direct import
// ---------------------------------------------------------------------------

import { LANGUAGES } from '../../app/page';

describe('LANGUAGES array – Kannada entry', () => {
  it('contains a Kannada entry', () => {
    const entry = LANGUAGES.find((l) => l.code === 'kn');
    expect(entry).toBeDefined();
  });

  it('Kannada entry has code "kn"', () => {
    const entry = LANGUAGES.find((l) => l.code === 'kn');
    expect(entry?.code).toBe('kn');
  });

  it('Kannada entry has name "Kannada"', () => {
    const entry = LANGUAGES.find((l) => l.code === 'kn');
    expect(entry?.name).toBe('Kannada');
  });

  it('Kannada entry has flag "🇮🇳"', () => {
    const entry = LANGUAGES.find((l) => l.code === 'kn');
    expect(entry?.flag).toBe('🇮🇳');
  });
});

// ---------------------------------------------------------------------------
// 2. LANG_CODES map – direct import (no Next.js runtime required)
// ---------------------------------------------------------------------------

import { LANG_CODES } from '../../app/api/translate/lang-codes';

describe('LANG_CODES map – Kannada entry', () => {
  it('LANG_CODES["Kannada"] equals "kn"', () => {
    expect(LANG_CODES['Kannada']).toBe('kn');
  });

  it('LANG_CODES does not contain an entry for an unsupported language', () => {
    expect(LANG_CODES['Klingon']).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 3. Language selector renders a Kannada option
// ---------------------------------------------------------------------------

import Home from '../../app/page';

describe('Language selector – renders Kannada option', () => {
  it('the language selector contains a Kannada option', () => {
    render(React.createElement(Home));
    const kannadaOption = screen.getByRole('option', { name: /Kannada/i });
    expect(kannadaOption).toBeTruthy();
  });

  it('the Kannada option has value "kn"', () => {
    render(React.createElement(Home));
    const kannadaOption = screen.getByRole('option', { name: /Kannada/i }) as HTMLOptionElement;
    expect(kannadaOption.value).toBe('kn');
  });
});

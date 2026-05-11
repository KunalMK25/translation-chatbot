// Smoke test to verify the test framework is configured correctly
import { describe, it, expect } from 'vitest';

describe('Test framework setup', () => {
  it('vitest globals are available', () => {
    expect(true).toBe(true);
  });

  it('jsdom environment is active', () => {
    expect(typeof document).toBe('object');
    expect(typeof window).toBe('object');
  });
});

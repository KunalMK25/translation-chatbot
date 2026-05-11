/**
 * Mapping from language display names to BCP-47 language codes.
 * Extracted as a standalone module so it can be imported in tests
 * without pulling in the Next.js server runtime.
 */
export const LANG_CODES: Record<string, string> = {
  Spanish: 'es', French: 'fr', German: 'de', Italian: 'it',
  Portuguese: 'pt', Japanese: 'ja', Chinese: 'zh', Arabic: 'ar',
  Hindi: 'hi', Korean: 'ko', Russian: 'ru', Dutch: 'nl',
  Turkish: 'tr', Polish: 'pl', Swedish: 'sv', Kannada: 'kn',
};

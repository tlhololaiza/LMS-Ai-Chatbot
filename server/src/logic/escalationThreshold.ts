export const MIN_CONFIDENCE = 0.6;
export const ESCALATION_TIMEOUT_MS = 60_000; // 1 minute

export const JUDGMENT_KEYWORDS = [
  'grade',
  'plagiar',
  'cheat',
  'legal',
  'medical',
  'policy',
  'discipline',
  'suspend',
  'penalty',
  'fired',
  'harass',
  'abuse',
  'assault',
];

/**
 * Simple heuristic to detect judgement-required queries.
 * Lowercase the input and check for keyword presence.
 */
export function isJudgementRequired(text?: string): boolean {
  if (!text) return false;
  const t = text.toLowerCase();
  for (const k of JUDGMENT_KEYWORDS) {
    if (t.includes(k)) return true;
  }
  // If user asks explicitly for a decision or grading
  if (t.includes('should i') || t.includes('should we') || t.includes('would you') || t.includes('is it okay')) {
    return true;
  }
  return false;
}

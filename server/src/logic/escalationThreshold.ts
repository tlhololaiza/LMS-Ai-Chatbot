export const MIN_CONFIDENCE = 0.6;
export const ESCALATION_TIMEOUT_MS = 60_000; // 1 minute

export const JUDGMENT_KEYWORDS = [
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
  'expel',
];

/**
 * Words that follow "should I …" and indicate an *informational* question,
 * NOT a judgement call.  E.g. "Who should I consult?" is informational.
 */
const INFORMATIONAL_VERBS = [
  'consult', 'ask', 'contact', 'talk', 'speak', 'reach', 'email',
  'use', 'learn', 'study', 'practice', 'start', 'try', 'read',
  'watch', 'install', 'download', 'go', 'visit', 'check', 'look',
  'submit', 'do', 'complete', 'build', 'create', 'follow', 'choose',
];

/**
 * Simple heuristic to detect judgement-required queries.
 * Lowercase the input and check for keyword presence.
 *
 * IMPORTANT: informational "should I" questions (e.g. "who should I
 * consult", "should I use React or Angular") are NOT escalated — they
 * can be answered from the knowledge base.
 */
export function isJudgementRequired(text?: string): boolean {
  if (!text) return false;
  const t = text.toLowerCase();

  // Hard keywords always trigger (plagiarism, harassment, etc.)
  for (const k of JUDGMENT_KEYWORDS) {
    if (t.includes(k)) return true;
  }

  // "should I / should we / would you / is it okay" — only escalate if
  // the sentence is NOT an informational question.
  if (t.includes('should i') || t.includes('should we') || t.includes('would you') || t.includes('is it okay')) {
    // Check if the sentence is clearly informational
    const isInformational = INFORMATIONAL_VERBS.some(verb => t.includes(verb));
    if (isInformational) return false;

    // Also skip if the question is about consulting, asking, or who to talk to
    if (/who\s+(should|can|do)\s+i/i.test(t)) return false;

    return true;
  }

  return false;
}

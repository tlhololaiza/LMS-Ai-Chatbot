/**
 * Escalation logger helper for frontend
 * Call this when an AI error, low-confidence, moderation flag, or user escalation occurs.
 */

export interface EscalationEvent {
  query: string;
  category: string;
  reason: string;
  escalationType: 'human_review' | 'support' | 'moderation' | 'other';
  target?: string;
  severity?: 'low' | 'medium' | 'high';
  correlationId?: string;
}

/**
 * Log an escalation event to the backend API.
 * Usage: call when aiError, low-confidence, or user escalation is detected.
 */
export async function logEscalationEvent(event: EscalationEvent): Promise<void> {
  const res = await fetch('/api/log-escalation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  if (!res.ok) {
    // Optionally handle/log error
    throw new Error('Failed to log escalation event');
  }
}

/**
 * Example usage:
 *   if (aiError || aiConfidence < 0.5) {
 *     await logEscalationEvent({
 *       query,
 *       category: 'dashboard',
 *       reason: aiError ? 'AI error' : 'Low confidence',
 *       escalationType: 'human_review',
 *       target: 'mentor',
 *       severity: 'medium',
 *       correlationId,
 *     });
 *   }
 */

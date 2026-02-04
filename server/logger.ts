import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export interface QueryLogEntry {
  timestamp: string;
  query: string;
  category: string;
}

export interface ResponseOutcomeLogEntry {
  timestamp: string;
  event: 'response_outcome';
  query: string;
  category: string;
  outcome: 'success' | 'error';
  responsePreview?: string;
  errorMessage?: string;
  model?: string;
  aiError?: boolean;
}

export interface EscalationLogEntry {
  timestamp: string;
  event: 'escalation';
  query: string;
  category: string;
  reason: string; // e.g., low confidence, safety flag, user request
  escalationType: 'human_review' | 'support' | 'moderation' | 'other';
  target?: 'mentor' | 'admin' | 'support' | 'moderator' | string;
  severity?: 'low' | 'medium' | 'high';
  correlationId?: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_FILE_PATH = path.resolve(__dirname, './query_logs.jsonl');

export function logQuery(query: string, category: string) {
  const entry: QueryLogEntry = {
    timestamp: new Date().toISOString(),
    query,
    category,
  };
  const line = JSON.stringify(entry) + '\n';
  fs.mkdirSync(path.dirname(LOG_FILE_PATH), { recursive: true });
  fs.appendFileSync(LOG_FILE_PATH, line, 'utf8');
}

/**
 * Log the outcome of a chat response (success or error).
 * Stores a structured JSONL entry with a small preview of the response or the error message.
 * This ties back to the original query and category for simple correlation in audits.
 */
export function logResponseOutcome(params: {
  query: string;
  category: string;
  outcome: 'success' | 'error';
  response?: string;
  errorMessage?: string;
  model?: string;
  aiError?: boolean;
}) {
  const { query, category, outcome, response, errorMessage, model, aiError } = params;

  const responsePreview = response
    ? response.slice(0, 200) + (response.length > 200 ? '…' : '')
    : undefined;

  const entry: ResponseOutcomeLogEntry = {
    timestamp: new Date().toISOString(),
    event: 'response_outcome',
    query,
    category,
    outcome,
    responsePreview,
    errorMessage,
    model,
    aiError,
  };

  const line = JSON.stringify(entry) + '\n';
  fs.mkdirSync(path.dirname(LOG_FILE_PATH), { recursive: true });
  fs.appendFileSync(LOG_FILE_PATH, line, 'utf8');
}

/**
 * Log an escalation event for audit purposes.
 * Useful when a conversation is handed off to a human or flagged for review.
 */
export function logEscalationEvent(params: {
  query: string;
  category: string;
  reason: string;
  escalationType: 'human_review' | 'support' | 'moderation' | 'other';
  target?: 'mentor' | 'admin' | 'support' | 'moderator' | string;
  severity?: 'low' | 'medium' | 'high';
  correlationId?: string;
}) {
  const { query, category, reason, escalationType, target, severity, correlationId } = params;

  const entry: EscalationLogEntry = {
    timestamp: new Date().toISOString(),
    event: 'escalation',
    query,
    category,
    reason,
    escalationType,
    target,
    severity,
    correlationId,
  };

  const line = JSON.stringify(entry) + '\n';
  fs.mkdirSync(path.dirname(LOG_FILE_PATH), { recursive: true });
  fs.appendFileSync(LOG_FILE_PATH, line, 'utf8');
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

export interface QueryLogEntry {
  timestamp: string;
  query: string;
  category: string;
  chainPrevHash?: string;
  chainHash?: string;
  chainAlgo?: 'sha256';
  correlationId?: string;
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
  chainPrevHash?: string;
  chainHash?: string;
  chainAlgo?: 'sha256';
  correlationId?: string;
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
  chainPrevHash?: string;
  chainHash?: string;
  chainAlgo?: 'sha256';
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_FILE_PATH = path.resolve(__dirname, './query_logs.jsonl');

function getLastChainHash(): string | undefined {
  try {
    if (!fs.existsSync(LOG_FILE_PATH)) return undefined;
    const content = fs.readFileSync(LOG_FILE_PATH, 'utf8');
    const lines = content.trim().split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (!line) continue;
      try {
        const obj = JSON.parse(line);
        if (obj.chainHash && typeof obj.chainHash === 'string') {
          return obj.chainHash as string;
        }
      } catch {
        // skip malformed line
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function computeChainHash(payload: object, prevHash?: string): string {
  const hash = crypto.createHash('sha256');
  // Hash includes previous hash + canonical JSON of payload
  const canonical = JSON.stringify(payload);
  hash.update((prevHash || '') + canonical);
  return hash.digest('hex');
}

function appendWithChain<T extends object>(entry: T): void {
  const prevHash = getLastChainHash();
  const chainHash = computeChainHash(entry, prevHash);
  const chainedEntry = {
    ...entry,
    chainPrevHash: prevHash,
    chainHash,
    chainAlgo: 'sha256' as const,
  };
  const line = JSON.stringify(chainedEntry) + '\n';
  fs.mkdirSync(path.dirname(LOG_FILE_PATH), { recursive: true });
  fs.appendFileSync(LOG_FILE_PATH, line, 'utf8');
}

export function logQuery(query: string, category: string, correlationId?: string) {
  const entry: QueryLogEntry = {
    timestamp: new Date().toISOString(),
    query,
    category,
    correlationId,
  };
  appendWithChain(entry);
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
  correlationId?: string;
}) {
  const { query, category, outcome, response, errorMessage, model, aiError, correlationId } = params;

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
    correlationId,
  };
  appendWithChain(entry);
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
  appendWithChain(entry);
}

/**
 * Verify the hash chain for the log file.
 * Returns { ok: boolean, issues: string[] }
 */
export function verifyLogChain(): { ok: boolean; issues: string[] } {
  const issues: string[] = [];
  try {
    if (!fs.existsSync(LOG_FILE_PATH)) {
      return { ok: true, issues }; // empty is valid
    }
    const content = fs.readFileSync(LOG_FILE_PATH, 'utf8');
    const lines = content.trim().split('\n');
    let prevHash: string | undefined = undefined;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      let obj: any;
      try {
        obj = JSON.parse(line);
      } catch {
        issues.push(`Line ${i + 1}: not valid JSON`);
        continue;
      }
      const extractedPrev = obj.chainPrevHash;
      const extractedHash = obj.chainHash;
      if (extractedPrev !== prevHash) {
        issues.push(`Line ${i + 1}: prevHash mismatch`);
      }
      // Recompute hash without chain fields
      const { chainPrevHash, chainHash, chainAlgo, ...payload } = obj;
      const recomputed = computeChainHash(payload, prevHash);
      if (extractedHash !== recomputed) {
        issues.push(`Line ${i + 1}: hash mismatch`);
      }
      prevHash = extractedHash;
    }
    return { ok: issues.length === 0, issues };
  } catch (err) {
    issues.push(`Verification error: ${err instanceof Error ? err.message : 'unknown'}`);
    return { ok: false, issues };
  }
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export interface QueryLogEntry {
  timestamp: string;
  query: string;
  category: string;
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

export interface ResponseOutcomeEntry {
  timestamp: string;
  queryId?: string;
  category: string;
  outcome: 'success' | 'failure';
  responseTimeMs?: number;
  model?: string;
  error?: string;
}

const RESPONSE_LOG_FILE_PATH = path.resolve(__dirname, './response_logs.jsonl');

export function logResponseOutcome(entry: Omit<ResponseOutcomeEntry, 'timestamp'>) {
  const fullEntry: ResponseOutcomeEntry = {
    timestamp: new Date().toISOString(),
    ...entry,
  };
  const line = JSON.stringify(fullEntry) + '\n';
  fs.mkdirSync(path.dirname(RESPONSE_LOG_FILE_PATH), { recursive: true });
  fs.appendFileSync(RESPONSE_LOG_FILE_PATH, line, 'utf8');
}

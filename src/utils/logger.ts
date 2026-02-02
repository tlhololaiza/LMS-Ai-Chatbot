import fs from 'fs';
import path from 'path';

export interface QueryLogEntry {
  timestamp: string;
  query: string;
  category: string;
}

const LOG_FILE_PATH = path.resolve(__dirname, '../../logs/query_logs.jsonl');

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

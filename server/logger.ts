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

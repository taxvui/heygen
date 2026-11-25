import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'heygen-db.json');

console.log('Ensuring database directory and seed state...');
fs.mkdirSync(DATA_DIR, { recursive: true });
if (fs.existsSync(DB_FILE)) {
  console.log(`Database already present at ${DB_FILE}`);
} else {
  console.log('Database will be initialized automatically on first API call or test run.');
}

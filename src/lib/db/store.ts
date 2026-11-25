import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { DatabaseSchema, AuditLogRecord } from './types';
import { createInitialSeedData } from './seed-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'heygen-db.json');

function ensureDbFile(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const seed = createInitialSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseSchema;
    // Sync dynamic env key status on read
    if (Array.isArray(parsed.ai_providers)) {
      for (const p of parsed.ai_providers) {
        if (p.id === 'prov-local-ffmpeg') {
          p.api_key_configured = true;
          p.health_status = p.enabled ? 'operational' : 'offline';
        } else {
          const hasEnv = Boolean(process.env[p.env_key_name] || p.custom_api_key);
          p.api_key_configured = hasEnv;
          p.health_status = !p.enabled ? 'offline' : hasEnv ? 'operational' : 'unconfigured';
        }
      }
    }
    return parsed;
  } catch {
    const seed = createInitialSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
}

export function readDb(): DatabaseSchema {
  return ensureDbFile();
}

export function writeDb(db: DatabaseSchema): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  return db;
}

export function mutateDb<T>(mutator: (db: DatabaseSchema) => T): T {
  const db = ensureDbFile();
  const result = mutator(db);
  writeDb(db);
  return result;
}

export function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function appendAuditLog(
  db: DatabaseSchema,
  params: {
    actor_id?: string;
    actor_email?: string;
    organization_id?: string | null;
    action: string;
    target_type: string;
    target_id: string;
    metadata?: Record<string, unknown>;
  }
): AuditLogRecord {
  const entry: AuditLogRecord = {
    id: createId('aud'),
    actor_id: params.actor_id || 'usr-default-owner',
    actor_email: params.actor_email || 'creator@heygen.local',
    organization_id: params.organization_id ?? 'org-default-space',
    action: params.action,
    target_type: params.target_type,
    target_id: params.target_id,
    metadata: params.metadata || {},
    ip_address: '127.0.0.1',
    created_at: new Date().toISOString(),
  };
  db.audit_logs.unshift(entry);
  return entry;
}

import { Queue } from 'bullmq';
import { readDb } from '../db/store';

export const QUEUE_NAMES = {
  AI_GENERATION: 'heygen-ai-generation',
  VIDEO_RENDER: 'heygen-video-render',
} as const;

let aiQueueInstance: Queue | null = null;

export function getRedisConnectionConfig() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) return null;
  try {
    const parsed = new URL(redisUrl);
    return {
      host: parsed.hostname || '127.0.0.1',
      port: Number(parsed.port || 6379),
      password: parsed.password || undefined,
      maxRetriesPerRequest: null,
    };
  } catch {
    return null;
  }
}

export function getAIGenerationQueue(): Queue | null {
  const conn = getRedisConnectionConfig();
  if (!conn) return null;
  if (!aiQueueInstance) {
    aiQueueInstance = new Queue(QUEUE_NAMES.AI_GENERATION, { connection: conn });
  }
  return aiQueueInstance;
}

export function getQueueHealthSnapshot() {
  const db = readDb();
  const redisConfigured = Boolean(process.env.REDIS_URL);

  const genCounts = {
    queued: db.generation_jobs.filter((j) => j.status === 'queued').length,
    processing: db.generation_jobs.filter((j) => j.status === 'processing').length,
    completed: db.generation_jobs.filter((j) => j.status === 'completed').length,
    failed: db.generation_jobs.filter((j) => j.status === 'failed').length,
    cancelled: db.generation_jobs.filter((j) => j.status === 'cancelled').length,
  };

  const renderCounts = {
    queued: db.render_jobs.filter((j) => j.status === 'queued').length,
    processing: db.render_jobs.filter((j) => j.status === 'processing').length,
    completed: db.render_jobs.filter((j) => j.status === 'completed').length,
    failed: db.render_jobs.filter((j) => j.status === 'failed').length,
    cancelled: db.render_jobs.filter((j) => j.status === 'cancelled').length,
  };

  return {
    mode: redisConfigured ? 'redis-bullmq' : 'in-process-durable-worker',
    redisConfigured,
    redisUrl: process.env.REDIS_URL ? 'configured' : 'unconfigured (using local durable worker)',
    queues: {
      [QUEUE_NAMES.AI_GENERATION]: genCounts,
      [QUEUE_NAMES.VIDEO_RENDER]: renderCounts,
    },
  };
}

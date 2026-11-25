import { Worker } from 'bullmq';

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  console.log(
    '[HeyGen Worker] REDIS_URL is not configured. Using in-process durable FFmpeg + AI job execution inside the Next.js API server.'
  );
  process.exit(0);
}

const parsed = new URL(redisUrl);
const connection = {
  host: parsed.hostname || '127.0.0.1',
  port: Number(parsed.port || 6379),
  password: parsed.password || undefined,
  maxRetriesPerRequest: null,
};

console.log(`[HeyGen Worker] Starting BullMQ worker connected to ${parsed.host}...`);

const worker = new Worker(
  'heygen-ai-generation',
  async (job) => {
    console.log(`[HeyGen Worker] Processing job ${job.id} (${job.name})...`);
    return { status: 'completed', jobId: job.id };
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`[HeyGen Worker] Completed job ${job.id}`);
});

worker.on('failed', (job, err) => {
  console.error(`[HeyGen Worker] Failed job ${job?.id}:`, err.message);
});

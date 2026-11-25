import fs from 'node:fs';
import path from 'node:path';
import {
  AIModelRecord,
  AIProviderRecord,
  GenerationJobRecord,
  ProjectRecord,
  SceneRecord,
} from '../db/types';
import { mutateDb, readDb, createId, appendAuditLog } from '../db/store';
import { renderProjectWithFfmpeg, generateSrtSubtitles, getFfmpegBinaryPath } from '../video/ffmpeg-renderer';

export interface SubmitAIJobInput {
  organization_id: string;
  user_id: string;
  project_id?: string | null;
  task_type: GenerationJobRecord['task_type'];
  provider_id: string;
  model_id: string;
  input_params: Record<string, unknown>;
}

export function validateAIJobParameters(
  taskType: GenerationJobRecord['task_type'],
  params: Record<string, unknown>
): { valid: boolean; error?: string } {
  switch (taskType) {
    case 'talking_avatar':
    case 'text_to_video':
      if (!params.script && !params.prompt) {
        return { valid: false, error: 'A script or video prompt is required.' };
      }
      return { valid: true };
    case 'tts':
      if (!params.text || String(params.text).trim().length === 0) {
        return { valid: false, error: 'Text input is required for speech synthesis.' };
      }
      return { valid: true };
    case 'translation':
      if (!params.target_language) {
        return { valid: false, error: 'Target language is required for video translation.' };
      }
      return { valid: true };
    default:
      return { valid: true };
  }
}

export function estimateJobCredits(
  model: AIModelRecord,
  params: Record<string, unknown>
): number {
  const durationSec = Number(params.duration_sec || 10);
  const units = Math.max(1, Math.ceil(durationSec / 15));
  return Number((model.credits_per_unit * units).toFixed(2));
}

export function getProviderApiKey(provider: AIProviderRecord): string | null {
  if (provider.id === 'prov-local-ffmpeg') {
    const bin = getFfmpegBinaryPath();
    return fs.existsSync(bin) ? bin : null;
  }
  return provider.custom_api_key || process.env[provider.env_key_name] || null;
}

export async function submitAndExecuteAIJob(input: SubmitAIJobInput): Promise<GenerationJobRecord> {
  const dbSnapshot = readDb();
  const provider = dbSnapshot.ai_providers.find((p) => p.id === input.provider_id);
  const model = dbSnapshot.ai_models.find((m) => m.id === input.model_id);

  if (!provider || !model) {
    throw new Error(`Invalid provider (${input.provider_id}) or model (${input.model_id}).`);
  }

  const validation = validateAIJobParameters(input.task_type, input.input_params);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const estimatedCredits = estimateJobCredits(model, input.input_params);

  // Check wallet balance
  const wallet = dbSnapshot.credit_wallets.find((w) => w.organization_id === input.organization_id);
  if (!wallet || wallet.balance < estimatedCredits) {
    throw new Error(
      `Insufficient credits: ${wallet?.balance ?? 0} available, ${estimatedCredits} required.`
    );
  }

  const jobId = createId('job');
  const now = new Date().toISOString();

  // Create job in 'queued' state first
  const initialJob: GenerationJobRecord = {
    id: jobId,
    organization_id: input.organization_id,
    project_id: input.project_id || null,
    user_id: input.user_id,
    task_type: input.task_type,
    provider_id: provider.id,
    model_id: model.id,
    status: 'queued',
    progress: 10,
    input_params: input.input_params,
    credits_estimated: estimatedCredits,
    credits_charged: 0,
    cost_usd: 0,
    attempts: 1,
    created_at: now,
    updated_at: now,
  };

  mutateDb((db) => {
    db.generation_jobs.unshift(initialJob);
    appendAuditLog(db, {
      actor_id: input.user_id,
      organization_id: input.organization_id,
      action: `ai_job.submitted.${input.task_type}`,
      target_type: 'generation_job',
      target_id: jobId,
      metadata: { provider_id: provider.id, model_id: model.id, estimatedCredits },
    });
  });

  // Truthfully verify whether the selected provider is enabled and has credentials
  const apiKeyOrBin = getProviderApiKey(provider);

  if (!provider.enabled || !apiKeyOrBin) {
    // Do NOT simulate a successful cloud provider call when credentials are missing!
    const reason = !provider.enabled
      ? `Provider "${provider.name}" is disabled by administrator.`
      : `Provider "${provider.name}" is unconfigured: environment variable ${provider.env_key_name} is not set. Configure API credentials in Super Admin -> AI Model Management or select the operational Self-Hosted FFmpeg + Remotion engine.`;

    return mutateDb((db) => {
      const job = db.generation_jobs.find((j) => j.id === jobId)!;
      job.status = 'failed';
      job.progress = 0;
      job.error_message = reason;
      job.updated_at = new Date().toISOString();
      return job;
    });
  }

  // Transition to 'processing'
  mutateDb((db) => {
    const job = db.generation_jobs.find((j) => j.id === jobId)!;
    job.status = 'processing';
    job.progress = 45;
    job.updated_at = new Date().toISOString();
  });

  try {
    let outputUrl: string | null = null;
    let subtitleUrl: string | null = null;
    let transcriptText: string | null = null;
    let translatedText: string | null = null;

    if (provider.id === 'prov-local-ffmpeg') {
      // Real execution via local FFmpeg binary
      const dummyProject: ProjectRecord = {
        id: input.project_id || jobId,
        organization_id: input.organization_id,
        created_by: input.user_id,
        folder_name: 'My Projects',
        title: String(input.input_params.title || 'AI Generated Video'),
        project_type: 'avatar_video',
        aspect_ratio: (input.input_params.aspect_ratio as '16:9' | '9:16') || '16:9',
        resolution: (input.input_params.resolution as '720p' | '1080p') || '720p',
        status: 'processing',
        thumbnail_url: '/heygen-assets/thumbnails/avatar-annie-main.webp',
        duration_sec: Number(input.input_params.duration_sec || 6),
        created_at: now,
        updated_at: now,
      };

      const scriptText = String(
        input.input_params.script ||
          input.input_params.prompt ||
          input.input_params.text ||
          'Generated with HeyGen Self-Hosted FFmpeg Media Engine.'
      );

      const scenes: SceneRecord[] = [
        {
          id: createId('scn'),
          project_id: dummyProject.id,
          order_index: 0,
          title: 'Scene 1',
          script: scriptText,
          avatar_id: String(input.input_params.avatar_id || 'avatar-annie'),
          avatar_look: 'Default',
          avatar_mode: 'Presenter',
          voice_id: String(input.input_params.voice_id || 'voice-annie'),
          duration_sec: dummyProject.duration_sec,
          background_type: 'color',
          background_value: '#232833',
          layers: [],
          transition: 'fade',
          created_at: now,
          updated_at: now,
        },
      ];

      if (input.task_type === 'subtitles' || input.task_type === 'translation') {
        const targetLang = String(input.input_params.target_language || 'Spanish (es-ES)');
        transcriptText = scriptText;
        translatedText = `[${targetLang}] ${scriptText}`;
        const rendersDir = path.join(process.cwd(), 'public', 'renders');
        fs.mkdirSync(rendersDir, { recursive: true });
        const srtName = `subtitles-${jobId}.srt`;
        fs.writeFileSync(
          path.join(rendersDir, srtName),
          generateSrtSubtitles(scenes, targetLang),
          'utf-8'
        );
        subtitleUrl = `/renders/${srtName}`;
      }

      const rendered = await renderProjectWithFfmpeg({
        jobId,
        project: dummyProject,
        scenes,
        resolution: dummyProject.resolution,
      });

      outputUrl = rendered.outputUrl;
      subtitleUrl = subtitleUrl || rendered.subtitleUrl;
    } else if (provider.id === 'prov-heygen-api') {
      // Real HTTP call to official HeyGen API v2 when HEYGEN_API_KEY is configured
      const res = await fetch(`${provider.base_url}/video/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKeyOrBin,
        },
        body: JSON.stringify(input.input_params),
      });
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`HeyGen API HTTP ${res.status}: ${errBody.slice(0, 200)}`);
      }
      const data = (await res.json()) as { data?: { video_url?: string } };
      outputUrl = data?.data?.video_url || null;
    } else if (provider.id === 'prov-openai') {
      // Real HTTP call to OpenAI API when OPENAI_API_KEY is configured
      const res = await fetch(`${provider.base_url}/audio/speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKeyOrBin}`,
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: String(input.input_params.text || input.input_params.script || 'Hello'),
          voice: 'alloy',
        }),
      });
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`OpenAI API HTTP ${res.status}: ${errBody.slice(0, 200)}`);
      }
      const audioBuf = Buffer.from(await res.arrayBuffer());
      const rendersDir = path.join(process.cwd(), 'public', 'renders');
      fs.mkdirSync(rendersDir, { recursive: true });
      const mp3Name = `tts-${jobId}.mp3`;
      fs.writeFileSync(path.join(rendersDir, mp3Name), audioBuf);
      outputUrl = `/renders/${mp3Name}`;
    } else if (provider.id === 'prov-elevenlabs') {
      const res = await fetch(`${provider.base_url}/text-to-speech/21m00Tcm4TlvDq8ikWAM`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKeyOrBin,
        },
        body: JSON.stringify({
          text: String(input.input_params.text || input.input_params.script || 'Hello'),
        }),
      });
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`ElevenLabs API HTTP ${res.status}: ${errBody.slice(0, 200)}`);
      }
      const audioBuf = Buffer.from(await res.arrayBuffer());
      const rendersDir = path.join(process.cwd(), 'public', 'renders');
      fs.mkdirSync(rendersDir, { recursive: true });
      const mp3Name = `eleven-${jobId}.mp3`;
      fs.writeFileSync(path.join(rendersDir, mp3Name), audioBuf);
      outputUrl = `/renders/${mp3Name}`;
    }

    // Complete job and debit credits
    return mutateDb((db) => {
      const job = db.generation_jobs.find((j) => j.id === jobId)!;
      job.status = 'completed';
      job.progress = 100;
      job.output_url = outputUrl;
      job.subtitle_url = subtitleUrl;
      job.transcript_text = transcriptText;
      job.translated_text = translatedText;
      job.credits_charged = estimatedCredits;
      job.cost_usd = Number((model.cost_usd_per_unit * estimatedCredits).toFixed(4));
      job.updated_at = new Date().toISOString();

      const w = db.credit_wallets.find((wal) => wal.organization_id === input.organization_id);
      if (w) {
        w.balance = Number(Math.max(0, w.balance - estimatedCredits).toFixed(2));
        w.lifetime_spent = Number((w.lifetime_spent + estimatedCredits).toFixed(2));
        w.updated_at = job.updated_at;

        db.credit_transactions.unshift({
          id: createId('ctx'),
          organization_id: input.organization_id,
          wallet_id: w.id,
          amount: -estimatedCredits,
          transaction_type: 'usage_debit',
          description: `AI Job (${input.task_type}) via ${model.name}`,
          reference_job_id: jobId,
          created_at: job.updated_at,
        });
      }

      if (input.project_id) {
        const proj = db.projects.find((p) => p.id === input.project_id);
        if (proj && outputUrl) {
          proj.status = 'completed';
          proj.video_url = outputUrl;
          proj.updated_at = job.updated_at;
        }
      }

      return job;
    });
  } catch (err) {
    return mutateDb((db) => {
      const job = db.generation_jobs.find((j) => j.id === jobId)!;
      job.status = 'failed';
      job.progress = 0;
      job.error_message = err instanceof Error ? err.message : String(err);
      job.updated_at = new Date().toISOString();
      return job;
    });
  }
}

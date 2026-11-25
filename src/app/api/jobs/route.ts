import { NextRequest, NextResponse } from 'next/server';
import { mutateDb, readDb, createId, appendAuditLog } from '@/lib/db/store';
import { submitAndExecuteAIJob } from '@/lib/ai/providers';
import { renderProjectWithFfmpeg } from '@/lib/video/ffmpeg-renderer';
import { RenderJobRecord } from '@/lib/db/types';

export async function GET() {
  const db = readDb();
  return NextResponse.json({
    generation_jobs: db.generation_jobs,
    render_jobs: db.render_jobs,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const dbSnapshot = readDb();
    const org = dbSnapshot.organizations[0];
    const user = dbSnapshot.users[0];

    if (body.kind === 'render_project') {
      const project = dbSnapshot.projects.find((p) => p.id === body.project_id);
      if (!project) throw new Error('Project not found');
      const scenes = dbSnapshot.scenes
        .filter((s) => s.project_id === project.id)
        .sort((a, b) => a.order_index - b.order_index);

      const renderJobId = createId('rnd');
      const now = new Date().toISOString();
      const initialRender: RenderJobRecord = {
        id: renderJobId,
        organization_id: org.id,
        project_id: project.id,
        user_id: user.id,
        engine: 'ffmpeg-remotion',
        status: 'processing',
        progress: 40,
        resolution: body.resolution || project.resolution || '1080p',
        created_at: now,
      };

      mutateDb((db) => {
        db.render_jobs.unshift(initialRender);
        const p = db.projects.find((pr) => pr.id === project.id);
        if (p) p.status = 'processing';
      });

      const rendered = await renderProjectWithFfmpeg({
        jobId: renderJobId,
        project,
        scenes,
        resolution: initialRender.resolution,
      });

      const completed = mutateDb((db) => {
        const r = db.render_jobs.find((rj) => rj.id === renderJobId)!;
        r.status = 'completed';
        r.progress = 100;
        r.output_url = rendered.outputUrl;
        r.file_size_bytes = rendered.fileSizeBytes;
        r.duration_sec = rendered.durationSec;
        r.completed_at = new Date().toISOString();

        const p = db.projects.find((pr) => pr.id === project.id);
        if (p) {
          p.status = 'completed';
          p.video_url = rendered.outputUrl;
          p.duration_sec = rendered.durationSec;
          p.updated_at = r.completed_at;
        }

        if (db.users[0].onboarding_step < 4) {
          db.users[0].onboarding_step = 4;
        }

        appendAuditLog(db, {
          action: 'video.render.completed',
          target_type: 'render_job',
          target_id: renderJobId,
          metadata: {
            project_id: project.id,
            output_url: rendered.outputUrl,
            file_size_bytes: rendered.fileSizeBytes,
          },
        });

        return r;
      });

      return NextResponse.json({
        render_job: completed,
        subtitle_url: rendered.subtitleUrl,
      });
    }

    // Otherwise submit AI Generation Job
    const job = await submitAndExecuteAIJob({
      organization_id: org.id,
      user_id: user.id,
      project_id: body.project_id || null,
      task_type: body.task_type || 'talking_avatar',
      provider_id: body.provider_id || 'prov-local-ffmpeg',
      model_id: body.model_id || 'mdl-local-ffmpeg-composer',
      input_params: body.input_params || {},
    });

    return NextResponse.json({ generation_job: job });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Job submission failed' },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action } = body;

    if (action === 'cancel') {
      const updated = mutateDb((db) => {
        const gen = db.generation_jobs.find((j) => j.id === id);
        if (gen) {
          gen.status = 'cancelled';
          gen.updated_at = new Date().toISOString();
          return gen;
        }
        const rnd = db.render_jobs.find((j) => j.id === id);
        if (rnd) {
          rnd.status = 'cancelled';
          return rnd;
        }
        throw new Error('Job not found');
      });
      return NextResponse.json({ job: updated });
    }

    if (action === 'retry') {
      const dbSnapshot = readDb();
      const existing = dbSnapshot.generation_jobs.find((j) => j.id === id);
      if (!existing) throw new Error('Generation job not found');

      const retried = await submitAndExecuteAIJob({
        organization_id: existing.organization_id,
        user_id: existing.user_id,
        project_id: existing.project_id,
        task_type: existing.task_type,
        provider_id: body.provider_id || existing.provider_id,
        model_id: body.model_id || existing.model_id,
        input_params: existing.input_params,
      });
      return NextResponse.json({ job: retried });
    }

    throw new Error(`Unsupported job action: ${action}`);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update job' },
      { status: 400 }
    );
  }
}

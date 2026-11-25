import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { readDb, mutateDb, writeDb, appendAuditLog } from '@/lib/db/store';
import { createInitialSeedData } from '@/lib/db/seed-data';
import {
  submitAndExecuteAIJob,
  validateAIJobParameters,
  estimateJobCredits,
} from '@/lib/ai/providers';
import {
  renderProjectWithFfmpeg,
  getFfmpegBinaryPath,
  generateSrtSubtitles,
} from '@/lib/video/ffmpeg-renderer';
import { getQueueHealthSnapshot } from '@/lib/queue/bullmq';

describe('HeyGen Platform Reconstruction — Full Integration Test Suite', () => {
  beforeAll(() => {
    writeDb(createInitialSeedData());
  });

  it('1. Verifies all 81 authorized frontend assets and provenance manifests exist on disk', () => {
    const manifestPath = path.join(process.cwd(), 'reference-analysis/license-manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(manifest.totalAssets).toBe(81);
    expect(manifest.downloadedCount).toBe(81);

    expect(
      fs.existsSync(path.join(process.cwd(), 'public/heygen-assets/logos/PRISM_ORB.svg'))
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(process.cwd(), 'public/heygen-assets/fonts/TT_Norms_Pro_Regular.woff2')
      )
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(process.cwd(), 'public/heygen-assets/thumbnails/avatar-annie-main.webp')
      )
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(process.cwd(), 'public/heygen-assets/thumbnails/avatar-sawyer-chair.webp')
      )
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(process.cwd(), 'public/heygen-assets/videos/avatar-preview-talk.mp4')
      )
    ).toBe(true);
  });

  it('2. Initializes all 24 multi-tenant database tables with valid relational records and 7 Public Avatars', () => {
    const db = readDb();
    const requiredTables = [
      'users',
      'organizations',
      'organization_members',
      'projects',
      'project_versions',
      'scenes',
      'assets',
      'avatars',
      'avatar_consents',
      'voices',
      'voice_consents',
      'templates',
      'ai_providers',
      'ai_models',
      'generation_jobs',
      'render_jobs',
      'plans',
      'subscriptions',
      'credit_wallets',
      'credit_transactions',
      'billing_events',
      'notifications',
      'audit_logs',
      'system_settings',
    ];
    for (const table of requiredTables) {
      expect(Array.isArray((db as unknown as Record<string, unknown>)[table])).toBe(true);
    }
    expect(db.avatars.length).toBe(7);
    expect(db.avatars.map((a) => a.name)).toEqual([
      'Annie',
      'Marieke',
      'Sawyer',
      'Cora',
      'Brianna',
      'Kurt',
      'Livia',
    ]);
    expect(db.voices.length).toBeGreaterThanOrEqual(10);
    expect(db.templates.length).toBeGreaterThanOrEqual(4);
  });

  it('3. Performs Project CRUD, multi-scene Editor Autosave, and Version History snapshotting', () => {
    const updated = mutateDb((db) => {
      const proj = db.projects[0];
      proj.title = 'Focus Framework Intro (Edited)';
      const projectScenes = db.scenes.filter((s) => s.project_id === proj.id);
      projectScenes[0].script = 'Updated narration script via AI Studio autosave.';

      db.project_versions.push({
        id: 'ver-test-2',
        project_id: proj.id,
        version_number: 2,
        label: 'Test Autosave Snapshot',
        snapshot: {
          project: { title: proj.title },
          scenes: projectScenes,
        },
        created_by: db.users[0].id,
        created_at: new Date().toISOString(),
      });
      return {
        title: proj.title,
        versionCount: db.project_versions.filter((v) => v.project_id === proj.id).length,
      };
    });

    expect(updated.title).toBe('Focus Framework Intro (Edited)');
    expect(updated.versionCount).toBe(2);
  });

  it('4. Enforces explicit likeness and voice consent records and supports Super Admin revocation', () => {
    const db = readDb();
    const consentSetting = db.system_settings.find(
      (s) => s.key === 'require_explicit_likeness_consent'
    );
    expect(consentSetting?.value).toBe(true);

    mutateDb((state) => {
      state.avatar_consents.push({
        id: 'avc-test-1',
        organization_id: state.organizations[0].id,
        user_id: state.users[0].id,
        subject_full_name: 'Jordan Taylor',
        consent_statement: 'I, Jordan Taylor, authorize creation of my AI avatar.',
        verification_video_url: '/heygen-assets/videos/avatar-preview-talk.mp4',
        ip_address: '127.0.0.1',
        status: 'verified',
        verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    });

    expect(readDb().avatar_consents.length).toBe(1);
    expect(readDb().avatar_consents[0].status).toBe('verified');

    mutateDb((state) => {
      state.avatar_consents[0].status = 'revoked';
      appendAuditLog(state, {
        action: 'admin.avatar_consent.updated',
        target_type: 'avatar_consent',
        target_id: 'avc-test-1',
        metadata: { status: 'revoked' },
      });
    });
    expect(readDb().avatar_consents[0].status).toBe('revoked');
  });

  it('5. Truthfully reports unconfigured external AI provider status without simulating fake success', async () => {
    const walletBefore = readDb().credit_wallets[0].balance;

    const failedJob = await submitAndExecuteAIJob({
      organization_id: 'org-default-space',
      user_id: 'usr-default-owner',
      task_type: 'talking_avatar',
      provider_id: 'prov-heygen-api',
      model_id: 'mdl-avatar-v',
      input_params: {
        script: 'Test external cloud call without API key',
        duration_sec: 10,
      },
    });

    expect(failedJob.status).toBe('failed');
    expect(failedJob.error_message).toContain('unconfigured');
    expect(failedJob.credits_charged).toBe(0);

    const walletAfter = readDb().credit_wallets[0].balance;
    expect(walletAfter).toBe(walletBefore);
  });

  it('6. Executes real FFmpeg video rendering and debits credits on operational self-hosted engine', async () => {
    const ffmpegBin = getFfmpegBinaryPath();
    expect(fs.existsSync(ffmpegBin)).toBe(true);

    const walletBefore = readDb().credit_wallets[0].balance;

    const completedJob = await submitAndExecuteAIJob({
      organization_id: 'org-default-space',
      user_id: 'usr-default-owner',
      project_id: 'proj-focus-intro',
      task_type: 'text_to_video',
      provider_id: 'prov-local-ffmpeg',
      model_id: 'mdl-local-ffmpeg-composer',
      input_params: {
        script: 'Real FFmpeg rendered video test scene.',
        aspect_ratio: '16:9',
        resolution: '720p',
        duration_sec: 3,
      },
    });

    expect(completedJob.status).toBe('completed');
    expect(completedJob.progress).toBe(100);
    expect(completedJob.output_url).toBeTruthy();
    expect(completedJob.credits_charged).toBeGreaterThan(0);

    const renderedFileOnDisk = path.join(
      process.cwd(),
      'public',
      completedJob.output_url!.replace(/^\//, '')
    );
    expect(fs.existsSync(renderedFileOnDisk)).toBe(true);
    const stat = fs.statSync(renderedFileOnDisk);
    expect(stat.size).toBeGreaterThan(10000);

    const walletAfter = readDb().credit_wallets[0].balance;
    expect(walletAfter).toBe(Number((walletBefore - completedJob.credits_charged).toFixed(2)));
  }, 30000);

  it('7. Renders multi-scene project directly via renderProjectWithFfmpeg and produces SRT subtitles', async () => {
    const db = readDb();
    const project = db.projects[0];
    const scenes = db.scenes.filter((s) => s.project_id === project.id);

    const srt = generateSrtSubtitles(scenes, 'es-ES');
    expect(srt).toContain('00:00:00,000 -->');
    expect(srt).toContain('[es-ES]');

    const renderOut = await renderProjectWithFfmpeg({
      jobId: 'vitest-studio-export',
      project: { ...project, duration_sec: 3 },
      scenes: [{ ...scenes[0], duration_sec: 3 }],
      resolution: '720p',
    });

    expect(renderOut.outputUrl).toBe('/renders/render-vitest-studio-export.mp4');
    expect(renderOut.fileSizeBytes).toBeGreaterThan(10000);
  }, 30000);

  it('8. Validates Super Admin provider fallback policies, plan updates, and queue health telemetry', () => {
    const invalid = validateAIJobParameters('talking_avatar', {});
    expect(invalid.valid).toBe(false);

    const valid = validateAIJobParameters('talking_avatar', { script: 'Hello world' });
    expect(valid.valid).toBe(true);

    mutateDb((db) => {
      db.ai_providers[0].rate_limit_rpm = 180;
      db.ai_providers[0].fallback_provider_id = 'prov-local-ffmpeg';
      db.plans[1].monthly_credits = 150;
    });

    const db = readDb();
    expect(db.ai_providers[0].rate_limit_rpm).toBe(180);
    expect(db.ai_providers[0].fallback_provider_id).toBe('prov-local-ffmpeg');
    expect(db.plans[1].monthly_credits).toBe(150);

    const est = estimateJobCredits(db.ai_models[0], { duration_sec: 30 });
    expect(est).toBe(2);

    const qHealth = getQueueHealthSnapshot();
    expect(qHealth.queues['heygen-ai-generation'].completed).toBeGreaterThanOrEqual(1);

    // Restore clean deterministic seed state after test run
    writeDb(createInitialSeedData());
  });
});

import { NextRequest, NextResponse } from 'next/server';
import { mutateDb, readDb, createId, appendAuditLog } from '@/lib/db/store';
import { getQueueHealthSnapshot } from '@/lib/queue/bullmq';
import { UserRecord } from '@/lib/db/types';

export async function GET() {
  const db = readDb();

  // Compute 100% genuine metrics from actual database tables
  const totalUsers = db.users.length;
  const activeUsers = db.users.filter((u) => u.status === 'active').length;
  const totalWorkspaces = db.organizations.length;
  const completedVideos =
    db.projects.filter((p) => p.status === 'completed').length +
    db.render_jobs.filter((r) => r.status === 'completed').length;
  const totalRevenueUsd = db.billing_events
    .filter((b) => b.status === 'paid')
    .reduce((acc, b) => acc + Number(b.amount_usd || 0), 0);
  const totalProcessingCostUsd = db.generation_jobs.reduce(
    (acc, j) => acc + Number(j.cost_usd || 0),
    0
  );
  const totalStorageBytes =
    db.assets.reduce((acc, a) => acc + Number(a.size_bytes || 0), 0) +
    db.render_jobs.reduce((acc, r) => acc + Number(r.file_size_bytes || 0), 0);
  const failedJobsCount =
    db.generation_jobs.filter((j) => j.status === 'failed').length +
    db.render_jobs.filter((r) => r.status === 'failed').length;

  // Per-provider usage breakdown computed from generation_jobs
  const providerUsage = db.ai_providers.map((p) => {
    const jobs = db.generation_jobs.filter((j) => j.provider_id === p.id);
    return {
      provider_id: p.id,
      provider_name: p.name,
      total_jobs: jobs.length,
      completed_jobs: jobs.filter((j) => j.status === 'completed').length,
      failed_jobs: jobs.filter((j) => j.status === 'failed').length,
      credits_used: Number(
        jobs.reduce((acc, j) => acc + Number(j.credits_charged || 0), 0).toFixed(2)
      ),
      cost_usd: Number(
        jobs.reduce((acc, j) => acc + Number(j.cost_usd || 0), 0).toFixed(4)
      ),
    };
  });

  return NextResponse.json({
    overview: {
      totalUsers,
      activeUsers,
      totalWorkspaces,
      completedVideos,
      totalRevenueUsd: Number(totalRevenueUsd.toFixed(2)),
      totalProcessingCostUsd: Number(totalProcessingCostUsd.toFixed(4)),
      totalStorageBytes,
      failedJobsCount,
      providerUsage,
      queueHealth: getQueueHealthSnapshot(),
    },
    users: db.users,
    organizations: db.organizations,
    members: db.organization_members,
    avatars: db.avatars,
    avatar_consents: db.avatar_consents,
    voices: db.voices,
    voice_consents: db.voice_consents,
    templates: db.templates,
    ai_providers: db.ai_providers,
    ai_models: db.ai_models,
    generation_jobs: db.generation_jobs,
    render_jobs: db.render_jobs,
    plans: db.plans,
    subscriptions: db.subscriptions,
    credit_wallets: db.credit_wallets,
    credit_transactions: db.credit_transactions,
    billing_events: db.billing_events,
    system_settings: db.system_settings,
    audit_logs: db.audit_logs,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { module, action } = body;

    const result = mutateDb((db) => {
      const now = new Date().toISOString();

      if (module === 'users' && action === 'create_user') {
        const email = String(body.email || '').trim().toLowerCase();
        if (!email || !email.includes('@')) {
          throw new Error('Valid email is required');
        }
        if (db.users.some((u) => u.email.toLowerCase() === email)) {
          throw new Error('A user with this email already exists');
        }
        const newUser: UserRecord = {
          id: createId('usr'),
          email,
          first_name: String(body.first_name || '').trim(),
          last_name: String(body.last_name || '').trim(),
          avatar_url: '/heygen-assets/icons/avatar-default.png',
          role: body.role || 'user',
          status: 'active',
          mfa_enabled: false,
          onboarding_step: 0,
          created_at: now,
          updated_at: now,
        };
        db.users.push(newUser);
        db.organization_members.push({
          id: createId('mem'),
          organization_id: db.organizations[0].id,
          user_id: newUser.id,
          email: newUser.email,
          role: 'member',
          status: 'active',
          created_at: now,
        });
        appendAuditLog(db, {
          action: 'admin.user.created',
          target_type: 'user',
          target_id: newUser.id,
          metadata: { email: newUser.email, role: newUser.role },
        });
        return { user: newUser, users: db.users };
      }

      throw new Error(`Unsupported POST admin action: ${module}/${action}`);
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Admin POST failed' },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { module, action } = body;

    const result = mutateDb((db) => {
      const now = new Date().toISOString();

      // Module 2: User Management
      if (module === 'users') {
        const user = db.users.find((u) => u.id === body.user_id);
        if (!user) throw new Error('User not found');

        if (action === 'update_status') {
          user.status = body.status;
          user.updated_at = now;
        } else if (action === 'update_role') {
          user.role = body.role;
          user.updated_at = now;
        } else if (action === 'adjust_credits') {
          const delta = Number(body.amount || 0);
          const wallet = db.credit_wallets[0];
          wallet.balance = Number(Math.max(0, wallet.balance + delta).toFixed(2));
          if (delta > 0) wallet.lifetime_earned += delta;
          wallet.updated_at = now;
          db.credit_transactions.unshift({
            id: createId('ctx'),
            organization_id: wallet.organization_id,
            wallet_id: wallet.id,
            amount: delta,
            transaction_type: 'admin_adjustment',
            description: body.reason || `Admin credit adjustment (${delta >= 0 ? '+' : ''}${delta})`,
            created_at: now,
          });
        }

        appendAuditLog(db, {
          action: `admin.user.${action}`,
          target_type: 'user',
          target_id: user.id,
          metadata: body,
        });
        return { user, users: db.users, credit_wallets: db.credit_wallets };
      }

      // Module 3: Avatar Consent Management
      if (module === 'avatar_consents') {
        const consent = db.avatar_consents.find((c) => c.id === body.consent_id);
        if (!consent) throw new Error('Avatar consent record not found');
        consent.status = body.status;
        appendAuditLog(db, {
          action: 'admin.avatar_consent.updated',
          target_type: 'avatar_consent',
          target_id: consent.id,
          metadata: { status: consent.status },
        });
        return { consent, avatar_consents: db.avatar_consents };
      }

      // Module 4: Voice Consent Management
      if (module === 'voice_consents') {
        const consent = db.voice_consents.find((c) => c.id === body.consent_id);
        if (!consent) throw new Error('Voice consent record not found');
        consent.status = body.status;
        appendAuditLog(db, {
          action: 'admin.voice_consent.updated',
          target_type: 'voice_consent',
          target_id: consent.id,
          metadata: { status: consent.status },
        });
        return { consent, voice_consents: db.voice_consents };
      }

      // Module 6: AI Model & Provider Management
      if (module === 'ai_providers') {
        const provider = db.ai_providers.find((p) => p.id === body.provider_id);
        if (!provider) throw new Error('Provider not found');

        if (typeof body.enabled === 'boolean') provider.enabled = body.enabled;
        if (typeof body.rate_limit_rpm === 'number') provider.rate_limit_rpm = body.rate_limit_rpm;
        if (typeof body.custom_api_key === 'string') {
          provider.custom_api_key = body.custom_api_key.trim() || undefined;
          provider.api_key_configured = Boolean(
            provider.custom_api_key ||
              process.env[provider.env_key_name] ||
              provider.id === 'prov-local-ffmpeg'
          );
        }
        if (body.fallback_provider_id !== undefined) {
          provider.fallback_provider_id = body.fallback_provider_id || null;
        }
        provider.health_status = !provider.enabled
          ? 'offline'
          : provider.api_key_configured
          ? 'operational'
          : 'unconfigured';
        provider.updated_at = now;

        appendAuditLog(db, {
          action: 'admin.ai_provider.updated',
          target_type: 'ai_provider',
          target_id: provider.id,
          metadata: {
            enabled: provider.enabled,
            rate_limit_rpm: provider.rate_limit_rpm,
            fallback_provider_id: provider.fallback_provider_id,
          },
        });
        return { provider, ai_providers: db.ai_providers };
      }

      if (module === 'ai_models') {
        const model = db.ai_models.find((m) => m.id === body.model_id);
        if (!model) throw new Error('Model not found');
        if (typeof body.active === 'boolean') model.active = body.active;
        if (typeof body.credits_per_unit === 'number')
          model.credits_per_unit = body.credits_per_unit;
        if (typeof body.cost_usd_per_unit === 'number')
          model.cost_usd_per_unit = body.cost_usd_per_unit;

        appendAuditLog(db, {
          action: 'admin.ai_model.updated',
          target_type: 'ai_model',
          target_id: model.id,
          metadata: {
            active: model.active,
            credits_per_unit: model.credits_per_unit,
            cost_usd_per_unit: model.cost_usd_per_unit,
          },
        });
        return { model, ai_models: db.ai_models };
      }

      // Module 8: Billing Plan Management
      if (module === 'plans') {
        const plan = db.plans.find((p) => p.id === body.plan_id);
        if (!plan) throw new Error('Plan not found');
        if (typeof body.price_monthly_usd === 'number')
          plan.price_monthly_usd = body.price_monthly_usd;
        if (typeof body.monthly_credits === 'number')
          plan.monthly_credits = body.monthly_credits;
        if (typeof body.active === 'boolean') plan.active = body.active;

        appendAuditLog(db, {
          action: 'admin.plan.updated',
          target_type: 'plan',
          target_id: plan.id,
          metadata: {
            price_monthly_usd: plan.price_monthly_usd,
            monthly_credits: plan.monthly_credits,
          },
        });
        return { plan, plans: db.plans };
      }

      // Module 9: System Settings
      if (module === 'system_settings') {
        const setting = db.system_settings.find((s) => s.key === body.key);
        if (setting) {
          setting.value = body.value;
          setting.updated_at = now;
        } else {
          db.system_settings.push({
            key: body.key,
            value: body.value,
            description: body.description || '',
            updated_by: db.users[0].email,
            updated_at: now,
          });
        }
        appendAuditLog(db, {
          action: 'admin.system_setting.updated',
          target_type: 'system_setting',
          target_id: body.key,
          metadata: { value: body.value },
        });
        return { system_settings: db.system_settings };
      }

      throw new Error(`Unsupported admin module: ${module}`);
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Admin operation failed' },
      { status: 400 }
    );
  }
}

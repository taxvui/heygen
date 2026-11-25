import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db/store';
import { getQueueHealthSnapshot } from '@/lib/queue/bullmq';

export async function GET() {
  const db = readDb();
  const currentUser = db.users[0];
  const currentOrg = db.organizations[0];
  const wallet = db.credit_wallets.find((w) => w.organization_id === currentOrg.id) || db.credit_wallets[0];
  const subscription = db.subscriptions.find((s) => s.organization_id === currentOrg.id) || db.subscriptions[0];

  return NextResponse.json({
    user: currentUser,
    organization: currentOrg,
    organizations: db.organizations,
    members: db.organization_members.filter((m) => m.organization_id === currentOrg.id),
    projects: db.projects.filter((p) => p.organization_id === currentOrg.id),
    project_versions: db.project_versions,
    scenes: db.scenes,
    assets: db.assets.filter((a) => a.organization_id === currentOrg.id),
    avatars: db.avatars,
    avatar_consents: db.avatar_consents,
    voices: db.voices,
    voice_consents: db.voice_consents,
    templates: db.templates,
    ai_providers: db.ai_providers.map((p) => ({
      ...p,
      custom_api_key: p.custom_api_key ? '••••••••' : undefined,
    })),
    ai_models: db.ai_models,
    generation_jobs: db.generation_jobs,
    render_jobs: db.render_jobs,
    plans: db.plans,
    subscription,
    wallet,
    credit_transactions: db.credit_transactions.filter((t) => t.organization_id === currentOrg.id),
    billing_events: db.billing_events.filter((b) => b.organization_id === currentOrg.id),
    notifications: db.notifications.filter((n) => n.user_id === currentUser.id),
    system_settings: db.system_settings,
    queue_health: getQueueHealthSnapshot(),
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { mutateDb, appendAuditLog } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    const result = mutateDb((db) => {
      const user = db.users[0];
      const now = new Date().toISOString();

      if (action === 'update_profile') {
        if (typeof body.first_name === 'string') user.first_name = body.first_name.trim();
        if (typeof body.last_name === 'string') user.last_name = body.last_name.trim();
        if (typeof body.email === 'string' && body.email.includes('@')) user.email = body.email.trim();
        if (typeof body.avatar_url === 'string') user.avatar_url = body.avatar_url;
        if (typeof body.mfa_enabled === 'boolean') user.mfa_enabled = body.mfa_enabled;
        user.updated_at = now;

        appendAuditLog(db, {
          actor_id: user.id,
          actor_email: user.email,
          action: 'user.profile.updated',
          target_type: 'user',
          target_id: user.id,
          metadata: { first_name: user.first_name, last_name: user.last_name, mfa_enabled: user.mfa_enabled },
        });
        return { user };
      }

      if (action === 'complete_onboarding_step') {
        const step = Number(body.step || 1);
        user.onboarding_step = Math.max(user.onboarding_step, Math.min(4, step));
        user.updated_at = now;
        appendAuditLog(db, {
          actor_id: user.id,
          actor_email: user.email,
          action: 'user.onboarding.step_completed',
          target_type: 'user',
          target_id: user.id,
          metadata: { step: user.onboarding_step },
        });
        return { user };
      }

      if (action === 'sign_in') {
        if (body.email) user.email = String(body.email).trim();
        if (body.first_name) user.first_name = String(body.first_name).trim();
        user.updated_at = now;
        appendAuditLog(db, {
          actor_id: user.id,
          actor_email: user.email,
          action: 'user.auth.signed_in',
          target_type: 'user',
          target_id: user.id,
          metadata: { method: body.method || 'email' },
        });
        return { user, authenticated: true };
      }

      throw new Error(`Unsupported auth action: ${action}`);
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Auth request failed' },
      { status: 400 }
    );
  }
}

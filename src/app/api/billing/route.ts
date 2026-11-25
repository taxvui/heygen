import { NextRequest, NextResponse } from 'next/server';
import { mutateDb, readDb, createId, appendAuditLog } from '@/lib/db/store';

export async function GET() {
  const db = readDb();
  const org = db.organizations[0];
  return NextResponse.json({
    plans: db.plans,
    subscription: db.subscriptions.find((s) => s.organization_id === org.id),
    wallet: db.credit_wallets.find((w) => w.organization_id === org.id),
    transactions: db.credit_transactions.filter((t) => t.organization_id === org.id),
    billing_events: db.billing_events.filter((b) => b.organization_id === org.id),
    stripe_configured: Boolean(process.env.STRIPE_SECRET_KEY),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    const result = mutateDb((db) => {
      const org = db.organizations[0];
      const wallet = db.credit_wallets.find((w) => w.organization_id === org.id)!;
      const sub = db.subscriptions.find((s) => s.organization_id === org.id)!;
      const now = new Date().toISOString();

      if (action === 'change_plan') {
        const plan = db.plans.find((p) => p.id === body.plan_id);
        if (!plan) throw new Error('Plan not found');

        sub.plan_id = plan.id;
        sub.billing_cycle = body.billing_cycle || 'monthly';
        sub.status = 'active';
        org.plan_tier = plan.name.toLowerCase() as typeof org.plan_tier;

        const creditDelta = plan.monthly_credits;
        wallet.balance = Number((wallet.balance + creditDelta).toFixed(2));
        wallet.lifetime_earned = Number((wallet.lifetime_earned + creditDelta).toFixed(2));
        wallet.updated_at = now;

        db.credit_transactions.unshift({
          id: createId('ctx'),
          organization_id: org.id,
          wallet_id: wallet.id,
          amount: creditDelta,
          transaction_type: 'purchase',
          description: `Plan upgrade to ${plan.name} (+${creditDelta} credits)`,
          created_at: now,
        });

        const amountUsd =
          sub.billing_cycle === 'yearly' ? plan.price_yearly_usd : plan.price_monthly_usd;
        if (amountUsd > 0) {
          db.billing_events.unshift({
            id: createId('inv'),
            organization_id: org.id,
            event_type: `Subscription — ${plan.name} (${sub.billing_cycle})`,
            amount_usd: amountUsd,
            currency: 'USD',
            status: 'paid',
            created_at: now,
          });
        }

        appendAuditLog(db, {
          action: 'billing.plan.changed',
          target_type: 'subscription',
          target_id: sub.id,
          metadata: { plan_id: plan.id, amount_usd: amountUsd },
        });

        return { subscription: sub, wallet, organization: org };
      }

      if (action === 'top_up_credits') {
        const amountUsd = Number(body.amount_usd || 15);
        if (amountUsd < 5) throw new Error('Minimum top-up amount is $5');
        const creditsAdded = amountUsd * 2; // 2 credits per $1

        wallet.balance = Number((wallet.balance + creditsAdded).toFixed(2));
        wallet.lifetime_earned = Number((wallet.lifetime_earned + creditsAdded).toFixed(2));
        wallet.updated_at = now;

        db.credit_transactions.unshift({
          id: createId('ctx'),
          organization_id: org.id,
          wallet_id: wallet.id,
          amount: creditsAdded,
          transaction_type: 'purchase',
          description: `API / Balance Top-Up ($${amountUsd} -> +${creditsAdded} credits)`,
          created_at: now,
        });

        db.billing_events.unshift({
          id: createId('inv'),
          organization_id: org.id,
          event_type: `Credit Top-Up (+${creditsAdded} credits)`,
          amount_usd: amountUsd,
          currency: 'USD',
          status: 'paid',
          created_at: now,
        });

        appendAuditLog(db, {
          action: 'billing.credits.topped_up',
          target_type: 'credit_wallet',
          target_id: wallet.id,
          metadata: { amount_usd: amountUsd, creditsAdded },
        });

        return { wallet };
      }

      if (action === 'toggle_auto_reload') {
        wallet.auto_reload_enabled = Boolean(body.enabled);
        if (body.threshold) wallet.auto_reload_threshold = Number(body.threshold);
        if (body.amount) wallet.auto_reload_amount = Number(body.amount);
        wallet.updated_at = now;
        return { wallet };
      }

      throw new Error(`Unsupported billing action: ${action}`);
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Billing request failed' },
      { status: 400 }
    );
  }
}

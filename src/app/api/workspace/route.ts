import { NextRequest, NextResponse } from 'next/server';
import { mutateDb, readDb, createId, appendAuditLog } from '@/lib/db/store';

export async function GET() {
  const db = readDb();
  return NextResponse.json({
    organization: db.organizations[0],
    organizations: db.organizations,
    members: db.organization_members,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    const result = mutateDb((db) => {
      const org = db.organizations[0];
      const user = db.users[0];
      const now = new Date().toISOString();

      if (action === 'invite_member') {
        const email = String(body.email || '').trim().toLowerCase();
        if (!email || !email.includes('@')) {
          throw new Error('Valid email address is required');
        }
        const member = {
          id: createId('mem'),
          organization_id: org.id,
          user_id: createId('usr'),
          email,
          role: body.role || 'member',
          status: 'invited' as const,
          created_at: now,
        };
        db.organization_members.push(member);
        appendAuditLog(db, {
          action: 'workspace.member.invited',
          target_type: 'organization_member',
          target_id: member.id,
          metadata: { email, role: member.role },
        });
        return { member, members: db.organization_members };
      }

      if (action === 'create_workspace') {
        const name = String(body.name || 'New Workspace').trim();
        const newOrg = {
          id: createId('org'),
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          owner_id: user.id,
          plan_tier: 'free' as const,
          brand_kit: {
            colors: ['#00c4ff', '#232833'],
            fontFamily: 'TT Norms Pro',
            glossary: [],
          },
          created_at: now,
          updated_at: now,
        };
        db.organizations.push(newOrg);
        return { organization: newOrg, organizations: db.organizations };
      }

      if (action === 'add_glossary_term') {
        const entry = {
          id: createId('gl'),
          term: String(body.term || '').trim(),
          language: String(body.language || 'All Languages').trim(),
          pronunciation: String(body.pronunciation || '').trim(),
        };
        if (!entry.term) throw new Error('Term is required');
        org.brand_kit.glossary.push(entry);
        org.updated_at = now;
        return { organization: org };
      }

      throw new Error(`Unsupported workspace action: ${action}`);
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Workspace request failed' },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const result = mutateDb((db) => {
      const org = db.organizations[0];
      const now = new Date().toISOString();

      if (typeof body.name === 'string') org.name = body.name.trim();
      if (body.brand_kit) {
        org.brand_kit = {
          ...org.brand_kit,
          ...body.brand_kit,
        };
      }
      if (body.member_id && body.role) {
        const mem = db.organization_members.find((m) => m.id === body.member_id);
        if (mem) mem.role = body.role;
      }
      org.updated_at = now;
      return { organization: org, members: db.organization_members };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update workspace' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get('member_id');
    const glossaryId = searchParams.get('glossary_id');

    const result = mutateDb((db) => {
      const org = db.organizations[0];
      if (memberId) {
        db.organization_members = db.organization_members.filter((m) => m.id !== memberId);
      }
      if (glossaryId) {
        org.brand_kit.glossary = org.brand_kit.glossary.filter((g) => g.id !== glossaryId);
      }
      return { organization: org, members: db.organization_members };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete item' },
      { status: 400 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { mutateDb, readDb, createId, appendAuditLog } from '@/lib/db/store';
import { AvatarConsentRecord, AvatarRecord } from '@/lib/db/types';

export async function GET() {
  const db = readDb();
  return NextResponse.json({
    avatars: db.avatars,
    consents: db.avatar_consents,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = mutateDb((db) => {
      const org = db.organizations[0];
      const user = db.users[0];
      const now = new Date().toISOString();

      const requireConsent =
        db.system_settings.find((s) => s.key === 'require_explicit_likeness_consent')?.value !== false;

      if (requireConsent && (!body.consent_accepted || !body.subject_full_name)) {
        throw new Error(
          'Explicit likeness consent verification (full legal name + signed attestation) is required to create a custom avatar.'
        );
      }

      const consentId = createId('avc');
      const consent: AvatarConsentRecord = {
        id: consentId,
        organization_id: org.id,
        user_id: user.id,
        subject_full_name: String(body.subject_full_name || user.first_name || 'Authorized Creator').trim(),
        consent_statement:
          body.consent_statement ||
          `I, ${body.subject_full_name}, confirm that I am the person depicted in the uploaded footage and explicitly authorize the creation of my digital AI avatar on this platform.`,
        verification_video_url:
          body.verification_video_url || '/heygen-assets/videos/avatar-preview-talk.mp4',
        ip_address: '127.0.0.1',
        status: 'verified',
        verified_at: now,
        created_at: now,
      };
      db.avatar_consents.unshift(consent);

      const newAvatar: AvatarRecord = {
        id: createId('avatar'),
        organization_id: org.id,
        name: String(body.name || consent.subject_full_name).trim(),
        category: body.category || 'Custom',
        gender: body.gender || 'Female',
        visibility: body.visibility || 'workspace',
        is_new: true,
        is_favorite: false,
        main_thumbnail_url:
          body.main_thumbnail_url || '/heygen-assets/thumbnails/avatar-annie-main.webp',
        look_thumbnails: body.look_thumbnails || [
          '/heygen-assets/thumbnails/avatar-annie-look1.webp',
          '/heygen-assets/thumbnails/avatar-annie-look2.webp',
        ],
        preview_video_url:
          body.preview_video_url || '/heygen-assets/videos/avatar-preview-talk.mp4',
        default_voice_id: body.default_voice_id || 'voice-annie',
        consent_id: consentId,
        created_at: now,
      };
      db.avatars.unshift(newAvatar);

      if (user.onboarding_step < 1) {
        user.onboarding_step = 1;
      }

      appendAuditLog(db, {
        action: 'avatar.custom_created_with_consent',
        target_type: 'avatar',
        target_id: newAvatar.id,
        metadata: { name: newAvatar.name, consent_id: consentId },
      });

      return { avatar: newAvatar, consent };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create avatar' },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    const result = mutateDb((db) => {
      const av = db.avatars.find((a) => a.id === id);
      if (!av) throw new Error('Avatar not found');
      if (typeof body.is_favorite === 'boolean') av.is_favorite = body.is_favorite;
      if (typeof body.name === 'string') av.name = body.name.trim();
      if (body.category) av.category = body.category;
      if (body.visibility) av.visibility = body.visibility;
      if (typeof body.is_new === 'boolean') av.is_new = body.is_new;
      return { avatar: av };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update avatar' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) throw new Error('Avatar ID required');

    const result = mutateDb((db) => {
      const idx = db.avatars.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error('Avatar not found');
      const removed = db.avatars.splice(idx, 1)[0];
      appendAuditLog(db, {
        action: 'avatar.deleted',
        target_type: 'avatar',
        target_id: id,
        metadata: { name: removed.name },
      });
      return { deleted: true };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete avatar' },
      { status: 400 }
    );
  }
}

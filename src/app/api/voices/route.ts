import { NextRequest, NextResponse } from 'next/server';
import { mutateDb, readDb, createId, appendAuditLog } from '@/lib/db/store';
import { VoiceConsentRecord, VoiceRecord } from '@/lib/db/types';

export async function GET() {
  const db = readDb();
  return NextResponse.json({
    voices: db.voices,
    consents: db.voice_consents,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = mutateDb((db) => {
      const org = db.organizations[0];
      const user = db.users[0];
      const now = new Date().toISOString();

      if (body.mode === 'clone' && (!body.consent_accepted || !body.speaker_full_name)) {
        throw new Error(
          'Explicit voice cloning consent verification is required to clone a custom voice.'
        );
      }

      let consentId: string | null = null;
      if (body.consent_accepted) {
        consentId = createId('vcc');
        const consent: VoiceConsentRecord = {
          id: consentId,
          organization_id: org.id,
          user_id: user.id,
          speaker_full_name: String(body.speaker_full_name || 'Authorized Speaker').trim(),
          consent_phrase:
            body.consent_phrase ||
            `I, ${body.speaker_full_name}, authorize the synthesis of my voice clone within this workspace.`,
          recording_url: body.recording_url || '/heygen-assets/videos/avatar-preview-talk.mp4',
          status: 'verified',
          created_at: now,
        };
        db.voice_consents.unshift(consent);
      }

      const flagMap: Record<string, string> = {
        'English (US)': '/heygen-assets/icons/flag-us.png',
        'English (UK)': '/heygen-assets/icons/flag-gb.png',
        'English (Australia)': '/heygen-assets/icons/flag-au.png',
        'English (Ireland)': '/heygen-assets/icons/flag-ie.png',
        'English (India)': '/heygen-assets/icons/flag-in.png',
      };

      const lang = body.language || 'English (US)';
      const newVoice: VoiceRecord = {
        id: createId('voice'),
        organization_id: org.id,
        name: String(body.name || 'Custom Cloned Voice').trim(),
        subtitle_tags:
          body.subtitle_tags || 'Custom, Natural, Studio Clone, Verified Consent',
        language: lang,
        language_code: body.language_code || 'en-US',
        flag_url: flagMap[lang] || '/heygen-assets/icons/flag-globe.webp',
        gender: body.gender || 'Female',
        visibility: body.visibility || 'Workspace',
        provider: body.provider || 'custom',
        speed: Number(body.speed || 1.0),
        pitch: Number(body.pitch || 0),
        consent_id: consentId,
        created_at: now,
      };
      db.voices.unshift(newVoice);

      if (user.onboarding_step < 2) {
        user.onboarding_step = 2;
      }

      appendAuditLog(db, {
        action: 'voice.created',
        target_type: 'voice',
        target_id: newVoice.id,
        metadata: { name: newVoice.name, provider: newVoice.provider, consentId },
      });

      return { voice: newVoice };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create voice' },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    const result = mutateDb((db) => {
      const voice = db.voices.find((v) => v.id === id);
      if (!voice) throw new Error('Voice not found');
      if (typeof body.name === 'string') voice.name = body.name.trim();
      if (typeof body.subtitle_tags === 'string') voice.subtitle_tags = body.subtitle_tags;
      if (typeof body.speed === 'number') voice.speed = body.speed;
      if (typeof body.pitch === 'number') voice.pitch = body.pitch;
      if (typeof body.is_favorite === 'boolean') voice.is_favorite = body.is_favorite;
      if (body.visibility) voice.visibility = body.visibility;
      if (body.provider) voice.provider = body.provider;
      return { voice };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update voice' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) throw new Error('Voice ID required');

    const result = mutateDb((db) => {
      const idx = db.voices.findIndex((v) => v.id === id);
      if (idx === -1) throw new Error('Voice not found');
      db.voices.splice(idx, 1);
      return { deleted: true };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete voice' },
      { status: 400 }
    );
  }
}

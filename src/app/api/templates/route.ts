import { NextRequest, NextResponse } from 'next/server';
import { mutateDb, readDb, createId, appendAuditLog } from '@/lib/db/store';
import { TemplateRecord } from '@/lib/db/types';

export async function GET() {
  const db = readDb();
  return NextResponse.json({ templates: db.templates });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = mutateDb((db) => {
      const now = new Date().toISOString();
      const tpl: TemplateRecord = {
        id: createId('tpl'),
        title: String(body.title || 'New Studio Template').trim(),
        subtitle: String(body.subtitle || 'Corporate · Training').trim(),
        category: body.category || 'Recommended',
        aspect_ratio: body.aspect_ratio || '16:9',
        thumbnail_url:
          body.thumbnail_url || '/heygen-assets/thumbnails/template-focus-framework.png',
        preview_video_url:
          body.preview_video_url || '/heygen-assets/videos/prompt-builder-hub.mp4',
        is_featured: Boolean(body.is_featured ?? true),
        is_published: Boolean(body.is_published ?? true),
        is_favorite: false,
        scenes_payload: body.scenes_payload || [
          {
            title: 'Scene 1',
            script: body.script || 'Welcome to our new customizable template.',
            avatar_id: 'avatar-annie',
            voice_id: 'voice-annie',
            duration_sec: 8,
            background_type: 'color',
            background_value: '#f3f5f9',
          },
        ],
        created_at: now,
      };
      db.templates.unshift(tpl);

      appendAuditLog(db, {
        action: 'template.published',
        target_type: 'template',
        target_id: tpl.id,
        metadata: { title: tpl.title, category: tpl.category },
      });

      return { template: tpl };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create template' },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    const result = mutateDb((db) => {
      const tpl = db.templates.find((t) => t.id === id);
      if (!tpl) throw new Error('Template not found');
      if (typeof body.title === 'string') tpl.title = body.title.trim();
      if (typeof body.subtitle === 'string') tpl.subtitle = body.subtitle.trim();
      if (body.category) tpl.category = body.category;
      if (typeof body.is_favorite === 'boolean') tpl.is_favorite = body.is_favorite;
      if (typeof body.is_featured === 'boolean') tpl.is_featured = body.is_featured;
      if (typeof body.is_published === 'boolean') tpl.is_published = body.is_published;
      return { template: tpl };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update template' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) throw new Error('Template ID required');

    const result = mutateDb((db) => {
      const idx = db.templates.findIndex((t) => t.id === id);
      if (idx === -1) throw new Error('Template not found');
      db.templates.splice(idx, 1);
      return { deleted: true };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete template' },
      { status: 400 }
    );
  }
}

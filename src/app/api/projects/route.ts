import { NextRequest, NextResponse } from 'next/server';
import { mutateDb, readDb, createId, appendAuditLog } from '@/lib/db/store';
import { ProjectRecord, SceneRecord } from '@/lib/db/types';

export async function GET() {
  const db = readDb();
  return NextResponse.json({
    projects: db.projects,
    scenes: db.scenes,
    versions: db.project_versions,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'create';

    const result = mutateDb((db) => {
      const org = db.organizations[0];
      const user = db.users[0];
      const now = new Date().toISOString();

      if (action === 'duplicate') {
        const source = db.projects.find((p) => p.id === body.project_id);
        if (!source) throw new Error('Source project not found');
        const newProjId = createId('proj');
        const copy: ProjectRecord = {
          ...source,
          id: newProjId,
          title: `${source.title} (Copy)`,
          status: 'draft',
          created_at: now,
          updated_at: now,
        };
        db.projects.unshift(copy);

        const sourceScenes = db.scenes.filter((s) => s.project_id === source.id);
        for (const sc of sourceScenes) {
          db.scenes.push({
            ...sc,
            id: createId('scn'),
            project_id: newProjId,
            layers: sc.layers.map((l) => ({ ...l, id: createId('lyr') })),
            created_at: now,
            updated_at: now,
          });
        }

        appendAuditLog(db, {
          action: 'project.duplicated',
          target_type: 'project',
          target_id: newProjId,
          metadata: { source_id: source.id },
        });
        return { project: copy, scenes: db.scenes.filter((s) => s.project_id === newProjId) };
      }

      if (action === 'create_from_template') {
        const tpl = db.templates.find((t) => t.id === body.template_id);
        if (!tpl) throw new Error('Template not found');
        const newProjId = createId('proj');
        const project: ProjectRecord = {
          id: newProjId,
          organization_id: org.id,
          created_by: user.id,
          folder_name: body.folder_name || 'My Projects',
          title: tpl.title,
          project_type: 'studio',
          aspect_ratio: tpl.aspect_ratio,
          resolution: '1080p',
          status: 'draft',
          thumbnail_url: tpl.thumbnail_url,
          duration_sec: 10,
          created_at: now,
          updated_at: now,
        };
        db.projects.unshift(project);

        const initialScenes: SceneRecord[] = (tpl.scenes_payload.length ? tpl.scenes_payload : [{}]).map(
          (sp, idx) => ({
            id: createId('scn'),
            project_id: newProjId,
            order_index: idx,
            title: sp.title || `Scene ${idx + 1}`,
            script: sp.script || 'Enter your avatar narration script for this scene.',
            avatar_id: sp.avatar_id || 'avatar-annie',
            avatar_look: 'Default',
            avatar_mode: 'Presenter',
            voice_id: sp.voice_id || 'voice-annie',
            duration_sec: sp.duration_sec || 8,
            background_type: sp.background_type || 'color',
            background_value: sp.background_value || '#f3f5f9',
            transition: 'fade',
            layers: [
              {
                id: createId('lyr'),
                type: 'text',
                name: 'Heading Text',
                x: 60,
                y: 85,
                width: 420,
                height: 100,
                rotation: 0,
                opacity: 1,
                zIndex: 2,
                content: tpl.title,
                fontSize: 34,
                fontWeight: 800,
                color: sp.background_value === '#3718d8' ? '#ffffff' : '#232833',
                animation: 'fade-in',
              },
              {
                id: createId('lyr'),
                type: 'avatar',
                name: 'Avatar Presenter',
                x: 520,
                y: 40,
                width: 340,
                height: 440,
                rotation: 0,
                opacity: 1,
                zIndex: 3,
                src: '/heygen-assets/thumbnails/avatar-annie-main.webp',
                animation: 'none',
              },
            ],
            created_at: now,
            updated_at: now,
          })
        );
        db.scenes.push(...initialScenes);
        return { project, scenes: initialScenes };
      }

      // Default create project
      const newProjId = createId('proj');
      const project: ProjectRecord = {
        id: newProjId,
        organization_id: org.id,
        created_by: user.id,
        folder_name: body.folder_name || 'My Projects',
        title: body.title || 'Untitled Video Project',
        project_type: body.project_type || 'studio',
        aspect_ratio: body.aspect_ratio || '16:9',
        resolution: body.resolution || '1080p',
        status: 'draft',
        thumbnail_url: body.thumbnail_url || '/heygen-assets/thumbnails/template-focus-framework.png',
        duration_sec: Number(body.duration_sec || 8),
        created_at: now,
        updated_at: now,
      };
      db.projects.unshift(project);

      const defaultScene: SceneRecord = {
        id: createId('scn'),
        project_id: newProjId,
        order_index: 0,
        title: 'Scene 1',
        script: body.script || 'Welcome to HeyGen AI Studio. Type or paste your script here.',
        avatar_id: body.avatar_id || 'avatar-annie',
        avatar_look: 'Default',
        avatar_mode: body.avatar_mode || 'Presenter',
        voice_id: body.voice_id || 'voice-annie',
        duration_sec: Number(body.duration_sec || 8),
        background_type: 'color',
        background_value: '#f3f5f9',
        transition: 'fade',
        layers: [
          {
            id: createId('lyr'),
            type: 'text',
            name: 'Scene Title',
            x: 60,
            y: 90,
            width: 420,
            height: 100,
            rotation: 0,
            opacity: 1,
            zIndex: 2,
            content: project.title,
            fontSize: 32,
            fontWeight: 800,
            color: '#232833',
            animation: 'fade-in',
          },
          {
            id: createId('lyr'),
            type: 'avatar',
            name: 'Avatar Layer',
            x: 520,
            y: 40,
            width: 340,
            height: 440,
            rotation: 0,
            opacity: 1,
            zIndex: 3,
            src: '/heygen-assets/thumbnails/avatar-annie-main.webp',
            animation: 'none',
          },
        ],
        created_at: now,
        updated_at: now,
      };
      db.scenes.push(defaultScene);

      appendAuditLog(db, {
        action: 'project.created',
        target_type: 'project',
        target_id: newProjId,
        metadata: { title: project.title, project_type: project.project_type },
      });

      return { project, scenes: [defaultScene] };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create project' },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { project_id } = body;

    const result = mutateDb((db) => {
      const project = db.projects.find((p) => p.id === project_id);
      if (!project) throw new Error('Project not found');
      const now = new Date().toISOString();

      if (typeof body.title === 'string') project.title = body.title.trim();
      if (typeof body.folder_name === 'string') project.folder_name = body.folder_name.trim();
      if (body.aspect_ratio) project.aspect_ratio = body.aspect_ratio;
      if (body.resolution) project.resolution = body.resolution;
      if (body.status) project.status = body.status;
      project.updated_at = now;

      if (Array.isArray(body.scenes)) {
        // Replace scenes for this project (Autosave from AI Studio Editor)
        db.scenes = db.scenes.filter((s) => s.project_id !== project_id);
        const updatedScenes: SceneRecord[] = body.scenes.map((s: SceneRecord, idx: number) => ({
          ...s,
          id: s.id || createId('scn'),
          project_id,
          order_index: idx,
          updated_at: now,
          created_at: s.created_at || now,
        }));
        db.scenes.push(...updatedScenes);
        project.duration_sec = updatedScenes.reduce((acc, s) => acc + (Number(s.duration_sec) || 5), 0);

        if (body.save_version) {
          const existingVersions = db.project_versions.filter((v) => v.project_id === project_id);
          const nextVer = existingVersions.length + 1;
          db.project_versions.unshift({
            id: createId('ver'),
            project_id,
            version_number: nextVer,
            label: body.version_label || `Version ${nextVer}`,
            snapshot: {
              project: {
                title: project.title,
                aspect_ratio: project.aspect_ratio,
                resolution: project.resolution,
              },
              scenes: updatedScenes,
            },
            created_by: db.users[0].id,
            created_at: now,
          });
        }
      }

      return {
        project,
        scenes: db.scenes
          .filter((s) => s.project_id === project_id)
          .sort((a, b) => a.order_index - b.order_index),
        versions: db.project_versions.filter((v) => v.project_id === project_id),
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update project' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('id');
    const permanent = searchParams.get('permanent') === 'true';
    if (!projectId) throw new Error('Project ID required');

    const result = mutateDb((db) => {
      const idx = db.projects.findIndex((p) => p.id === projectId);
      if (idx === -1) throw new Error('Project not found');
      if (permanent || db.projects[idx].status === 'trashed') {
        const removed = db.projects.splice(idx, 1)[0];
        db.scenes = db.scenes.filter((s) => s.project_id !== projectId);
        appendAuditLog(db, {
          action: 'project.deleted_permanently',
          target_type: 'project',
          target_id: projectId,
          metadata: { title: removed.title },
        });
        return { deleted: true, permanent: true };
      } else {
        db.projects[idx].status = 'trashed';
        db.projects[idx].updated_at = new Date().toISOString();
        return { deleted: true, permanent: false, project: db.projects[idx] };
      }
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete project' },
      { status: 400 }
    );
  }
}

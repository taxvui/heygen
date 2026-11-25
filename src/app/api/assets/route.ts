import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { mutateDb, readDb, createId, appendAuditLog } from '@/lib/db/store';
import { AssetRecord } from '@/lib/db/types';

export async function GET() {
  const db = readDb();
  return NextResponse.json({ assets: db.assets });
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let name = 'Uploaded Asset';
    let folder = 'Uploads';
    let assetType: AssetRecord['asset_type'] = 'image';
    let mimeType = 'image/png';
    let sizeBytes = 42000;
    let publicUrl = '/heygen-assets/images/prompt-ads-promo.png';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      folder = String(formData.get('folder') || 'Uploads');
      if (file) {
        name = file.name;
        mimeType = file.type || 'application/octet-stream';
        sizeBytes = file.size;
        if (mimeType.startsWith('video/')) assetType = 'video';
        else if (mimeType.startsWith('audio/')) assetType = 'audio';
        else if (mimeType.startsWith('image/')) assetType = 'image';
        else assetType = 'document';

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        fs.mkdirSync(uploadDir, { recursive: true });
        const safeName = `${Date.now()}-${name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const buf = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(path.join(uploadDir, safeName), buf);
        publicUrl = `/uploads/${safeName}`;
      }
    } else {
      const body = await req.json();
      name = String(body.name || 'Asset').trim();
      folder = String(body.folder || 'Uploads').trim();
      assetType = body.asset_type || 'image';
      mimeType = body.mime_type || 'image/png';
      sizeBytes = Number(body.size_bytes || 45000);
      publicUrl = body.url || '/heygen-assets/images/prompt-ads-promo.png';
    }

    const result = mutateDb((db) => {
      const org = db.organizations[0];
      const user = db.users[0];
      const asset: AssetRecord = {
        id: createId('ast'),
        organization_id: org.id,
        uploaded_by: user.id,
        folder,
        name,
        asset_type: assetType,
        mime_type: mimeType,
        size_bytes: sizeBytes,
        url: publicUrl,
        created_at: new Date().toISOString(),
      };
      db.assets.unshift(asset);
      appendAuditLog(db, {
        action: 'asset.uploaded',
        target_type: 'asset',
        target_id: asset.id,
        metadata: { name: asset.name, asset_type: asset.asset_type, size_bytes: asset.size_bytes },
      });
      return { asset };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to upload asset' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) throw new Error('Asset ID required');

    const result = mutateDb((db) => {
      const idx = db.assets.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error('Asset not found');
      db.assets.splice(idx, 1);
      return { deleted: true };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete asset' },
      { status: 400 }
    );
  }
}

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const REF_IMAGES_DIR = path.join(ROOT, 'public', 'reference-assets', 'images');
fs.mkdirSync(REF_IMAGES_DIR, { recursive: true });

const ASSETS_TO_DOWNLOAD = [
  // 1. /brand central collage (BrandKitV4EmptyCollage)
  {
    id: 'brand-kit-v4-empty-collage',
    route: '/brand',
    remoteUrl: 'https://dynamic.heygen.ai/prod/movio/public/resource/b66bdc67af6f44f087695f1b8626d60c.png?tr=f-auto',
    filename: 'brand-kit-v4-empty-collage.png',
  },
  // 2. /home PRISM_ORB backdrop
  {
    id: 'home-prism-orb',
    route: '/home',
    remoteUrl: 'https://dynamic.heygen.ai/app/branding/PRISM_ORB.png?tr=f-auto,q-50,w-100',
    filename: 'prism-orb.png',
  },
  // 3. /apps Promo Banner right-side collage
  {
    id: 'apps-v2-video-agent-banner',
    route: '/apps',
    remoteUrl: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-video-agent-banner.jpg?tr=f-auto,q-85,h-330',
    filename: 'apps-v2-video-agent-banner.jpg',
  },
  // 4. /apps Featured & Grid card covers
  {
    id: 'apps-v2-video-translate',
    route: '/apps',
    remoteUrl: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-video-translate.jpg?tr=f-auto,q-85,h-440',
    filename: 'apps-v2-video-translate.jpg',
  },
  {
    id: 'apps-v2-pdf-ppt',
    route: '/apps',
    remoteUrl: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-pdf-ppt.jpg?tr=f-auto,q-85,h-440',
    filename: 'apps-v2-pdf-ppt.jpg',
  },
  {
    id: 'apps-v2-ai-video-generator',
    route: '/apps',
    remoteUrl: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-ai-video-generator.jpg?tr=f-auto,q-85,h-440',
    filename: 'apps-v2-ai-video-generator.jpg',
  },
  {
    id: 'apps-v2-video-agent-editorial',
    route: '/apps',
    remoteUrl: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-video-agent-editorial.jpg?tr=f-auto,q-85,h-440',
    filename: 'apps-v2-video-agent-editorial.jpg',
  },
  {
    id: 'apps-v2-podcast',
    route: '/apps',
    remoteUrl: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-podcast.jpg?tr=f-auto,q-85,h-360',
    filename: 'apps-v2-podcast.jpg',
  },
  {
    id: 'apps-v2-cinematic-shots',
    route: '/apps',
    remoteUrl: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-cinematic-shots.jpg?tr=f-auto,q-85,h-440',
    filename: 'apps-v2-cinematic-shots.jpg',
  },
  {
    id: 'apps-v2-ai-studio-hero',
    route: '/apps',
    remoteUrl: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-ai-studio-hero-17383f0cf985.webp?tr=f-auto,q-85,h-440',
    filename: 'apps-v2-ai-studio-hero.webp',
  },
  {
    id: 'apps-business-card-cover',
    route: '/apps',
    remoteUrl: 'https://app.heygen.com/business-card/apps-cover.jpg',
    filename: 'apps-business-card-cover.jpg',
  },
  {
    id: 'apps-v2-upscale',
    route: '/apps',
    remoteUrl: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-upscale.jpg?tr=f-auto,q-85,h-360',
    filename: 'apps-v2-upscale.jpg',
  },
  {
    id: 'apps-v2-speech-cleanup',
    route: '/apps',
    remoteUrl: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-speech-cleanup.jpg?tr=f-auto,q-85,h-360',
    filename: 'apps-v2-speech-cleanup.jpg',
  },
  {
    id: 'apps-v2-interactive',
    route: '/apps',
    remoteUrl: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-interactive.jpg?tr=f-auto,q-85,h-360',
    filename: 'apps-v2-interactive.jpg',
  },
  {
    id: 'apps-ai-clipping',
    route: '/apps',
    remoteUrl: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-ai-clipping.jpg?tr=f-auto,q-85,h-360',
    filename: 'apps-ai-clipping.jpg',
  },
  {
    id: 'apps-v2-batch-upload',
    route: '/apps',
    remoteUrl: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-batch-upload.jpg?tr=f-auto,q-85,h-360',
    filename: 'apps-v2-batch-upload.jpg',
  },
];

async function run() {
  const downloaded = [];
  for (const item of ASSETS_TO_DOWNLOAD) {
    const destPath = path.join(REF_IMAGES_DIR, item.filename);
    const res = await fetch(item.remoteUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Referer: 'https://app.heygen.com/',
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to download ${item.remoteUrl}: HTTP ${res.status}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buf);
    const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
    downloaded.push({
      ...item,
      localUrl: `/reference-assets/images/${item.filename}`,
      bytes: buf.length,
      sha256,
    });
    console.log(`Downloaded ${item.filename} (${buf.length} bytes, sha256=${sha256.slice(0, 12)}...)`);
  }

  // Update reference-resources/manifest.json
  const manifestPath = path.join(ROOT, 'reference-resources', 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.v8GateAssets = downloaded;
    manifest.totalVerifiedResources = (manifest.resources?.length || 0) + downloaded.length;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  }

  // Update docs/reference/resource-inventory.json
  const invPath = path.join(ROOT, 'docs', 'reference', 'resource-inventory.json');
  if (fs.existsSync(invPath)) {
    const inv = JSON.parse(fs.readFileSync(invPath, 'utf8'));
    inv.v8GateVerifiedAssets = downloaded;
    fs.writeFileSync(invPath, JSON.stringify(inv, null, 2));
  }

  console.log(`Successfully downloaded and inventoried ${downloaded.length} original HeyGen route assets.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();

const DIRS = [
  'public/heygen-assets/logos',
  'public/heygen-assets/icons',
  'public/heygen-assets/fonts',
  'public/heygen-assets/images',
  'public/heygen-assets/thumbnails',
  'public/heygen-assets/videos',
  'public/heygen-assets/animations',
  'public/heygen-assets/backgrounds',
  'styles/reference/extracted-css',
  'reference-analysis',
  'docs/reference',
];

for (const dir of DIRS) {
  fs.mkdirSync(path.join(ROOT, dir), { recursive: true });
}

const ASSETS = [
  // Logos & Branding
  {
    category: 'logos',
    localPath: 'public/heygen-assets/logos/PRISM_ORB.svg',
    url: 'https://app.heygen.com/icons/heygen/wordmark/svg/PRISM_ORB.svg',
    type: 'image/svg+xml',
    description: 'HeyGen Prism Orb Primary Sidebar Logo (SVG)',
  },
  {
    category: 'logos',
    localPath: 'public/heygen-assets/logos/PRISM_ORB.png',
    url: 'https://dynamic.heygen.ai/app/branding/PRISM_ORB.png?tr=f-auto,q-50,w-100',
    type: 'image/png',
    description: 'HeyGen Prism Orb Logo (PNG)',
  },
  {
    category: 'logos',
    localPath: 'public/heygen-assets/logos/HeyGen_Primary_Logo_Black_RGB.svg',
    url: 'https://auth.heygen.com/icons/HeyGen_Primary_Logo_Black_RGB.svg',
    type: 'image/svg+xml',
    description: 'HeyGen Stacked Primary Black RGB Logo with Prism Orb',
  },
  {
    category: 'logos',
    localPath: 'public/heygen-assets/logos/favicon.ico',
    url: 'https://app.heygen.com/favicon.ico',
    type: 'image/x-icon',
    description: 'HeyGen Favicon ICO',
  },
  {
    category: 'logos',
    localPath: 'public/heygen-assets/logos/og.png',
    url: 'https://static.heygen.ai/heygen/asset/og.png',
    type: 'image/png',
    description: 'HeyGen OpenGraph Brand Banner',
  },

  // Fonts (WOFF2 / OTF / TTF)
  {
    category: 'fonts',
    localPath: 'public/heygen-assets/fonts/TT_Norms_Pro_Light.woff2',
    url: 'https://static.heygen.ai/fonts/tt_norms_pro/TT_Norms_Pro_Light.woff2',
    type: 'font/woff2',
    family: 'TT Norms Pro',
    weight: 300,
    style: 'normal',
  },
  {
    category: 'fonts',
    localPath: 'public/heygen-assets/fonts/TT_Norms_Pro_Regular.woff2',
    url: 'https://static.heygen.ai/fonts/tt_norms_pro/TT_Norms_Pro_Regular.woff2',
    type: 'font/woff2',
    family: 'TT Norms Pro',
    weight: 400,
    style: 'normal',
  },
  {
    category: 'fonts',
    localPath: 'public/heygen-assets/fonts/TT_Norms_Pro_Normal.woff2',
    url: 'https://static.heygen.ai/fonts/tt_norms_pro/TT_Norms_Pro_Normal.woff2',
    type: 'font/woff2',
    family: 'TT Norms Pro',
    weight: 450,
    style: 'normal',
  },
  {
    category: 'fonts',
    localPath: 'public/heygen-assets/fonts/TT_Norms_Pro_Medium.woff2',
    url: 'https://static.heygen.ai/fonts/tt_norms_pro/TT_Norms_Pro_Medium.woff2',
    type: 'font/woff2',
    family: 'TT Norms Pro',
    weight: 500,
    style: 'normal',
  },
  {
    category: 'fonts',
    localPath: 'public/heygen-assets/fonts/TT_Norms_Pro_DemiBold.woff2',
    url: 'https://static.heygen.ai/fonts/tt_norms_pro/TT_Norms_Pro_DemiBold.woff2',
    type: 'font/woff2',
    family: 'TT Norms Pro',
    weight: 600,
    style: 'normal',
  },
  {
    category: 'fonts',
    localPath: 'public/heygen-assets/fonts/TT_Norms_Pro_Bold.woff2',
    url: 'https://static.heygen.ai/fonts/tt_norms_pro/TT_Norms_Pro_Bold.woff2',
    type: 'font/woff2',
    family: 'TT Norms Pro',
    weight: 700,
    style: 'normal',
  },
  {
    category: 'fonts',
    localPath: 'public/heygen-assets/fonts/TT_Norms_Pro_ExtraBold.woff2',
    url: 'https://static.heygen.ai/fonts/tt_norms_pro/TT_Norms_Pro_ExtraBold.woff2',
    type: 'font/woff2',
    family: 'TT Norms Pro',
    weight: 800,
    style: 'normal',
  },
  {
    category: 'fonts',
    localPath: 'public/heygen-assets/fonts/TT_Norms_Pro_Italic.woff2',
    url: 'https://static.heygen.ai/fonts/tt_norms_pro/TT_Norms_Pro_Italic.woff2',
    type: 'font/woff2',
    family: 'TT Norms Pro',
    weight: 400,
    style: 'italic',
  },
  {
    category: 'fonts',
    localPath: 'public/heygen-assets/fonts/ABCSolar-Light.woff2',
    url: 'https://static.heygen.ai/fonts/solar/ABCSolar-Light.woff2',
    type: 'font/woff2',
    family: 'ABC Solar Display',
    weight: 300,
    style: 'normal',
  },
  {
    category: 'fonts',
    localPath: 'public/heygen-assets/fonts/ABCSolar-Regular.woff2',
    url: 'https://static.heygen.ai/fonts/solar/ABCSolar-Regular.woff2',
    type: 'font/woff2',
    family: 'ABC Solar Display',
    weight: 400,
    style: 'normal',
  },
  {
    category: 'fonts',
    localPath: 'public/heygen-assets/fonts/ABCSolarDisplay-Semibold.woff2',
    url: 'https://app.heygen.com/fonts/solar/ABCSolarDisplay-Semibold.woff2',
    type: 'font/woff2',
    family: 'ABC Solar Display',
    weight: 600,
    style: 'normal',
  },
  {
    category: 'fonts',
    localPath: 'public/heygen-assets/fonts/ABCSolar-Bold.woff2',
    url: 'https://static.heygen.ai/fonts/solar/ABCSolar-Bold.woff2',
    type: 'font/woff2',
    family: 'ABC Solar Display',
    weight: 700,
    style: 'normal',
  },
  {
    category: 'fonts',
    localPath: 'public/heygen-assets/fonts/ABCSolarDisplay-Bold.woff2',
    url: 'https://static.heygen.ai/fonts/solar/ABCSolarDisplay-Bold.woff2',
    type: 'font/woff2',
    family: 'ABC Solar Display',
    weight: 800,
    style: 'normal',
  },

  // Icons & UI Graphics
  {
    category: 'icons',
    localPath: 'public/heygen-assets/icons/empty-looks.svg',
    url: 'https://static.heygen.ai/avatar/empty-looks.svg',
    type: 'image/svg+xml',
    description: 'Empty looks avatar placeholder illustration',
  },
  {
    category: 'icons',
    localPath: 'public/heygen-assets/icons/avatar-default.png',
    url: 'https://app.heygen.com/images/avatar-default.png',
    type: 'image/png',
    description: 'Default user avatar icon (light)',
  },
  {
    category: 'icons',
    localPath: 'public/heygen-assets/icons/avatar-default-dark.png',
    url: 'https://app.heygen.com/images/avatar-default-dark.png',
    type: 'image/png',
    description: 'Default user avatar icon (dark)',
  },
  {
    category: 'icons',
    localPath: 'public/heygen-assets/icons/flag-globe.webp',
    url: 'https://static.heygen.ai/region_flags/globe-compressed3.webp',
    type: 'image/webp',
    description: 'All languages globe icon',
  },
  {
    category: 'icons',
    localPath: 'public/heygen-assets/icons/flag-us.png',
    url: 'https://static.heygen.ai/region_flags/us.png',
    type: 'image/png',
    description: 'US region flag',
  },
  {
    category: 'icons',
    localPath: 'public/heygen-assets/icons/flag-au.png',
    url: 'https://static.heygen.ai/region_flags/au.png',
    type: 'image/png',
    description: 'AU region flag',
  },
  {
    category: 'icons',
    localPath: 'public/heygen-assets/icons/flag-gb.png',
    url: 'https://static.heygen.ai/region_flags/gb.png',
    type: 'image/png',
    description: 'GB region flag',
  },
  {
    category: 'icons',
    localPath: 'public/heygen-assets/icons/flag-ie.png',
    url: 'https://static.heygen.ai/region_flags/ie.png',
    type: 'image/png',
    description: 'IE region flag',
  },
  {
    category: 'icons',
    localPath: 'public/heygen-assets/icons/flag-in.png',
    url: 'https://static.heygen.ai/region_flags/in.png',
    type: 'image/png',
    description: 'IN region flag',
  },

  // Home Dashboard Video Prompt Images (3x2 grid)
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/prompt-ads-promo.png',
    url: 'https://dynamic.heygen.ai/app/homepod/ads-promo__B-ringlight-creator.png?tr=f-auto,q-70,h-480',
    type: 'image/png',
    description: 'Home Video Prompt Card 1: Ads & Promo',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/prompt-educational-video.jpg',
    url: 'https://dynamic.heygen.ai/SuperAgent/card-educational-video.jpg?tr=f-auto,q-70,h-480',
    type: 'image/jpeg',
    description: 'Home Video Prompt Card 2: Educational Video',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/prompt-expert-explainer.png',
    url: 'https://dynamic.heygen.ai/SuperAgent/expert-explainer.png?tr=f-auto,q-70,h-480',
    type: 'image/png',
    description: 'Home Video Prompt Card 3: Expert Explainer',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/prompt-tips-how-to.jpg',
    url: 'https://dynamic.heygen.ai/SuperAgent/card_tips_how_to.jpeg?tr=f-auto,q-70,h-480',
    type: 'image/jpeg',
    description: 'Home Video Prompt Card 4: Tips & How-To',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/prompt-news-brief.jpg',
    url: 'https://dynamic.heygen.ai/SuperAgent/card-news-brief-video.jpg?tr=f-auto,q-70,h-480',
    type: 'image/jpeg',
    description: 'Home Video Prompt Card 5: News Brief Video',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/prompt-video-podcast.jpg',
    url: 'https://dynamic.heygen.ai/SuperAgent/card_video_podcast.jpeg?tr=f-auto,q-70,h-480',
    type: 'image/jpeg',
    description: 'Home Video Prompt Card 6: Video Podcast',
  },

  // Video Agent & Additional Prompt Cards
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/agent-micro-lesson.jpg',
    url: 'https://dynamic.heygen.ai/SuperAgent/card_micro_lesson.jpeg?tr=f-auto,q-70,h-480',
    type: 'image/jpeg',
    description: 'Video Agent Card: Micro Lesson',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/agent-corporate-training.jpg',
    url: 'https://dynamic.heygen.ai/SuperAgent/card-corporate-training.jpg?tr=f-auto,q-70,h-480',
    type: 'image/jpeg',
    description: 'Video Agent Card: Corporate Training',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/agent-team-onboarding.png',
    url: 'https://dynamic.heygen.ai/SuperAgent/team-onboarding.png?tr=f-auto,q-70,h-480',
    type: 'image/png',
    description: 'Video Agent Card: Team Onboarding',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/agent-policy-explainer.png',
    url: 'https://dynamic.heygen.ai/SuperAgent/policy-explainer.png?tr=f-auto,q-70,h-480',
    type: 'image/png',
    description: 'Video Agent Card: Policy Explainer',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/agent-skills-refresher.png',
    url: 'https://dynamic.heygen.ai/SuperAgent/skills-refresher.png?tr=f-auto,q-70,h-480',
    type: 'image/png',
    description: 'Video Agent Card: Skills Refresher',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/agent-internal-update.jpg',
    url: 'https://dynamic.heygen.ai/SuperAgent/card_internal_update.jpeg?tr=f-auto,q-70,h-480',
    type: 'image/jpeg',
    description: 'Video Agent Card: Internal Update',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/video-agent-captions.jpg',
    url: 'https://dynamic.heygen.ai/VideoAgent/2.jpg?updatedAt=1779323474673?tr=f-auto,q-70,h-480',
    type: 'image/jpeg',
    description: 'Video Agent Inspiration: Captions',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/video-agent-brand.jpg',
    url: 'https://dynamic.heygen.ai/VideoAgent/4.jpg?updatedAt=1779323474918?tr=f-auto,q-70,h-480',
    type: 'image/jpeg',
    description: 'Video Agent Inspiration: Brand',
  },

  // Apps Library Banners
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/apps-v2-video-agent-banner.jpg',
    url: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-video-agent-banner.jpg?tr=f-auto,q-85,h-330',
    type: 'image/jpeg',
    description: 'Apps Library Hero: Prompt to Video collage',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/apps-v2-video-translate.jpg',
    url: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-video-translate.jpg?tr=f-auto,q-85,h-440',
    type: 'image/jpeg',
    description: 'Apps Library Card: Translate Videos',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/apps-v2-pdf-ppt.jpg',
    url: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-pdf-ppt.jpg?tr=f-auto,q-85,h-440',
    type: 'image/jpeg',
    description: 'Apps Library Card: PPT/PDF to Video',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/apps-v2-ai-studio-hero.webp',
    url: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-ai-studio-hero-17383f0cf985.webp?tr=f-auto,q-85,h-440',
    type: 'image/webp',
    description: 'Apps Library Card: Creative Studio',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/apps-v2-ai-video-generator.jpg',
    url: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-ai-video-generator.jpg?tr=f-auto,q-85,h-440',
    type: 'image/jpeg',
    description: 'Apps Library Card: AI Video Generator',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/apps-v2-podcast.jpg',
    url: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-podcast.jpg?tr=f-auto,q-85,h-360',
    type: 'image/jpeg',
    description: 'Apps Library Card: Podcast',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/apps-v2-cinematic-shots.jpg',
    url: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-cinematic-shots.jpg?tr=f-auto,q-85,h-440',
    type: 'image/jpeg',
    description: 'Apps Library Card: Cinematic Shots',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/apps-v2-upscale.jpg',
    url: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-upscale.jpg?tr=f-auto,q-85,h-360',
    type: 'image/jpeg',
    description: 'Apps Library Card: Video Upscale',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/apps-v2-speech-cleanup.jpg',
    url: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-speech-cleanup.jpg?tr=f-auto,q-85,h-360',
    type: 'image/jpeg',
    description: 'Apps Library Card: Speech Cleanup',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/apps-v2-interactive.jpg',
    url: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-interactive.jpg?tr=f-auto,q-85,h-360',
    type: 'image/jpeg',
    description: 'Apps Library Card: Interactive Avatar',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/apps-ai-clipping.jpg',
    url: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-ai-clipping.jpg?tr=f-auto,q-85,h-360',
    type: 'image/jpeg',
    description: 'Apps Library Card: AI Clipping',
  },
  {
    category: 'images',
    localPath: 'public/heygen-assets/images/apps-v2-batch-upload.jpg',
    url: 'https://dynamic.heygen.ai/APPS-PAGE-V2-ASSETS/apps-v2-batch-upload.jpg?tr=f-auto,q-85,h-360',
    type: 'image/jpeg',
    description: 'Apps Library Card: Batch Upload',
  },

  // Public Avatars Multi-Look Bento Thumbnails (Annie, Marieke, Sawyer, Cora, Brianna, Kurt, Livia)
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/avatar-annie-main.webp',
    url: 'https://dynamic.heygen.ai/tr:ar-158-190,h-720,fo-auto,f-auto/avatar/v3/262658a5bb3346e38b68c623019fd5b2_55470/preview_target.webp',
    type: 'image/webp',
    description: 'Public Avatar Annie - Main Portrait',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/avatar-annie-look1.webp',
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/avatar/v3/50965e4d1dc6491a9e6fdbe1ee0d260b/half/2.2/raw_preview_image.webp',
    type: 'image/webp',
    description: 'Public Avatar Annie - Look 1 (Navy Blazer)',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/avatar-annie-look2.webp',
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/avatar/v3/030834e167464549aa999c359bef6558/half/2.2/raw_preview_image.webp',
    type: 'image/webp',
    description: 'Public Avatar Annie - Look 2 (White Top)',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/avatar-marieke-main.jpg',
    url: 'https://dynamic.heygen.ai/tr:ar-158-190,h-720,fo-auto,f-auto/public-avatars/Marieke/lookpack/stills/Warm_Autumn_4.jpg',
    type: 'image/jpeg',
    description: 'Public Avatar Marieke - Main Portrait',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/avatar-marieke-look1.jpg',
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/public-avatars/Marieke/lookpack/stills/Modern_Corporate_2.jpg',
    type: 'image/jpeg',
    description: 'Public Avatar Marieke - Look 1 (Corporate)',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/avatar-marieke-look2.jpg',
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/public-avatars/Marieke/paos/angles/Kitchen_1.jpg',
    type: 'image/jpeg',
    description: 'Public Avatar Marieke - Look 2 (Kitchen)',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/avatar-sawyer-main.png',
    url: 'https://dynamic.heygen.ai/tr:ar-158-190,h-720,fo-auto,f-auto/image/9080303643e84f1eaf34f2926065ae49/original.png',
    type: 'image/png',
    description: 'Public Avatar Sawyer - Main Portrait',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/avatar-sawyer-look1.webp',
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/avatar/v3/5d5a9a07c612460d882861e0e8931564_54040/preview_target.webp',
    type: 'image/webp',
    description: 'Public Avatar Annie - Look 1 (Navy Blazer)',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/avatar-sawyer-look2.webp',
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/avatar/v3/561ec5deb3f74a27b6b12fd8a6a2f76e_56970/preview_target.webp',
    type: 'image/webp',
    description: 'Public Avatar Annie - Look 2 (White Top)',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/avatar-sawyer-chair.webp',
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/avatar/v3/d2ac71052b764c93a49a9e53537f6d29/half/2.2/raw_preview_image.webp',
    type: 'image/webp',
    description: 'Public Avatar Sawyer - Look 1 (Dark Tee on Chair)',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/avatar-sawyer-brick.webp',
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/avatar/v3/f312436050b547548b695af1c869a091/half/2.2/raw_preview_image.webp',
    type: 'image/webp',
    description: 'Public Avatar Sawyer - Look 2 (Brick Wall Podcast)',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/avatar-cora-main.jpg',
    url: 'https://dynamic.heygen.ai/tr:ar-158-190,h-720,fo-auto,f-auto/public-avatars/Cora/lookpack/angles/Presenter_4.jpg',
    type: 'image/jpeg',
    description: 'Public Avatar Cora - Main Portrait',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/avatar-cora-look1.jpg',
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/public-avatars/Cora/paos/angles/office73_p3_a3.jpg',
    type: 'image/jpeg',
    description: 'Public Avatar Cora - Look 1 (Office)',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/avatar-cora-look2.jpg',
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/public-avatars/Cora/paos/angles/livingroom79_p2_a2.jpg',
    type: 'image/jpeg',
    description: 'Public Avatar Cora - Look 2 (Living Room)',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/avatar-livia-main.jpg',
    url: 'https://dynamic.heygen.ai/tr:ar-158-190,h-720,fo-auto,f-auto/public-avatars/Livia/paos/angles/Office_11.jpg',
    type: 'image/jpeg',
    description: 'Public Avatar Livia - Main Portrait',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/avatar-livia-look1.jpg',
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/public-avatars/Livia/paos/angles/Office_12.jpg',
    type: 'image/jpeg',
    description: 'Public Avatar Livia - Look 1',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/avatar-brianna-main.png',
    url: 'https://dynamic.heygen.ai/tr:ar-158-190,h-720,fo-auto,f-auto/image/b5954effb53b4e7c95075e8b6923cb08/original.png',
    type: 'image/png',
    description: 'Public Avatar Brianna - Main Portrait',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/avatar-kurt-look1.webp',
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/avatar/v3/5a5ddd0a915143d7827292148567f2d5/half/2.2/raw_preview_image.webp',
    type: 'image/webp',
    description: 'Public Avatar Kurt - Look 1',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/avatar-kurt-look2.webp',
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/avatar/v3/c2431fc0c6fb44809f48e7db6390e7de/half/2.2/raw_preview_image.webp',
    type: 'image/webp',
    description: 'Public Avatar Kurt - Look 2',
  },

  // AI Studio Template Thumbnails
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/template-focus-framework.png',
    url: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/04da766815784edf9b038db4cf6cd6ce/thumbnail_medium_thumbnail-video-04da766815784edf9b038db4cf6cd6ce.png',
    type: 'image/png',
    description: 'AI Studio Template: Focus Framework Intro',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/template-minimalist-sales-report.png',
    url: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/09546f1637664ea6969519f91dc3bd79/thumbnail_medium_thumbnail-video-09546f1637664ea6969519f91dc3bd79.png',
    type: 'image/png',
    description: 'AI Studio Template: Minimalist Sales Report',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/template-stress-free-moving.png',
    url: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/1d6b074d59734503b65bf9828384261b/thumbnail_medium_thumbnail-video-1d6b074d59734503b65bf9828384261b.png',
    type: 'image/png',
    description: 'AI Studio Template: Stress-Free Moving Quote',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/template-corporate-onboarding.png',
    url: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/24d7265d70d84124baeb8e761044f823/thumbnail_medium_thumbnail-video-24d7265d70d84124baeb8e761044f823.png',
    type: 'image/png',
    description: 'AI Studio Template: Corporate Onboarding',
  },
  {
    category: 'thumbnails',
    localPath: 'public/heygen-assets/thumbnails/deck-front-poster.jpg',
    url: 'https://dynamic.heygen.ai/tr:w-320,f-auto/avatar/avatar-hub/deck-front-poster.jpg',
    type: 'image/jpeg',
    description: 'Avatar Hub Deck Front Poster',
  },

  // Preview Videos
  {
    category: 'videos',
    localPath: 'public/heygen-assets/videos/prompt-builder-hub.mp4',
    url: 'https://static.heygen.ai/heygen/s2v/prompt-builder/formats/hub.mp4',
    type: 'video/mp4',
    description: 'Video Agent Format Preview MP4',
  },
  {
    category: 'videos',
    localPath: 'public/heygen-assets/videos/avatar-preview-talk.mp4',
    url: 'https://files2.heygen.ai/avatar/v3/025975fe53df4ae3bcb08e98ef7ce01c_38970/preview_video_talk_12.mp4',
    type: 'video/mp4',
    description: 'Avatar Talking Preview Video MP4',
  },

  // Reference Stylesheets
  {
    category: 'css',
    localPath: 'styles/reference/extracted-css/main-CIqZwH0u.css',
    url: 'https://app.heygen.com/main-CIqZwH0u.css',
    type: 'text/css',
    description: 'Primary HeyGen Design Tokens & Base Stylesheet',
  },
  {
    category: 'css',
    localPath: 'styles/reference/extracted-css/main-C1zSbYdM.css',
    url: 'https://app.heygen.com/main-C1zSbYdM.css',
    type: 'text/css',
    description: 'Secondary HeyGen Component & Utility Stylesheet',
  },
];

async function downloadAsset(item) {
  const fullPath = path.join(ROOT, item.localPath);
  try {
    const res = await fetch(item.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Referer': 'https://app.heygen.com/',
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(fullPath, buf);
    const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
    return {
      ...item,
      status: 'DOWNLOADED',
      bytes: buf.length,
      sha256,
      publicUrl: item.localPath.startsWith('public/') ? '/' + item.localPath.slice('public/'.length) : item.localPath,
      downloadedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      ...item,
      status: 'FAILED',
      error: String(err.message || err),
      bytes: 0,
      sha256: null,
      publicUrl: item.localPath.startsWith('public/') ? '/' + item.localPath.slice('public/'.length) : item.localPath,
    };
  }
}

async function main() {
  console.log(`Downloading ${ASSETS.length} authorized reference assets...`);
  const results = [];
  for (const asset of ASSETS) {
    const r = await downloadAsset(asset);
    results.push(r);
    console.log(`[${r.status}] ${r.localPath} (${r.bytes} bytes)`);
  }

  // Write reference-analysis JSON inventories
  const cssInventory = results.filter((r) => r.category === 'css');
  const fontInventory = results.filter((r) => r.category === 'fonts');
  const imageInventory = results.filter((r) => ['logos', 'icons', 'images', 'thumbnails'].includes(r.category));
  const videoInventory = results.filter((r) => r.category === 'videos');

  fs.writeFileSync(path.join(ROOT, 'reference-analysis/css-inventory.json'), JSON.stringify(cssInventory, null, 2));
  fs.writeFileSync(path.join(ROOT, 'reference-analysis/font-inventory.json'), JSON.stringify(fontInventory, null, 2));
  fs.writeFileSync(path.join(ROOT, 'reference-analysis/image-inventory.json'), JSON.stringify(imageInventory, null, 2));
  fs.writeFileSync(path.join(ROOT, 'reference-analysis/video-inventory.json'), JSON.stringify(videoInventory, null, 2));

  const assetMap = Object.fromEntries(
    results.map((r) => [r.url, { localPath: r.localPath, publicUrl: r.publicUrl, sha256: r.sha256, bytes: r.bytes, status: r.status }])
  );
  fs.writeFileSync(path.join(ROOT, 'reference-analysis/asset-map.json'), JSON.stringify(assetMap, null, 2));

  const licenseManifest = {
    project: 'HeyGen Platform Reconstruction',
    authorizationScope: 'Owner-authorized reuse of HeyGen frontend CSS, fonts, logos, images, videos, and UI media assets.',
    excludedScope: 'Private backend source code, private user data, proprietary AI model weights, and authenticated third-party user records.',
    generatedAt: new Date().toISOString(),
    totalAssets: results.length,
    downloadedCount: results.filter((r) => r.status === 'DOWNLOADED').length,
    assets: results.map((r) => ({
      localPath: r.localPath,
      sourceUrl: r.url,
      sha256: r.sha256,
      bytes: r.bytes,
      type: r.type,
      provenance: new URL(r.url).origin,
      authorizationStatus: 'AUTHORIZED_FRONTEND_STATIC_ASSET',
    })),
  };
  fs.writeFileSync(path.join(ROOT, 'reference-analysis/license-manifest.json'), JSON.stringify(licenseManifest, null, 2));

  console.log(`Completed: ${licenseManifest.downloadedCount}/${licenseManifest.totalAssets} assets downloaded.`);
}

main();

# Phase 1 — Authorized Asset Extraction Report

> **Generated**: `2026-11-22T13:41:38Z`
> **Script**: `scripts/extract-authorized-assets.mjs`
> **Manifests**: `reference-analysis/{css-inventory,font-inventory,image-inventory,video-inventory,asset-map,license-manifest}.json`

---

## 1. Executive Summary

- **Total Eligible Frontend Assets Targeted**: `81`
- **Successfully Downloaded & Verified (SHA-256)**: `81 / 81 (100%)`
- **Failed / Missing Assets**: `0`
- **External Runtime Asset Dependency**: `None` — all fonts, logos, icons, prompt cards, avatar multi-look thumbnails, template thumbnails, and preview videos are served locally from `/heygen-assets/*`.

---

## 2. Category Breakdown

| Category | Directory | Count | Formats | Total Size |
| :--- | :--- | :---: | :--- | :---: |
| **Logos & Wordmarks** | `public/heygen-assets/logos/` | `5` | `.svg`, `.png`, `.ico` | `224.7 KB` |
| **Web Fonts** | `public/heygen-assets/fonts/` | `13` | `.woff2` (`TT Norms Pro`, `ABC Solar Display`) | `1,302.9 KB` |
| **UI Icons & Flags** | `public/heygen-assets/icons/` | `9` | `.svg`, `.png`, `.webp` | `51.8 KB` |
| **Prompt & App Cards** | `public/heygen-assets/images/` | `26` | `.png`, `.jpg`, `.webp` | `1,967.0 KB` |
| **Avatars & Templates** | `public/heygen-assets/thumbnails/` | `24` | `.webp`, `.jpg`, `.png` | `1,283.7 KB` |
| **Preview Videos** | `public/heygen-assets/videos/` | `2` | `.mp4` | `5,849.9 KB` |
| **Reference Stylesheets** | `styles/reference/extracted-css/` | `2` | `.css` | `1,234.0 KB` |

---

## 3. Excluded Resources & Scope Boundaries

| Resource Class | Disposition | Reason |
| :--- | :--- | :--- |
| Compiled vendor/app JS bundles (`main.app-*.js`, `vendor-*.js`) | **Excluded from runtime reuse** | Replaced with clean, maintainable TypeScript + Next.js 16 + React components while preserving exact UI behavior and visual tokens. |
| Private user account data & `api2.heygen.com` responses | **Excluded** | Outside authorization scope; implemented independent PostgreSQL / Supabase schema and multi-tenant API routes. |
| Signed expiring media URLs (`template.mp4?Expires=...`) | **Excluded / Replaced** | Time-limited signed URLs excluded in favor of permanent static preview videos (`prompt-builder-hub.mp4`, `avatar-preview-talk.mp4`). |

---

## 4. Local Replacement Mappings (Sample)

| Remote Source URL | Local Public Path | Status |
| :--- | :--- | :---: |
| `https://app.heygen.com/icons/heygen/wordmark/svg/PRISM_ORB.svg` | `/heygen-assets/logos/PRISM_ORB.svg` | `VERIFIED` |
| `https://auth.heygen.com/icons/HeyGen_Primary_Logo_Black_RGB.svg` | `/heygen-assets/logos/HeyGen_Primary_Logo_Black_RGB.svg` | `VERIFIED` |
| `https://static.heygen.ai/fonts/tt_norms_pro/TT_Norms_Pro_Regular.woff2` | `/heygen-assets/fonts/TT_Norms_Pro_Regular.woff2` | `VERIFIED` |
| `https://static.heygen.ai/fonts/solar/ABCSolar-Bold.woff2` | `/heygen-assets/fonts/ABCSolar-Bold.woff2` | `VERIFIED` |
| `https://dynamic.heygen.ai/app/homepod/ads-promo__B-ringlight-creator.png?tr=f-auto,q-70,h-480` | `/heygen-assets/images/prompt-ads-promo.png` | `VERIFIED` |
| `https://dynamic.heygen.ai/SuperAgent/card-educational-video.jpg?tr=f-auto,q-70,h-480` | `/heygen-assets/images/prompt-educational-video.jpg` | `VERIFIED` |
| `https://dynamic.heygen.ai/SuperAgent/expert-explainer.png?tr=f-auto,q-70,h-480` | `/heygen-assets/images/prompt-expert-explainer.png` | `VERIFIED` |
| `https://dynamic.heygen.ai/SuperAgent/card_tips_how_to.jpeg?tr=f-auto,q-70,h-480` | `/heygen-assets/images/prompt-tips-how-to.jpg` | `VERIFIED` |
| `https://dynamic.heygen.ai/SuperAgent/card-news-brief-video.jpg?tr=f-auto,q-70,h-480` | `/heygen-assets/images/prompt-news-brief.jpg` | `VERIFIED` |
| `https://dynamic.heygen.ai/SuperAgent/card_video_podcast.jpeg?tr=f-auto,q-70,h-480` | `/heygen-assets/images/prompt-video-podcast.jpg` | `VERIFIED` |
| `https://dynamic.heygen.ai/tr:ar-158-190,h-720,fo-auto,f-auto/avatar/v3/262658a5bb3346e38b68c623019fd5b2_55470/preview_target.webp` | `/heygen-assets/thumbnails/avatar-annie-main.webp` | `VERIFIED` |
| `https://dynamic.heygen.ai/tr:ar-158-190,h-720,fo-auto,f-auto/image/b5954effb53b4e7c95075e8b6923cb08/original.png` | `/heygen-assets/thumbnails/avatar-brianna-main.png` (Sawyer Primary Portrait) | `VERIFIED` |
| `https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/avatar/v3/d2ac71052b764c93a49a9e53537f6d29/half/2.2/raw_preview_image.webp` | `/heygen-assets/thumbnails/avatar-sawyer-chair.webp` | `VERIFIED` |
| `https://static.heygen.ai/heygen/s2v/prompt-builder/formats/hub.mp4` | `/heygen-assets/videos/prompt-builder-hub.mp4` | `VERIFIED` |
| `https://files2.heygen.ai/avatar/v3/025975fe53df4ae3bcb08e98ef7ce01c_38970/preview_video_talk_12.mp4` | `/heygen-assets/videos/avatar-preview-talk.mp4` | `VERIFIED` |

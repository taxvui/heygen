# HeyGen Full Platform Reconstruction (v2.0)

An operational AI Video SaaS platform and independent Super Admin Dashboard reconstructed with pixel-accurate visual and functional fidelity to `https://app.heygen.com/home`.

---

## 1. Architecture & Stack

- **Frontend & SSR/API**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Zustand, TanStack Query, React Hook Form, Zod, Framer Motion.
- **Design System Package**: `packages/ui/` (`tokens`, `themes`, `icons`, `styles`, `components`) using locally self-hosted authorized `TT Norms Pro` and `ABC Solar Display` `.woff2` fonts, `PRISM_ORB.svg`, and extracted HeyGen CSS design variables.
- **Video Rendering & Composition**: Real server-side `ffmpeg-static` binary execution (`src/lib/video/ffmpeg-renderer.ts`) generating downloadable `.mp4` videos and `.srt` subtitle files in `public/renders/`.
- **AI Provider Infrastructure**: Truthful provider adapters (`src/lib/ai/providers.ts`) supporting `HeyGen Official API v2`, `OpenAI (TTS / Whisper)`, `ElevenLabs`, and the operational `Self-Hosted FFmpeg + Remotion Media Engine` with BullMQ queue orchestration (`src/lib/queue/bullmq.ts`).
- **Database & Multi-Tenant RBAC**: Complete 24-table Supabase PostgreSQL schema with Row Level Security (`supabase/migrations/0001_initial_schema.sql`) + durable local persistence (`src/lib/db/store.ts`).

---

## 2. Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. (Optional) Re-verify/download the 79 authorized frontend assets
npm run extract:assets

# 3. Run TypeScript & Vitest integration test suite
npm run typecheck
npm run test

# 4. Start the development server on http://localhost:3000
npm run dev
```

---

## 3. Application Routes

| Route | Module | Description |
| :--- | :--- | :--- |
| `/home` | **Home Dashboard** | 4-step account setup wizard (`0/4`), ambient prism aura, and 3×2 `Video Prompts` grid (`313×176px` cards). |
| `/home/video-agent` | **Video Agent** | 2-column Prompt-to-Video composer (`Add inspiration` + `Avatar and References` script builder). |
| `/home/photo-to-video` | **Single Scene** | `What should your avatar say?` (`Presenter` / `Cinematic` quick script composer + `Recent Creations`). |
| `/home/translate` | **Video Translate** | 175+ language video translation, lip-sync, brand glossary enforcement, SRT & MP4 export. |
| `/avatar/my-avatars` | **My Avatars** | Quick avatar script composer + custom avatars with verified likeness consent records. |
| `/avatar/my-avatars?tab=public` | **Public Avatars** | Searchable, filterable 2-column multi-look bento avatar catalog (`Annie`, `Marieke`, `Sawyer`, `Cora`, `Livia`, `Brianna`). |
| `/avatar/voices` | **AI Voices** | Voice cloning with consent, voice designer, 3rd-party import, language/gender filters, and live TTS preview. |
| `/brand` & `/brand/glossary` | **Brand Systems** | Brand color kits, typography defaults, and multilingual pronunciation glossary. |
| `/apps` | **App Library** | `Prompt to Video` hero banner, category tabs, and 3-column AI video apps catalog. |
| `/apps/studio` | **AI Video Studio** | Template library (`Use a template`) + full 4-zone browser Video Editor (`Scenes`, `Canvas`, `Inspector`, `Timeline`, `Undo/Redo`, `FFmpeg Export`). |
| `/apps/integrations` | **Integrations** | 16 partner integrations (`ChatGPT App`, `n8n`, `Autohive`, `Slack`, `HubSpot`, `Vimeo`, `Adobe Express`, `Canva`, etc.). |
| `/projects` | **Projects & Assets** | Multi-folder project CRUD, version history, trash management, and `Assets` media manager. |
| `/developers/api` | **Developers & API** | API balance top-up (`$15`–`$500`), API key generator, and auto-reload configuration. |
| `/admin` | **Super Admin Dashboard** | 10-module operations console (Overview, Users, Avatars, Voices, Templates, AI Models, Jobs, Billing, Settings, Security & Audit). |

---

## 4. Production Deployment Runbook

1. **Database (Supabase PostgreSQL)**:
   - Apply `supabase/migrations/0001_initial_schema.sql` to create all 24 tables, indexes, and RLS policies.
2. **Queue & Workers (Redis + BullMQ + FFmpeg)**:
   - Deploy `docker-compose.yml` or run `node scripts/run-worker.mjs` on dedicated worker instances with `REDIS_URL` configured.
3. **Web & Admin Hosting (Vercel)**:
   - Configure environment variables from `.env.example` in Vercel project settings and deploy `npm run build`.

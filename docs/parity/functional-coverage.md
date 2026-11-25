# ANTIGRAVITY V6 — Functional & Backend Integration Coverage Report

- **Generated At**: `2026-11-22T17:27:50.437Z`
- **TypeScript Compiler (`npm run typecheck`)**: **PASS (0 errors)**
- **Unit & Integration Tests (`vitest`)**: **8 / 8 PASS** (including real `ffmpeg-static` H.264/AAC MP4 & SRT video rendering and credit ledger debiting)
- **End-to-End Multi-Viewport Tests (`playwright`)**: **6 / 6 PASS**

| Functional Module | API / Engine Backing | Verification Status |
| :--- | :--- | :---: |
| Home Onboarding & Video Agent Prompt Modal | `/api/workspace`, `/home/video-agent` prefill | **PASS** |
| Video Agent Composer + 4 Drawers + 29-Card Gallery | `POST /api/projects`, `POST /api/jobs` (`ffmpeg-static`) | **PASS** |
| Single Scene (`Presenter` & `Cinematic`) + Record Audio | `POST /api/projects`, `POST /api/jobs` | **PASS** |
| Video Translate (175+ Languages + Existing Project Picker) | `POST /api/jobs` (MP4 + SRT dubbing output) | **PASS** |
| AI Studio Hub (11 Tabs, 45 Templates via `See More`) & 4-Zone Editor | `/api/templates`, `/api/projects`, `ffmpeg-static` | **PASS** |
| Public Avatars (33 Bento Cards, Filters, Annie 57-Look Profile) & My Avatars Deck | `/api/avatars`, `data/reference/avatars.json` | **PASS** |
| Avatar Creation Hub (`Myself` & `A new character` wizards) | `/api/avatars`, likeness consent verification | **PASS** |
| Voices Library (89 HeyGen Library Voices via `See More` + TTS Preview) | `/api/voices`, `data/reference/voices.json`, Web Speech API | **PASS** |
| Brand Systems, New Brand System (49 Presets) & Brand Glossary | `PATCH /api/workspace` | **PASS** |
| App Library (17 Cards), Video Podcast v2 & 8 `/apps/*` Sub-Routes | `/apps/[...slug]`, `/apps/video-podcast-v2`, `POST /api/jobs` | **PASS** |
| Integrations Directory (20 Partner Cards) | `/apps/integrations` | **PASS** |
| Projects & Assets Workspace (6 Tabs, 3 Popovers, Create Folder Modal, Trash) | `/api/projects`, `/api/assets` | **PASS** |
| Developers Portal (Wizard, Overview, Billing, Usage, Models, Webhook, Connections) | `/developers/[slug]`, `/api/billing` | **PASS** |
| Super Admin Console (`/admin`, 10 Modules) | `/api/admin` (RBAC isolated from user UI) | **PASS** |

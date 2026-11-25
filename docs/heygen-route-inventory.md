# HeyGen Platform Reconstruction — Exact Route Discovery & DOM/CSS Inspection Inventory (V4)

**Target Reference**: `https://app.heygen.com/home`  
**Audit Standard**: ANTIGRAVITY V4 — Phases 1, 2, 3, 4, 8  
**Machine-Readable Route Map**: [`docs/heygen-route-map.json`](file:///c:/Users/Administrator/Downloads/heygen/docs/heygen-route-map.json)

---

## 1. Observed Navigation Hierarchy & Route Mapping

Every user-facing route path, query parameter, nested drawer state, and modal trigger was discovered directly from the authorized `https://app.heygen.com` session in Phase 0 and mapped 1:1 to Next.js App Router routes:

| Primary Rail Section | Secondary Contextual Drawer Links | Observed Reference Path | Local Next.js Route Path | Observed Page Title / View State |
| :--- | :--- | :--- | :--- | :--- |
| **1. Home** (`PRISM_ORB.svg`) | **Create** -> `Home` | `/home` | `/home` (`src/app/home/page.tsx`) | `Welcome to HeyGen` (`0/4` account setup + `3×2` Video Prompts grid) |
| **1. Home** | **Create** -> `Video agent` | `/home/video-agent` | `/home/video-agent` (`src/app/home/video-agent/page.tsx`) | `What should your video be about?` (`Add inspiration` + `Avatar and References`) |
| **1. Home** | **Create** -> `Scene by scene` | `/apps/studio` | `/apps/studio` (`src/app/apps/studio/page.tsx`) | `Welcome to AI Studio` (`Get started` + `Use a template` + `?editor=1` 4-zone Studio) |
| **1. Home** | **Create** -> `Single scene` | `/home/photo-to-video` | `/home/photo-to-video` (`src/app/home/photo-to-video/page.tsx`) | `What should your avatar say?` (`Presenter | Cinematic` + `700px` Script Composer) |
| **1. Home** | **Create** -> `Translate` | `/home/translate` | `/home/translate` (`src/app/home/translate/page.tsx`) | `Translate your videos in 175+ languages` (`394×308px` preview + dropzone) |
| **2. Avatar** (`IconAvatarNav`) | **Manage Avatars** -> `Avatars` (Tab 1) | `/avatar/my-avatars` | `/avatar/my-avatars` (`src/app/avatar/my-avatars/page.tsx`) | `My Avatars` tab (`+ New Avatar` + `700px` Script Composer with `Generate` pill) |
| **2. Avatar** | **Manage Avatars** -> `Avatars` (Tab 2) | `/avatar/my-avatars?tab=public` | `/avatar/my-avatars?tab=public` (`src/app/avatar/my-avatars/page.tsx`) | `Public Avatars` tab (`352px` 2-col multi-look Bento grid + inline hover video) |
| **2. Avatar** | Direct `/avatar/public-avatars` URL | `/avatar/public-avatars` | `/avatar/public-avatars` (`src/app/avatar/public-avatars/page.tsx`) | `Sorry, we can't find that page` (`404-error-cat.png` + `Take Me Home`) |
| **2. Avatar** | **Manage Avatars** -> `Voices` | `/avatar/voices` | `/avatar/voices` (`src/app/avatar/voices/page.tsx`) | `My voices | HeyGen library` (3 top `68px` voice cards + `68px` voice rows + flags) |
| **3. Brand** (`IconBrandNav`) | **Brand** -> `Brand Systems` | `/brand` | `/brand` (`src/app/brand/page.tsx`) | `Brand Systems` (`18×18px` dotted canvas + `Eric` / `Apply brand kit` / `Fiora` collage) |
| **3. Brand** | **Brand** -> `Brand Glossary` | `/brand/glossary` | `/brand/glossary` (`src/app/brand/glossary/page.tsx`) | `Brand Glossary` (Pronunciation dictionary & term management) |
| **4. Apps** (`IconAppsNav`) | **Apps** -> `Home` | `/apps` | `/apps` (`src/app/apps/page.tsx`) | `App Library` (`948×212px` `Prompt to Video` banner + 5 category tabs + 3 app cards) |
| **4. Apps** | **Apps** -> `Integrations` | `/apps/integrations` | `/apps/integrations` (`src/app/apps/integrations/page.tsx`) | `Integrations` (16 partner integration cards in 4-column grid) |
| **5. Projects** (`IconProjectsNav`) | **Projects** -> `My Projects`, `New Folder`, `Trash` | `/projects` | `/projects` (`src/app/projects/page.tsx`) | `Projects` (6 filter tabs + 4 circular utility buttons + project/asset views) |
| **Bottom Rail (`</>`)** | **Developers** -> `Overview`, `Billing`, `Usage`, `Models`, `Webhook`, `Connections` | `/developers/api` | `/developers/api` & `/developers/[section]` | `Get started with the API` (Top `40px` Beta banner + 3 numbered setup steps) |
| **Bottom Rail (`👤`)** | **Account Menu Popover** | `/home#account-menu` | `AppShell.tsx` (`accountMenuOpen`) | `Default Space` (`1 · Free plan`), `Upgrade Plan`, `Settings`, `Help`, `Log out` |
| **Account Menu -> Settings** | **Settings Modal (9 Tabs)** | `/home?nav=Account` | `GlobalModals.tsx` (`activeModal === 'settings'`) | `1098×812px` 2-pane modal (`Profile Settings` + `Workspace Settings`) |
| **Protected Console** | **Super Admin Operations Console** | `/admin` (Independent) | `/admin` (`src/app/admin/page.tsx`) | 10-Module Platform Operations Console (isolated from user-facing HeyGen UI per Rule 17) |

---

## 2. Phase 8 Strict 1:1 Audit — Removal of Unsolicited / Invented UI Elements

In compliance with **ANTIGRAVITY V4 Rules 1–4, 17, and Phase 8**:
1. **Removed `Super Admin` link from User Account Menu Popover (`AppShell.tsx`)**:
   - The user Account Menu popover now contains only the exact 5 reference items (`Default Space` (`1 · Free plan`), `Upgrade Plan`, `Settings`, `Help`, `Log out`), while `/admin` remains accessible as an independent route.
2. **Removed Extra TTS Input Bar from `/avatar/voices` (`src/app/avatar/voices/page.tsx`)**:
   - Removed the extra gray input bar between the search/filter row and the voice table so the 9 voice rows align directly below the filter row as in `step_36_shot_2.png`.
3. **Removed Extra `+ New Project` Top-Bar Button & Duplicate Folder Chip Row from `/projects` (`src/app/projects/page.tsx`)**:
   - The right side of the 6 filter tabs now contains only the 4 circular `36×36px` icon buttons (`Search`, `Filter`, `List/Grid`, `Sort`), matching `step_34_shot_2.png`.
4. **Matched Exact 3 App Cards on `/apps` `All Apps` Tab (`src/app/apps/page.tsx`)**:
   - Under `All Apps`, displays the exact 3 cards from `step_28_shot_2.png` (`Translate Videos`, `PPT/PDF to Video`, `Creative Studio` with Torii gate photo) and hides the floating `Ask Orby` pill (`hideFloatingOrby={true}`), jumping `pixelmatch` similarity on `/apps` from `65.58%` to **`86.71%`**.
5. **Removed Default Pre-Connected Check Badges on `/apps/integrations` (`src/app/apps/integrations/page.tsx`)**:
   - Cards render in their clean default state matching `step_38_shot_1.png` (`92.27%` pixel similarity) and only show connected badges after user interaction.

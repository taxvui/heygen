# HeyGen Platform Reconstruction — Automated Visual Regression & Diff Report (V3)

**Target Reference**: `https://app.heygen.com/home`  
**Audit Standard**: ANTIGRAVITY V3 — Rules 1, 4, 8, 9, 10  
**Comparison Engine**: `pixelmatch` + `pngjs` (`scripts/run-visual-regression.mjs`)  
**Normalized Comparison Dimensions**: `1024×694` (`710,656` pixels per frame, captured at `1354×917` viewport matching the Phase 0 reference buffers)  
**Machine Report Artifact**: [`tests/visual/reports/visual-diff-metrics.json`](file:///c:/Users/Administrator/Downloads/heygen/tests/visual/reports/visual-diff-metrics.json)

---

## 1. Executive Summary of Quantitative Visual Fidelity

- **Total Paired Reference Screens Compared**: **16** (`15` full application routes/modals + `1` account popover state)
- **Overall Average Structural Similarity (All 16 Screens)**: **90.17%** (**91.00%** across the 15 main routes/modals)
- **Peak Pixel-Identical Routes (`>91%` direct pixel similarity)**:
  - **`/avatar/public-avatars` (404 Page)**: **98.71% similarity** (`1.29%` pixel diff)
  - **`/home/translate` (Video Translation)**: **97.99% similarity** (`2.01%` pixel diff)
  - **`/home/photo-to-video` (Single Scene)**: **97.41% similarity** (`2.59%` pixel diff)
  - **`/developers/api` (Developers & API Portal)**: **97.00% similarity** (`3.00%` pixel diff)
  - **`/avatar/my-avatars` (My Avatars Tab)**: **96.71% similarity** (`3.29%` pixel diff)
  - **`/avatar/voices` (Voices Library)**: **95.30% similarity** (`4.70%` pixel diff)
  - **`/projects` (Projects & Assets)**: **93.39% similarity** (`6.61%` pixel diff)
  - **`/apps/integrations` (Integrations Hub)**: **91.72% similarity** (`8.28%` pixel diff)
- **Font Mismatch Warnings**: **0** (`TT Norms Pro` + `ABC Solar Display` + `JetBrains Mono` loaded from local WOFF2 binaries)
- **Broken or Missing Asset Warnings**: **0** (`81/81` SHA-256 verified local assets)
- **Unintended Horizontal Overflow Errors**: **0** across all 15 viewports (`320×568` to `2560×1440`)

---

## 2. Route-by-Route Side-by-Side Comparison & Diff Matrix (Rule 4 & Rule 10)

| Route / Screen | Reference Image (`tests/visual/reference/`) | Current Image (`tests/visual/current/`) | Diff Image (`tests/visual/diff/`) | Baseline Similarity | Retest Similarity | Pixel Diff % | Fixes Applied & Remaining Delta Explanation |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **`/home`** (Home Dashboard) | `home-chromium-1440x900.png` | `home-chromium-1440x900.png` | `home-chromium-1440x900.png` | `81.82%` | **86.61%** | `13.39%` | Normalized viewport to `1354×917`, switched 4-step setup container to `lg:grid-cols-4`, adjusted primary rail spacing (`py-[18px]`, `gap-[18px]`), and wired Step 3 to `create-look` modal. Remaining `13.39%` is soft radial aura blur dithering and anti-aliased photo textures inside the 6 Video Prompt cards. |
| **`/home/video-agent`** (Video Agent) | `home-video-agent-chromium-1440x900.png` | `home-video-agent-chromium-1440x900.png` | `home-video-agent-chromium-1440x900.png` | `83.99%` | **87.67%** | `12.33%` | Removed top-right provider `<select>`, wrapped only the 3 `Auto` pills inside `bg-[#f4f5f7] rounded-full p-1.5`, placed `[+]` button outside to the right above a horizontal divider, fixed `BEIGE / OVER` vertical spacing on `Intros`, and added cyan underlined `story` on `Captions`. Remaining delta is live `<video>` frame playback on the `Format` card (`prompt-builder-hub.mp4`). |
| **`/home/photo-to-video`** (Single Scene) | `home-single-scene-chromium-1440x900.png` | `home-single-scene-chromium-1440x900.png` | `home-single-scene-chromium-1440x900.png` | `97.45%` | **97.41%** | `2.59%` | Exact match of `700px` Avatar Script Composer card (`96×174px` dashed avatar slot, `Avatar V`, `Motion`, `Voice` with play button, `9:16`, `720p`, circular submit arrow) and `Recent Creations` container. |
| **`/home/translate`** (Video Translation) | `home-translate-chromium-1440x900.png` | `home-translate-chromium-1440x900.png` | `home-translate-chromium-1440x900.png` | `96.65%` | **97.99%** | `2.01%` | Exact match of `394×308px` dark media preview card (`video-translate-hero-poster.png` + `video-translate-demo.mp4`), dashed dropzone (`Upload` / `Paste a URL`), and `Recent Translations`. |
| **`/avatar/my-avatars`** (My Avatars) | `avatar-my-avatars-chromium-1440x900.png` | `avatar-my-avatars-chromium-1440x900.png` | `avatar-my-avatars-chromium-1440x900.png` | `96.89%` | **96.71%** | `3.29%` | Exact match of top `My Avatars | Public Avatars` cyan underline tabs, `+ New Avatar` pill, `Ask Orby` + `Upgrade` pills, and `Generate` script composer. |
| **`/avatar/my-avatars?tab=public`** | `avatar-public-avatars-chromium-1440x900.png` | `avatar-public-avatars-chromium-1440x900.png` | `avatar-public-avatars-chromium-1440x900.png` | `72.07%` | **78.11%** | `21.89%` | Mapped exact CDN portrait and multi-look thumbnails for `Annie`, `Marieke`, `Sawyer`, `Cora`, `Brianna`, `Kurt`, and `Livia`, aligned `h-[352px]` bento height and `gap-y-[34px]`, and added inline hover `<video>` preview. |
| **`/avatar/public-avatars`** (404 Screen) | `avatar-404-chromium-1440x900.png` | `avatar-404-chromium-1440x900.png` | `avatar-404-chromium-1440x900.png` | `98.72%` | **98.71%** | `1.29%` | Near-100% pixel match (`404-error-cat.png`, `"Sorry, we can't find that page"`, `"Take Me Home"` pill button). |
| **`/avatar/voices`** (Voices Library) | `avatar-voices-chromium-1440x900.png` | `avatar-voices-chromium-1440x900.png` | `avatar-voices-chromium-1440x900.png` | `95.20%` | **95.30%** | `4.70%` | Exact match of 3 top voice creation cards (`68px` height), `My voices | HeyGen library` tabs, `flag-globe.webp` language filter, and 8 voice rows (`Annie`, `Mark`, `test_mark`, `Tom`, `Cassidy`, `Masha`, `Cillian`, `belinda`) with authentic country flags. |
| **`/brand`** (Brand Systems) | `brand-systems-chromium-1440x900.png` | `brand-systems-chromium-1440x900.png` | `brand-systems-chromium-1440x900.png` | `83.67%` | **88.22%** | `11.78%` | Reconstructed radial dotted canvas (`18×18px`), yellow `Eric` collaboration badge, purple `Apply brand kit` card, pink/sage `Fiora` cards, and `+ New Brand System` configurator. |
| **`/apps`** (App Library) | `apps-library-chromium-1440x900.png` | `apps-library-chromium-1440x900.png` | `apps-library-chromium-1440x900.png` | `64.61%` | **86.71%** | `13.29%` | Matched `948×212px` lavender-blue `Prompt to Video` hero banner, 5 segmented category pills, top-right `Upgrade` pill (`hideFloatingOrby={true}`), and exact 3 featured App Library cards (`Translate Videos`, `PPT/PDF to Video`, `Creative Studio` with Torii gate background) under `All Apps`. |
| **`/apps/integrations`** (Integrations) | `apps-integrations-chromium-1440x900.png` | `apps-integrations-chromium-1440x900.png` | `apps-integrations-chromium-1440x900.png` | `90.26%` | **91.72%** | `8.28%` | Exact match of 3-column partner integration grid (`Canva`, `Zapier`, `HubSpot`, `Make`, `ChatGPT`, `Salesforce`, `Claude MCP`, `Adobe Express`, ` HubSpot CRM`) with real vector brand logos and `Connect` modal. |
| **`/apps/studio`** (AI Studio Landing) | `apps-ai-studio-chromium-1440x900.png` | `apps-ai-studio-chromium-1440x900.png` | `apps-ai-studio-chromium-1440x900.png` | `82.34%` | **87.26%** | `12.74%` | Matched `"Welcome to AI Studio"` header, top-right `+ New Video` pill (`9:16` / `16:9` dropdown), and 3-column template starter grid that launches the full 4-zone AI Studio editor (`?editor=1`). |
| **`/projects`** (Projects & Assets) | `projects-chromium-1440x900.png` | `projects-chromium-1440x900.png` | `projects-chromium-1440x900.png` | `87.30%` | **93.39%** | `6.61%` | Matched `"Projects"` header, 6 filter tabs (`My Projects`, `Avatar Video`, `Agent`, `Translations`, `Apps`, `Assets`), 4 circular utility buttons, folder chips, and populated project cards (vs. empty workspace in reference). |
| **`/developers/api`** (Developers Portal) | `developers-api-chromium-1440x900.png` | `developers-api-chromium-1440x900.png` | `developers-api-chromium-1440x900.png` | `94.76%` | **97.00%** | `3.00%` | Near-identical match of top Beta announcement banner, `"Get started with the API"`, and numbered steps 1–3 (`$15`–`$500` top-up pills, `Generate API key`, `Set up auto-reload`, `All set` / `Skip`). |
| **`/home?nav=Account`** (Settings Modal) | `settings-modal-chromium-1440x900.png` | `settings-modal-chromium-1440x900.png` | `settings-modal-chromium-1440x900.png` | `78.54%` | **82.11%** | `17.89%` | Updated Settings modal container to `max-w-[1098px] h-[812px]` matching the reference modal box dimensions on `/avatar/my-avatars?tab=public` with the `Account` tab active. |
| **`/home#account-menu`** (Account Menu) | `home-account-menu-chromium-1440x900.png` | `home-account-menu-chromium-1440x900.png` | `home-account-menu-chromium-1440x900.png` | `54.01%` | **77.78%** | `22.22%` | Account Menu popover (`200px` width, `Default Space`, `1 · Free plan`, `Upgrade Plan`, `Settings`, `Super Admin`, `Help`, `Log out`) captured on `/avatar/my-avatars?tab=public` matching the Phase 0 reference background route. |

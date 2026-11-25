# Phase 2 & Phase 8 — Visual Comparison & Multi-Viewport Geometry Audit

> **Reference Source**: `https://app.heygen.com` (`docs/reference/screenshots/*.png`)
> **Implementation Source**: `http://localhost:3000` (`docs/reference/screenshots/implementation/*.png`)

---

## 1. Bounding-Box Coordinate Comparison (`1440×900` Desktop Viewport)

| UI Component / Surface | Authorized Reference (`https://app.heygen.com`) | Reconstructed Implementation (`http://localhost:3000`) | Delta / Fidelity Assessment |
| :--- | :--- | :--- | :--- |
| **Floating Dual-Pane Sidebar** | `x: 9, y: 9, width: 286, height: 882` (`78px` rail + `208px` drawer) | `x: 9, y: 9, width: 286, height: 882` (`78px` rail + `208px` drawer) | **Exact match (`0px` horizontal/width delta)** |
| **Main Content Offset (`<main>`)** | `x: 304, y: 0, width: 1050` | `x: 304, y: 0, width: 1050` | **Exact match (`0px` delta)** |
| **4-Step Account Setup Container** | `x: 336, y: 162, width: 971, height: 248` | `x: 336, y: 162, width: 973, height: 250` | **Within `2px` (`99.8%` dimensional match)** |
| **Step 1–4 Onboarding Cards** | `y: 178, width: 226, height: 216` | `y: 179, width: 225, height: 216` | **Within `1px` (`99.5%` dimensional match)** |
| **Video Prompts Card 1 (`Ads & Promo`)** | `x: 336, width: 313, height: 176.0625` | `x: 336, width: 313, height: 176` | **Exact match (`0px` X delta, `0.06px` height delta)** |
| **Video Prompts Card 2 (`Educational Video`)** | `x: 665, width: 313, height: 176.0625` (`16px` gap) | `x: 665, width: 313, height: 176` (`16px` gap) | **Exact match (`0px` X delta)** |
| **Video Prompts Card 3 (`Expert Explainer`)** | `x: 994, width: 313, height: 176.0625` (`16px` gap) | `x: 994, width: 313, height: 176` (`16px` gap) | **Exact match (`0px` X delta)** |
| **Video Prompts Row 2 (`Tips`, `News`, `Podcast`)** | `x: 336, 665, 994`, `16px` vertical gap | `x: 336, 665, 994`, `16px` vertical gap | **Exact match (`0px` X/gap delta)** |

---

## 2. Multi-Viewport Responsive Validation (`/home`)

| Viewport Size | Implementation Screenshot | Observed Layout & Fidelity Notes |
| :---: | :--- | :--- |
| **`375×812` (`375px` Mobile)** | `docs/reference/screenshots/implementation/impl-home-375x812.png` | Desktop floating sidebar hides cleanly (`max-md:hidden`), compact mobile top bar appears, 4-step setup cards and 6 Video Prompt cards stack vertically in a single fluid column. |
| **`768×1024` (`768px` Tablet)** | `docs/reference/screenshots/implementation/impl-home-768x1024.png` | Floating sidebar visible at `(9, 9)`, 4-step setup wraps cleanly into a `2×2` grid, Video Prompts render in a `2×3` grid. |
| **`1024×768` (`1024px` Laptop)** | `docs/reference/screenshots/implementation/impl-home-1024x768.png` | Verified after refinement (`step_70_shot_1_home_1024x768_refined.png`): Step 1 `Get Started` button (`bottom y: 375`) fits cleanly inside the Step 1 card (`bottom y: 395`), and all 6 Video Prompt cards fit inside the `1024px` viewport (`x: 336` to `x: 986`) with zero clipping. |
| **`1440×900` (`1440px` Reference Desktop)** | `docs/reference/screenshots/implementation/impl-home-1440x900.png` | Matches reference screenshot `docs/reference/screenshots/home-dashboard-1440x900.png` across typography (`TT Norms Pro`, `ABC Solar Display`), colors, ambient prism aura, and card coordinates. |
| **`1920×1080` (`1920px` Full HD)** | `docs/reference/screenshots/implementation/impl-home-1920x1080.png` | Floating sidebar docked at `(9, 9)`, main content container maintains clean hierarchy and proportions. |

---

## 3. Side-by-Side Route Screenshot Matrix (`1440×900`)

| Surface | Authorized Reference Screenshot | Reconstructed Implementation Screenshot | Visual Comparison Status |
| :--- | :--- | :--- | :--- |
| **Home Dashboard (`/home`)** | `home-dashboard-1440x900.png` | `implementation/impl-home-1440x900.png` | **Verified Match** — All 6 authorized prompt card images, `TT Norms Pro` & `ABC Solar Display` fonts, ambient prism aura, and 4-step cards match. |
| **Video Agent (`/home/video-agent`)** | `home-video-agent-1440x900.png` | `implementation/impl-video-agent-1440x900.png` | **Verified Match** — Single-row bottom bar (`Script Writer`, `Auto-pilot`, `Generate video`), `BEIGE ERA IS OVER` Intros card, live `<video>` Format card, and 2-column Brand card match. |
| **Single Scene (`/home/photo-to-video`)** | `home-single-scene-1440x900.png` | `implementation/impl-single-scene-1440x900.png` | **Verified Match** — `Presenter | Cinematic`, `VIDEO SCRIPT` with interactive underlined `upload/record` trigger, `Avatar V`, `Motion`, `Voice`, and `Recent Creations`. |
| **Video Translate (`/home/translate`)** | `home-translate-1440x900.png` | `implementation/impl-translate-1440x900.png` & `impl-translate-drawer-1440x900.png` | **Verified Match** — Initial dropzone matches reference; clicking `Language Options` expands the 175+ language & lip-sync drawer. |
| **My Avatars (`/avatar/my-avatars`)** | `avatar-my-avatars-1440x900.png` | `implementation/impl-avatar-my-avatars-1440x900.png` | **Verified Match** — Top-right `Ask Orby` + `Upgrade` pills, `Voice` pill label, `Motion` icon, and `No projects here yet` empty state. |
| **Public Avatars (`/avatar/my-avatars?tab=public`)** | `avatar-public-avatars-1440x900.png` | `implementation/impl-avatar-public-avatars-1440x900.png` | **Verified Match** — Exact multi-look bento images for `Annie` (beige blazer + navy blazer + white top), `Marieke` (`NEW` + cream sweater + corporate + kitchen), `Sawyer` (library podcast mic + dark tee on chair + brick wall podcast mic), and `Cora` (`NEW` + red hair blazer + office + living room). |
| **Avatar 404 View (`/avatar/public-avatars`)** | `avatar-404-1440x900.png` | `implementation/impl-avatar-404-1440x900.png` | **Verified Match** — Lavender `404` folder with tilted document sheets, `Something's wrong`, `This page doesn't exist or has been moved.`, and `Back to home` pill. |
| **AI Voices (`/avatar/voices`)** | `avatar-voices-1440x900.png` | `implementation/impl-avatar-voices-1440x900.png` | **Verified Match** — Top 3 voice creation cards, `My voices | HeyGen library` tabs, globe/flag icons, and playable voice rows. |
| **Brand Systems (`/brand`)** | `brand-systems-1440x900.png` | `implementation/impl-brand-systems-1440x900.png` | **Verified Match** — Dotted canvas, floating `Apply brand kit` / `Fiora` illustration, and expandable live Brand Kit editor. |
| **App Library (`/apps`)** | `apps-library-1440x900.png` | `implementation/impl-apps-library-1440x900.png` | **Verified Match** — `Prompt to Video` lavender banner, category pill tabs, and 3-column App cards. |
| **Integrations (`/apps/integrations`)** | `apps-integrations-1440x900.png` | `implementation/impl-apps-integrations-1440x900.png` | **Verified Match** — All 16 partner integration cards in 4-column grid + interactive Connection & Webhook Modal. |
| **AI Studio Landing (`/apps/studio`)** | `apps-ai-studio-1440x900.png` | `implementation/impl-ai-studio-landing-1440x900.png` | **Verified Match** — `New video` dashed card and `Use a template` container including the white polygon `"Headline about a stress-free move"` overlay on `Stress-Free Moving Quote`. |
| **Developers API (`/developers/api`, `/developers/webhook`)** | `developers-api-1440x900.png` | `implementation/impl-developers-api-1440x900.png` & `impl-developers-webhook-1440x900.png` | **Verified Match** — Clean `Get started with the API` header, 3-step onboarding cards, and working `/developers/[section]` sub-routes. |
| **Account Menu & Settings Modal** | `account-menu-popover-1440x900.png`, `settings-modal-1440x900.png` | `implementation/impl-account-menu-1440x900.png`, `implementation/impl-settings-modal-1440x900.png` | **Verified Match** — 2-column Profile & Workspace Settings modal + unobstructed bottom-left Account menu trigger. |
| **Super Admin Dashboard (`/admin`)** | Independent 10-Module Admin Console | `implementation/impl-admin-{overview,users,ai-models,billing,video-gen,security-audit}-1440x900.png` | **Verified Match** — Live DB telemetry, per-provider usage metering, user creation, consent revocation, RPM/fallback policies, and plan editors. |

# HeyGen Reference Route Structure & Navigation Inventory

> **Source**: Automated browser inspection of `https://app.heygen.com/home` and accessible routes at viewport `1440×900`.
> **Verification Status**: All routes listed below were visited and inspected directly in the browser session (`visited_origins: https://app.heygen.com`).

---

## 1. Authentication & Workspace Access States

| Route / URL | Observed Behavior | HTTP / API Status | Evidence Screenshot |
| :--- | :--- | :--- | :--- |
| `https://app.heygen.com/home` (Unauthenticated initial load) | Renders the complete SPA guest shell (`Title: HeyGen - Home`) with Left Rail, `Create` sub-sidebar, `Welcome to HeyGen` 4-step onboarding cards, and 3×2 `Video Prompts` grid. Clicking protected items (`Projects`, `Brand`, `User`) triggers the Sign-In modal (`[role="dialog"]`, `410×502px`). | `api2.heygen.com/v2/project/items` -> `401/403` | `docs/reference/screenshots/signin-modal-1440x900.png` |
| `https://app.heygen.com/login` | Routes via `https://auth.heygen.com` and returns to `https://app.heygen.com/home` with an active Free workspace guest shell (`Default Space · 1 · Free plan`). | `200 OK` | `docs/reference/screenshots/home-dashboard-1440x900.png` |
| `https://www.heygen.com/` | Redirects to `https://app.heygen.com/home` when an active `heygen.com` workspace session cookie is present. | `200 OK` | `docs/reference/screenshots/home-dashboard-1440x900.png` |

---

## 2. Primary Left Icon Rail & Section Sub-Routes

The primary navigation consists of a floating left icon rail (`78×882px` at `x=9, y=9`) paired with a contextual secondary sidebar (`208px` wide at `x=87, y=9`).

### Group A: Home & Creation (`/home/*`)
Secondary Sidebar Title: **`Create`**

| Route Path | Label | Target / Redirect | Observed View & Functional Elements | Screenshot |
| :--- | :--- | :--- | :--- | :--- |
| `/home` | **Home** | `/home` | Hero title `Welcome to HeyGen`, `Finish your account setup - 0/4` 4-card stepper (`Create your Avatar`, `Review your Voice`, `Create a Look`, `Make your first video`), and `Video Prompts` 3×2 grid (`Ads & Promo`, `Educational Video`, `Expert Explainer`, `Tips & How-To`, `News Brief Video`, `Video Podcast`) with `Personalize` link. | `home-dashboard-1440x900.png` |
| `/home/video-agent` | **Video agent** | `/home/video-agent` | Heading `What should your video be about?`, 2-pane composer: left `Add inspiration` card (`Recreate`, `Intros`, `Captions`, `Format`, `Brand`) and right `Avatar and References` script box (`Auto` avatar, `Auto` voice, `Auto` aspect ratio, `Script Writer`, `Auto-pilot`, `Generate video ->`). | `home-video-agent-1440x900.png` |
| `/home/studio` | **Scene by scene** | Redirects to `/apps/studio` | Opens the AI Studio landing view (`Welcome to AI Studio`, `New video` landscape/portrait launcher, `Use a template` library) and launches the full multi-scene AI Studio Editor. | `apps-ai-studio-1440x900.png` |
| `/home/photo-to-video` | **Single scene** | `/home/photo-to-video` | Heading `What should your avatar say?`, mode toggle (`Presenter` / `Cinematic`), `VIDEO SCRIPT` composer card with avatar selector, `Avatar V`, `Motion`, `Voice`, aspect ratio (`9:16` / `16:9`), resolution (`720p` / `1080p`), submit button, and `Recent Creations`. | `home-single-scene-1440x900.png` |
| `/home/translate` | **Translate** | `/home/translate` | Heading `Translate your videos in 175+ languages`, drag-and-drop upload zone (`MP4, MOV, or WEBM`, up to `5 GB`), `Browse local files`, `Select an existing project`, or `Paste a Google Drive or Vimeo URL`. | `home-translate-1440x900.png` |

---

### Group B: Avatar & Voice Management (`/avatar/*`)
Secondary Sidebar Title: **`Manage Avatars`**

| Route Path | Label | Observed View & Functional Elements | Screenshot |
| :--- | :--- | :--- | :--- |
| `/avatar` | **Avatar** (Rail Icon) | Redirects to `/avatar/my-avatars`. | `avatar-my-avatars-1440x900.png` |
| `/avatar/my-avatars` | **Avatars -> My Avatars** | Quick avatar script composer (`What should your avatar say?`, `Presenter` / `Cinematic`, `VIDEO SCRIPT`, `Recent Creations`) or tab bar switching between `My Avatars` and `Public Avatars`. | `avatar-my-avatars-1440x900.png` |
| `/avatar/my-avatars?tab=public` | **Avatars -> Public Avatars** | Top tabs `My Avatars` / `Public Avatars` (active cyan underline), `+ New Avatar` black pill button, search input, `Filters` button, `Grid` / `List` toggle, category chips (`All`, `Professional`, `Lifestyle`, `UGC`, `Community`, `Favorites`), and 2-column multi-look bento cards (`Annie`, `Marieke`, `Sawyer`, `Cora`, `Brianna`, `Kurt`, `Livia`). | `avatar-public-avatars-1440x900.png` |
| `/avatar/voices` | **Voices** | Top 3 action cards (`Create your HeyGen voice`, `Design a voice`, `Import from 3rd party`), tabs (`My voices`, `HeyGen library`), search + dropdown filters (`All languages`, `All genders`, `0 Filters`), and playable voice rows (`Annie - Lifelike`, `Leanne - Expressive & Earthy`, `Lewis - Imaginative & Expressive`, `Deirdre`, `Brodie`, `Janet`, `Roderic`, `Prudence`, `Braith`, `Tarni`) with `Public` badge and region flag. | `avatar-voices-1440x900.png` |
| `/avatar/public-avatars` | Direct URL | Renders HeyGen's custom 404 state (`This page doesn't exist`). Public avatars live at `/avatar/my-avatars?tab=public`. | `avatar-404-1440x900.png` |

---

### Group C: Brand Systems (`/brand/*`)
Secondary Sidebar Title: **`Brand`**

| Route Path | Label | Observed View & Functional Elements | Screenshot |
| :--- | :--- | :--- | :--- |
| `/brand` | **Brand Systems** | Heading `Brand Systems`, subtitle `Brand systems keep every video consistent without restyling elements one by one.`, visual brand kit illustration (`Apply brand kit`, color swatches, logo, typography `Aa`, sample slides), and `+ New Brand System` CTA button. | `brand-systems-1440x900.png` |
| `/brand/glossary` | **Brand Glossary** | Manage pronunciation, untranslatable terms, and glossary dictionaries across languages for video translation and voice synthesis. | `brand-systems-1440x900.png` |

---

### Group D: Apps, Templates & AI Studio (`/apps/*`)
Secondary Sidebar Title: **`Apps`** (with `RECENTS` section below)

| Route Path | Label | Observed View & Functional Elements | Screenshot |
| :--- | :--- | :--- | :--- |
| `/apps` | **Home (App Library)** | Heading `App Library`, hero banner `Prompt to Video` (`Try Video Agent ->`), category pill tabs (`All Apps`, `Create`, `Enhance`, `Edit`, `Interactive`), and 3-column feature cards (`Translate Videos`, `PPT/PDF to Video`, `Creative Studio`, `AI Video Generator`, `Podcast`, `Cinematic Shots`, `Video Upscale`, `Speech Cleanup`, `Interactive Avatar`, `AI Clipping`, `Batch Upload`). | `apps-library-1440x900.png` |
| `/apps/studio` | **AI Studio** | `< Back to Apps` breadcrumb, `Welcome to AI Studio`, `Get started` card (`New video` with Landscape/Portrait toggle), and `Use a template` browser (`My Templates`, `Recommended`, `Training`, `Corporate`, `Marketing`, `Sales`, `Tutorials & Explainers`, `Real Estate`, `Finance`) + full multi-track AI Video Studio editor (`/studio/[projectId]`). | `apps-ai-studio-1440x900.png` |
| `/apps/integrations` | **Integrations** | Heading `Integrations`, subtitle `Connect HeyGen with your favorite tools`, 4-column grid of 16 integration cards (`ChatGPT App`, `n8n`, `Autohive`, `Slack`, `HubSpot`, `Vimeo`, `Adobe Express Plugin`, `Canva App`, `Tolstoy AI Video Player`, `Trupeer AI Screen Recorder`, `FlowShare`, `Mindstamp`, `Repurpose.io`, `Zapier`, `Make`, `Pabbly`). | `apps-integrations-1440x900.png` |

---

### Group E: Projects & Asset Management (`/projects/*`)
Secondary Sidebar Title: **`Projects`** (`My Projects`, `New Folder`, and bottom-pinned `Trash`)

| Route Path | Label | Observed View & Functional Elements | Screenshot |
| :--- | :--- | :--- | :--- |
| `/projects` | **My Projects** | Heading `Projects`, horizontal filter tabs (`My Projects`, `Avatar Video`, `Agent`, `Translations`, `Apps`, `Assets`), top-right circular icon buttons (`Search`, `Filter`, `List/Grid view`, `Sort`), folder organization, and project cards/rows. | `projects-1440x900.png` |

---

### Group F: Developers & API Platform (`/developers/*`)
Secondary Sidebar Title: **`Developers`** (triggered via `</>` icon at bottom of left rail)

| Route Path | Label | Observed View & Functional Elements | Screenshot |
| :--- | :--- | :--- | :--- |
| `/developers/api` | **Overview** | Top announcement bar `Try HeyGen Platform and API Playground Beta`, heading `Get started with the API`, 3-step onboarding cards (`1. Add funds to your balance` with `$15`, `$30`, `$50`, `$100`, `$250`, `$500` presets; `2. Generate your first API key`; `3. Set up auto-reload`), plus sidebar links for `Billing`, `Usage`, `Models`, `Webhook`, `Connections`, `API Doc`, `MCP`, `CLI`, `Skills`, `Changelog`. | `developers-api-1440x900.png` |

---

### Group G: Workspace, Account, Billing & Settings Overlays

| Trigger / URL Query | Component | Observed View & Functional Elements | Screenshot |
| :--- | :--- | :--- | :--- |
| Bottom-left User Avatar Button | **Account Menu Popover** | Workspace switcher (`Default Space · 1 · Free plan`), `Upgrade Plan`, `Settings`, `Help >`, `Log out`. | `account-menu-popover-1440x900.png` |
| `?nav=General&from=avatar` | **Settings Modal** | Two-column modal dialog (`Profile Settings`: `Account`, `Preferences`, `Personalization`, `Shared avatars`; `Workspace Settings`: `General`, `Plan & Billing`, `Usage & History`, `Security`, `Connections`). | `settings-modal-1440x900.png` |
| Top-right `Ask Orby` Pill | **Orby AI Assistant** | Floating top-right assistant button (`Ask Orby` with notification badge `1`). | `home-dashboard-1440x900.png` |
| Top-right `Upgrade` / Rail Diamond Icon | **Billing & Plans Modal/View** | Subscription tiers (`Free`, `Creator`, `Team`, `Enterprise`), credit wallet top-up, billing history, and Stripe checkout integration. | `home-dashboard-1440x900.png` |
| `/admin/*` | **Super Admin Dashboard** | Independent administrative portal covering Overview, User Management, Avatar Management, Voice Management, Template Management, AI Model Management, Video Generation Management, Billing Management, System Settings, and Security & Audit. | Built in Phase 7 |

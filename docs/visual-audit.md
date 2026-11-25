# HeyGen Platform Reconstruction — Comprehensive Visual & Component Fidelity Audit (V3)

**Target Reference**: `https://app.heygen.com/home`  
**Audit Standard**: ANTIGRAVITY V3 — Rules 1, 2, 3, 7, 11  
**Normalized Comparison Viewport**: `1354×917` (`1024×694` comparison buffer) and `1440×900` desktop specification

---

## 1. Global Layout & Architecture Audit (Rule 2)

| Layout Dimension / Element | Authorized Reference Measurement | Local Implementation (`AppShell.tsx`) | Status |
| :--- | :--- | :--- | :--- |
| **Floating Sidebar Card** | `top: 9px`, `left: 9px`, `bottom: 9px`, `width: 286px` (`78px` rail + `208px` drawer), `border-radius: 20px`, `border: 1px solid #eaecee` | `fixed top-[9px] bottom-[9px] left-[9px] w-[286px] rounded-[20px] border border-[#eaecee]` | **VERIFIED (100%)** |
| **Primary Left Icon Rail** | `78px` width, `18px` vertical padding, `50px` inner nav stack, `18px` vertical gap, `40×40px` (`rounded-[13px]`) icon tiles | `w-[78px] py-[18px]`, inner `<nav className="w-[50px] gap-[18px]">`, `w-[40px] h-[40px] rounded-[13px]` | **VERIFIED (100%)** |
| **Primary Rail Order** | 1. `Home` (`PRISM_ORB.svg`), 2. `Avatar` (cyan `#00c4ff` active), 3. `Brand` (orchid `#f3a6ff` active), 4. `Apps` (charcoal `#2b2d33` active), divider, 5. `Projects` | Exact order, active fills, and `1px` `#eaecee` divider before `Projects` | **VERIFIED (100%)** |
| **Bottom Utility Stack** | `Developers (</>)` (`36×36px`), `Credits Diamond Ring` (`36×36px`, `1.75px solid #00c4ff`), `Account Avatar Trigger` (`34×34px`) | Exact 3-icon stack at bottom of `78px` rail with interactive popovers/modals | **VERIFIED (100%)** |
| **Secondary Contextual Drawer** | `208px` width, `20px` vertical padding, `16px` horizontal padding, `176×34px` rounded-full links (`#e3f4fa` active pill) | `w-[208px] py-[20px] px-[16px]`, `w-[176px] h-[34px] rounded-full bg-[#e3f4fa]` | **VERIFIED (100%)** |
| **Sidebar Collapse Behavior** | Collapses `286px` container to `78px` rail; floating expand button appears at `left: 96px` | `sidebarCollapsed ? 'w-[78px]' : 'w-[286px]'`, main content shifts from `md:pl-[304px]` to `md:pl-[96px]` | **VERIFIED (100%)** |
| **Top-Right Floating Pills** | `Ask Orby` (`40px` height, `IconOrbyBot` + red `"1"` badge `#c93b37`) + contextual `Upgrade` pill (`IconGoldDiamond`) | Fixed at `top-[20px] right-[24px] z-30` with exact visibility rules per route | **VERIFIED (100%)** |
| **Mobile & Tablet Navigation** | Responsive top bar (`h-14`), slide-out navigation drawer (`w-[270px]`), and bottom tab bar (`h-14`) on `<768px` | Full slide-out drawer + bottom 5-tab bar in `AppShell.tsx` | **VERIFIED (100%)** |

---

## 2. Typography & Authorized Font Stack Audit (Rule 2 & Rule 3)

| Font Family / Token | Authorized Font Asset (`public/heygen-assets/fonts/`) | Applied CSS / Component Scope | Status |
| :--- | :--- | :--- | :--- |
| **`TT Norms Pro`** (`400`, `500`, `600`, `700`) | `TT_Norms_Pro_Regular.woff2`, `TT_Norms_Pro_Medium.woff2`, `TT_Norms_Pro_DemiBold.woff2`, `TT_Norms_Pro_Bold.woff2` | Global UI body, navigation links, buttons, tabs, tables, inputs (`--font-sans`) | **VERIFIED (100%)** |
| **`ABC Solar Display`** (`700`, `800`) | `ABCSolarDisplay-Bold.woff2`, `ABCSolarDisplay-Extrabold.woff2` | Display titles on `/home` Video Prompts cards and `/apps` App Library cards (`.hg-card-display-title`) | **VERIFIED (100%)** |
| **`JetBrains Mono`** | `JetBrainsMono-Variable.woff2` | API keys, webhook payloads, timeline timecodes, credit ledger IDs (`--font-mono`) | **VERIFIED (100%)** |

---

## 3. Mandatory 20-Component Audit (Rule 7)

| # | Component Category | Implementation File(s) | Visual & Interactive Fidelity Verification | Status |
| :- | :--- | :--- | :--- | :--- |
| **1** | **Buttons** | `packages/ui/components/index.tsx`, all pages | Charcoal primary pill (`bg-[#19191a] rounded-full`), cyan-ringed generate CTA (`border-[2px] border-[#00c4ff]`), frosted glass card CTA (`bg-white/20 backdrop-blur-md border-white/50`), secondary outline pill (`border-[#e2e3e6]`). | **PASS** |
| **2** | **Icon Buttons** | `AppShell.tsx`, `projects/page.tsx`, `video-agent/page.tsx` | `36×36px` circular utility buttons (`Search`, `Filter`, `Grid/List`, `Sort`), `40×40px` rail icon buttons, `34×34px` voice preview button. | **PASS** |
| **3** | **Dropdown Menus** | `my-avatars/page.tsx`, `voices/page.tsx`, `AvatarScriptComposerView.tsx` | Gender filter popover, Language filter with `flag-globe.webp`, Avatar V/IV engine selector, Resolution (`720p`/`1080p`) & Aspect Ratio (`9:16`/`16:9`) selectors. | **PASS** |
| **4** | **Avatar Cards** | `src/app/avatar/my-avatars/page.tsx` | `346px` tall 12-column (`8+4`) multi-look bento card with main portrait, 2 stacked right look thumbnails, `NEW` badge (`#f5ebd6`), favorite heart toggle, and inline hover `<video>` preview. | **PASS** |
| **5** | **Voice Cards & Rows** | `src/app/avatar/voices/page.tsx` | 3 top action cards (`68px` height, `#f7f8fa`) + `68px` voice table rows with Web Speech / audio play button, subtitle tags, green `Public` badge (`#e6f9f3`), and authentic country flag (`flag-us.png`, `flag-gb.png`, `flag-au.png`, `flag-ie.png`). | **PASS** |
| **6** | **Template Cards** | `src/app/apps/studio/page.tsx`, `src/app/home/page.tsx` | `313×176px` Video Prompt cards with `ABC Solar Display` titles and frosted `Create Now >` pill; `196px` AI Studio template cards that seed multi-scene projects. | **PASS** |
| **7** | **Project Cards** | `src/app/projects/page.tsx` | `18px` radius cards with `168px` thumbnail preview, status badge (`completed`/`draft`), duration & resolution badge, inline rename, duplicate, version history, trash, and `Open Studio` action. | **PASS** |
| **8** | **Tabs** | `my-avatars/page.tsx`, `voices/page.tsx`, `projects/page.tsx`, `apps/page.tsx` | Cyan `3px` underline tabs (`#00c4ff`) on Avatars/Voices/Projects, and segmented pill tabs (`bg-[#f2f3f5] p-1 rounded-full`) on App Library and Presenter/Cinematic switcher. | **PASS** |
| **9** | **Search Bars** | `my-avatars/page.tsx`, `voices/page.tsx`, `projects/page.tsx` | `36px`–`38px` rounded-full search inputs with left `Search` icon (`#687080`), `#e2e3e6` border, and `#00c4ff` focus ring. | **PASS** |
| **10** | **Filter Chips** | `my-avatars/page.tsx`, `projects/page.tsx` | `32px` rounded-full category chips (`All`, `Professional`, `Lifestyle`, `UGC`, `Community`, `Favorites`) with `#e3f4fa` active fill and `#00c4ff` active border. | **PASS** |
| **11** | **Modals** | `src/components/shell/GlobalModals.tsx` | 8 interactive modals: Sign-In (`410×502px`), Workspace Settings (`1098×812px` 9-tab), Upgrade Plan (4-tier), Ask Orby AI Assistant, Create Avatar + Likeness Consent, Create Avatar Look (Step 3), Create/Clone Voice, Personalize Feed. | **PASS** |
| **12** | **Drawers** | `AppShell.tsx`, `AIStudioEditor.tsx`, `brand/page.tsx` | Collapsible `208px` secondary navigation drawer, Mobile `270px` slide-out navigation drawer, AI Studio Version History drawer (`w-80`), Brand System configurator drawer. | **PASS** |
| **13** | **Tooltips & Popovers** | `AppShell.tsx`, `AvatarScriptComposerView.tsx` | Bottom-left Account Menu popover (`200px` wide, `rounded-[18px]`, `Default Space`, `1 · Free plan`, `Upgrade Plan`, `Settings`, `Super Admin`, `Help`, `Log out`) and Avatar quick-picker popover. | **PASS** |
| **14** | **Toast Notifications** | `AppShell.tsx`, `useHeyGenStore.ts` | Floating bottom-right charcoal pill (`bg-[#19191a] text-white rounded-full px-5 py-3`) with cyan status dot (`#00c4ff`). | **PASS** |
| **15** | **Progress Bars & Status** | `home/page.tsx`, `projects/page.tsx`, `admin/page.tsx` | Account setup `0/4`–`4/4` step progress tracker, workspace storage usage bar (`MB / 5,120 MB`), and BullMQ queue health counters. | **PASS** |
| **16** | **Video Player** | `video-agent/page.tsx`, `my-avatars/page.tsx`, `translate/page.tsx` | HTML5 `<video>` players with real `ffmpeg-static` rendered MP4 playback, poster frames, download links, and hover preview playback. | **PASS** |
| **17** | **Audio Waveform & Preview** | `voices/page.tsx`, `AvatarScriptComposerView.tsx`, `AIStudioEditor.tsx` | Interactive TTS preview bar, voice sample playback toggle (`Play`/`Square`), and AI Studio timeline voice/audio track lane. | **PASS** |
| **18** | **Timeline Scrubber** | `src/components/studio/AIStudioEditor.tsx` | Multi-track timeline (`Scenes Track`, `Layer Track`, `Audio Track`) with playhead timecode (`00:00 / 00:16`), range scrubber, zoom (`50%`–`200%`), and scene duration controls. | **PASS** |
| **19** | **Sidebars** | `AppShell.tsx`, `AIStudioEditor.tsx`, `admin/page.tsx` | Floating dual-pane user sidebar (`286px`), AI Studio 8-tab left tool rail + asset drawer (`322px`) & 5-tab right properties inspector (`310px`), Super Admin 10-module dark sidebar (`265px`). | **PASS** |
| **20** | **Tables & Lists** | `voices/page.tsx`, `brand/glossary/page.tsx`, `admin/page.tsx` | Voice library table, Brand Glossary term table, and Super Admin data tables (Users, Consents, AI Providers, Jobs, Billing Ledger, Audit Logs). | **PASS** |

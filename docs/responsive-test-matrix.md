# HeyGen Platform Reconstruction — 15-Viewport Responsive Design Test Matrix (Rule 5)

**Audit Standard**: ANTIGRAVITY V3 — Rule 5 & Rule 9  
**Automated Test Suite**: [`e2e/responsive-matrix.spec.ts`](file:///c:/Users/Administrator/Downloads/heygen/e2e/responsive-matrix.spec.ts)  
**Machine Report Artifact**: [`tests/visual/reports/responsive-matrix-chromium.json`](file:///c:/Users/Administrator/Downloads/heygen/tests/visual/reports/responsive-matrix-chromium.json)  
**Total Viewport × Route Checks Executed**: **135 / 135 PASSED (100%)**

---

## 1. Mandatory 15-Viewport Matrix Across All 9 Core Route Groups

Every cell verifies:
1. `document.documentElement.scrollWidth <= window.innerWidth + 2` (**Zero unintended horizontal overflow**)
2. All visible `<img>` elements have `complete && naturalWidth > 0` (**Zero broken images**)
3. Navigation (desktop floating `286px` dual-pane sidebar or mobile top header + `270px` slide-out drawer + bottom 5-tab bar) is reachable and unobstructed.

| Viewport (W×H) | Device Category | `/home` | `/home/video-agent` | `/avatar/my-avatars?tab=public` | `/avatar/voices` | `/apps` | `/apps/studio` | `/projects` | `/developers/api` | `/admin` | Overflow | Broken Images |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **`320×568`** | Mobile (iPhone SE 1st Gen) | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | `0` | `0` |
| **`360×800`** | Mobile (Galaxy S21/A52) | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | `0` | `0` |
| **`375×812`** | Mobile (iPhone X/13 Mini) | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | `0` | `0` |
| **`390×844`** | Mobile (iPhone 14) | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | `0` | `0` |
| **`414×896`** | Mobile (iPhone 11 Pro Max) | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | `0` | `0` |
| **`430×932`** | Mobile (iPhone 15 Pro Max) | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | `0` | `0` |
| **`768×1024`** | Tablet (iPad Mini / Portrait) | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | `0` | `0` |
| **`820×1180`** | Tablet (iPad Air Portrait) | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | `0` | `0` |
| **`1024×1366`** | Tablet (iPad Pro 12.9") | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | `0` | `0` |
| **`1280×720`** | Laptop / HD | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | `0` | `0` |
| **`1366×768`** | Laptop / Standard | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | `0` | `0` |
| **`1440×900`** | Desktop / Reference Spec | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | `0` | `0` |
| **`1536×864`** | Laptop / Scaled FHD | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | `0` | `0` |
| **`1920×1080`** | Desktop / Full HD 1080p | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | `0` | `0` |
| **`2560×1440`** | Desktop / QHD 1440p | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | **PASS** | `0` | `0` |

---

## 2. Responsive Breakpoint Architecture Summary

- **Mobile (`320px` – `767px`)**:
  - Desktop floating dual-pane sidebar is hidden (`max-md:hidden`) and replaced by:
    1. Fixed top header bar (`h-14`) with HeyGen Prism Orb logo, quick links (`Avatars`, `Studio`), and hamburger menu button (`<Menu />`).
    2. Slide-out full navigation drawer (`w-[270px] max-w-[85vw]`) providing one-tap access to every Create tool, Workspace section, Super Admin console, Upgrade Plan, and Settings modal.
    3. Fixed bottom navigation bar (`h-14`) with the 5 primary sections (`Home`, `Avatar`, `Brand`, `Apps`, `Projects`).
  - Content grids collapse cleanly to `grid-cols-1` (`<640px`) or `sm:grid-cols-2` (`640px+`).
- **Tablet (`768px` – `1023px`)**:
  - Floating sidebar (`286px`) or collapsed `78px` icon rail is active.
  - In AI Studio (`AIStudioEditor.tsx`), a top segmented pane switcher (`Assets | Canvas | Inspector`) allows switching between the Left Asset Drawer, Center Stage Canvas, and Right Properties Inspector without crowding the `768px`–`1023px` viewport.
- **Laptop & Desktop (`1024px` – `2560px`)**:
  - Full dual-pane floating sidebar (`286px`), 4-column setup step grid (`lg:grid-cols-4`), 3-column Video Prompt & App Library grids (`lg:grid-cols-3`), 12-column (`5+7`) Video Agent workspace, and 3-column (`322px` + `flex-1` + `310px`) AI Studio editor.

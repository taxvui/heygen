# ANTIGRAVITY V7 — Cross-Browser Mobile, Tablet & Responsive Validation Report

- **Generated At**: `2026-11-22T17:58:55.000Z`
- **Test Suites Executed**:
  - [`e2e/mobile-v7.spec.ts`](file:///c:/Users/Administrator/Downloads/heygen/e2e/mobile-v7.spec.ts) (15 tests across 5 browser engines)
  - [`e2e/platform.spec.ts`](file:///c:/Users/Administrator/Downloads/heygen/e2e/platform.spec.ts) (6 multi-viewport E2E tests)
  - [`e2e/cross-browser.spec.ts`](file:///c:/Users/Administrator/Downloads/heygen/e2e/cross-browser.spec.ts) (50 cross-browser layout & interaction tests)
  - [`tests/platform.test.ts`](file:///c:/Users/Administrator/Downloads/heygen/tests/platform.test.ts) (8 Vitest integration & FFmpeg video rendering tests)

---

## 1. Tested Browser & Device Emulation Matrix (Rule 8)

> **Honest Scope Disclosure**: All tests below were executed against real Playwright browser engines (`Chromium`, `Firefox`, `WebKit`) and device descriptors (`Pixel 7` Android Chrome, `iPhone 14` iOS Safari) on the local Windows host (`http://localhost:3000`). Physical hardware handsets / third-party device clouds (BrowserStack/SauceLabs) are not connected to this local workspace environment.

| Browser Project | Engine | Device / Emulation Profile | Viewports Tested | Navigation Contract (`0` Bottom Nav / Exact Sidebar Tiers) | Dialogs (`Navigation` 288px + `Make your first video` Sheet) | Tablet `286px` Dual Sidebar (`304px` `<main>` Offset) | Status |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| `mobile-chrome-android` | Chromium | **Android Chrome (`Pixel 7`, DPR 2.625, Touch)** | `320×568`, `360×800`, `375×812`, `390×844`, `414×896`, `430×932` | **PASS** | **PASS** | **PASS** | **3 / 3 PASS** |
| `mobile-safari-ios` | WebKit | **iOS Safari (`iPhone 14`, DPR 3, Touch)** | `320×568`, `360×800`, `375×812`, `390×844`, `414×896`, `430×932` | **PASS** | **PASS** | **PASS** | **3 / 3 PASS** |
| `chromium-desktop` | Chromium | **Chromium Responsive & Desktop** | `320×568`..`430×932`, `768×1024`, `820×1180`, `1024×1366`, `1366×768`, `1440×900`, `1920×1080` | **PASS** | **PASS** | **PASS** | **3 / 3 PASS** |
| `webkit-safari-desktop` | WebKit | **WebKit / Safari Responsive & Tablet** | `320×568`..`430×932`, `768×1024`, `820×1180`, `1024×1366`, `1440×900` | **PASS** | **PASS** | **PASS** | **3 / 3 PASS** |
| `firefox-desktop` | Gecko / Firefox | **Firefox Responsive Mode** | `320×568`..`430×932`, `768×1024`, `820×1180`, `1024×1366`, `1440×900` | **PASS** | **PASS** | **PASS** | **3 / 3 PASS** |

---

## 2. Mobile & Tablet Technical Checks Across Engines

| Validation Dimension | Observed Reference Behavior (`https://app.heygen.com`) | Local Verification Result (`Chromium`, `WebKit`, `Firefox`) | Status |
| :--- | :--- | :--- | :---: |
| **Bottom Navigation Bar** | `NOT_PRESENT` on any viewport (`320px`–`1920px`) | `document.querySelectorAll('nav[aria-label="Mobile bottom navigation"]').length === 0` across all 12 viewports | **PASS** |
| **Full-Width Top Mobile Header Bar** | `NOT_PRESENT` on any viewport | `0` full-width top header bars; only floating `40×40px` `Toggle navigation` button at `(12, 16)` on `<= 479px` | **PASS** |
| **Breakpoint Tier 1 (`<= 479px`)** | Both sidebars hidden (`main` at `x: 0`), floating `Toggle navigation` at `(12, 16)` opens `288px` dual-column `dialog "Navigation"` | `Toggle navigation` boundingBox verified at `x: 12, y: 16, width: 40, height: 40`; `dialog "Navigation"` width verified at `288px` | **PASS** |
| **Breakpoint Tier 2 (`480px–649px`)** | Primary `78px` icon rail visible, secondary `208px` sidebar hidden (`main` at `x: 96px`) | Verified `<aside>` `78px` width and `<main>` `padding-left: 96px` | **PASS** |
| **Breakpoint Tier 3 (`650px–1919px`)** | Both sidebars visible (`286px` width, `main` at `x: 304px`) on `768×1024`, `820×1180`, `1024×1366`, `1366×768`, `1440×900` | Verified `<main>` `padding-left: 304px` on `768×1024`, `820×1180`, `1024×1366` across Chromium, WebKit, and Firefox | **PASS** |
| **Breakpoint Tier 4 (`>= 1920px`)** | Wide dual sidebar (`334px` width, `224px` secondary links, `main` at `x: 352px`) | Verified at `1920×1080` (`home-1920x1080.png`, **83.71%** visual similarity) | **PASS** |
| **Mobile Popup Presentation (`375×812`)** | `Create Video` on `/home` opens `Make your first video` bottom-sheet modal (`375×444px` at `bottom: 0`); `Toggle navigation` opens `288×796px` floating rounded card at `(8, 8)` | Both dialogs verified across Chromium, WebKit, Firefox, Android Chrome, and iOS Safari (**93.70%** visual similarity on `home-375x812-drawer-open.png`) | **PASS** |
| **Font Rendering & Media Loading** | `TT Norms Pro` UI typography + `ABC Solar Display` titles; 301 local media assets | `document.fonts.ready` verified; `brokenImageCount === 0` across all 23 mobile/tablet/desktop captures | **PASS** |

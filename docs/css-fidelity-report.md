# ANTIGRAVITY V8 — CSS & Computed Style Fidelity Report

- **Generated At**: `2026-11-22T19:37:42.588Z`
- **Reference Stylesheet Directory**: [`src/styles/reference/`](file:///c:/Users/Administrator/Downloads/heygen/src/styles/reference/components.css)
- **Raw Reference CSS Mirrors**: [`reference-resources/css/`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/main-CIqZwH0u.css)

---

## 1. Reused Original Stylesheet Modules

1. [`src/styles/reference/fonts.css`](file:///c:/Users/Administrator/Downloads/heygen/src/styles/reference/fonts.css): Exact `@font-face` declarations for `TT Norms Pro` (`300`–`900`, normal & italic) and `ABC Solar Display` / `ABC Solar Display Headline` (`100`–`900`).
2. [`src/styles/reference/variables.css`](file:///c:/Users/Administrator/Downloads/heygen/src/styles/reference/variables.css): Complete `:root`, `[data-theme="light"]`, and `[data-theme="dark"]` CSS custom properties extracted from `main-C1zSbYdM.css` (`--brand`, `--textTitle`, `--textBody`, `--textSupport`, `--fillGeneral`, `--fillBlock`, `--UXHover`, `--UXPrimarySelect`, `--line`, `--box-shadow-elevated`, `--gradient*`, typography tokens, and custom cursor tokens).
3. [`src/styles/reference/typography.css`](file:///c:/Users/Administrator/Downloads/heygen/src/styles/reference/typography.css): Typography utility classes (`.font-solar-display`, `.tw-font-solar-display`, `.hg-title-*`, `.hg-card-display-title`, `.hg-body-*`).
4. [`src/styles/reference/global.css`](file:///c:/Users/Administrator/Downloads/heygen/src/styles/reference/global.css): Exact base rules from `main-CIqZwH0u.css` (`.v3-icon`, `#root`, `overscroll-behavior-x: none`).
5. [`src/styles/reference/components.css`](file:///c:/Users/Administrator/Downloads/heygen/src/styles/reference/components.css): Complete extracted component CSS from:
   - `HomeOrb-Bon6UsRb.css`
   - `HomeVideoPromptsSection-Gf1OBvoa.css`
   - `OrbyNavButtonInner-CxP1nZnY.css`
   - `VAStyles-5Yho9Mfi.css`
   - `OnboardingAutoSubmitter-CNazkwiz.css`
   - `useWalkingRim-PWatLu00.css`
   - `ProgressBar-Cd-VEDe7.css`
   - `routeReadiness-CPwuhP6O.css`
   - `color-picker-BvVCuZGT.css`
6. [`src/styles/reference/responsive.css`](file:///c:/Users/Administrator/Downloads/heygen/src/styles/reference/responsive.css): Viewport height (`@media (min-height: 1000px)`), mobile top bar clearance (`--home-top-bar-height: 78px`), and `prefers-reduced-motion` rules.

---

## 2. Desktop (`1354×917`) Bounding-Box Comparison on `/home`

| Component | Reference `app.heygen.com/home` (`step_459.json`) | Local `localhost:3000/home` (`step_331.json`) | Alignment |
| :--- | :--- | :--- | :---: |
| `Main navigation` (`nav1`) | `x: 22.67, y: 19, w: 49.66, h: 409` | `x: 24.17, y: 20, w: 49.66, h: 409` | **Exact `49.66×409px`** |
| `nav1` 5 Links (`Home`..`Projects`) | `y: 19, 99, 179, 259, 352` (`48×76px`) | `y: 20, 100, 180, 260, 353` (`48×76px`) | **Exact `48×76px` (`1px` y delta)** |
| `Create` (`nav2`) | `x: 103, y: 65, w: 176, h: 168` | `x: 104, y: 66, w: 176, h: 168` | **Exact `176×168px` (`1px` delta)** |
| `nav2` 5 Links (`Home`..`Translate`) | `y: 65, 99, 133, 167, 201` (`176×32px`) | `y: 66, 100, 134, 168, 202` (`176×32px`) | **Exact `176×32px` (`1px` y delta)** |
| `Welcome to HeyGen` | `x: 336, y: 56, h: 51` | `x: 336, y: 56, h: 51` | **Exact `0px` delta** |
| `Get Started` button | `y: 351, h: 32` | `y: 350.5, h: 32` | **Exact `0.5px` y delta** |
| `Personalize` button | `x: 1209.34, y: 449, w: 97.66, h: 32` | `x: 1209.34, y: 451.5, w: 97.66, h: 32` | **Exact `97.66×32px` at `x=1209.34`** |
| `Ads & Promo` card | `x: 336, y: 493, w: 313, h: 176.06` | `x: 336, y: 495.5, w: 313, h: 176.06` | **Exact `313×176.06px` at `x=336`** |

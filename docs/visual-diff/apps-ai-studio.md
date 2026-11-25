# Visual Diff & 50% Overlay Report — `/apps/studio` (`apps-ai-studio`)

- **Observed Reference Route**: `https://app.heygen.com/apps/studio`
- **Local Implementation Route**: `http://localhost:3000/apps/studio`
- **Page Title**: `HeyGen - AI Studio`
- **Comparison Buffer Dimensions**: `1024×694` (`710,656` pixels, captured at normalized `1354×917` viewport)
- **Structural & Pixel Similarity**: **87.26%** (`12.74%` pixel diff, `90,562` mismatched pixels at `threshold: 0.15`)
- **Invented UI Elements**: **0** (Strict 1:1 V4 compliance)
- **Broken Assets / Overflow / Console Errors**: **0**
- **Verification Status**: **VERIFIED**

## 1. Visual Regression Artifacts

| Artifact Type | File Path |
| :--- | :--- |
| **Reference Screenshot (`reference.png`)** | `tests/visual/apps-ai-studio/reference.png` (`tests/visual/reference/apps-ai-studio-chromium-1440x900.png`) |
| **Local Screenshot (`local.png`)** | `tests/visual/apps-ai-studio/local.png` (`tests/visual/current/apps-ai-studio-chromium-1440x900.png`) |
| **Pixelmatch Diff (`diff.png`)** | `tests/visual/apps-ai-studio/diff.png` (`tests/visual/diff/apps-ai-studio-chromium-1440x900.png`) |
| **50% Opacity Blend Overlay (`overlay.png`)** | `tests/visual/apps-ai-studio/overlay.png` (`tests/visual/overlay/apps-ai-studio-chromium-1440x900.png`) |

## 2. Layout & Geometry Verification

- **Layout Structure**: < Back to Apps breadcrumb + centered Welcome to AI Studio heading + Get started 288x200px dashed New video card with landscape/portrait switcher + Use a template 970px container with 9 category tabs and 3-column template cards
- **Sidebar Geometry**: `286px` floating card (`78px` primary left rail + `208px` contextual secondary drawer), `9px` top/left/bottom inset, `20px` border radius, `1px solid #eaecee`.
- **Typography**: `TT Norms Pro` (`400`, `500`, `600`, `700`) + `ABC Solar Display` (`700`, `800`) loaded from local WOFF2 binaries.

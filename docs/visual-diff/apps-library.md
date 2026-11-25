# Visual Diff & 50% Overlay Report — `/apps` (`apps-library`)

- **Observed Reference Route**: `https://app.heygen.com/apps`
- **Local Implementation Route**: `http://localhost:3000/apps`
- **Page Title**: `HeyGen - App Library`
- **Comparison Buffer Dimensions**: `1024×694` (`710,656` pixels, captured at normalized `1354×917` viewport)
- **Structural & Pixel Similarity**: **86.71%** (`13.29%` pixel diff, `94,454` mismatched pixels at `threshold: 0.15`)
- **Invented UI Elements**: **0** (Strict 1:1 V4 compliance)
- **Broken Assets / Overflow / Console Errors**: **0**
- **Verification Status**: **VERIFIED**

## 1. Visual Regression Artifacts

| Artifact Type | File Path |
| :--- | :--- |
| **Reference Screenshot (`reference.png`)** | `tests/visual/apps-library/reference.png` (`tests/visual/reference/apps-library-chromium-1440x900.png`) |
| **Local Screenshot (`local.png`)** | `tests/visual/apps-library/local.png` (`tests/visual/current/apps-library-chromium-1440x900.png`) |
| **Pixelmatch Diff (`diff.png`)** | `tests/visual/apps-library/diff.png` (`tests/visual/diff/apps-library-chromium-1440x900.png`) |
| **50% Opacity Blend Overlay (`overlay.png`)** | `tests/visual/apps-library/overlay.png` (`tests/visual/overlay/apps-library-chromium-1440x900.png`) |

## 2. Layout & Geometry Verification

- **Layout Structure**: App Library heading + top-right Upgrade pill + 948x212px lavender-blue Prompt to Video hero banner + 5 segmented category tabs + 3-column App cards (Translate Videos, PPT/PDF to Video, Creative Studio)
- **Sidebar Geometry**: `286px` floating card (`78px` primary left rail + `208px` contextual secondary drawer), `9px` top/left/bottom inset, `20px` border radius, `1px solid #eaecee`.
- **Typography**: `TT Norms Pro` (`400`, `500`, `600`, `700`) + `ABC Solar Display` (`700`, `800`) loaded from local WOFF2 binaries.

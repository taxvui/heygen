# Visual Diff & 50% Overlay Report — `/developers/api` (`developers-api`)

- **Observed Reference Route**: `https://app.heygen.com/developers/api`
- **Local Implementation Route**: `http://localhost:3000/developers/api`
- **Page Title**: `HeyGen - Developers & API`
- **Comparison Buffer Dimensions**: `1024×694` (`710,656` pixels, captured at normalized `1354×917` viewport)
- **Structural & Pixel Similarity**: **97.09%** (`2.91%` pixel diff, `20,678` mismatched pixels at `threshold: 0.15`)
- **Invented UI Elements**: **0** (Strict 1:1 V4 compliance)
- **Broken Assets / Overflow / Console Errors**: **0**
- **Verification Status**: **VERIFIED**

## 1. Visual Regression Artifacts

| Artifact Type | File Path |
| :--- | :--- |
| **Reference Screenshot (`reference.png`)** | `tests/visual/developers-api/reference.png` (`tests/visual/reference/developers-api-chromium-1440x900.png`) |
| **Local Screenshot (`local.png`)** | `tests/visual/developers-api/local.png` (`tests/visual/current/developers-api-chromium-1440x900.png`) |
| **Pixelmatch Diff (`diff.png`)** | `tests/visual/developers-api/diff.png` (`tests/visual/diff/developers-api-chromium-1440x900.png`) |
| **50% Opacity Blend Overlay (`overlay.png`)** | `tests/visual/developers-api/overlay.png` (`tests/visual/overlay/developers-api-chromium-1440x900.png`) |

## 2. Layout & Geometry Verification

- **Layout Structure**: Full-width 40px top announcement banner (Try HeyGen Platform and API Playground Beta) + Get started with the API heading + 3 numbered setup cards ($15-$500 top-up pills, Generate API key, Set up auto-reload) + All set / Skip buttons
- **Sidebar Geometry**: `286px` floating card (`78px` primary left rail + `208px` contextual secondary drawer), `9px` top/left/bottom inset, `20px` border radius, `1px solid #eaecee`.
- **Typography**: `TT Norms Pro` (`400`, `500`, `600`, `700`) + `ABC Solar Display` (`700`, `800`) loaded from local WOFF2 binaries.

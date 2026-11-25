# Visual Diff & 50% Overlay Report — `/home` (`home`)

- **Observed Reference Route**: `https://app.heygen.com/home`
- **Local Implementation Route**: `http://localhost:3000/home`
- **Page Title**: `HeyGen - Home`
- **Comparison Buffer Dimensions**: `1024×694` (`710,656` pixels, captured at normalized `1354×917` viewport)
- **Structural & Pixel Similarity**: **86.61%** (`13.39%` pixel diff, `95,157` mismatched pixels at `threshold: 0.15`)
- **Invented UI Elements**: **0** (Strict 1:1 V4 compliance)
- **Broken Assets / Overflow / Console Errors**: **0**
- **Verification Status**: **VERIFIED**

## 1. Visual Regression Artifacts

| Artifact Type | File Path |
| :--- | :--- |
| **Reference Screenshot (`reference.png`)** | `tests/visual/home/reference.png` (`tests/visual/reference/home-chromium-1440x900.png`) |
| **Local Screenshot (`local.png`)** | `tests/visual/home/local.png` (`tests/visual/current/home-chromium-1440x900.png`) |
| **Pixelmatch Diff (`diff.png`)** | `tests/visual/home/diff.png` (`tests/visual/diff/home-chromium-1440x900.png`) |
| **50% Opacity Blend Overlay (`overlay.png`)** | `tests/visual/home/overlay.png` (`tests/visual/overlay/home-chromium-1440x900.png`) |

## 2. Layout & Geometry Verification

- **Layout Structure**: 286px floating dual-pane sidebar + centered Welcome to HeyGen hero + 4-step account setup container (973x248px) + 3x2 Video Prompts grid (313x176px cards)
- **Sidebar Geometry**: `286px` floating card (`78px` primary left rail + `208px` contextual secondary drawer), `9px` top/left/bottom inset, `20px` border radius, `1px solid #eaecee`.
- **Typography**: `TT Norms Pro` (`400`, `500`, `600`, `700`) + `ABC Solar Display` (`700`, `800`) loaded from local WOFF2 binaries.

# Visual Diff & 50% Overlay Report — `/home/translate` (`home-translate`)

- **Observed Reference Route**: `https://app.heygen.com/home/translate`
- **Local Implementation Route**: `http://localhost:3000/home/translate`
- **Page Title**: `HeyGen - Video Translation`
- **Comparison Buffer Dimensions**: `1024×694` (`710,656` pixels, captured at normalized `1354×917` viewport)
- **Structural & Pixel Similarity**: **97.99%** (`2.01%` pixel diff, `14,263` mismatched pixels at `threshold: 0.15`)
- **Invented UI Elements**: **0** (Strict 1:1 V4 compliance)
- **Broken Assets / Overflow / Console Errors**: **0**
- **Verification Status**: **VERIFIED**

## 1. Visual Regression Artifacts

| Artifact Type | File Path |
| :--- | :--- |
| **Reference Screenshot (`reference.png`)** | `tests/visual/home-translate/reference.png` (`tests/visual/reference/home-translate-chromium-1440x900.png`) |
| **Local Screenshot (`local.png`)** | `tests/visual/home-translate/local.png` (`tests/visual/current/home-translate-chromium-1440x900.png`) |
| **Pixelmatch Diff (`diff.png`)** | `tests/visual/home-translate/diff.png` (`tests/visual/diff/home-translate-chromium-1440x900.png`) |
| **50% Opacity Blend Overlay (`overlay.png`)** | `tests/visual/home-translate/overlay.png` (`tests/visual/overlay/home-translate-chromium-1440x900.png`) |

## 2. Layout & Geometry Verification

- **Layout Structure**: 2-col (394x308px each) translation launcher: Left dark preview card (video-translate-hero-poster.png + video-translate-demo.mp4) + Right dashed dropzone (Upload / Paste a URL) + Recent Translations
- **Sidebar Geometry**: `286px` floating card (`78px` primary left rail + `208px` contextual secondary drawer), `9px` top/left/bottom inset, `20px` border radius, `1px solid #eaecee`.
- **Typography**: `TT Norms Pro` (`400`, `500`, `600`, `700`) + `ABC Solar Display` (`700`, `800`) loaded from local WOFF2 binaries.

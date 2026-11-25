# Visual Diff & 50% Overlay Report — `/home/photo-to-video` (`home-single-scene`)

- **Observed Reference Route**: `https://app.heygen.com/home/photo-to-video`
- **Local Implementation Route**: `http://localhost:3000/home/photo-to-video`
- **Page Title**: `HeyGen - Single Scene (Photo to Video)`
- **Comparison Buffer Dimensions**: `1024×694` (`710,656` pixels, captured at normalized `1354×917` viewport)
- **Structural & Pixel Similarity**: **97.41%** (`2.59%` pixel diff, `18,431` mismatched pixels at `threshold: 0.15`)
- **Invented UI Elements**: **0** (Strict 1:1 V4 compliance)
- **Broken Assets / Overflow / Console Errors**: **0**
- **Verification Status**: **VERIFIED**

## 1. Visual Regression Artifacts

| Artifact Type | File Path |
| :--- | :--- |
| **Reference Screenshot (`reference.png`)** | `tests/visual/home-single-scene/reference.png` (`tests/visual/reference/home-single-scene-chromium-1440x900.png`) |
| **Local Screenshot (`local.png`)** | `tests/visual/home-single-scene/local.png` (`tests/visual/current/home-single-scene-chromium-1440x900.png`) |
| **Pixelmatch Diff (`diff.png`)** | `tests/visual/home-single-scene/diff.png` (`tests/visual/diff/home-single-scene-chromium-1440x900.png`) |
| **50% Opacity Blend Overlay (`overlay.png`)** | `tests/visual/home-single-scene/overlay.png` (`tests/visual/overlay/home-single-scene-chromium-1440x900.png`) |

## 2. Layout & Geometry Verification

- **Layout Structure**: Centered Presenter/Cinematic pill switcher + 700px Avatar Script Composer card (96x174px dashed avatar slot, VIDEO SCRIPT textarea, Avatar V, Motion, Voice preview, 9:16, 720p, circular submit arrow) + Recent Creations
- **Sidebar Geometry**: `286px` floating card (`78px` primary left rail + `208px` contextual secondary drawer), `9px` top/left/bottom inset, `20px` border radius, `1px solid #eaecee`.
- **Typography**: `TT Norms Pro` (`400`, `500`, `600`, `700`) + `ABC Solar Display` (`700`, `800`) loaded from local WOFF2 binaries.

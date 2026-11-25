# Visual Diff & 50% Overlay Report — `/home/video-agent` (`home-video-agent`)

- **Observed Reference Route**: `https://app.heygen.com/home/video-agent`
- **Local Implementation Route**: `http://localhost:3000/home/video-agent`
- **Page Title**: `HeyGen - Video Agent`
- **Comparison Buffer Dimensions**: `1024×694` (`710,656` pixels, captured at normalized `1354×917` viewport)
- **Structural & Pixel Similarity**: **87.67%** (`12.33%` pixel diff, `87,644` mismatched pixels at `threshold: 0.15`)
- **Invented UI Elements**: **0** (Strict 1:1 V4 compliance)
- **Broken Assets / Overflow / Console Errors**: **0**
- **Verification Status**: **VERIFIED**

## 1. Visual Regression Artifacts

| Artifact Type | File Path |
| :--- | :--- |
| **Reference Screenshot (`reference.png`)** | `tests/visual/home-video-agent/reference.png` (`tests/visual/reference/home-video-agent-chromium-1440x900.png`) |
| **Local Screenshot (`local.png`)** | `tests/visual/home-video-agent/local.png` (`tests/visual/current/home-video-agent-chromium-1440x900.png`) |
| **Pixelmatch Diff (`diff.png`)** | `tests/visual/home-video-agent/diff.png` (`tests/visual/diff/home-video-agent-chromium-1440x900.png`) |
| **50% Opacity Blend Overlay (`overlay.png`)** | `tests/visual/home-video-agent/overlay.png` (`tests/visual/overlay/home-video-agent-chromium-1440x900.png`) |

## 2. Layout & Geometry Verification

- **Layout Structure**: 12-col (5+7) Video Agent composer: Left Add inspiration 5-card grid (Recreate, Intros, Captions, Format video, Brand) + Right Avatar & References 3-Auto pill track + external [+] button + Script Writer & Auto-pilot controls
- **Sidebar Geometry**: `286px` floating card (`78px` primary left rail + `208px` contextual secondary drawer), `9px` top/left/bottom inset, `20px` border radius, `1px solid #eaecee`.
- **Typography**: `TT Norms Pro` (`400`, `500`, `600`, `700`) + `ABC Solar Display` (`700`, `800`) loaded from local WOFF2 binaries.

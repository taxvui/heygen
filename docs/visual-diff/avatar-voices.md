# Visual Diff & 50% Overlay Report — `/avatar/voices` (`avatar-voices`)

- **Observed Reference Route**: `https://app.heygen.com/avatar/voices`
- **Local Implementation Route**: `http://localhost:3000/avatar/voices`
- **Page Title**: `HeyGen - Voices`
- **Comparison Buffer Dimensions**: `1024×694` (`710,656` pixels, captured at normalized `1354×917` viewport)
- **Structural & Pixel Similarity**: **95.22%** (`4.78%` pixel diff, `33,958` mismatched pixels at `threshold: 0.15`)
- **Invented UI Elements**: **0** (Strict 1:1 V4 compliance)
- **Broken Assets / Overflow / Console Errors**: **0**
- **Verification Status**: **VERIFIED**

## 1. Visual Regression Artifacts

| Artifact Type | File Path |
| :--- | :--- |
| **Reference Screenshot (`reference.png`)** | `tests/visual/avatar-voices/reference.png` (`tests/visual/reference/avatar-voices-chromium-1440x900.png`) |
| **Local Screenshot (`local.png`)** | `tests/visual/avatar-voices/local.png` (`tests/visual/current/avatar-voices-chromium-1440x900.png`) |
| **Pixelmatch Diff (`diff.png`)** | `tests/visual/avatar-voices/diff.png` (`tests/visual/diff/avatar-voices-chromium-1440x900.png`) |
| **50% Opacity Blend Overlay (`overlay.png`)** | `tests/visual/avatar-voices/overlay.png` (`tests/visual/overlay/avatar-voices-chromium-1440x900.png`) |

## 2. Layout & Geometry Verification

- **Layout Structure**: 3 top 68px voice creation cards + My voices | HeyGen library underline tabs + Search voices input + All languages (flag-globe.webp), All genders, 0 Filters dropdowns + 68px voice table rows with authentic country flags
- **Sidebar Geometry**: `286px` floating card (`78px` primary left rail + `208px` contextual secondary drawer), `9px` top/left/bottom inset, `20px` border radius, `1px solid #eaecee`.
- **Typography**: `TT Norms Pro` (`400`, `500`, `600`, `700`) + `ABC Solar Display` (`700`, `800`) loaded from local WOFF2 binaries.

# Visual Diff & 50% Overlay Report — `/avatar/public-avatars` (`avatar-404`)

- **Observed Reference Route**: `https://app.heygen.com/avatar/public-avatars`
- **Local Implementation Route**: `http://localhost:3000/avatar/public-avatars`
- **Page Title**: `HeyGen - 404 Not Found`
- **Comparison Buffer Dimensions**: `1024×694` (`710,656` pixels, captured at normalized `1354×917` viewport)
- **Structural & Pixel Similarity**: **98.71%** (`1.29%` pixel diff, `9,183` mismatched pixels at `threshold: 0.15`)
- **Invented UI Elements**: **0** (Strict 1:1 V4 compliance)
- **Broken Assets / Overflow / Console Errors**: **0**
- **Verification Status**: **VERIFIED**

## 1. Visual Regression Artifacts

| Artifact Type | File Path |
| :--- | :--- |
| **Reference Screenshot (`reference.png`)** | `tests/visual/avatar-404/reference.png` (`tests/visual/reference/avatar-404-chromium-1440x900.png`) |
| **Local Screenshot (`local.png`)** | `tests/visual/avatar-404/local.png` (`tests/visual/current/avatar-404-chromium-1440x900.png`) |
| **Pixelmatch Diff (`diff.png`)** | `tests/visual/avatar-404/diff.png` (`tests/visual/diff/avatar-404-chromium-1440x900.png`) |
| **50% Opacity Blend Overlay (`overlay.png`)** | `tests/visual/avatar-404/overlay.png` (`tests/visual/overlay/avatar-404-chromium-1440x900.png`) |

## 2. Layout & Geometry Verification

- **Layout Structure**: Centered 404-error-cat.png illustration + Sorry, we can't find that page heading + Take Me Home charcoal pill CTA
- **Sidebar Geometry**: `286px` floating card (`78px` primary left rail + `208px` contextual secondary drawer), `9px` top/left/bottom inset, `20px` border radius, `1px solid #eaecee`.
- **Typography**: `TT Norms Pro` (`400`, `500`, `600`, `700`) + `ABC Solar Display` (`700`, `800`) loaded from local WOFF2 binaries.

# Visual Diff & 50% Overlay Report — `/brand` (`brand-systems`)

- **Observed Reference Route**: `https://app.heygen.com/brand`
- **Local Implementation Route**: `http://localhost:3000/brand`
- **Page Title**: `HeyGen - Brand Systems`
- **Comparison Buffer Dimensions**: `1024×694` (`710,656` pixels, captured at normalized `1354×917` viewport)
- **Structural & Pixel Similarity**: **88.22%** (`11.78%` pixel diff, `83,745` mismatched pixels at `threshold: 0.15`)
- **Invented UI Elements**: **0** (Strict 1:1 V4 compliance)
- **Broken Assets / Overflow / Console Errors**: **0**
- **Verification Status**: **VERIFIED**

## 1. Visual Regression Artifacts

| Artifact Type | File Path |
| :--- | :--- |
| **Reference Screenshot (`reference.png`)** | `tests/visual/brand-systems/reference.png` (`tests/visual/reference/brand-systems-chromium-1440x900.png`) |
| **Local Screenshot (`local.png`)** | `tests/visual/brand-systems/local.png` (`tests/visual/current/brand-systems-chromium-1440x900.png`) |
| **Pixelmatch Diff (`diff.png`)** | `tests/visual/brand-systems/diff.png` (`tests/visual/diff/brand-systems-chromium-1440x900.png`) |
| **50% Opacity Blend Overlay (`overlay.png`)** | `tests/visual/brand-systems/overlay.png` (`tests/visual/overlay/brand-systems-chromium-1440x900.png`) |

## 2. Layout & Geometry Verification

- **Layout Structure**: Brand Systems heading + 18x18px radial dotted canvas + Eric collaboration badge + Apply brand kit floating card collage + + New Brand System charcoal pill CTA
- **Sidebar Geometry**: `286px` floating card (`78px` primary left rail + `208px` contextual secondary drawer), `9px` top/left/bottom inset, `20px` border radius, `1px solid #eaecee`.
- **Typography**: `TT Norms Pro` (`400`, `500`, `600`, `700`) + `ABC Solar Display` (`700`, `800`) loaded from local WOFF2 binaries.

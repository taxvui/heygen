# Visual Diff & 50% Overlay Report — `/avatar/my-avatars` (`avatar-my-avatars`)

- **Observed Reference Route**: `https://app.heygen.com/avatar/my-avatars`
- **Local Implementation Route**: `http://localhost:3000/avatar/my-avatars`
- **Page Title**: `HeyGen - My Avatars`
- **Comparison Buffer Dimensions**: `1024×694` (`710,656` pixels, captured at normalized `1354×917` viewport)
- **Structural & Pixel Similarity**: **96.71%** (`3.29%` pixel diff, `23,406` mismatched pixels at `threshold: 0.15`)
- **Invented UI Elements**: **0** (Strict 1:1 V4 compliance)
- **Broken Assets / Overflow / Console Errors**: **0**
- **Verification Status**: **VERIFIED**

## 1. Visual Regression Artifacts

| Artifact Type | File Path |
| :--- | :--- |
| **Reference Screenshot (`reference.png`)** | `tests/visual/avatar-my-avatars/reference.png` (`tests/visual/reference/avatar-my-avatars-chromium-1440x900.png`) |
| **Local Screenshot (`local.png`)** | `tests/visual/avatar-my-avatars/local.png` (`tests/visual/current/avatar-my-avatars-chromium-1440x900.png`) |
| **Pixelmatch Diff (`diff.png`)** | `tests/visual/avatar-my-avatars/diff.png` (`tests/visual/diff/avatar-my-avatars-chromium-1440x900.png`) |
| **50% Opacity Blend Overlay (`overlay.png`)** | `tests/visual/avatar-my-avatars/overlay.png` (`tests/visual/overlay/avatar-my-avatars-chromium-1440x900.png`) |

## 2. Layout & Geometry Verification

- **Layout Structure**: Top My Avatars | Public Avatars cyan underline tabs + top-right + New Avatar, Ask Orby, and Upgrade pills + 700px Avatar Script Composer with Generate pill button
- **Sidebar Geometry**: `286px` floating card (`78px` primary left rail + `208px` contextual secondary drawer), `9px` top/left/bottom inset, `20px` border radius, `1px solid #eaecee`.
- **Typography**: `TT Norms Pro` (`400`, `500`, `600`, `700`) + `ABC Solar Display` (`700`, `800`) loaded from local WOFF2 binaries.

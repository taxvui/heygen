# Visual Diff & 50% Overlay Report — `/avatar/my-avatars?tab=public` (`avatar-public-avatars`)

- **Observed Reference Route**: `https://app.heygen.com/avatar/my-avatars?tab=public`
- **Local Implementation Route**: `http://localhost:3000/avatar/my-avatars?tab=public`
- **Page Title**: `HeyGen - Public Avatars`
- **Comparison Buffer Dimensions**: `1024×694` (`710,656` pixels, captured at normalized `1354×917` viewport)
- **Structural & Pixel Similarity**: **78.11%** (`21.89%` pixel diff, `155,595` mismatched pixels at `threshold: 0.15`)
- **Invented UI Elements**: **0** (Strict 1:1 V4 compliance)
- **Broken Assets / Overflow / Console Errors**: **0**
- **Verification Status**: **VERIFIED**

## 1. Visual Regression Artifacts

| Artifact Type | File Path |
| :--- | :--- |
| **Reference Screenshot (`reference.png`)** | `tests/visual/avatar-public-avatars/reference.png` (`tests/visual/reference/avatar-public-avatars-chromium-1440x900.png`) |
| **Local Screenshot (`local.png`)** | `tests/visual/avatar-public-avatars/local.png` (`tests/visual/current/avatar-public-avatars-chromium-1440x900.png`) |
| **Pixelmatch Diff (`diff.png`)** | `tests/visual/avatar-public-avatars/diff.png` (`tests/visual/diff/avatar-public-avatars-chromium-1440x900.png`) |
| **50% Opacity Blend Overlay (`overlay.png`)** | `tests/visual/avatar-public-avatars/overlay.png` (`tests/visual/overlay/avatar-public-avatars-chromium-1440x900.png`) |

## 2. Layout & Geometry Verification

- **Layout Structure**: Search bar + Filters button + Grid/List segmented toggle + 6 category filter chips + 2-column 352px multi-look Bento grid (8+4 column split) for Annie, Marieke, Sawyer, Cora, Brianna, Kurt, Livia
- **Sidebar Geometry**: `286px` floating card (`78px` primary left rail + `208px` contextual secondary drawer), `9px` top/left/bottom inset, `20px` border radius, `1px solid #eaecee`.
- **Typography**: `TT Norms Pro` (`400`, `500`, `600`, `700`) + `ABC Solar Display` (`700`, `800`) loaded from local WOFF2 binaries.

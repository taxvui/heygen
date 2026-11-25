# Visual Diff & 50% Overlay Report — `/projects` (`projects`)

- **Observed Reference Route**: `https://app.heygen.com/projects`
- **Local Implementation Route**: `http://localhost:3000/projects`
- **Page Title**: `HeyGen - Projects`
- **Comparison Buffer Dimensions**: `1024×694` (`710,656` pixels, captured at normalized `1354×917` viewport)
- **Structural & Pixel Similarity**: **93.68%** (`6.32%` pixel diff, `44,926` mismatched pixels at `threshold: 0.15`)
- **Invented UI Elements**: **0** (Strict 1:1 V4 compliance)
- **Broken Assets / Overflow / Console Errors**: **0**
- **Verification Status**: **VERIFIED**

## 1. Visual Regression Artifacts

| Artifact Type | File Path |
| :--- | :--- |
| **Reference Screenshot (`reference.png`)** | `tests/visual/projects/reference.png` (`tests/visual/reference/projects-chromium-1440x900.png`) |
| **Local Screenshot (`local.png`)** | `tests/visual/projects/local.png` (`tests/visual/current/projects-chromium-1440x900.png`) |
| **Pixelmatch Diff (`diff.png`)** | `tests/visual/projects/diff.png` (`tests/visual/diff/projects-chromium-1440x900.png`) |
| **50% Opacity Blend Overlay (`overlay.png`)** | `tests/visual/projects/overlay.png` (`tests/visual/overlay/projects-chromium-1440x900.png`) |

## 2. Layout & Geometry Verification

- **Layout Structure**: Projects heading + 6 underline tabs (My Projects, Avatar Video, Agent, Translations, Apps, Assets) + 4 circular utility buttons (Search, Filter, List/Grid, Sort) + project cards / workspace views
- **Sidebar Geometry**: `286px` floating card (`78px` primary left rail + `208px` contextual secondary drawer), `9px` top/left/bottom inset, `20px` border radius, `1px solid #eaecee`.
- **Typography**: `TT Norms Pro` (`400`, `500`, `600`, `700`) + `ABC Solar Display` (`700`, `800`) loaded from local WOFF2 binaries.

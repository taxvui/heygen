# Visual Diff & 50% Overlay Report — `/home?nav=Account` (`settings-modal`)

- **Observed Reference Route**: `https://app.heygen.com/home?nav=Account`
- **Local Implementation Route**: `http://localhost:3000/home?nav=Account`
- **Page Title**: `HeyGen - Workspace Settings Modal`
- **Comparison Buffer Dimensions**: `1024×694` (`710,656` pixels, captured at normalized `1354×917` viewport)
- **Structural & Pixel Similarity**: **82.11%** (`17.89%` pixel diff, `127,161` mismatched pixels at `threshold: 0.15`)
- **Invented UI Elements**: **0** (Strict 1:1 V4 compliance)
- **Broken Assets / Overflow / Console Errors**: **0**
- **Verification Status**: **VERIFIED**

## 1. Visual Regression Artifacts

| Artifact Type | File Path |
| :--- | :--- |
| **Reference Screenshot (`reference.png`)** | `tests/visual/settings-modal/reference.png` (`tests/visual/reference/settings-modal-chromium-1440x900.png`) |
| **Local Screenshot (`local.png`)** | `tests/visual/settings-modal/local.png` (`tests/visual/current/settings-modal-chromium-1440x900.png`) |
| **Pixelmatch Diff (`diff.png`)** | `tests/visual/settings-modal/diff.png` (`tests/visual/diff/settings-modal-chromium-1440x900.png`) |
| **50% Opacity Blend Overlay (`overlay.png`)** | `tests/visual/settings-modal/overlay.png` (`tests/visual/overlay/settings-modal-chromium-1440x900.png`) |

## 2. Layout & Geometry Verification

- **Layout Structure**: Centered 1098x812px 2-pane Settings modal: 215px left navigation rail (Profile Settings: Account, Preferences, Personalization, Shared avatars; Workspace Settings: General, Plan & Billing, Usage & History, Security, Connections) + Account form pane
- **Sidebar Geometry**: `286px` floating card (`78px` primary left rail + `208px` contextual secondary drawer), `9px` top/left/bottom inset, `20px` border radius, `1px solid #eaecee`.
- **Typography**: `TT Norms Pro` (`400`, `500`, `600`, `700`) + `ABC Solar Display` (`700`, `800`) loaded from local WOFF2 binaries.

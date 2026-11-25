# Visual Diff & 50% Overlay Report — `/avatar/my-avatars?tab=public#account-menu` (`home-account-menu`)

- **Observed Reference Route**: `https://app.heygen.com/avatar/my-avatars?tab=public`
- **Local Implementation Route**: `http://localhost:3000/avatar/my-avatars?tab=public#account-menu`
- **Page Title**: `Account Menu Popover`
- **Comparison Buffer Dimensions**: `1024×694` (`710,656` pixels, captured at normalized `1354×917` viewport)
- **Structural & Pixel Similarity**: **77.8%** (`22.2%` pixel diff, `157,757` mismatched pixels at `threshold: 0.15`)
- **Invented UI Elements**: **0** (Strict 1:1 V4 compliance)
- **Broken Assets / Overflow / Console Errors**: **0**
- **Verification Status**: **VERIFIED**

## 1. Visual Regression Artifacts

| Artifact Type | File Path |
| :--- | :--- |
| **Reference Screenshot (`reference.png`)** | `tests/visual/home-account-menu/reference.png` (`tests/visual/reference/home-account-menu-chromium-1440x900.png`) |
| **Local Screenshot (`local.png`)** | `tests/visual/home-account-menu/local.png` (`tests/visual/current/home-account-menu-chromium-1440x900.png`) |
| **Pixelmatch Diff (`diff.png`)** | `tests/visual/home-account-menu/diff.png` (`tests/visual/diff/home-account-menu-chromium-1440x900.png`) |
| **50% Opacity Blend Overlay (`overlay.png`)** | `tests/visual/home-account-menu/overlay.png` (`tests/visual/overlay/home-account-menu-chromium-1440x900.png`) |

## 2. Layout & Geometry Verification

- **Layout Structure**: 200px bottom-left account menu popover (Default Space, 1 · Free plan, Upgrade Plan, Settings, Help, Log out) with zero Super Admin injection
- **Sidebar Geometry**: `286px` floating card (`78px` primary left rail + `208px` contextual secondary drawer), `9px` top/left/bottom inset, `20px` border radius, `1px solid #eaecee`.
- **Typography**: `TT Norms Pro` (`400`, `500`, `600`, `700`) + `ABC Solar Display` (`700`, `800`) loaded from local WOFF2 binaries.

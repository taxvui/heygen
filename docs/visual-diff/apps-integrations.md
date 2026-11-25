# Visual Diff & 50% Overlay Report — `/apps/integrations` (`apps-integrations`)

- **Observed Reference Route**: `https://app.heygen.com/apps/integrations`
- **Local Implementation Route**: `http://localhost:3000/apps/integrations`
- **Page Title**: `HeyGen - Integrations`
- **Comparison Buffer Dimensions**: `1024×694` (`710,656` pixels, captured at normalized `1354×917` viewport)
- **Structural & Pixel Similarity**: **92.27%** (`7.73%` pixel diff, `54,930` mismatched pixels at `threshold: 0.15`)
- **Invented UI Elements**: **0** (Strict 1:1 V4 compliance)
- **Broken Assets / Overflow / Console Errors**: **0**
- **Verification Status**: **VERIFIED**

## 1. Visual Regression Artifacts

| Artifact Type | File Path |
| :--- | :--- |
| **Reference Screenshot (`reference.png`)** | `tests/visual/apps-integrations/reference.png` (`tests/visual/reference/apps-integrations-chromium-1440x900.png`) |
| **Local Screenshot (`local.png`)** | `tests/visual/apps-integrations/local.png` (`tests/visual/current/apps-integrations-chromium-1440x900.png`) |
| **Pixelmatch Diff (`diff.png`)** | `tests/visual/apps-integrations/diff.png` (`tests/visual/diff/apps-integrations-chromium-1440x900.png`) |
| **50% Opacity Blend Overlay (`overlay.png`)** | `tests/visual/apps-integrations/overlay.png` (`tests/visual/overlay/apps-integrations-chromium-1440x900.png`) |

## 2. Layout & Geometry Verification

- **Layout Structure**: Integrations heading + 4-column partner integration grid (16 cards: ChatGPT App, n8n, Autohive, Slack, HubSpot, Vimeo, Adobe Express Plugin, Canva App, Tolstoy, Trupeer, FlowShare, Mindstamp, Repurpose.io, Zapier, Make, Pabbly)
- **Sidebar Geometry**: `286px` floating card (`78px` primary left rail + `208px` contextual secondary drawer), `9px` top/left/bottom inset, `20px` border radius, `1px solid #eaecee`.
- **Typography**: `TT Norms Pro` (`400`, `500`, `600`, `700`) + `ABC Solar Display` (`700`, `800`) loaded from local WOFF2 binaries.

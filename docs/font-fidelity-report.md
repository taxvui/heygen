# ANTIGRAVITY V8 — Font Fidelity Report

- **Generated At**: `2026-11-22T19:37:42.588Z`
- **Font Stylesheet**: [`src/styles/reference/fonts.css`](file:///c:/Users/Administrator/Downloads/heygen/src/styles/reference/fonts.css)
- **Typography Scale Stylesheet**: [`src/styles/reference/typography.css`](file:///c:/Users/Administrator/Downloads/heygen/src/styles/reference/typography.css)

---

## 1. Original `@font-face` Reconstruction vs Reference (`main-C1zSbYdM.css` & `main-CIqZwH0u.css`)

| Font Family | Weight / Style | Original Reference URL | Self-Hosted Local Path | HTTP Status |
| :--- | :---: | :--- | :--- | :---: |
| `TT Norms Pro` | `300 normal` | `https://static.heygen.ai/fonts/tt_norms_pro/TT_Norms_Pro_Light.woff2` | `/reference-assets/fonts/TT_Norms_Pro_Light.woff2` | `200 OK` |
| `TT Norms Pro` | `400 normal` | `https://static.heygen.ai/fonts/tt_norms_pro/TT_Norms_Pro_Regular.woff2` | `/reference-assets/fonts/TT_Norms_Pro_Regular.woff2` | `200 OK` |
| `TT Norms Pro` | `400 italic` | `https://static.heygen.ai/fonts/tt_norms_pro/TT_Norms_Pro_Italic.woff2` | `/reference-assets/fonts/TT_Norms_Pro_Italic.woff2` | `200 OK` |
| `TT Norms Pro` | `450 normal` | `https://static.heygen.ai/fonts/tt_norms_pro/TT_Norms_Pro_Normal.woff2` | `/reference-assets/fonts/TT_Norms_Pro_Normal.woff2` | `200 OK` |
| `TT Norms Pro` | `500 normal` | `https://static.heygen.ai/fonts/tt_norms_pro/TT_Norms_Pro_Medium.woff2` | `/reference-assets/fonts/TT_Norms_Pro_Medium.woff2` | `200 OK` |
| `TT Norms Pro` | `600 normal` | `https://static.heygen.ai/fonts/tt_norms_pro/TT_Norms_Pro_DemiBold.woff2` | `/reference-assets/fonts/TT_Norms_Pro_DemiBold.woff2` | `200 OK` |
| `TT Norms Pro` | `700 normal` | `https://static.heygen.ai/fonts/tt_norms_pro/TT_Norms_Pro_Bold.woff2` | `/reference-assets/fonts/TT_Norms_Pro_Bold.woff2` | `200 OK` |
| `TT Norms Pro` | `800/900 normal` | `https://static.heygen.ai/fonts/tt_norms_pro/TT_Norms_Pro_ExtraBold.woff2` | `/reference-assets/fonts/TT_Norms_Pro_ExtraBold.woff2` | `200 OK` |
| `ABC Solar Display` | `100-300 normal` | `https://static.heygen.ai/fonts/solar/ABCSolar-Light.woff2` | `/reference-assets/fonts/ABCSolar-Light.woff2` | `200 OK` |
| `ABC Solar Display` | `400 normal` | `https://static.heygen.ai/fonts/solar/ABCSolar-Regular.woff2` | `/reference-assets/fonts/ABCSolar-Regular.woff2` | `200 OK` |
| `ABC Solar Display` | `600 normal` | `https://app.heygen.com/fonts/solar/ABCSolarDisplay-Semibold.woff2` | `/reference-assets/fonts/ABCSolarDisplay-Semibold.woff2` | `200 OK` |
| `ABC Solar Display` | `700-800 normal` | `https://static.heygen.ai/fonts/solar/ABCSolarDisplay-Bold.woff2` | `/reference-assets/fonts/ABCSolarDisplay-Bold.woff2` | `200 OK` |

---

## 2. Measured Typography & Bounding-Box Verification on `/home` (`1354×917`)

| UI Element | Reference Font / Class (`step_459.json`) | Reference Box (`1354×917`) | Local V8 Box (`1354×917`) | Delta |
| :--- | :--- | :---: | :---: | :---: |
| `Welcome to HeyGen` | `ABC Solar Display`, `34px` (`44px` at `min-height:1000px`), `700` | `x: 336, y: 56, h: 51` | `x: 336, y: 56, h: 51` | **`0px`** |
| `Create` section heading | `TT Norms Pro`, `13px / 20px`, `600` | `x: 111, y: 31, h: 20` | `x: 111, y: 31, h: 20` | **`0px`** |
| `Get Started` button | `TT Norms Pro`, `14px / 20px`, `600` | `y: 351, h: 32` | `y: 350.5, h: 32` | **`0.5px`** |
| `Personalize` button | `TT Norms Pro`, `14px / 20px`, `600` | `x: 1209.34, w: 97.66, h: 32` | `x: 1209.34, w: 97.66, h: 32` | **`0px`** |

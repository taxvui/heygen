# ANTIGRAVITY V8 — Asset Fidelity Report

- **Generated At**: `2026-11-22T19:37:42.588Z`
- **Reference Origin**: `https://app.heygen.com`
- **Resource Inventory**: [`docs/reference/resource-inventory.json`](file:///c:/Users/Administrator/Downloads/heygen/docs/reference/resource-inventory.json)
- **Resource Audit Report**: [`docs/reference/resource-audit.md`](file:///c:/Users/Administrator/Downloads/heygen/docs/reference/resource-audit.md)
- **SHA-256 Checksum Manifest**: [`reference-resources/manifest.json`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/manifest.json)

---

## 1. Authorized Original Resource Summary

| Category | Local Directory | Verified File Count | Status |
| :--- | :--- | :---: | :---: |
| **Reference CSS Stylesheets** | [`reference-resources/css/`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/main-CIqZwH0u.css) | **11** | 100% Extracted & SHA-256 Verified |
| **Modulepreload JS Bundle Manifest** | [`reference-resources/javascript/modulepreload-manifest.json`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/javascript/modulepreload-manifest.json) | **250+ bundles** | 100% Inventoried |
| **Self-Hosted Original Fonts** | `public/reference-assets/fonts/` & `public/heygen-assets/fonts/` | **13 WOFF2 files** | 100% HTTP 200 Verified |
| **Extracted Sprite SVG Icons** | `public/reference-assets/icons/` & [`src/components/reference-icons/index.tsx`](file:///c:/Users/Administrator/Downloads/heygen/src/components/reference-icons/index.tsx) | **76 exact `<symbol>` SVGs** + `sprite-a85fbf208429.svg` | 100% Extracted from `/sprite-a85fbf208429.svg` |
| **Original Logos, Images, Thumbnails & Videos** | `public/reference-assets/{logos,images,videos}/` & `public/heygen-assets/` | **301 media files** | `0` Broken Requests (`brokenReqCount: 0`) |
| **Total Tracked Resources in Manifest** | [`reference-resources/manifest.json`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/manifest.json) | **312** | SHA-256 Verified |

---

## 2. Provenance & Authorization Compliance

- Every first-party stylesheet, font face (`TT Norms Pro`, `ABC Solar Display`), SVG sprite symbol (`/sprite-a85fbf208429.svg`), logo (`PRISM_ORB.svg`), avatar portrait, template thumbnail, and preview video is stored locally with its original URL, MIME type, byte size, and SHA-256 hash recorded in [`reference-resources/manifest.json`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/manifest.json).
- Zero unauthorized external runtime hotlinks or broken asset requests (`brokenReqCount === 0` across all audited viewports and routes).

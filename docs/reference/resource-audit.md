# ANTIGRAVITY V8 — Phase 1 Complete Frontend Resource Audit

- **Audited Origin**: `https://app.heygen.com`
- **Primary Desktop Viewport**: `1354×917`
- **Primary Mobile Viewport**: `375×812`
- **Machine-Readable Inventory**: [`docs/reference/resource-inventory.json`](file:///c:/Users/Administrator/Downloads/heygen/docs/reference/resource-inventory.json)
- **Downloaded Resource Manifest**: [`reference-resources/manifest.json`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/manifest.json)

---

## 1. Loaded CSS Stylesheets Inventory

| Stylesheet URL | Local Mirror | Size (chars) | Routes Loaded | Purpose |
| :--- | :--- | :---: | :--- | :--- |
| `/main-CIqZwH0u.css` | [`reference-resources/css/main-CIqZwH0u.css`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/main-CIqZwH0u.css) | `4285` | All routes | Base reset, `.v3-icon`, `#root`, `SF Pro Display`, `NotoEmoji`, `ABC Solar Display` Semibold |
| `/main-C1zSbYdM.css` | [`reference-resources/css/main-C1zSbYdM-tokens.css`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/main-C1zSbYdM-tokens.css) | `1,229,688` | All routes | Complete `:root` / `[data-theme]` design tokens, `TT Norms Pro` & `ABC Solar Display` `@font-face`, `332` `@media` queries, `99` `@keyframes` |
| `/VAStyles-5Yho9Mfi.css` | [`reference-resources/css/VAStyles-5Yho9Mfi.css`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/VAStyles-5Yho9Mfi.css) | `29644` | `/home`, `/home/video-agent` | `.glass-default`, `.glass-focused`, `#sa-prompt-box`, `.sa-composer`, `.sa-mweb-card-*`, `.sa-more-tile*`, `.sa-lp-flow-hero*` |
| `/HomeOrb-Bon6UsRb.css` | [`reference-resources/css/HomeOrb-Bon6UsRb.css`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/HomeOrb-Bon6UsRb.css) | `1847` | `/home` | `.home-bg-orb` blurred rotating background orb keyframes |
| `/HomeVideoPromptsSection-Gf1OBvoa.css` | [`reference-resources/css/HomeVideoPromptsSection-Gf1OBvoa.css`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/HomeVideoPromptsSection-Gf1OBvoa.css) | `363` | `/home` | `.personalizing-shimmer` text gradient animation |
| `/OrbyNavButtonInner-CxP1nZnY.css` | [`reference-resources/css/OrbyNavButtonInner-CxP1nZnY.css`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/OrbyNavButtonInner-CxP1nZnY.css) | `1778` | All routes | `.orby-pill-words` & `.orby-pill-dots` top-right Ask Orby button animations |
| `/OnboardingAutoSubmitter-CNazkwiz.css` | [`reference-resources/css/OnboardingAutoSubmitter-CNazkwiz.css`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/OnboardingAutoSubmitter-CNazkwiz.css) | `37406` | `/home`, `/home/video-agent` | Complete Prompt Builder (`.pb-root`, `.pb-stage`, `.pb-compose`, `.pb-delivery`, `.pb-doc-input`, `.pb-inspire`, `.pb-category-grid`) |
| `/useWalkingRim-PWatLu00.css` | [`reference-resources/css/useWalkingRim-PWatLu00.css`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/useWalkingRim-PWatLu00.css) | `692` | `/home`, `/home/video-agent` | `.pb-compose-rim` radial-gradient border mask |
| `/ProgressBar-Cd-VEDe7.css` | [`reference-resources/css/ProgressBar-Cd-VEDe7.css`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/ProgressBar-Cd-VEDe7.css) | `1169` | All routes | Video player cue sizing and seek pulse indicators |
| `/routeReadiness-CPwuhP6O.css` | [`reference-resources/css/routeReadiness-CPwuhP6O.css`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/routeReadiness-CPwuhP6O.css) | `5563` | All routes | Orby floating/docked assistant panel & conic-gradient glow |
| `/color-picker-BvVCuZGT.css` | [`reference-resources/css/color-picker-BvVCuZGT.css`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/color-picker-BvVCuZGT.css) | `978` | `/home/studio`, `/brand` | `.react-colorful` Brand Kit & Studio color picker overrides |

---

## 2. Font Files & `@font-face` Declarations

### Actively Loaded WOFF2 Fonts (`HTTP 200`)
1. `TT Norms Pro Regular` (`400`) — `/reference-assets/fonts/TT_Norms_Pro_Regular.woff2`
2. `TT Norms Pro Medium` (`500`) — `/reference-assets/fonts/TT_Norms_Pro_Medium.woff2`
3. `TT Norms Pro DemiBold` (`600`) — `/reference-assets/fonts/TT_Norms_Pro_DemiBold.woff2`
4. `TT Norms Pro Bold` (`700`) — `/reference-assets/fonts/TT_Norms_Pro_Bold.woff2`
5. `ABC Solar Display Bold` (`700/800`) — `/reference-assets/fonts/ABCSolarDisplay-Bold.woff2`

All 13 self-hosted font weights (`TT Norms Pro` 300–800 + Italic, `ABC Solar Display` Light/Regular/Semibold/Bold/Display-Bold) are mirrored in `public/reference-assets/fonts/` and `public/heygen-assets/fonts/`.

---

## 3. SVG Sprite & Inline Icon Inventory

- **Global Sprite Sheet**: `https://app.heygen.com/sprite-a85fbf208429.svg` (`732` total `<symbol>` definitions).
- **Extracted Route-Active Symbols**: **`76`** exact `<symbol>` vector definitions extracted directly from `/sprite-a85fbf208429.svg` and saved individually under `public/reference-assets/icons/<id>.svg` and in [`src/components/reference-icons/index.tsx`](file:///c:/Users/Administrator/Downloads/heygen/src/components/reference-icons/index.tsx).

| Route | Total SVGs Rendered | Unique SVGs | Sprite Symbol IDs Used |
| :--- | :---: | :---: | :--- |
| `/home` | `25` | `20` | `avatar-menu`, `brand-kit`, `design`, `folder`, `code`, `pro`, `collapse-chat`, `home-smile`, `magic`, `video`, `image`, `translate`, `user`, `voice`, `right` |
| `/home/video-agent` | `60` | `32` | `avatar-menu`, `brand-kit`, `design`, `folder`, `code`, `pro`, `collapse-chat`, `home-smile`, `magic`, `video`, `image`, `translate`, `plus`, `expand-corners`, `char-full-body`, `audio`, `aspect-ratio`, `add`, `info`, `recommend`, `down`, `arrow-right`, `rocket`, `lightbulb`, `Chart`, `eye`, `homepage` |
| `/home/photo-to-video` | `24` | `23` | `avatar-menu`, `brand-kit`, `design`, `folder`, `code`, `pro`, `collapse-chat`, `home-smile`, `magic`, `video`, `image`, `translate`, `add-avatar`, `down`, `movement-expressive`, `audio`, `play-s`, `portrait-phone`, `arrow-up`, `right` |
| `/home/studio` | `23` | `21` | `avatar-menu`, `brand-kit`, `design`, `folder`, `code`, `pro`, `collapse-chat`, `home-smile`, `magic`, `video`, `image`, `translate`, `create-video`, `right`, `desktop`, `mobile`, `plus`, `Search` |
| `/home/translate` | `15` | `15` | `avatar-menu`, `brand-kit`, `design`, `folder`, `code`, `pro`, `collapse-chat`, `home-smile`, `magic`, `video`, `image`, `translate`, `iconlink` |
| `/apps` | `29` | `13` | `avatar-menu`, `brand-kit`, `design`, `folder`, `code`, `pro`, `collapse-chat`, `home-smile`, `molecule`, `arrow-right` |
| `/avatar/my-avatars?tab=public` | `16` | `16` | `avatar-menu`, `brand-kit`, `design`, `folder`, `code`, `pro`, `collapse-chat`, `voice`, `add-avatar`, `Search`, `filter`, `card-view`, `list-view` |
| `/avatar/voices` | `77` | `20` | `avatar-menu`, `brand-kit`, `design`, `folder`, `code`, `pro`, `collapse-chat`, `voice`, `mic`, `magic`, `download`, `Search`, `down`, `play-s`, `more-level` |
| `/brand` | `12` | `12` | `avatar-menu`, `brand-kit`, `design`, `folder`, `code`, `pro`, `collapse-chat`, `knowledge-base`, `add` |
| `/projects/assets` | `19` | `19` | `avatar-menu`, `brand-kit`, `design`, `folder`, `code`, `pro`, `collapse-chat`, `video-type`, `add-folder`, `delete`, `Search`, `upload-one`, `filter`, `list-view`, `descend`, `ds-warn-triangle`, `refresh` |
| `/developers/api` | `40` | `32` | `arrow-right-up`, `avatar-menu`, `brand-kit`, `design`, `folder`, `code`, `pro`, `collapse-chat`, `home-smile`, `ds-billing`, `Chart`, `layer`, `send`, `link`, `text-type`, `arrow-up-right`, `molecule`, `magic`, `history`, `coins-ds`, `key`, `book`, `brainstorm`, `copy` |

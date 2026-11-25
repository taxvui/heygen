# ANTIGRAVITY V8 — JavaScript Interactive Behavior Report

- **Generated At**: `2026-11-22T19:37:42.588Z`
- **Reference Modulepreload Manifest**: [`reference-resources/javascript/modulepreload-manifest.json`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/javascript/modulepreload-manifest.json)

---

## 1. Interactive UI Behaviors Verified Against Reference

| Interactive Feature | Reference Bundle / Mechanism | Local Implementation | Verification Status |
| :--- | :--- | :--- | :---: |
| **4-Tier Responsive Navigation & Mobile Drawer** | `home_layout-DZ3traDo.js`, `mobile_full_screen_drawer-CfnZ2F_5.js` | [`src/components/shell/AppShell.tsx`](file:///c:/Users/Administrator/Downloads/heygen/src/components/shell/AppShell.tsx) (`<=479px` floating `Toggle navigation` at `(12, 16)` -> `288px` dual-column `dialog "Navigation"`; `480–649px` `78px` rail; `650–1919px` `286px` dual sidebar; `>=1920px` `334px` wide dual sidebar) | **95.33% Visual Similarity** (`home-375x812-drawer-open`) |
| **Mobile `Create Video` Bottom-Sheet Dialog** | `show_make_video_modal-BRIhF5z9.js`, `vendor-drawer-DKqEPGVb.js` | [`src/app/home/page.tsx`](file:///c:/Users/Administrator/Downloads/heygen/src/app/home/page.tsx) (`dialog "Make your first video"` with `Guided Creation` & `Prompt to Video`) | **Verified in E2E & Visual Captures** |
| **`Personalize` Inline Gradient Industry Selector** | `show_personalize_modal-CeHFpgig.js` | [`src/app/home/page.tsx`](file:///c:/Users/Administrator/Downloads/heygen/src/app/home/page.tsx) (18 industry pills with live prompt filtering) | **Verified** |
| **Video Prompt Modal & Prompt Builder Drawers** | `v_a_prompt_box-C5YFlVg8.js`, `caption_presets-frhOsZ4A.js` | [`src/app/home/page.tsx`](file:///c:/Users/Administrator/Downloads/heygen/src/app/home/page.tsx) & [`src/app/home/video-agent/page.tsx`](file:///c:/Users/Administrator/Downloads/heygen/src/app/home/video-agent/page.tsx) (27 Intros, 75 Captions, 4 Formats, 3 Brand Presets, Recreate modal) | **Verified** |
| **Presenter / Cinematic Script Composer & Popovers** | `avatar_engine-BM4UN_6X.js`, `voice_preview_player-Bh71tyUg.js` | [`src/components/avatar/AvatarScriptComposerView.tsx`](file:///c:/Users/Administrator/Downloads/heygen/src/components/avatar/AvatarScriptComposerView.tsx) (`Avatar V/IV/III` popover, `APPLY CUSTOM MOTION BETA`, `Record Audio` modal, `Choose a Voice` modal) | **Verified** |
| **Public Avatars Bento Hover Video & 57 Looks Detail** | `looks_grid-D-ngIo4_.js`, `use_avatar_tabs-BJqDsQkz.js` | [`src/app/avatar/my-avatars/page.tsx`](file:///c:/Users/Administrator/Downloads/heygen/src/app/avatar/my-avatars/page.tsx) & [`src/app/avatar/my-avatars/[id]/page.tsx`](file:///c:/Users/Administrator/Downloads/heygen/src/app/avatar/my-avatars/%5Bid%5D/page.tsx) (33 Bento cards, 99 portraits, 57 Annie looks) | **Verified** |
| **Voices Library Popovers, Audio Preview & Pagination** | `voice-engine-DzdNO0WQ.js`, `use_voice_preview-CGoiXTgr.js` | [`src/app/avatar/voices/page.tsx`](file:///c:/Users/Administrator/Downloads/heygen/src/app/avatar/voices/page.tsx) (89 voices, language/gender/use-case popovers, row action menu) | **Verified** |
| **Projects Filter/View/Sort Popovers & Retry State** | `search_sort_filter_context-DZJOEZB5.js`, `use_folder_modal_generic-CcXhniqB.js` | [`src/app/projects/page.tsx`](file:///c:/Users/Administrator/Downloads/heygen/src/app/projects/page.tsx) (`Filter projects`, `View`, `Sort`, `Create a folder` modal, `/projects/trash`, and `Try again` workspace toggle) | **Verified** |

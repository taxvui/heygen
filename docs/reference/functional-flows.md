# HeyGen Reference Functional Flows & User Journeys

> **Source**: End-to-end interactive flow tracing on `https://app.heygen.com`.

---

## Flow 1: Home Dashboard & Guided Account Setup (`/home`)
1. **Landing**: User lands on `/home` (`Welcome to HeyGen`), viewing the 4-step account setup wizard (`Finish your account setup - 0/4`) and the 3×2 `Video Prompts` grid (`Ads & Promo`, `Educational Video`, `Expert Explainer`, `Tips & How-To`, `News Brief Video`, `Video Podcast`).
2. **Step 1 (`Create your Avatar`)**: Clicking `Get Started` launches the custom avatar creation & consent flow (webcam/upload recording with explicit likeness consent statement). Completing Step 1 increments the counter (`1/4`) and unlocks Step 2 (`Review your Voice`) and Step 3 (`Create a Look`).
3. **Video Prompt Launch**: Clicking `Create Now ›` on any prompt card pre-populates `/home/video-agent` with the prompt category template and opens the Video Agent script/inspiration builder.
4. **Personalize**: Clicking `Personalize` opens a dialog allowing the user to select their industry/use-case (`Marketing`, `Training & L&D`, `Sales Outreach`, `Content Creation`, `Customer Support`) to tailor prompt cards.

---

## Flow 2: Video Agent — Prompt to Multi-Scene Video (`/home/video-agent`)
1. **Inspiration Selection**: In the left `Add inspiration` pane, the user can click `+ Recreate` (upload/paste reference video URL) or browse `Intros`, `Captions`, `Format`, and `Brand` presets with video previews.
2. **Avatar & Voice Configuration**: In the right `Avatar and References` header bar, the user selects an Avatar (`Auto` or specific avatar like `Annie`, `Marieke`, `Sawyer`), a Voice (`Auto` or specific voice), aspect ratio (`16:9` / `9:16`), and reference media (`+`).
3. **Script & Auto-Pilot**: User enters a topic or full script, optionally clicks `Script Writer` (AI script generator modal) or toggles `Auto-pilot` mode, and clicks `Generate video ->`.
4. **Job Submission & Studio Hand-off**: Creates a generation job or opens the generated multi-scene project directly inside AI Studio (`/apps/studio`).

---

## Flow 3: Single-Scene Avatar Video (`/home/photo-to-video` & `/avatar/my-avatars`)
1. **Mode Selection**: Toggle between `Presenter` (natural talking head with gestures) and `Cinematic` (expressive full-motion generation).
2. **Avatar & Script Input**: Click the left avatar slot (`+`) to pick an avatar or photo, enter script text in `VIDEO SCRIPT`, or click `upload/record` to upload/record audio.
3. **Engine & Output Controls**: Choose engine (`Avatar V` / `Avatar IV`), optional `Motion` prompt, `Voice` with inline audio preview, aspect ratio (`9:16` Portrait / `16:9` Landscape), and resolution (`720p` / `1080p` / `4K`).
4. **Generate**: Clicking `Generate` validates credit balance, submits a talking-avatar job to the BullMQ/worker pipeline, and shows real-time progress in `Recent Creations`.

---

## Flow 4: Avatar Catalog, Custom Avatars & Likeness Consent (`/avatar/my-avatars?tab=public`)
1. **Browse & Filter**: Switch between `My Avatars` and `Public Avatars`. Search by name, filter by gender/age/attire via `Filters`, toggle `Grid` / `List` view, or filter by category chip (`All`, `Professional`, `Lifestyle`, `UGC`, `Community`, `Favorites`).
2. **Look Inspection**: Each Public Avatar bento card displays the primary portrait plus 2 look thumbnails. Clicking an avatar opens the Avatar Detail Drawer showing all available looks, voice pairing, preview video playback, favorite toggle, and `Create Video with Avatar`.
3. **Custom Avatar Creation (`+ New Avatar`)**: Opens a multi-step wizard:
   - Upload calibration footage or photo look.
   - **Mandatory Likeness Consent Verification**: User records or uploads a verification video reading the dynamic consent script (`"I, [Full Name], hereby authorize..."`) and signs the consent attestation record stored in `avatar_consents`.

---

## Flow 5: Voice Library, TTS & Custom Voice Cloning (`/avatar/voices`)
1. **Browse & Preview**: Filter by `My voices` or `HeyGen library`, search by keyword, filter by language (`All languages`), gender (`All genders`), and tags. Click the play button on any row to stream the voice sample.
2. **Create / Design / Import Voice**:
   - `Create your HeyGen voice`: Upload audio sample + explicit voice consent recording (`voice_consents`).
   - `Design a voice`: Specify gender, age, accent, and tone prompt to synthesize a custom voice profile.
   - `Import from 3rd party`: Connect ElevenLabs / OpenAI / Azure TTS credentials.

---

## Flow 6: Video Translation & Lip-Sync (`/home/translate`)
1. **Source Input**: Drag-and-drop an `MP4`, `MOV`, or `WEBM` file, select an existing project, or paste a URL.
2. **Language & Lip-Sync Settings**: Select source language (or auto-detect), target language (175+ languages), speaker count, translation mode (`Audio Dubbing Only` vs `Full Lip-Sync Video Translation`), and brand glossary enforcement.
3. **Pipeline Execution**: Runs Speech-to-Text transcription -> Translation -> Target Voice Cloning/TTS -> Lip-Sync video synthesis -> Subtitle (`SRT`/`VTT`) and `MP4` export.

---

## Flow 7: Full AI Video Studio Editor (`/apps/studio`)
1. **Launcher**: From `/apps/studio`, click `New video` (`Landscape 16:9` or `Portrait 9:16`) or pick a template from `Use a template` (`Recommended`, `Training`, `Corporate`, `Marketing`, `Sales`, `Tutorials & Explainers`, `Real Estate`, `Finance`).
2. **4-Zone Studio Workspace**:
   - **Left Rail + Asset Drawer**: Switch between `Scenes`, `Avatars`, `Text`, `Images`, `Videos`, `Audio`, `Templates`, `Backgrounds`.
   - **Center Interactive Canvas**: HTML5/Remotion-powered stage with draggable/resizable layers, alignment guides, aspect ratio switcher, zoom selector, and live transport (`Play/Pause`, timecode, fullscreen).
   - **Right Properties Inspector**: Context-sensitive inspector for Avatar look/display mode (`Full body`, `Circle`, `Close-up`), Voice & Script per scene, Text typography/colors/animations, Layer opacity/position/rotation, and Scene transitions.
   - **Bottom Multi-Track Timeline**: Scene cards with duration handles, synchronized voice/script track, overlay layer tracks, background audio waveform track, playhead scrubbing, split/duplicate/delete, and timeline zoom.
3. **Autosave, Version History & Export**: Every edit autosaves to the database with version snapshots; clicking `Export / Generate` triggers server-side FFmpeg/Remotion rendering to produce a downloadable `.mp4` video file.

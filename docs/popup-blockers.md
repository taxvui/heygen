# HeyGen Platform Reconstruction — V5 Popup Blockers & Plan/Tier Prerequisite Report

**Target Reference**: `https://app.heygen.com/home`  
**Audit Standard**: ANTIGRAVITY V5 — Rules 1, 6, 7, 11  
**Total Uninspected Reachable Popup Triggers**: **0** (`38 / 38` reachable popups inspected and captured)

---

## 1. Summary of Blocker Status

- **Unreachable / Unobserved Popups on Accessible Reference Routes**: **0**
- Every visible button, icon button, three-dot menu, dropdown arrow, card, avatar thumbnail, toolbar pill, user menu, settings tab, and upload/create trigger across `/home`, `/home/video-agent`, `/home/photo-to-video`, `/home/translate`, `/avatar/my-avatars`, `/avatar/my-avatars?tab=public`, `/avatar/voices`, `/brand`, `/apps`, `/apps/integrations`, `/apps/studio`, `/projects`, and `/developers/api` was triggered and captured on the live `https://app.heygen.com` reference session.

---

## 2. Documented Plan-Gated / Account-State Behaviors Inside Observed Reference Popups (Rule 11)

While all 38 popup triggers opened and were captured 1:1, the following **3 reference triggers** exhibit Free-tier or empty-account prerequisite gates inside the observed reference UI (which we reproduced faithfully rather than fabricating unseen paid-only screens):

### 2.1 `popup-13-video-agent-recreate` (`+ Recreate` card on `/home/video-agent`)
- **Reference Route**: `https://app.heygen.com/home/video-agent`
- **Trigger Location**: Top-left `+ Recreate` card inside `Add inspiration`
- **Observed Reference Behavior**: On the authorized Free-plan reference account, clicking `+ Recreate` opens the **`"Unlock Recreate in Video Agent"`** Pro/Creator paywall modal (`894×569px`, `step_65_shot_2_popup_13_video_agent_recreate.png`) displaying the `Creator ($29/mo)` and `Pro ($49/mo)` radio cards and the `recreate-upsell-beige-v2.mp4` (`Original` vs `Recreated`) split-screen preview video.
- **Plan Prerequisite**: Requires an active `Creator` or `Pro` subscription on `app.heygen.com` to bypass the upsell modal into the paid video recreation uploader.
- **V5 Implementation**: Reconstructed the exact observed `"Unlock Recreate in Video Agent"` modal (`tests/visual/popups/local/popup-13-video-agent-recreate.png`) using the downloaded `recreate-upsell-beige-v2.mp4` asset.

### 2.2 `popup-10-settings-security` (`Settings -> Security` tab)
- **Reference Route**: `https://app.heygen.com/home?nav=Security`
- **Trigger Location**: Workspace Settings Modal -> `Security` left rail tab
- **Observed Reference Behavior**: Displays `"Enable SSO and two-factor authentication — SSO is available on Business plans and above. Two-factor authentication (2FA) is available on Enterprise plans."` with an `"Upgrade plan"` button (`step_63_shot_7_popup_10_settings_security.png`).
- **Plan Prerequisite**: Enterprise / Business subscription tier required to view SAML/OIDC SSO configuration fields.
- **V5 Implementation**: Reconstructed the exact observed `Security` tab (`tests/visual/popups/local/popup-10-settings-security.png`).

### 2.3 `popup-20-composer-upload-record` (`"upload/record"` on `/home/photo-to-video`)
- **Reference Route**: `https://app.heygen.com/home/photo-to-video`
- **Trigger Location**: `"upload/record"` link inside the `VIDEO SCRIPT` placeholder
- **Observed Reference Behavior**: Opens the `"Record Audio"` modal (`530×608px`, `step_88_shot_2_popup_20_composer_upload_record.png`) with `Record Audio | Upload Audio` tabs, red circular record button, and headless browser microphone warning `"No microphone found. Connect one, then try recording again."`.
- **V5 Implementation**: Reconstructed the exact observed `"Record Audio"` modal (`tests/visual/popups/local/popup-20-composer-upload-record.png`) including both `Record Audio` and `Upload Audio` tabs.

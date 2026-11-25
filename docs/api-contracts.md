# HeyGen Platform Reconstruction — REST API Contracts

> **Base URL**: `http://localhost:3000/api`
> **Persistence**: `src/lib/db/store.ts` (`data/heygen-db.json` + `supabase/migrations/0001_initial_schema.sql`)

---

## 1. `GET /api/bootstrap`
Returns the complete workspace state for the authenticated user and active organization:
- **Response `200 OK`**:
  ```json
  {
    "user": { "id": "usr-default-owner", "email": "creator@heygen.local", "role": "super_admin", "onboarding_step": 0 },
    "organization": { "id": "org-default-space", "name": "Default Space", "plan_tier": "free" },
    "members": [...],
    "projects": [...],
    "project_versions": [...],
    "scenes": [...],
    "assets": [...],
    "avatars": [...],
    "avatar_consents": [...],
    "voices": [...],
    "voice_consents": [...],
    "templates": [...],
    "ai_providers": [...],
    "ai_models": [...],
    "generation_jobs": [...],
    "render_jobs": [...],
    "plans": [...],
    "subscription": {...},
    "wallet": { "balance": 15, "lifetime_earned": 15, "lifetime_spent": 0 },
    "credit_transactions": [...],
    "billing_events": [...],
    "system_settings": [...],
    "queue_health": {...}
  }
  ```

---

## 2. `POST /api/auth`
Handles authentication, profile updates, MFA toggles, and onboarding progression.
- **Actions**:
  - `{ "action": "sign_in", "method": "email" | "google" | "apple", "email": "..." }`
  - `{ "action": "update_profile", "first_name": "...", "last_name": "...", "mfa_enabled": true }`
  - `{ "action": "complete_onboarding_step", "step": 1 }`

---

## 3. `GET / POST / PATCH / DELETE /api/projects`
Multi-tenant video project & scene management with version history snapshots.
- **`POST /api/projects`**:
  - Create blank project: `{ "title": "...", "project_type": "studio", "aspect_ratio": "16:9", "resolution": "1080p" }`
  - Duplicate project: `{ "action": "duplicate", "project_id": "..." }`
  - Create from template: `{ "action": "create_from_template", "template_id": "tpl-focus-framework" }`
- **`PATCH /api/projects`**:
  - Autosave scenes & optional version checkpoint:
    ```json
    {
      "project_id": "proj-focus-intro",
      "title": "Updated Title",
      "scenes": [...],
      "save_version": true,
      "version_label": "Manual Checkpoint"
    }
    ```
- **`DELETE /api/projects?id=<projectId>&permanent=false`**: Moves project to Trash or permanently deletes it.

---

## 4. `GET / POST / PATCH / DELETE /api/avatars`
Public and custom avatar catalog with mandatory likeness consent verification.
- **`POST /api/avatars`**:
  - Requires `consent_accepted: true` and `subject_full_name` when `require_explicit_likeness_consent` is enabled.
  - Creates a verified `avatar_consents` attestation record and links `consent_id` to the newly created `AvatarRecord`.

---

## 5. `GET / POST / PATCH / DELETE /api/voices`
AI voice catalog, voice cloning with `voice_consents` verification, voice designer, and 3rd-party voice import.

---

## 6. `GET / POST / PATCH / DELETE /api/templates`
AI Studio template catalog and Super Admin template publishing.

---

## 7. `GET / POST / DELETE /api/assets`
Multipart file upload (`multipart/form-data` -> `public/uploads/*`) and JSON asset registration with signed delivery URLs and storage metering.

---

## 8. `GET / POST / PATCH /api/jobs`
AI generation jobs and FFmpeg + Remotion multi-scene video render jobs.
- **`POST /api/jobs` (`kind: "render_project"`)**:
  - Executes `renderProjectWithFfmpeg` using `ffmpeg-static`, writes `public/renders/render-<jobId>.mp4` and `.srt`, and updates the project's `video_url` and `status: "completed"`.
- **`POST /api/jobs` (AI Generation)**:
  - Executes `submitAndExecuteAIJob`. Truthfully checks provider credentials (`HEYGEN_API_KEY`, `OPENAI_API_KEY`, `ELEVENLABS_API_KEY`, or `FFMPEG_STATIC_BIN`). If an external cloud provider is unconfigured, records `status: "failed"` with diagnostic details and charges `0` credits.
- **`PATCH /api/jobs`**:
  - `{ "id": "<jobId>", "action": "retry" | "cancel" }`

---

## 9. `GET / POST / PATCH / DELETE /api/workspace`
Workspace creation, team invitations (`invite_member`), member role updates, Brand Kit colors/typography updates, and Brand Glossary term CRUD (`add_glossary_term`).

---

## 10. `GET / POST /api/billing`
Subscription plan upgrades/downgrades (`change_plan`), API/credit balance top-ups (`top_up_credits`), auto-reload configuration (`toggle_auto_reload`), and invoice ledger generation.

---

## 11. `GET / PATCH /api/admin`
Super Admin Dashboard telemetry & privileged operations across all 10 admin modules (`users`, `ai_providers`, `ai_models`, `plans`, `system_settings`), logging every mutation to `audit_logs`.

-- ============================================================================
-- HEYGEN PLATFORM RECONSTRUCTION — SUPABASE POSTGRESQL SCHEMA, INDEXES & RLS
-- All 24 Multi-Tenant Tables with RBAC, Consent Attestation, Jobs & Billing
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT DEFAULT '/heygen-assets/icons/avatar-default.png',
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'suspended')),
  mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_step INTEGER NOT NULL DEFAULT 0 CHECK (onboarding_step BETWEEN 0 AND 4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ORGANIZATIONS (Workspaces)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_tier TEXT NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'creator', 'team', 'enterprise')),
  brand_kit JSONB NOT NULL DEFAULT '{"colors":["#00c4ff","#232833","#c259ff"],"fontFamily":"TT Norms Pro","glossary":[]}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ORGANIZATION_MEMBERS
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'editor', 'member', 'viewer')),
  invited_email TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- 4. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  folder_name TEXT NOT NULL DEFAULT 'My Projects',
  title TEXT NOT NULL,
  project_type TEXT NOT NULL DEFAULT 'studio' CHECK (project_type IN ('studio', 'avatar_video', 'video_agent', 'translation', 'photo_to_video')),
  aspect_ratio TEXT NOT NULL DEFAULT '16:9' CHECK (aspect_ratio IN ('16:9', '9:16', '1:1')),
  resolution TEXT NOT NULL DEFAULT '1080p' CHECK (resolution IN ('720p', '1080p', '4k')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'queued', 'processing', 'completed', 'failed', 'trashed')),
  thumbnail_url TEXT NOT NULL DEFAULT '/heygen-assets/thumbnails/template-focus-framework.png',
  video_url TEXT,
  duration_sec NUMERIC(10,2) NOT NULL DEFAULT 15.0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PROJECT_VERSIONS
CREATE TABLE IF NOT EXISTS project_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  label TEXT NOT NULL DEFAULT 'Autosave',
  snapshot JSONB NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, version_number)
);

-- 6. SCENES
CREATE TABLE IF NOT EXISTS scenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL DEFAULT 'Scene 1',
  script TEXT NOT NULL DEFAULT '',
  avatar_id TEXT NOT NULL DEFAULT 'avatar-annie',
  avatar_look TEXT NOT NULL DEFAULT 'Look 1',
  avatar_mode TEXT NOT NULL DEFAULT 'Presenter',
  voice_id TEXT NOT NULL DEFAULT 'voice-annie',
  duration_sec NUMERIC(10,2) NOT NULL DEFAULT 8.0,
  background_type TEXT NOT NULL DEFAULT 'color' CHECK (background_type IN ('color', 'image', 'video')),
  background_value TEXT NOT NULL DEFAULT '#f7f8fa',
  layers JSONB NOT NULL DEFAULT '[]'::jsonb,
  transition TEXT NOT NULL DEFAULT 'fade',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ASSETS
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  folder TEXT NOT NULL DEFAULT 'Uploads',
  name TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('image', 'video', 'audio', 'document')),
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  url TEXT NOT NULL,
  duration_sec NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. AVATARS
CREATE TABLE IF NOT EXISTS avatars (
  id TEXT PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Professional' CHECK (category IN ('Professional', 'Lifestyle', 'UGC', 'Community', 'Custom')),
  gender TEXT NOT NULL DEFAULT 'Female',
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'workspace', 'private')),
  is_new BOOLEAN NOT NULL DEFAULT FALSE,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  main_thumbnail_url TEXT NOT NULL,
  look_thumbnails JSONB NOT NULL DEFAULT '[]'::jsonb,
  preview_video_url TEXT NOT NULL DEFAULT '/heygen-assets/videos/avatar-preview-talk.mp4',
  default_voice_id TEXT NOT NULL DEFAULT 'voice-annie',
  consent_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. AVATAR_CONSENTS
CREATE TABLE IF NOT EXISTS avatar_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_full_name TEXT NOT NULL,
  consent_statement TEXT NOT NULL,
  verification_video_url TEXT NOT NULL,
  ip_address TEXT NOT NULL DEFAULT '127.0.0.1',
  status TEXT NOT NULL DEFAULT 'verified' CHECK (status IN ('pending', 'verified', 'rejected', 'revoked')),
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. VOICES
CREATE TABLE IF NOT EXISTS voices (
  id TEXT PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subtitle_tags TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'English (US)',
  language_code TEXT NOT NULL DEFAULT 'en-US',
  flag_url TEXT NOT NULL DEFAULT '/heygen-assets/icons/flag-us.png',
  gender TEXT NOT NULL DEFAULT 'Female',
  visibility TEXT NOT NULL DEFAULT 'Public' CHECK (visibility IN ('Public', 'Private', 'Workspace')),
  provider TEXT NOT NULL DEFAULT 'heygen' CHECK (provider IN ('heygen', 'elevenlabs', 'openai', 'azure', 'custom')),
  sample_audio_url TEXT,
  speed NUMERIC(4,2) NOT NULL DEFAULT 1.00,
  pitch INTEGER NOT NULL DEFAULT 0,
  consent_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. VOICE_CONSENTS
CREATE TABLE IF NOT EXISTS voice_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  speaker_full_name TEXT NOT NULL,
  consent_phrase TEXT NOT NULL,
  recording_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'verified' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. TEMPLATES
CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Recommended',
  aspect_ratio TEXT NOT NULL DEFAULT '16:9',
  thumbnail_url TEXT NOT NULL,
  preview_video_url TEXT NOT NULL DEFAULT '/heygen-assets/videos/prompt-builder-hub.mp4',
  is_featured BOOLEAN NOT NULL DEFAULT TRUE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  scenes_payload JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. AI_PROVIDERS
CREATE TABLE IF NOT EXISTS ai_providers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  capabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  base_url TEXT NOT NULL,
  env_key_name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  rate_limit_rpm INTEGER NOT NULL DEFAULT 60,
  fallback_provider_id TEXT,
  health_status TEXT NOT NULL DEFAULT 'unconfigured' CHECK (health_status IN ('operational', 'unconfigured', 'degraded', 'offline')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. AI_MODELS
CREATE TABLE IF NOT EXISTS ai_models (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL REFERENCES ai_providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('talking_avatar', 'text_to_video', 'image_to_video', 'tts', 'stt', 'lip_sync', 'translation', 'subtitles')),
  credits_per_unit NUMERIC(8,2) NOT NULL DEFAULT 1.0,
  cost_usd_per_unit NUMERIC(8,4) NOT NULL DEFAULT 0.05,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. GENERATION_JOBS
CREATE TABLE IF NOT EXISTS generation_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL CHECK (task_type IN ('talking_avatar', 'text_to_video', 'image_to_video', 'tts', 'stt', 'lip_sync', 'translation', 'subtitles')),
  provider_id TEXT NOT NULL REFERENCES ai_providers(id),
  model_id TEXT NOT NULL REFERENCES ai_models(id),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled', 'unconfigured_provider')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  input_params JSONB NOT NULL DEFAULT '{}'::jsonb,
  output_url TEXT,
  subtitle_url TEXT,
  error_message TEXT,
  credits_estimated NUMERIC(8,2) NOT NULL DEFAULT 1.0,
  credits_charged NUMERIC(8,2) NOT NULL DEFAULT 0.0,
  cost_usd NUMERIC(8,4) NOT NULL DEFAULT 0.0,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. RENDER_JOBS
CREATE TABLE IF NOT EXISTS render_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  engine TEXT NOT NULL DEFAULT 'ffmpeg-remotion',
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
  progress INTEGER NOT NULL DEFAULT 0,
  resolution TEXT NOT NULL DEFAULT '1080p',
  output_url TEXT,
  file_size_bytes BIGINT,
  duration_sec NUMERIC(10,2),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 17. PLANS
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_monthly_usd NUMERIC(10,2) NOT NULL,
  price_yearly_usd NUMERIC(10,2) NOT NULL,
  monthly_credits INTEGER NOT NULL,
  max_resolution TEXT NOT NULL,
  max_video_duration_min INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 18. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES plans(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'cancelled')),
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. CREDIT_WALLETS
CREATE TABLE IF NOT EXISTS credit_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID UNIQUE NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  balance NUMERIC(12,2) NOT NULL DEFAULT 15.0,
  lifetime_earned NUMERIC(12,2) NOT NULL DEFAULT 15.0,
  lifetime_spent NUMERIC(12,2) NOT NULL DEFAULT 0.0,
  auto_reload_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  auto_reload_threshold NUMERIC(10,2) NOT NULL DEFAULT 5.0,
  auto_reload_amount NUMERIC(10,2) NOT NULL DEFAULT 30.0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. CREDIT_TRANSACTIONS
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  wallet_id UUID NOT NULL REFERENCES credit_wallets(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('grant', 'purchase', 'usage_debit', 'refund', 'admin_adjustment')),
  description TEXT NOT NULL,
  reference_job_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. BILLING_EVENTS
CREATE TABLE IF NOT EXISTS billing_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  amount_usd NUMERIC(10,2) NOT NULL DEFAULT 0.0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'failed', 'refunded')),
  invoice_pdf_url TEXT,
  stripe_event_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'system',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 23. AUDIT_LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  actor_email TEXT NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT NOT NULL DEFAULT '127.0.0.1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 24. SYSTEM_SETTINGS
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT NOT NULL,
  updated_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_projects_org ON projects(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_scenes_project ON scenes(project_id, order_index);
CREATE INDEX IF NOT EXISTS idx_assets_org ON assets(organization_id, asset_type);
CREATE INDEX IF NOT EXISTS idx_gen_jobs_org ON generation_jobs(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_render_jobs_project ON render_jobs(project_id, status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatar_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE voices ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE render_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Workspace Isolation Policies
CREATE POLICY "Workspace members can access organization projects"
  ON projects FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Public and workspace avatars readable by members"
  ON avatars FOR SELECT
  USING (
    visibility = 'public' OR organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

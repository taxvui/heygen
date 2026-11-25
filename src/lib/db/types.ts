export type UserRole = 'user' | 'admin' | 'super_admin';
export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'member' | 'viewer';
export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface UserRecord {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  role: UserRole;
  status: 'active' | 'disabled' | 'suspended';
  mfa_enabled: boolean;
  onboarding_step: number;
  created_at: string;
  updated_at: string;
}

export interface OrganizationRecord {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  plan_tier: 'free' | 'creator' | 'team' | 'enterprise';
  brand_kit: {
    colors: string[];
    fontFamily: string;
    logoUrl?: string;
    glossary: { id: string; term: string; language: string; pronunciation: string }[];
  };
  created_at: string;
  updated_at: string;
}

export interface OrganizationMemberRecord {
  id: string;
  organization_id: string;
  user_id: string;
  email: string;
  role: WorkspaceRole;
  status: 'active' | 'invited' | 'revoked';
  created_at: string;
}

export interface CanvasLayer {
  id: string;
  type: 'avatar' | 'text' | 'image' | 'video' | 'shape';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  content?: string;
  src?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  backgroundColor?: string;
  animation?: 'none' | 'fade-in' | 'slide-up' | 'zoom-in';
}

export interface SceneRecord {
  id: string;
  project_id: string;
  order_index: number;
  title: string;
  script: string;
  avatar_id: string;
  avatar_look: string;
  avatar_mode: 'Presenter' | 'Cinematic' | 'Circle' | 'Voice Only';
  voice_id: string;
  duration_sec: number;
  background_type: 'color' | 'image' | 'video';
  background_value: string;
  layers: CanvasLayer[];
  transition: 'none' | 'fade' | 'slide' | 'dissolve';
  audio_track_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectRecord {
  id: string;
  organization_id: string;
  created_by: string;
  folder_name: string;
  title: string;
  project_type: 'studio' | 'avatar_video' | 'video_agent' | 'translation' | 'photo_to_video';
  aspect_ratio: '16:9' | '9:16' | '1:1';
  resolution: '720p' | '1080p' | '4k';
  status: 'draft' | 'queued' | 'processing' | 'completed' | 'failed' | 'trashed';
  thumbnail_url: string;
  video_url?: string;
  duration_sec: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectVersionRecord {
  id: string;
  project_id: string;
  version_number: number;
  label: string;
  snapshot: {
    project: Partial<ProjectRecord>;
    scenes: SceneRecord[];
  };
  created_by: string;
  created_at: string;
}

export interface AssetRecord {
  id: string;
  organization_id: string;
  uploaded_by: string;
  folder: string;
  name: string;
  asset_type: 'image' | 'video' | 'audio' | 'document';
  mime_type: string;
  size_bytes: number;
  url: string;
  duration_sec?: number;
  created_at: string;
}

export interface AvatarRecord {
  id: string;
  organization_id?: string | null;
  name: string;
  category: 'Professional' | 'Lifestyle' | 'UGC' | 'Community' | 'Custom';
  gender: 'Female' | 'Male';
  visibility: 'public' | 'workspace' | 'private';
  is_new: boolean;
  is_favorite: boolean;
  main_thumbnail_url: string;
  look_thumbnails: string[];
  preview_video_url: string;
  default_voice_id: string;
  consent_id?: string | null;
  created_at: string;
}

export interface AvatarConsentRecord {
  id: string;
  organization_id: string;
  user_id: string;
  subject_full_name: string;
  consent_statement: string;
  verification_video_url: string;
  ip_address: string;
  status: 'pending' | 'verified' | 'rejected' | 'revoked';
  verified_at: string;
  created_at: string;
}

export interface VoiceRecord {
  id: string;
  organization_id?: string | null;
  name: string;
  subtitle_tags: string;
  language: string;
  language_code: string;
  flag_url: string;
  gender: 'Female' | 'Male';
  visibility: 'Public' | 'Private' | 'Workspace';
  provider: 'heygen' | 'elevenlabs' | 'openai' | 'azure' | 'custom';
  sample_audio_url?: string;
  speed: number;
  pitch: number;
  is_favorite?: boolean;
  consent_id?: string | null;
  created_at: string;
}

export interface VoiceConsentRecord {
  id: string;
  organization_id: string;
  user_id: string;
  speaker_full_name: string;
  consent_phrase: string;
  recording_url: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export interface TemplateRecord {
  id: string;
  title: string;
  subtitle: string;
  category: 'Recommended' | 'Training' | 'Corporate' | 'Marketing' | 'Sales' | 'Tutorials & Explainers' | 'Real Estate' | 'Finance';
  aspect_ratio: '16:9' | '9:16';
  thumbnail_url: string;
  preview_video_url: string;
  is_featured: boolean;
  is_published: boolean;
  is_favorite: boolean;
  scenes_payload: Partial<SceneRecord>[];
  created_at: string;
}

export interface AIProviderRecord {
  id: string;
  name: string;
  capabilities: string[];
  base_url: string;
  env_key_name: string;
  api_key_configured: boolean;
  custom_api_key?: string;
  enabled: boolean;
  rate_limit_rpm: number;
  fallback_provider_id?: string | null;
  health_status: 'operational' | 'unconfigured' | 'degraded' | 'offline';
  updated_at: string;
}

export interface AIModelRecord {
  id: string;
  provider_id: string;
  name: string;
  task_type: 'talking_avatar' | 'text_to_video' | 'image_to_video' | 'tts' | 'stt' | 'lip_sync' | 'translation' | 'subtitles';
  credits_per_unit: number;
  cost_usd_per_unit: number;
  active: boolean;
  created_at: string;
}

export interface GenerationJobRecord {
  id: string;
  organization_id: string;
  project_id?: string | null;
  user_id: string;
  task_type: 'talking_avatar' | 'text_to_video' | 'image_to_video' | 'tts' | 'stt' | 'lip_sync' | 'translation' | 'subtitles';
  provider_id: string;
  model_id: string;
  status: JobStatus;
  progress: number;
  input_params: Record<string, unknown>;
  output_url?: string | null;
  subtitle_url?: string | null;
  transcript_text?: string | null;
  translated_text?: string | null;
  error_message?: string | null;
  credits_estimated: number;
  credits_charged: number;
  cost_usd: number;
  attempts: number;
  created_at: string;
  updated_at: string;
}

export interface RenderJobRecord {
  id: string;
  organization_id: string;
  project_id: string;
  user_id: string;
  engine: 'ffmpeg-remotion';
  status: JobStatus;
  progress: number;
  resolution: '720p' | '1080p' | '4k';
  output_url?: string | null;
  file_size_bytes?: number | null;
  duration_sec?: number | null;
  error_message?: string | null;
  created_at: string;
  completed_at?: string | null;
}

export interface PlanRecord {
  id: string;
  name: string;
  price_monthly_usd: number;
  price_yearly_usd: number;
  monthly_credits: number;
  max_resolution: '720p' | '1080p' | '4k';
  max_video_duration_min: number;
  features: string[];
  active: boolean;
}

export interface SubscriptionRecord {
  id: string;
  organization_id: string;
  plan_id: string;
  status: 'active' | 'trialing' | 'past_due' | 'cancelled';
  billing_cycle: 'monthly' | 'yearly';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

export interface CreditWalletRecord {
  id: string;
  organization_id: string;
  balance: number;
  lifetime_earned: number;
  lifetime_spent: number;
  auto_reload_enabled: boolean;
  auto_reload_threshold: number;
  auto_reload_amount: number;
  updated_at: string;
}

export interface CreditTransactionRecord {
  id: string;
  organization_id: string;
  wallet_id: string;
  amount: number;
  transaction_type: 'grant' | 'purchase' | 'usage_debit' | 'refund' | 'admin_adjustment';
  description: string;
  reference_job_id?: string | null;
  created_at: string;
}

export interface BillingEventRecord {
  id: string;
  organization_id: string;
  event_type: string;
  amount_usd: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  invoice_pdf_url?: string;
  stripe_event_id?: string;
  created_at: string;
}

export interface NotificationRecord {
  id: string;
  user_id: string;
  title: string;
  message: string;
  category: 'system' | 'render' | 'billing' | 'security';
  is_read: boolean;
  created_at: string;
}

export interface AuditLogRecord {
  id: string;
  actor_id: string;
  actor_email: string;
  organization_id?: string | null;
  action: string;
  target_type: string;
  target_id: string;
  metadata: Record<string, unknown>;
  ip_address: string;
  created_at: string;
}

export interface SystemSettingRecord {
  key: string;
  value: unknown;
  description: string;
  updated_by: string;
  updated_at: string;
}

export interface DatabaseSchema {
  users: UserRecord[];
  organizations: OrganizationRecord[];
  organization_members: OrganizationMemberRecord[];
  projects: ProjectRecord[];
  project_versions: ProjectVersionRecord[];
  scenes: SceneRecord[];
  assets: AssetRecord[];
  avatars: AvatarRecord[];
  avatar_consents: AvatarConsentRecord[];
  voices: VoiceRecord[];
  voice_consents: VoiceConsentRecord[];
  templates: TemplateRecord[];
  ai_providers: AIProviderRecord[];
  ai_models: AIModelRecord[];
  generation_jobs: GenerationJobRecord[];
  render_jobs: RenderJobRecord[];
  plans: PlanRecord[];
  subscriptions: SubscriptionRecord[];
  credit_wallets: CreditWalletRecord[];
  credit_transactions: CreditTransactionRecord[];
  billing_events: BillingEventRecord[];
  notifications: NotificationRecord[];
  audit_logs: AuditLogRecord[];
  system_settings: SystemSettingRecord[];
}

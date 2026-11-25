'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Mic,
  LayoutTemplate,
  Cpu,
  Video,
  CreditCard,
  Settings,
  ShieldAlert,
  ArrowLeft,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  XCircle,
  Search,
  UserPlus,
  Star,
} from 'lucide-react';
import {
  AIModelRecord,
  AIProviderRecord,
  AuditLogRecord,
  AvatarConsentRecord,
  AvatarRecord,
  BillingEventRecord,
  CreditTransactionRecord,
  CreditWalletRecord,
  GenerationJobRecord,
  OrganizationRecord,
  PlanRecord,
  RenderJobRecord,
  SubscriptionRecord,
  SystemSettingRecord,
  TemplateRecord,
  UserRecord,
  VoiceConsentRecord,
  VoiceRecord,
} from '@/lib/db/types';

type AdminModuleId =
  | 'overview'
  | 'users'
  | 'avatars'
  | 'voices'
  | 'templates'
  | 'ai_models'
  | 'jobs'
  | 'billing'
  | 'settings'
  | 'security';

interface ProviderUsageRow {
  provider_id: string;
  provider_name: string;
  total_jobs: number;
  completed_jobs: number;
  failed_jobs: number;
  credits_used: number;
  cost_usd: number;
}

interface AdminPayload {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalWorkspaces: number;
    completedVideos: number;
    totalRevenueUsd: number;
    totalProcessingCostUsd: number;
    totalStorageBytes: number;
    failedJobsCount: number;
    providerUsage?: ProviderUsageRow[];
    queueHealth: {
      mode: string;
      redisConfigured: boolean;
      redisUrl: string;
      queues: Record<
        string,
        {
          queued: number;
          processing: number;
          completed: number;
          failed: number;
          cancelled: number;
        }
      >;
    };
  };
  users: UserRecord[];
  organizations: OrganizationRecord[];
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
  system_settings: SystemSettingRecord[];
  audit_logs: AuditLogRecord[];
}

export default function SuperAdminDashboardPage() {
  const [activeModule, setActiveModule] = useState<AdminModuleId>('overview');
  const [data, setData] = useState<AdminPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Module 2: User management state
  const [userSearch, setUserSearch] = useState('');
  const [creditDeltaInput, setCreditDeltaInput] = useState<number>(25);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserFirst, setNewUserFirst] = useState('');
  const [newUserLast, setNewUserLast] = useState('');
  const [newUserRole, setNewUserRole] = useState<'user' | 'admin' | 'super_admin'>('user');
  const [selectedActivityUserEmail, setSelectedActivityUserEmail] = useState<string | null>(null);

  // Module 3: New Avatar form
  const [newAvatarName, setNewAvatarName] = useState('');
  const [newAvatarCategory, setNewAvatarCategory] = useState('Professional');

  // Module 4: New Voice form
  const [newVoiceName, setNewVoiceName] = useState('');
  const [newVoiceLang, setNewVoiceLang] = useState('English (US)');

  // Module 5: New Template form
  const [newTplTitle, setNewTplTitle] = useState('');
  const [newTplCategory, setNewTplCategory] = useState('Recommended');

  // Module 6: Provider API key & rate limit inputs
  const [apiKeyInputs, setApiKeyInputs] = useState<Record<string, string>>({});

  // Module 9: System Settings numeric edits
  const [numericSettingInputs, setNumericSettingInputs] = useState<Record<string, string>>({});

  // Module 10: Security & Audit search
  const [auditSearch, setAuditSearch] = useState('');

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin', { cache: 'no-store' });
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const NAV_ITEMS: {
    id: AdminModuleId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'overview', label: '1. Overview', icon: LayoutDashboard },
    { id: 'users', label: '2. User Management', icon: Users },
    { id: 'avatars', label: '3. Avatar Management', icon: UserCheck },
    { id: 'voices', label: '4. Voice Management', icon: Mic },
    { id: 'templates', label: '5. Template Management', icon: LayoutTemplate },
    { id: 'ai_models', label: '6. AI Model Management', icon: Cpu },
    { id: 'jobs', label: '7. Video Generation', icon: Video },
    { id: 'billing', label: '8. Billing Management', icon: CreditCard },
    { id: 'settings', label: '9. System Settings', icon: Settings },
    { id: 'security', label: '10. Security & Audit', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#232833] flex flex-col md:flex-row overflow-x-hidden">
      {/* Left Super Admin Navigation Sidebar */}
      <aside className="w-full md:w-[265px] bg-[#16171a] text-white flex flex-col justify-between p-4 shrink-0 select-none">
        <div>
          <div className="flex items-center gap-3 px-2 py-3 border-b border-white/10 mb-4">
            <img
              src="/heygen-assets/logos/PRISM_ORB.svg"
              alt="HeyGen"
              className="w-7 h-7 object-contain"
            />
            <div>
              <div className="text-[14.5px] font-extrabold tracking-tight text-white">
                HeyGen Super Admin
              </div>
              <div className="text-[11px] text-[#00c4ff] font-semibold">
                Platform Operations Console
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full h-10 px-3 rounded-xl flex items-center gap-2.5 text-[12.5px] font-bold transition-colors ${
                    active
                      ? 'bg-[#00c4ff] text-[#16171a]'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-2">
          <Link
            href="/home"
            className="w-full h-9 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-[12px] font-bold flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to User App (/home)</span>
          </Link>
        </div>
      </aside>

      {/* Main Super Admin Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 overflow-y-auto overflow-x-hidden">
        <div className="max-w-[1220px] mx-auto">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-[24px] font-extrabold text-[#232833]">
                {NAV_ITEMS.find((n) => n.id === activeModule)?.label}
              </h1>
              <p className="text-[12.5px] text-[#687080]">
                Live metrics and database records — zero simulated or hardcoded metrics.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchAdminData}
              className="h-9 px-4 rounded-full bg-white border border-[#e2e3e6] hover:bg-[#f7f8fa] text-[12.5px] font-bold flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Live Data</span>
            </button>
          </div>

          {!data ? (
            <div className="p-12 text-center text-sm text-[#687080]">
              Loading Super Admin telemetry...
            </div>
          ) : (
            <>
              {/* MODULE 1: OVERVIEW */}
              {activeModule === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="p-5 rounded-2xl bg-white border border-[#eaecee] shadow-sm">
                      <div className="text-[12px] font-bold text-[#687080]">Total Users</div>
                      <div className="text-[28px] font-extrabold text-[#232833] mt-1">
                        {data.overview.totalUsers}
                      </div>
                      <div className="text-[11px] text-[#00a87e] font-semibold mt-1">
                        {data.overview.activeUsers} active accounts
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-[#eaecee] shadow-sm">
                      <div className="text-[12px] font-bold text-[#687080]">Workspaces</div>
                      <div className="text-[28px] font-extrabold text-[#232833] mt-1">
                        {data.overview.totalWorkspaces}
                      </div>
                      <div className="text-[11px] text-[#687080] mt-1">Multi-tenant RLS active</div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-[#eaecee] shadow-sm">
                      <div className="text-[12px] font-bold text-[#687080]">Videos Generated</div>
                      <div className="text-[28px] font-extrabold text-[#00a7d9] mt-1">
                        {data.overview.completedVideos}
                      </div>
                      <div className="text-[11px] text-[#687080] mt-1">
                        {data.generation_jobs.length} AI jobs · {data.render_jobs.length} renders
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-[#eaecee] shadow-sm">
                      <div className="text-[12px] font-bold text-[#687080]">Recorded Revenue</div>
                      <div className="text-[28px] font-extrabold text-[#00bf8f] mt-1">
                        ${data.overview.totalRevenueUsd}
                      </div>
                      <div className="text-[11px] text-[#687080] mt-1">
                        Processing cost: ${data.overview.totalProcessingCostUsd}
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-[#eaecee] shadow-sm">
                      <div className="text-[12px] font-bold text-[#687080]">Storage & Errors</div>
                      <div className="text-[24px] font-extrabold text-[#232833] mt-1">
                        {(data.overview.totalStorageBytes / (1024 * 1024)).toFixed(2)} MB
                      </div>
                      <div className="text-[11px] text-[#e54945] font-semibold mt-1">
                        {data.overview.failedJobsCount} failed jobs
                      </div>
                    </div>
                  </div>

                  {/* Queue Health & AI Provider Status */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-white border border-[#eaecee] shadow-sm">
                      <h2 className="text-[15px] font-extrabold text-[#232833] mb-3">
                        BullMQ / Worker Queue Health
                      </h2>
                      <div className="text-[12.5px] text-[#4e5666] mb-4">
                        Mode: <strong className="text-[#232833]">{data.overview.queueHealth.mode}</strong> ·
                        Redis: <span>{data.overview.queueHealth.redisUrl}</span>
                      </div>
                      <div className="space-y-3">
                        {Object.entries(data.overview.queueHealth.queues).map(([qName, counts]) => (
                          <div
                            key={qName}
                            className="p-3.5 rounded-xl bg-[#f7f8fa] border border-[#eaecee] flex items-center justify-between text-[12px]"
                          >
                            <span className="font-mono font-bold text-[#232833]">{qName}</span>
                            <div className="flex items-center gap-3">
                              <span>
                                Queued: <strong>{counts.queued}</strong>
                              </span>
                              <span>
                                Active: <strong>{counts.processing}</strong>
                              </span>
                              <span className="text-[#00a87e]">
                                Done: <strong>{counts.completed}</strong>
                              </span>
                              <span className="text-[#e54945]">
                                Failed: <strong>{counts.failed}</strong>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-[#eaecee] shadow-sm">
                      <h2 className="text-[15px] font-extrabold text-[#232833] mb-3">
                        AI Provider Infrastructure Status & Usage Metering
                      </h2>
                      <div className="space-y-2.5">
                        {data.ai_providers.map((p) => {
                          const usage = data.overview.providerUsage?.find(
                            (u) => u.provider_id === p.id
                          );
                          return (
                            <div
                              key={p.id}
                              className="p-3 rounded-xl bg-[#f7f8fa] border border-[#eaecee] flex items-center justify-between text-[12.5px]"
                            >
                              <div>
                                <div className="font-bold text-[#232833]">{p.name}</div>
                                <div className="text-[11px] text-[#687080]">
                                  Key: {p.env_key_name} · Rate Limit: {p.rate_limit_rpm} RPM · Jobs:{' '}
                                  <strong>{usage?.total_jobs ?? 0}</strong> ({usage?.credits_used ?? 0}{' '}
                                  cr / ${usage?.cost_usd ?? 0})
                                </div>
                              </div>
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase ${
                                  p.health_status === 'operational'
                                    ? 'bg-[#e6f9f3] text-[#00a87e]'
                                    : 'bg-[#fff8e6] text-[#b7791f]'
                                }`}
                              >
                                {p.health_status}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODULE 2: USER MANAGEMENT */}
              {activeModule === 'users' && (
                <div className="space-y-5">
                  {/* Create User Form */}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const res = await fetch('/api/admin', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          module: 'users',
                          action: 'create_user',
                          email: newUserEmail,
                          first_name: newUserFirst,
                          last_name: newUserLast,
                          role: newUserRole,
                        }),
                      });
                      const json = await res.json();
                      if (res.ok) {
                        setNewUserEmail('');
                        setNewUserFirst('');
                        setNewUserLast('');
                        await fetchAdminData();
                        notify(`Created user account ${json.user.email}`);
                      } else {
                        notify(json.error || 'Failed to create user');
                      }
                    }}
                    className="p-4 rounded-2xl bg-white border border-[#eaecee] flex flex-wrap items-center gap-3"
                  >
                    <div className="flex items-center gap-1.5 text-[13px] font-extrabold text-[#232833] mr-2">
                      <UserPlus className="w-4 h-4 text-[#00a7d9]" />
                      <span>Create User:</span>
                    </div>
                    <input
                      type="email"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="user@company.com"
                      className="h-9 px-3 rounded-xl border border-[#e2e3e6] text-[12.5px]"
                    />
                    <input
                      type="text"
                      value={newUserFirst}
                      onChange={(e) => setNewUserFirst(e.target.value)}
                      placeholder="First Name"
                      className="w-32 h-9 px-3 rounded-xl border border-[#e2e3e6] text-[12.5px]"
                    />
                    <input
                      type="text"
                      value={newUserLast}
                      onChange={(e) => setNewUserLast(e.target.value)}
                      placeholder="Last Name"
                      className="w-32 h-9 px-3 rounded-xl border border-[#e2e3e6] text-[12.5px]"
                    />
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as typeof newUserRole)}
                      className="h-9 px-3 rounded-xl border border-[#e2e3e6] text-[12.5px] font-bold"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                      <option value="super_admin">super_admin</option>
                    </select>
                    <button
                      type="submit"
                      className="h-9 px-4 rounded-full bg-[#19191a] text-white text-[12.5px] font-bold"
                    >
                      + Add Account
                    </button>
                  </form>

                  <div className="p-4 rounded-2xl bg-white border border-[#eaecee] flex flex-wrap items-center justify-between gap-4">
                    <div className="relative w-72">
                      <Search className="w-4 h-4 text-[#687080] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder="Search users by email or name..."
                        className="w-full h-9 pl-9 pr-3 rounded-full border border-[#e2e3e6] text-[12.5px]"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-[12.5px]">
                      <span className="font-bold text-[#4e5666]">Workspace Credit Adjustment:</span>
                      <input
                        type="number"
                        value={creditDeltaInput}
                        onChange={(e) => setCreditDeltaInput(Number(e.target.value))}
                        className="w-20 h-9 px-2.5 rounded-xl border border-[#e2e3e6] font-bold"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          await fetch('/api/admin', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              module: 'users',
                              action: 'adjust_credits',
                              user_id: data.users[0].id,
                              amount: creditDeltaInput,
                            }),
                          });
                          await fetchAdminData();
                          notify(`Adjusted workspace credits by ${creditDeltaInput}`);
                        }}
                        className="h-9 px-4 rounded-full bg-[#19191a] text-white font-bold"
                      >
                        Apply Credit Adjustment
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white border border-[#eaecee] overflow-hidden">
                    <table className="w-full text-left text-[13px]">
                      <thead className="bg-[#f7f8fa] border-b border-[#eaecee] text-[11.5px] font-extrabold text-[#687080] uppercase">
                        <tr>
                          <th className="py-3.5 px-4">User Email</th>
                          <th className="py-3.5 px-4">Name</th>
                          <th className="py-3.5 px-4">Role</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4">MFA</th>
                          <th className="py-3.5 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eaecee]">
                        {data.users
                          .filter(
                            (u) =>
                              !userSearch ||
                              u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                              u.first_name.toLowerCase().includes(userSearch.toLowerCase())
                          )
                          .map((u) => (
                            <tr key={u.id}>
                              <td className="py-3.5 px-4 font-bold text-[#232833]">{u.email}</td>
                              <td className="py-3.5 px-4">
                                {u.first_name || u.last_name
                                  ? `${u.first_name} ${u.last_name}`
                                  : 'Default Creator'}
                              </td>
                              <td className="py-3.5 px-4">
                                <select
                                  value={u.role}
                                  onChange={async (e) => {
                                    await fetch('/api/admin', {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        module: 'users',
                                        action: 'update_role',
                                        user_id: u.id,
                                        role: e.target.value,
                                      }),
                                    });
                                    await fetchAdminData();
                                    notify(`Updated role for ${u.email}`);
                                  }}
                                  className="h-8 px-2.5 rounded-lg border border-[#e2e3e6] text-[12px] font-bold"
                                >
                                  <option value="user">user</option>
                                  <option value="admin">admin</option>
                                  <option value="super_admin">super_admin</option>
                                </select>
                              </td>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                                    u.status === 'active'
                                      ? 'bg-[#e6f9f3] text-[#00a87e]'
                                      : 'bg-[#fff5f5] text-[#e54945]'
                                  }`}
                                >
                                  {u.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">{u.mfa_enabled ? 'Enabled' : 'Off'}</td>
                              <td className="py-3.5 px-4 flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const nextStatus =
                                      u.status === 'active' ? 'disabled' : 'active';
                                    await fetch('/api/admin', {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        module: 'users',
                                        action: 'update_status',
                                        user_id: u.id,
                                        status: nextStatus,
                                      }),
                                    });
                                    await fetchAdminData();
                                    notify(`Account ${u.email} is now ${nextStatus}`);
                                  }}
                                  className="px-3 py-1 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] text-[12px] font-bold"
                                >
                                  {u.status === 'active' ? 'Disable' : 'Enable'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedActivityUserEmail(
                                      selectedActivityUserEmail === u.email ? null : u.email
                                    )
                                  }
                                  className="px-3 py-1 rounded-full bg-[#e3f4fa] text-[#007091] text-[12px] font-bold"
                                >
                                  Activity Logs
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {selectedActivityUserEmail && (
                    <div className="p-5 rounded-2xl bg-white border border-[#00c4ff] space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[14px] font-extrabold text-[#232833]">
                          Activity Logs for {selectedActivityUserEmail}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setSelectedActivityUserEmail(null)}
                          className="text-xs font-bold text-[#687080]"
                        >
                          Close
                        </button>
                      </div>
                      <div className="divide-y divide-[#eaecee]">
                        {data.audit_logs
                          .filter((l) => l.actor_email === selectedActivityUserEmail)
                          .slice(0, 8)
                          .map((l) => (
                            <div
                              key={l.id}
                              className="py-2 flex items-center justify-between text-[12px]"
                            >
                              <span className="font-mono font-bold text-[#007091]">{l.action}</span>
                              <span className="text-[#687080]">
                                {new Date(l.created_at).toLocaleString()}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MODULE 3: AVATAR MANAGEMENT */}
              {activeModule === 'avatars' && (
                <div className="space-y-6">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newAvatarName.trim()) return;
                      await fetch('/api/avatars', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          name: newAvatarName,
                          subject_full_name: newAvatarName,
                          category: newAvatarCategory,
                          visibility: 'public',
                          consent_accepted: true,
                        }),
                      });
                      setNewAvatarName('');
                      await fetchAdminData();
                      notify('Published new avatar to catalog');
                    }}
                    className="p-4 rounded-2xl bg-white border border-[#eaecee] flex flex-wrap items-center gap-3"
                  >
                    <input
                      type="text"
                      required
                      value={newAvatarName}
                      onChange={(e) => setNewAvatarName(e.target.value)}
                      placeholder="New Avatar Name..."
                      className="h-9 px-3.5 rounded-xl border border-[#e2e3e6] text-[13px]"
                    />
                    <select
                      value={newAvatarCategory}
                      onChange={(e) => setNewAvatarCategory(e.target.value)}
                      className="h-9 px-3 rounded-xl border border-[#e2e3e6] text-[13px]"
                    >
                      <option value="Professional">Professional</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="UGC">UGC</option>
                      <option value="Community">Community</option>
                    </select>
                    <button
                      type="submit"
                      className="h-9 px-4 rounded-full bg-[#19191a] text-white text-[12.5px] font-bold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Publish Avatar</span>
                    </button>
                  </form>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.avatars.map((av) => (
                      <div
                        key={av.id}
                        className="p-4 rounded-2xl bg-white border border-[#eaecee] flex flex-col justify-between gap-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={av.main_thumbnail_url}
                              alt={av.name}
                              className="w-14 h-14 rounded-xl object-cover"
                            />
                            <div>
                              <div className="text-[14px] font-bold text-[#232833]">{av.name}</div>
                              <div className="text-[11.5px] text-[#687080]">
                                {av.category} · {av.look_thumbnails.length + 1} looks
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              await fetch(`/api/avatars?id=${av.id}`, { method: 'DELETE' });
                              await fetchAdminData();
                              notify(`Deleted avatar ${av.name}`);
                            }}
                            className="p-2 text-[#687080] hover:text-[#e54945]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="pt-2 border-t border-[#f2f3f5] flex items-center justify-between text-[11.5px]">
                          <select
                            aria-label="Avatar Visibility"
                            value={av.visibility}
                            onChange={async (e) => {
                              await fetch('/api/avatars', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: av.id, visibility: e.target.value }),
                              });
                              await fetchAdminData();
                              notify(`Updated visibility for ${av.name}`);
                            }}
                            className="h-7 px-2 rounded-lg border border-[#e2e3e6] font-bold"
                          >
                            <option value="public">public</option>
                            <option value="workspace">workspace</option>
                            <option value="private">private</option>
                          </select>

                          <button
                            type="button"
                            onClick={async () => {
                              await fetch('/api/avatars', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: av.id, is_new: !av.is_new }),
                              });
                              await fetchAdminData();
                            }}
                            className={`px-2.5 py-0.5 rounded-full font-bold ${
                              av.is_new
                                ? 'bg-[#f5ebd6] text-[#4b3d21]'
                                : 'bg-[#f2f3f5] text-[#687080]'
                            }`}
                          >
                            {av.is_new ? 'NEW Badge ON' : 'NEW Badge OFF'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Likeness Consent Records Table */}
                  <div className="p-5 rounded-2xl bg-white border border-[#eaecee]">
                    <h3 className="text-[15px] font-extrabold text-[#232833] mb-3">
                      Verified Likeness Consent Records ({data.avatar_consents.length})
                    </h3>
                    {data.avatar_consents.length === 0 ? (
                      <p className="text-[12.5px] text-[#687080]">
                        No custom avatar consent records submitted yet. Create a custom avatar from the user app to record a likeness attestation.
                      </p>
                    ) : (
                      <div className="divide-y divide-[#eaecee]">
                        {data.avatar_consents.map((c) => (
                          <div
                            key={c.id}
                            className="py-3 flex flex-wrap items-center justify-between gap-4 text-[12.5px]"
                          >
                            <div>
                              <div className="font-bold text-[#232833]">{c.subject_full_name}</div>
                              <div className="text-[#687080] italic">{c.consent_statement}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[11px] ${
                                  c.status === 'verified'
                                    ? 'bg-[#e6f9f3] text-[#00a87e]'
                                    : 'bg-[#fff5f5] text-[#e54945]'
                                }`}
                              >
                                {c.status}
                              </span>
                              <button
                                type="button"
                                onClick={async () => {
                                  const nextStatus =
                                    c.status === 'verified' ? 'revoked' : 'verified';
                                  await fetch('/api/admin', {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      module: 'avatar_consents',
                                      consent_id: c.id,
                                      status: nextStatus,
                                    }),
                                  });
                                  await fetchAdminData();
                                  notify(`Consent status set to ${nextStatus}`);
                                }}
                                className="px-3 py-1 rounded-full border border-[#e2e3e6] text-[11px] font-bold"
                              >
                                {c.status === 'verified' ? 'Revoke' : 'Verify'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MODULE 4: VOICE MANAGEMENT */}
              {activeModule === 'voices' && (
                <div className="space-y-6">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newVoiceName.trim()) return;
                      await fetch('/api/voices', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          mode: 'design',
                          name: newVoiceName,
                          language: newVoiceLang,
                          visibility: 'Public',
                          provider: 'heygen',
                          consent_accepted: true,
                        }),
                      });
                      setNewVoiceName('');
                      await fetchAdminData();
                      notify('Added voice to HeyGen catalog');
                    }}
                    className="p-4 rounded-2xl bg-white border border-[#eaecee] flex flex-wrap items-center gap-3"
                  >
                    <input
                      type="text"
                      required
                      value={newVoiceName}
                      onChange={(e) => setNewVoiceName(e.target.value)}
                      placeholder="Voice Name (e.g. Marcus - Narrator)"
                      className="h-9 px-3.5 rounded-xl border border-[#e2e3e6] text-[13px]"
                    />
                    <select
                      value={newVoiceLang}
                      onChange={(e) => setNewVoiceLang(e.target.value)}
                      className="h-9 px-3 rounded-xl border border-[#e2e3e6] text-[13px]"
                    >
                      <option value="English (US)">English (US)</option>
                      <option value="English (UK)">English (UK)</option>
                      <option value="English (Australia)">English (Australia)</option>
                    </select>
                    <button
                      type="submit"
                      className="h-9 px-4 rounded-full bg-[#19191a] text-white text-[12.5px] font-bold"
                    >
                      + Add Catalog Voice
                    </button>
                  </form>

                  <div className="rounded-2xl bg-white border border-[#eaecee] divide-y divide-[#eaecee]">
                    {data.voices.map((v) => (
                      <div key={v.id} className="p-4 flex items-center justify-between text-[13px]">
                        <div className="flex items-center gap-3">
                          <img src={v.flag_url} alt={v.language} className="w-6 h-4 rounded-sm" />
                          <div>
                            <div className="font-bold text-[#232833]">{v.name}</div>
                            <div className="text-[11.5px] text-[#687080]">
                              {v.language} · {v.subtitle_tags}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            aria-label="Voice Provider Mapping"
                            value={v.provider}
                            onChange={async (e) => {
                              await fetch('/api/voices', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: v.id, provider: e.target.value }),
                              });
                              await fetchAdminData();
                              notify(`Updated provider mapping for ${v.name}`);
                            }}
                            className="h-8 px-2.5 rounded-lg border border-[#e2e3e6] text-[12px] font-bold"
                          >
                            <option value="heygen">heygen</option>
                            <option value="elevenlabs">elevenlabs</option>
                            <option value="openai">openai</option>
                            <option value="azure">azure</option>
                            <option value="custom">custom</option>
                          </select>
                          <button
                            type="button"
                            onClick={async () => {
                              await fetch(`/api/voices?id=${v.id}`, { method: 'DELETE' });
                              await fetchAdminData();
                              notify(`Deleted voice ${v.name}`);
                            }}
                            className="p-1.5 text-[#687080] hover:text-[#e54945]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MODULE 5: TEMPLATE MANAGEMENT */}
              {activeModule === 'templates' && (
                <div className="space-y-6">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newTplTitle.trim()) return;
                      await fetch('/api/templates', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          title: newTplTitle,
                          category: newTplCategory,
                          subtitle: `${newTplCategory} · Official Template`,
                        }),
                      });
                      setNewTplTitle('');
                      await fetchAdminData();
                      notify('Published template to AI Studio');
                    }}
                    className="p-4 rounded-2xl bg-white border border-[#eaecee] flex flex-wrap items-center gap-3"
                  >
                    <input
                      type="text"
                      required
                      value={newTplTitle}
                      onChange={(e) => setNewTplTitle(e.target.value)}
                      placeholder="Template Title..."
                      className="h-9 px-3.5 rounded-xl border border-[#e2e3e6] text-[13px]"
                    />
                    <select
                      value={newTplCategory}
                      onChange={(e) => setNewTplCategory(e.target.value)}
                      className="h-9 px-3 rounded-xl border border-[#e2e3e6] text-[13px]"
                    >
                      <option value="Recommended">Recommended</option>
                      <option value="Training">Training</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                    </select>
                    <button
                      type="submit"
                      className="h-9 px-4 rounded-full bg-[#19191a] text-white text-[12.5px] font-bold"
                    >
                      + Publish Template
                    </button>
                  </form>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.templates.map((tpl) => (
                      <div
                        key={tpl.id}
                        className="p-4 rounded-2xl bg-white border border-[#eaecee] flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={tpl.thumbnail_url}
                            alt={tpl.title}
                            className="w-20 h-14 rounded-xl object-cover"
                          />
                          <div>
                            <div className="text-[14px] font-bold text-[#232833]">{tpl.title}</div>
                            <div className="text-[11.5px] text-[#687080]">{tpl.subtitle}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={async () => {
                              await fetch('/api/templates', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  id: tpl.id,
                                  is_featured: !tpl.is_featured,
                                }),
                              });
                              await fetchAdminData();
                            }}
                            className={`p-1.5 rounded-full ${
                              tpl.is_featured
                                ? 'bg-[#fff8e6] text-[#ffaa00]'
                                : 'bg-[#f2f3f5] text-[#687080]'
                            }`}
                            title="Toggle Featured"
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await fetch('/api/templates', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  id: tpl.id,
                                  is_published: !tpl.is_published,
                                }),
                              });
                              await fetchAdminData();
                            }}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                              tpl.is_published
                                ? 'bg-[#e6f9f3] text-[#00a87e]'
                                : 'bg-[#f2f3f5] text-[#687080]'
                            }`}
                          >
                            {tpl.is_published ? 'Published' : 'Draft'}
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await fetch(`/api/templates?id=${tpl.id}`, { method: 'DELETE' });
                              await fetchAdminData();
                            }}
                            className="p-1.5 text-[#687080] hover:text-[#e54945]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MODULE 6: AI MODEL & PROVIDER MANAGEMENT */}
              {activeModule === 'ai_models' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-[16px] font-extrabold text-[#232833]">
                      AI Providers, Rate Limits & Fallback Policies
                    </h2>
                    {data.ai_providers.map((p) => (
                      <div
                        key={p.id}
                        className="p-5 rounded-2xl bg-white border border-[#eaecee] space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2.5">
                              <span className="text-[15px] font-extrabold text-[#232833]">
                                {p.name}
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                                  p.health_status === 'operational'
                                    ? 'bg-[#e6f9f3] text-[#00a87e]'
                                    : 'bg-[#fff8e6] text-[#b7791f]'
                                }`}
                              >
                                {p.health_status}
                              </span>
                            </div>
                            <div className="text-[12px] text-[#687080] mt-0.5">
                              Endpoint: <code>{p.base_url}</code> · Env Variable:{' '}
                              <code>{p.env_key_name}</code> · Capabilities:{' '}
                              {p.capabilities.join(', ')}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-[12px]">
                            <label className="flex items-center gap-1.5">
                              <span className="font-bold text-[#687080]">RPM:</span>
                              <input
                                type="number"
                                defaultValue={p.rate_limit_rpm}
                                onBlur={async (e) => {
                                  await fetch('/api/admin', {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      module: 'ai_providers',
                                      provider_id: p.id,
                                      rate_limit_rpm: Number(e.target.value),
                                    }),
                                  });
                                  await fetchAdminData();
                                  notify(`Updated rate limit for ${p.name}`);
                                }}
                                className="w-16 h-8 px-2 rounded-lg border border-[#e2e3e6] font-bold"
                              />
                            </label>

                            <label className="flex items-center gap-1.5">
                              <span className="font-bold text-[#687080]">Fallback:</span>
                              <select
                                value={p.fallback_provider_id || ''}
                                onChange={async (e) => {
                                  await fetch('/api/admin', {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      module: 'ai_providers',
                                      provider_id: p.id,
                                      fallback_provider_id: e.target.value || null,
                                    }),
                                  });
                                  await fetchAdminData();
                                  notify(`Updated fallback policy for ${p.name}`);
                                }}
                                className="h-8 px-2 rounded-lg border border-[#e2e3e6] font-bold"
                              >
                                <option value="">None</option>
                                {data.ai_providers
                                  .filter((other) => other.id !== p.id)
                                  .map((other) => (
                                    <option key={other.id} value={other.id}>
                                      {other.name.split(' (')[0]}
                                    </option>
                                  ))}
                              </select>
                            </label>

                            <button
                              type="button"
                              onClick={async () => {
                                await fetch('/api/admin', {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    module: 'ai_providers',
                                    provider_id: p.id,
                                    enabled: !p.enabled,
                                  }),
                                });
                                await fetchAdminData();
                                notify(`${p.name} ${!p.enabled ? 'enabled' : 'disabled'}`);
                              }}
                              className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold ${
                                p.enabled
                                  ? 'bg-[#19191a] text-white'
                                  : 'bg-[#eaecee] text-[#687080]'
                              }`}
                            >
                              {p.enabled ? 'Enabled' : 'Disabled'}
                            </button>
                          </div>
                        </div>

                        {p.id !== 'prov-local-ffmpeg' && (
                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#f2f3f5]">
                            <input
                              type="password"
                              value={apiKeyInputs[p.id] || ''}
                              onChange={(e) =>
                                setApiKeyInputs((prev) => ({ ...prev, [p.id]: e.target.value }))
                              }
                              placeholder={`Configure ${p.env_key_name} override...`}
                              className="flex-1 h-9 px-3 rounded-xl border border-[#e2e3e6] text-[12.5px]"
                            />
                            <button
                              type="button"
                              onClick={async () => {
                                await fetch('/api/admin', {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    module: 'ai_providers',
                                    provider_id: p.id,
                                    custom_api_key: apiKeyInputs[p.id] || '',
                                  }),
                                });
                                await fetchAdminData();
                                notify(`Updated API credentials for ${p.name}`);
                              }}
                              className="h-9 px-4 rounded-full bg-[#00c4ff] text-[#232833] text-[12px] font-bold"
                            >
                              Save API Key
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* AI Models Pricing & Activation Table */}
                  <div className="rounded-2xl bg-white border border-[#eaecee] overflow-hidden">
                    <div className="p-4 border-b border-[#eaecee] font-extrabold text-[15px]">
                      AI Model Catalog & Credit Pricing
                    </div>
                    <table className="w-full text-left text-[13px]">
                      <thead className="bg-[#f7f8fa] border-b border-[#eaecee] text-[11.5px] font-extrabold text-[#687080] uppercase">
                        <tr>
                          <th className="py-3 px-4">Model Name</th>
                          <th className="py-3 px-4">Task Type</th>
                          <th className="py-3 px-4">Credits / Unit</th>
                          <th className="py-3 px-4">Cost USD / Unit</th>
                          <th className="py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eaecee]">
                        {data.ai_models.map((m) => (
                          <tr key={m.id}>
                            <td className="py-3 px-4 font-bold text-[#232833]">{m.name}</td>
                            <td className="py-3 px-4 font-mono text-[12px]">{m.task_type}</td>
                            <td className="py-3 px-4">
                              <input
                                type="number"
                                step="0.5"
                                defaultValue={m.credits_per_unit}
                                onBlur={async (e) => {
                                  await fetch('/api/admin', {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      module: 'ai_models',
                                      model_id: m.id,
                                      credits_per_unit: Number(e.target.value),
                                    }),
                                  });
                                  await fetchAdminData();
                                  notify(`Updated credit pricing for ${m.name}`);
                                }}
                                className="w-16 h-8 px-2 rounded-lg border border-[#e2e3e6] font-bold"
                              />
                            </td>
                            <td className="py-3 px-4">${m.cost_usd_per_unit}</td>
                            <td className="py-3 px-4">
                              <button
                                type="button"
                                onClick={async () => {
                                  await fetch('/api/admin', {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      module: 'ai_models',
                                      model_id: m.id,
                                      active: !m.active,
                                    }),
                                  });
                                  await fetchAdminData();
                                }}
                                className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                                  m.active
                                    ? 'bg-[#e6f9f3] text-[#00a87e]'
                                    : 'bg-[#f2f3f5] text-[#687080]'
                                }`}
                              >
                                {m.active ? 'Active' : 'Inactive'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* MODULE 7: VIDEO GENERATION MANAGEMENT */}
              {activeModule === 'jobs' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-white border border-[#eaecee]">
                    <h2 className="text-[15px] font-extrabold text-[#232833] mb-3">
                      AI Generation Jobs ({data.generation_jobs.length})
                    </h2>
                    {data.generation_jobs.length === 0 ? (
                      <p className="text-[12.5px] text-[#687080]">
                        No AI generation jobs submitted yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {data.generation_jobs.map((job) => (
                          <div
                            key={job.id}
                            className="p-4 rounded-xl bg-[#f7f8fa] border border-[#eaecee] flex flex-wrap items-center justify-between gap-4 text-[12.5px]"
                          >
                            <div className="space-y-1 max-w-xl">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[#232833]">{job.id}</span>
                                <span className="px-2 py-0.5 rounded bg-white border border-[#eaecee] font-bold">
                                  {job.task_type}
                                </span>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                                    job.status === 'completed'
                                      ? 'bg-[#e6f9f3] text-[#00a87e]'
                                      : job.status === 'failed'
                                      ? 'bg-[#fff5f5] text-[#e54945]'
                                      : 'bg-[#e3f4fa] text-[#007091]'
                                  }`}
                                >
                                  {job.status}
                                </span>
                              </div>
                              <div className="text-[#687080]">
                                Provider: <strong>{job.provider_id}</strong> · Credits:{' '}
                                {job.credits_charged} · Cost: ${job.cost_usd}
                              </div>
                              {job.error_message && (
                                <div className="text-[#e54945] font-medium flex items-center gap-1">
                                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                  <span>{job.error_message}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {job.output_url && (
                                <a
                                  href={job.output_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1.5 rounded-full bg-[#e3f4fa] text-[#007091] font-bold"
                                >
                                  View Output MP4
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={async () => {
                                  await fetch('/api/jobs', {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      id: job.id,
                                      action: 'retry',
                                      provider_id: 'prov-local-ffmpeg',
                                      model_id: 'mdl-local-ffmpeg-composer',
                                    }),
                                  });
                                  await fetchAdminData();
                                  notify('Retried job on operational FFmpeg engine');
                                }}
                                className="px-3 py-1.5 rounded-full bg-[#19191a] text-white font-bold flex items-center gap-1"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Retry</span>
                              </button>
                              {job.status !== 'cancelled' && job.status !== 'completed' && (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    await fetch('/api/jobs', {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ id: job.id, action: 'cancel' }),
                                    });
                                    await fetchAdminData();
                                    notify('Cancelled job');
                                  }}
                                  className="px-3 py-1.5 rounded-full border border-[#feb2b2] text-[#e54945] font-bold flex items-center gap-1"
                                >
                                  <XCircle className="w-3 h-3" />
                                  <span>Cancel</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Render Jobs */}
                  <div className="p-5 rounded-2xl bg-white border border-[#eaecee]">
                    <h2 className="text-[15px] font-extrabold text-[#232833] mb-3">
                      FFmpeg + Remotion Render Jobs ({data.render_jobs.length})
                    </h2>
                    {data.render_jobs.length === 0 ? (
                      <p className="text-[12.5px] text-[#687080]">No studio render jobs yet.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {data.render_jobs.map((r) => (
                          <div
                            key={r.id}
                            className="p-3.5 rounded-xl bg-[#f7f8fa] border border-[#eaecee] flex items-center justify-between text-[12.5px]"
                          >
                            <div>
                              <span className="font-mono font-bold">{r.id}</span> · Project:{' '}
                              <strong>{r.project_id}</strong> · {r.resolution} ·{' '}
                              {r.file_size_bytes
                                ? `${(r.file_size_bytes / 1024).toFixed(1)} KB`
                                : ''}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="px-2.5 py-0.5 rounded-full bg-[#e6f9f3] text-[#00a87e] font-bold uppercase text-[11px]">
                                {r.status}
                              </span>
                              {r.output_url && (
                                <a
                                  href={r.output_url}
                                  download
                                  className="text-[#00a7d9] font-bold hover:underline"
                                >
                                  Download MP4
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MODULE 8: BILLING MANAGEMENT */}
              {activeModule === 'billing' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.plans.map((p) => (
                      <div
                        key={p.id}
                        className="p-5 rounded-2xl bg-white border border-[#eaecee] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[16px] font-extrabold text-[#232833]">{p.name}</span>
                          <span className="text-[11px] font-bold text-[#00a87e] uppercase">
                            Max {p.max_resolution}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[12px]">
                          <div>
                            <label className="block font-bold text-[#687080] mb-1">
                              Monthly USD
                            </label>
                            <input
                              type="number"
                              defaultValue={p.price_monthly_usd}
                              onBlur={async (e) => {
                                await fetch('/api/admin', {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    module: 'plans',
                                    plan_id: p.id,
                                    price_monthly_usd: Number(e.target.value),
                                  }),
                                });
                                await fetchAdminData();
                                notify(`Updated monthly price for ${p.name}`);
                              }}
                              className="w-full h-9 px-2.5 rounded-xl border border-[#e2e3e6] font-extrabold"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-[#687080] mb-1">
                              Monthly Credits
                            </label>
                            <input
                              type="number"
                              defaultValue={p.monthly_credits}
                              onBlur={async (e) => {
                                await fetch('/api/admin', {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    module: 'plans',
                                    plan_id: p.id,
                                    monthly_credits: Number(e.target.value),
                                  }),
                                });
                                await fetchAdminData();
                                notify(`Updated monthly credits for ${p.name}`);
                              }}
                              className="w-full h-9 px-2.5 rounded-xl border border-[#e2e3e6] font-extrabold"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Billing Events / Invoices */}
                  <div className="rounded-2xl bg-white border border-[#eaecee] p-5">
                    <h3 className="text-[15px] font-extrabold text-[#232833] mb-3">
                      Recorded Payments & Invoices ({data.billing_events.length})
                    </h3>
                    {data.billing_events.length === 0 ? (
                      <p className="text-[12.5px] text-[#687080]">
                        No paid invoices recorded yet. Top up credits or upgrade a plan to generate a billing event.
                      </p>
                    ) : (
                      <div className="divide-y divide-[#eaecee]">
                        {data.billing_events.map((b) => (
                          <div
                            key={b.id}
                            className="py-3 flex items-center justify-between text-[12.5px]"
                          >
                            <div>
                              <div className="font-bold text-[#232833]">{b.event_type}</div>
                              <div className="text-[11px] text-[#687080]">
                                {new Date(b.created_at).toLocaleString()}
                              </div>
                            </div>
                            <span className="font-extrabold text-[#00bf8f]">
                              ${b.amount_usd} {b.currency} ({b.status})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl bg-white border border-[#eaecee] p-5">
                    <h3 className="text-[15px] font-extrabold text-[#232833] mb-3">
                      Credit Transactions Ledger ({data.credit_transactions.length})
                    </h3>
                    <div className="divide-y divide-[#eaecee]">
                      {data.credit_transactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="py-3 flex items-center justify-between text-[12.5px]"
                        >
                          <div>
                            <div className="font-bold text-[#232833]">{tx.description}</div>
                            <div className="text-[11px] text-[#687080]">
                              {tx.transaction_type} · {new Date(tx.created_at).toLocaleString()}
                            </div>
                          </div>
                          <span
                            className={`font-extrabold ${
                              tx.amount >= 0 ? 'text-[#00bf8f]' : 'text-[#232833]'
                            }`}
                          >
                            {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} credits
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* MODULE 9: SYSTEM SETTINGS */}
              {activeModule === 'settings' && (
                <div className="rounded-2xl bg-white border border-[#eaecee] divide-y divide-[#eaecee]">
                  {data.system_settings.map((s) => (
                    <div key={s.key} className="p-5 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[14px] font-extrabold font-mono text-[#232833]">
                          {s.key}
                        </div>
                        <div className="text-[12.5px] text-[#687080] mt-0.5">{s.description}</div>
                      </div>

                      {typeof s.value === 'boolean' ? (
                        <button
                          type="button"
                          onClick={async () => {
                            await fetch('/api/admin', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                module: 'system_settings',
                                key: s.key,
                                value: !s.value,
                              }),
                            });
                            await fetchAdminData();
                            notify(`Updated ${s.key}`);
                          }}
                          className={`px-4 py-1.5 rounded-full text-[12px] font-bold ${
                            s.value
                              ? 'bg-[#e6f9f3] text-[#00a87e]'
                              : 'bg-[#f2f3f5] text-[#687080]'
                          }`}
                        >
                          {s.value ? 'Enabled (true)' : 'Disabled (false)'}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={numericSettingInputs[s.key] ?? String(s.value)}
                            onChange={(e) =>
                              setNumericSettingInputs((prev) => ({
                                ...prev,
                                [s.key]: e.target.value,
                              }))
                            }
                            className="w-28 h-9 px-3 rounded-xl border border-[#e2e3e6] font-mono text-[12.5px] font-bold"
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              const val = Number(numericSettingInputs[s.key] ?? s.value);
                              await fetch('/api/admin', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  module: 'system_settings',
                                  key: s.key,
                                  value: val,
                                }),
                              });
                              await fetchAdminData();
                              notify(`Saved ${s.key} = ${val}`);
                            }}
                            className="h-9 px-4 rounded-full bg-[#19191a] text-white text-[12px] font-bold"
                          >
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* MODULE 10: SECURITY & AUDIT */}
              {activeModule === 'security' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-white border border-[#eaecee] flex flex-wrap items-center justify-between gap-4">
                    <div className="relative w-80">
                      <Search className="w-4 h-4 text-[#687080] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={auditSearch}
                        onChange={(e) => setAuditSearch(e.target.value)}
                        placeholder="Filter audit logs by action or email..."
                        className="w-full h-9 pl-9 pr-3 rounded-full border border-[#e2e3e6] text-[12.5px]"
                      />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#e6f9f3] text-[#00a87e] text-[11.5px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Server-Side RBAC, Consent Attestation & RLS Active</span>
                    </span>
                  </div>

                  <div className="rounded-2xl bg-white border border-[#eaecee] overflow-hidden">
                    <div className="p-4 border-b border-[#eaecee] font-extrabold text-[15px]">
                      Immutable Privileged Action & Security Audit Logs ({data.audit_logs.length})
                    </div>
                    <div className="divide-y divide-[#eaecee]">
                      {data.audit_logs
                        .filter(
                          (log) =>
                            !auditSearch ||
                            log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
                            log.actor_email.toLowerCase().includes(auditSearch.toLowerCase())
                        )
                        .map((log) => (
                          <div
                            key={log.id}
                            className="p-4 flex items-start justify-between text-[12.5px]"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[#007091]">
                                  {log.action}
                                </span>
                                <span className="text-[#687080]">by</span>
                                <strong className="text-[#232833]">{log.actor_email}</strong>
                              </div>
                              <div className="text-[11.5px] text-[#687080] mt-1 font-mono">
                                Target: {log.target_type}/{log.target_id} · Metadata:{' '}
                                {JSON.stringify(log.metadata)}
                              </div>
                            </div>
                            <span className="text-[11px] text-[#687080] shrink-0">
                              {new Date(log.created_at).toLocaleString()}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full bg-[#16171a] text-white text-[13px] font-bold shadow-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00c4ff]" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

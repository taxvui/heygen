'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import {
  X,
  Check,
  User,
  Sliders,
  Sparkles,
  Users,
  Settings,
  CreditCard,
  Clock,
  Shield,
  Link2,
  CheckCircle2,
  Mic,
  Download,
  ChevronRight,
  ChevronDown,
  Plus,
  MessageSquare,
  Bell,
  ArrowRight,
  ArrowUp,
  Lock,
  Music,
  Play,
} from 'lucide-react';
import { IconGoldDiamond, IconOrbyBot, IconVideoAgentWand } from '@heygen/ui/icons';

export function GlobalModals() {
  const router = useRouter();
  const {
    activeModal,
    settingsTab,
    setActiveModal,
    user,
    organization,
    avatars,
    voices,
    bootstrap,
    showToast,
  } = useHeyGenStore();

  // Sign-In state
  const [emailInput, setEmailInput] = useState(user?.email || 'creator@heygen.local');
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  // Settings form state
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [workspaceName, setWorkspaceName] = useState(organization?.name || 'Default Space');
  const [workspaceDesc, setWorkspaceDesc] = useState('');
  const [appearanceMode, setAppearanceMode] = useState<'Light' | 'Auto' | 'Dark'>('Auto');
  const [personalizationSubTab, setPersonalizationSubTab] = useState<'Profile' | 'Memory'>('Profile');
  const [sharedAvatarsSubTab, setSharedAvatarsSubTab] = useState<'My Avatars' | 'Shared with Me'>('My Avatars');
  const [watermarkEnforced, setWatermarkEnforced] = useState(false);

  // Upgrade Plan modal state
  const [planAudience, setPlanAudience] = useState<'Individual' | 'Business'>('Individual');
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Annual'>('Monthly');
  const [proCreditsTier, setProCreditsTier] = useState('1,000 credits');

  // Choose Avatar & Choose Voice modal tab states
  const [chooseAvatarTab, setChooseAvatarTab] = useState<'my' | 'public'>('my');
  const [chooseVoiceTab, setChooseVoiceTab] = useState<'my' | 'library'>('my');

  // Create Avatar & Consent state
  const [avatarName, setAvatarName] = useState('');
  const [subjectFullName, setSubjectFullName] = useState('');
  const [avatarCategory, setAvatarCategory] = useState<'Professional' | 'Lifestyle' | 'UGC'>('Professional');
  const [avatarGender, setAvatarGender] = useState<'Female' | 'Male'>('Female');
  const [consentChecked, setConsentChecked] = useState(true);
  const [submittingAvatar, setSubmittingAvatar] = useState(false);

  // Create/Design/Import Voice states
  const [designVoicePrompt, setDesignVoicePrompt] = useState('');
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState('');

  // Create Avatar Look state
  const [lookTargetAvatarId, setLookTargetAvatarId] = useState('avatar-annie');
  const [lookOutfitPreset, setLookOutfitPreset] = useState('Executive Boardroom Suit');
  const [lookPrompt, setLookPrompt] = useState(
    'Modern glass studio with warm rim lighting and tailored navy blazer'
  );
  const [submittingLook, setSubmittingLook] = useState(false);

  // Orby Assistant Chat state
  const [orbyQuery, setOrbyQuery] = useState('');
  const [orbyTab, setOrbyTab] = useState<'chat' | 'updates'>('chat');
  const [orbyMessages, setOrbyMessages] = useState<{ role: 'orby' | 'user'; text: string }[]>([]);

  if (!activeModal) return null;

  const handleSaveProfile = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_profile',
        first_name: firstName,
        last_name: lastName,
        email: emailInput,
      }),
    });
    await bootstrap();
    showToast('Account profile saved');
  };

  const handleToggleMfa = async (nextMfa: boolean) => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_profile',
        mfa_enabled: nextMfa,
      }),
    });
    await bootstrap();
    showToast(nextMfa ? '2-Factor Authentication enabled' : '2-Factor Authentication disabled');
  };

  const handleSaveWorkspaceName = async () => {
    await fetch('/api/workspace', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: workspaceName }),
    });
    await bootstrap();
    showToast('Workspace updated');
  };

  const handleSelectPlan = async (planId: string) => {
    const res = await fetch('/api/billing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'change_plan', plan_id: planId }),
    });
    if (res.ok) {
      await bootstrap();
      setActiveModal(null);
      showToast('Subscription plan updated & credits added!');
    }
  };

  const handleCreateCustomAvatar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAvatar(true);
    try {
      const res = await fetch('/api/avatars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: avatarName || subjectFullName,
          subject_full_name: subjectFullName,
          category: avatarCategory,
          gender: avatarGender,
          consent_accepted: consentChecked,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        await bootstrap();
        setActiveModal(null);
        showToast(`Custom Avatar "${data.avatar.name}" created with verified likeness consent!`);
      } else {
        showToast(data.error || 'Failed to create avatar');
      }
    } finally {
      setSubmittingAvatar(false);
    }
  };

  // 1. SIGN-IN MODAL (Exact 410x502px reference design from step_16_shot_1.png)
  if (activeModal === 'signin') {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1219]/45 backdrop-blur-[5px]"
        onClick={() => setActiveModal(null)}
      >
        <div
          className="relative w-[410px] min-h-[502px] rounded-[20px] bg-white px-10 pt-10 pb-7 shadow-[0_20px_60px_rgba(0,0,0,0.22)] flex flex-col items-center justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Close sign in dialog"
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#687080] hover:bg-[#f2f3f5]"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-full flex flex-col items-center">
            <img
              src="/heygen-assets/logos/HeyGen_Primary_Logo_Black_RGB.svg"
              alt="HeyGen"
              className="w-[135px] h-[80px] object-contain mb-9"
            />

            {!showEmailLogin ? (
              <div className="w-full space-y-3">
                <button
                  type="button"
                  onClick={async () => {
                    await fetch('/api/auth', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        action: 'sign_in',
                        method: 'google',
                        email: 'creator@heygen.local',
                        first_name: 'Alex',
                      }),
                    });
                    await bootstrap();
                    setActiveModal(null);
                    showToast('Signed in with Google workspace account');
                  }}
                  className="w-full h-12 rounded-full bg-[#232833] hover:bg-[#343b4a] text-white text-[14px] font-semibold flex items-center justify-center gap-3 transition-colors"
                >
                  <span className="font-bold text-[#4285F4] bg-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                    G
                  </span>
                  <span>Sign in with Google</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await fetch('/api/auth', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        action: 'sign_in',
                        method: 'apple',
                        email: 'creator@heygen.local',
                      }),
                    });
                    await bootstrap();
                    setActiveModal(null);
                    showToast('Signed in with Apple ID');
                  }}
                  className="w-full h-12 rounded-full bg-white hover:bg-[#f7f8fa] border border-[#e2e3e6] text-[#232833] text-[14px] font-semibold flex items-center justify-center gap-3 transition-colors"
                >
                  <span></span>
                  <span>Sign in with Apple</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowEmailLogin(true)}
                  className="w-full h-12 rounded-full bg-white hover:bg-[#f7f8fa] border border-[#e2e3e6] text-[#232833] text-[14px] font-semibold flex items-center justify-center gap-3 transition-colors"
                >
                  <span>✉</span>
                  <span>Sign in with Email</span>
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setShowEmailLogin(true)}
                    className="text-[13px] font-medium text-[#232833] hover:underline"
                  >
                    Other ways to sign in
                  </button>
                </div>
              </div>
            ) : (
              <form
                className="w-full space-y-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      action: 'sign_in',
                      method: 'email',
                      email: emailInput,
                    }),
                  });
                  await bootstrap();
                  setActiveModal(null);
                  showToast(`Signed in as ${emailInput}`);
                }}
              >
                <label className="block text-xs font-semibold text-[#4e5666]">
                  Work Email Address
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="mt-1.5 w-full h-11 px-3.5 rounded-xl border border-[#e2e3e6] text-sm text-[#232833] focus:outline-none focus:border-[#00c4ff]"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full h-11 rounded-full bg-[#232833] text-white text-sm font-semibold hover:bg-[#343b4a]"
                >
                  Continue with Email
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailLogin(false)}
                  className="w-full text-xs text-[#687080] hover:text-[#232833]"
                >
                  ← Back to all sign in methods
                </button>
              </form>
            )}
          </div>

          <p className="text-[11px] leading-[15px] text-[#687080] text-center mt-6">
            By signing in, you agree to the{' '}
            <span className="underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    );
  }

  // 2. WORKSPACE & PROFILE SETTINGS MODAL (Exact 954x810px 2-pane modal from step_63_shot_1..8)
  if (activeModal === 'settings') {
    const profileTabs = [
      { id: 'Account', label: 'Account', icon: User },
      { id: 'Preferences', label: 'Preferences', icon: Sliders },
      { id: 'Personalization', label: 'Personalization', icon: Sparkles },
      { id: 'Shared avatars', label: 'Shared avatars', icon: Users },
    ];
    const workspaceTabs = [
      { id: 'General', label: 'General', icon: Settings },
      { id: 'Plan & Billing', label: 'Plan & Billing', icon: CreditCard },
      { id: 'Usage & History', label: 'Usage & History', icon: Clock },
      { id: 'Security', label: 'Security', icon: Shield },
      { id: 'Connections', label: 'Connections', icon: Link2 },
    ];

    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1219]/45 backdrop-blur-[4px] p-4 sm:p-6"
        onClick={() => setActiveModal(null)}
      >
        <div
          className="relative w-full max-w-[954px] h-[810px] max-h-[90vh] rounded-[20px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.22)] border border-[#eaecee] flex overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Close settings"
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-[#687080] hover:bg-[#f2f3f5]"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left Navigation Rail (215px) */}
          <aside className="w-[215px] border-r border-[#eaecee] px-3 py-6 flex flex-col justify-between bg-white shrink-0">
            <div className="space-y-6">
              <div>
                <div className="px-3 mb-2 text-[12px] font-medium text-[#687080]">
                  Profile Settings
                </div>
                <nav className="space-y-0.5">
                  {profileTabs.map((t) => {
                    const Icon = t.icon;
                    const active = settingsTab === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveModal('settings', t.id)}
                        className={`w-full h-9 px-3 rounded-full flex items-center gap-2.5 text-[13px] transition-colors ${
                          active
                            ? 'bg-[#e3f4fa] text-[#232833] font-semibold'
                            : 'text-[#232833] hover:bg-[#f2f3f5]'
                        }`}
                      >
                        {t.id === 'Account' ? (
                          <span className="w-3.5 h-3.5 rounded-full bg-[#00b8ff] shrink-0" />
                        ) : (
                          <Icon className="w-4 h-4 shrink-0" />
                        )}
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div>
                <div className="px-3 mb-2 text-[12px] font-medium text-[#687080]">
                  Workspace Settings
                </div>
                <nav className="space-y-0.5">
                  {workspaceTabs.map((t) => {
                    const Icon = t.icon;
                    const active = settingsTab === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveModal('settings', t.id)}
                        className={`w-full h-9 px-3 rounded-full flex items-center gap-2.5 text-[13px] transition-colors ${
                          active
                            ? 'bg-[#e3f4fa] text-[#232833] font-semibold'
                            : 'text-[#232833] hover:bg-[#f2f3f5]'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>

          {/* Right Settings Content Pane */}
          <div className="flex-1 overflow-y-auto px-8 sm:px-10 py-8">
            {/* TAB 1: ACCOUNT (step_44_shot_2.png) */}
            {settingsTab === 'Account' && (
              <div className="max-w-[540px] space-y-6">
                <h2 className="text-[18px] font-bold text-[#232833]">Account</h2>

                <div>
                  <div className="text-[13px] font-semibold text-[#232833] mb-3">
                    Profile Picture
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#eaecee] flex items-center justify-center text-[#4e5666] text-xl font-medium">
                      +
                    </div>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => showToast('Avatar profile picture applied')}
                        className="block w-44 h-8 rounded-full bg-[#19191a] text-white text-[12px] font-semibold hover:bg-[#343842]"
                      >
                        Choose from avatars
                      </button>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => showToast('Profile photo updated')}
                          className="w-44 h-8 rounded-full border border-[#e2e3e6] text-[#232833] text-[12px] font-semibold hover:bg-[#f7f8fa]"
                        >
                          Upload photo
                        </button>
                        <span className="text-[11px] text-[#687080]">Pick a photo up to 2MB.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#232833] mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onBlur={handleSaveProfile}
                      className="w-full h-10 px-3.5 rounded-xl border border-[#e2e3e6] text-[13px] focus:outline-none focus:border-[#00c4ff]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#232833] mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onBlur={handleSaveProfile}
                      className="w-full h-10 px-3.5 rounded-xl border border-[#e2e3e6] text-[13px] focus:outline-none focus:border-[#00c4ff]"
                    />
                  </div>
                </div>

                <div>
                  <div className="text-[12px] font-semibold text-[#232833] mb-1.5">Email</div>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="h-8 px-4 rounded-full border border-[#e2e3e6] text-[12px] font-semibold text-[#232833] hover:bg-[#f7f8fa]"
                  >
                    Change email
                  </button>
                </div>

                <div>
                  <div className="text-[12px] font-semibold text-[#232833] mb-1.5">Password</div>
                  <button
                    type="button"
                    onClick={() => showToast('Password update link sent to your email')}
                    className="h-8 px-4 rounded-full border border-[#e2e3e6] text-[12px] font-semibold text-[#232833] hover:bg-[#f7f8fa]"
                  >
                    Create password
                  </button>
                </div>

                <div>
                  <div className="text-[12px] font-semibold text-[#232833] mb-2">
                    2-factor authentication
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleToggleMfa(!user?.mfa_enabled)}
                      className={`w-10 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                        user?.mfa_enabled
                          ? 'bg-[#00c4ff] justify-end'
                          : 'bg-[#4e5666] justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white" />
                    </button>
                    <span className="text-[12px] text-[#687080]">
                      {user?.mfa_enabled ? 'On' : 'Off'}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#687080] mt-1">
                    {user?.mfa_enabled
                      ? '2FA is active on your account.'
                      : '2FA is disabled on your account.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#eaecee]">
                  <div className="text-[12px] font-semibold text-[#232833] mb-2.5">
                    Connected accounts
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Google account connected')}
                    className="w-full h-10 rounded-xl bg-[#f7f8fa] hover:bg-[#eaecee] text-[13px] font-semibold text-[#232833] flex items-center justify-center gap-2"
                  >
                    <span className="font-bold text-[#4285F4]">G</span>
                    <span>Connect Google</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-[#eaecee] flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => showToast('Account deletion requires confirmation via email')}
                    className="h-8 px-4 rounded-full bg-[#e54945] text-white text-[12px] font-semibold hover:bg-[#d13b37]"
                  >
                    Delete Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModal('signin')}
                    className="h-8 px-4 rounded-full border border-[#e2e3e6] text-[#232833] text-[12px] font-semibold hover:bg-[#f7f8fa]"
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: PREFERENCES (Exact match to step_63_shot_1_popup_04_settings_preferences.png) */}
            {settingsTab === 'Preferences' && (
              <div className="max-w-[640px] space-y-6">
                <h2 className="text-[18px] font-extrabold text-[#232833]">Preferences</h2>

                <div>
                  <label className="block text-[12.5px] font-bold text-[#232833] mb-2">
                    Language
                  </label>
                  <div className="relative flex items-center h-11 px-4 rounded-xl border border-[#e2e3e6] bg-white justify-between">
                    <div className="flex items-center gap-2.5 text-[13px] font-medium text-[#232833]">
                      <span className="text-[11px] font-extrabold text-[#232833]">US</span>
                      <span>English</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-[#687080]" />
                  </div>
                </div>

                <div>
                  <div className="text-[12.5px] font-bold text-[#232833] mb-3">Appearance</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(['Light', 'Auto', 'Dark'] as const).map((theme) => {
                      const active = appearanceMode === theme;
                      return (
                        <button
                          key={theme}
                          type="button"
                          onClick={() => {
                            setAppearanceMode(theme);
                            showToast(`Appearance set to ${theme}`);
                          }}
                          className="flex flex-col items-center gap-2 text-center"
                        >
                          <div
                            className={`w-full h-[94px] rounded-[16px] p-2 border-2 transition-all flex items-center justify-center relative overflow-hidden ${
                              active ? 'border-[#00c4ff]' : 'border-[#eaecee]'
                            } ${
                              theme === 'Dark'
                                ? 'bg-[#19191a] text-white'
                                : theme === 'Auto'
                                ? 'bg-gradient-to-r from-white from-50% to-[#19191a] to-50%'
                                : 'bg-white text-[#232833]'
                            }`}
                          >
                            <div
                              className={`w-full h-full rounded-[11px] border border-[#00c4ff]/40 p-2.5 flex flex-col justify-between text-left ${
                                theme === 'Dark' ? 'bg-[#23252a]' : 'bg-white/90'
                              }`}
                            >
                              <div className="text-[9px] text-[#687080] truncate">
                                Describe the video you want...
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <span className="w-4 h-4 rounded-full border border-[#e2e3e6] flex items-center justify-center text-[8px]">
                                    +
                                  </span>
                                  <span className="px-1.5 py-0.5 rounded-full bg-[#f2f3f5] text-[#232833] text-[8px] font-bold">
                                    Auto v
                                  </span>
                                </div>
                                <span className="w-5 h-5 rounded-full bg-[#00c4ff] flex items-center justify-center text-white text-[8px]">
                                  ılı
                                </span>
                              </div>
                            </div>
                          </div>
                          <span
                            className={`text-[12px] font-bold ${
                              active ? 'text-[#232833]' : 'text-[#8c93a3]'
                            }`}
                          >
                            {theme}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PERSONALIZATION (Exact match to step_63_shot_2_popup_05_settings_personalization.png) */}
            {settingsTab === 'Personalization' && (
              <div className="h-full flex flex-col">
                <h2 className="text-[18px] font-extrabold text-[#232833] mb-4">Personalization</h2>
                <div className="flex items-center gap-6 border-b border-[#eaecee] mb-8">
                  {(['Profile', 'Memory'] as const).map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setPersonalizationSubTab(sub)}
                      className={`relative pb-2.5 text-[13.5px] font-bold ${
                        personalizationSubTab === sub ? 'text-[#232833]' : 'text-[#687080]'
                      }`}
                    >
                      <span>{sub}</span>
                      {personalizationSubTab === sub && (
                        <span className="absolute left-0 right-0 bottom-0 h-[2.5px] rounded-full bg-[#00c4ff]" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                  <div className="w-12 h-12 rounded-2xl bg-[#f4f5f7] flex items-center justify-center text-[#687080] mb-3">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-[15px] font-extrabold text-[#232833] mb-1">
                    No profile yet
                  </div>
                  <p className="text-[12.5px] text-[#687080] max-w-[320px] mb-5">
                    Complete a quick survey to personalize your HeyGen experience.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal(null);
                      router.push('/home');
                      showToast('Click Personalize under Video Prompts to select your industry');
                    }}
                    className="h-9 px-5 rounded-full bg-[#19191a] text-white text-[12.5px] font-bold"
                  >
                    Take survey
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: SHARED AVATARS (Exact match to step_63_shot_3_popup_06_settings_shared_avatars.png) */}
            {settingsTab === 'Shared avatars' && (
              <div className="h-full flex flex-col">
                <h2 className="text-[18px] font-extrabold text-[#232833] mb-4">Shared avatars</h2>
                <div className="flex items-center gap-6 border-b border-[#eaecee] mb-8">
                  {(['My Avatars', 'Shared with Me'] as const).map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSharedAvatarsSubTab(sub)}
                      className={`relative pb-2.5 text-[13.5px] font-bold ${
                        sharedAvatarsSubTab === sub ? 'text-[#232833]' : 'text-[#687080]'
                      }`}
                    >
                      <span>{sub}</span>
                      {sharedAvatarsSubTab === sub && (
                        <span className="absolute left-0 right-0 bottom-0 h-[2.5px] rounded-full bg-[#00c4ff]" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                  <div className="w-12 h-12 rounded-2xl bg-[#f4f5f7] flex items-center justify-center text-[#687080] mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-[14px] font-bold text-[#232833] mb-1">
                    No shared avatars yet
                  </div>
                  <p className="text-[12.5px] text-[#687080]">
                    Avatars shared across your workspace will appear here.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 5: GENERAL (Exact match to step_63_shot_4_popup_07_settings_general.png) */}
            {settingsTab === 'General' && (
              <div className="max-w-[600px] space-y-6">
                <h2 className="text-[18px] font-extrabold text-[#232833]">General</h2>

                <div>
                  <div className="text-[12.5px] font-bold text-[#232833] mb-3">Workspace Image</div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#00b8ff] text-white text-[22px] font-extrabold flex items-center justify-center shrink-0">
                      DS
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('Workspace image updated')}
                      className="w-40 h-9 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] text-[12.5px] font-bold text-[#232833]"
                    >
                      Upload photo
                    </button>
                    <span className="text-[11.5px] text-[#687080]">Pick a photo up to 2MB.</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[12.5px] font-bold text-[#232833] mb-1.5">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    onBlur={handleSaveWorkspaceName}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#e2e3e6] text-[13px] text-[#232833] focus:outline-none focus:border-[#00c4ff]"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-bold text-[#232833] mb-1.5">
                    Workspace Description
                  </label>
                  <textarea
                    value={workspaceDesc}
                    onChange={(e) => setWorkspaceDesc(e.target.value)}
                    placeholder="Write some words to describe your team"
                    className="w-full h-20 p-3.5 rounded-xl border border-[#e2e3e6] text-[13px] text-[#232833] placeholder:text-[#8c93a3] resize-none focus:outline-none focus:border-[#00c4ff]"
                  />
                </div>

                <div className="pt-4 border-t border-[#eaecee]">
                  <div className="text-[12.5px] font-semibold text-[#4e5666] mb-3">
                    Video Distribution
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[13px] font-bold text-[#232833]">
                        Enforce &ldquo;AI-Assisted&rdquo; Watermark for all videos
                      </div>
                      <p className="text-[12px] text-[#687080] mt-0.5">
                        When enabled, all downloaded videos in this domain will include a watermark.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setWatermarkEnforced(!watermarkEnforced);
                        showToast(
                          !watermarkEnforced
                            ? 'AI-Assisted watermark enforced'
                            : 'AI-Assisted watermark disabled'
                        );
                      }}
                      className={`w-10 h-5 rounded-full transition-colors p-0.5 flex items-center shrink-0 ${
                        watermarkEnforced
                          ? 'bg-[#00c4ff] justify-end'
                          : 'bg-[#8c93a3] justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: PLAN & BILLING (Exact match to step_63_shot_5_popup_08_settings_plan_billing.png) */}
            {settingsTab === 'Plan & Billing' && (
              <div className="max-w-[620px] space-y-5">
                <h2 className="text-[18px] font-extrabold text-[#232833]">Plan &amp; Billing</h2>

                <div>
                  <div className="text-[12.5px] font-bold text-[#232833] mb-2.5">Your Plan</div>
                  <div
                    className="rounded-[18px] p-[1.5px]"
                    style={{
                      background:
                        'linear-gradient(90deg, #e2d4f0 0%, #c259ff 35%, #00c4ff 70%, #00bf8f 100%)',
                    }}
                  >
                    <div className="rounded-[16.5px] bg-[#f4f5f7] p-6 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[28px] leading-[34px] font-extrabold text-[#232833] mb-2 capitalize">
                          {organization?.plan_tier || 'Free'}
                        </div>
                        <p className="text-[12.5px] leading-[18px] text-[#4e5666] max-w-[430px]">
                          Upgrade your plan today to get more video generations, 1080p exports, and
                          longer videos (up to 5 minutes).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveModal('upgrade')}
                        className="h-9 px-4 rounded-full bg-white hover:bg-[#f7f8fa] border border-[#eaecee] shadow-sm flex items-center gap-2 text-[12.5px] font-bold text-[#232833] shrink-0"
                      >
                        <IconGoldDiamond className="w-4 h-4" />
                        <span>Upgrade</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: USAGE & HISTORY (Exact match to step_63_shot_6_popup_09_settings_usage_history.png) */}
            {settingsTab === 'Usage & History' && (
              <div className="max-w-[620px] space-y-5">
                <h2 className="text-[18px] font-extrabold text-[#232833]">Usage &amp; History</h2>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold text-[#232833]">History</span>
                  <button
                    type="button"
                    onClick={() => showToast('Downloaded workspace usage CSV')}
                    className="h-8 px-3.5 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] text-[12px] font-bold text-[#232833] flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
                <div className="rounded-2xl border border-[#eaecee] overflow-hidden">
                  <div className="px-4 py-2.5 bg-[#f7f8fa] border-b border-[#eaecee] flex items-center justify-between text-[12px] font-bold text-[#687080]">
                    <span>Project</span>
                    <span>Credits</span>
                  </div>
                  <div className="py-16 text-center text-[13px] text-[#687080]">
                    No video history to show!
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: SECURITY (Exact match to step_63_shot_7_popup_10_settings_security.png) */}
            {settingsTab === 'Security' && (
              <div className="max-w-[560px] space-y-5">
                <h2 className="text-[18px] font-extrabold text-[#232833]">Security</h2>
                <div className="p-6 rounded-2xl border border-[#eaecee] bg-[#f7f8fa] space-y-3">
                  <div className="text-[15px] font-extrabold text-[#232833]">
                    Enable SSO and two-factor authentication
                  </div>
                  <p className="text-[12.5px] text-[#687080] leading-relaxed">
                    SSO is available on Business plans and above. Two-factor authentication (2FA)
                    is available on Enterprise plans.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveModal('upgrade')}
                    className="h-9 px-5 rounded-full bg-[#19191a] text-white text-[12.5px] font-bold"
                  >
                    Upgrade plan
                  </button>
                </div>
              </div>
            )}

            {/* TAB 9: CONNECTIONS (Exact match to step_63_shot_8_popup_11_settings_connections.png) */}
            {settingsTab === 'Connections' && (
              <div className="max-w-[640px] space-y-5">
                <h2 className="text-[18px] font-extrabold text-[#232833]">Connections</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      name: 'Slack',
                      badge: '❖',
                      badgeBg: '#f4f5f7',
                      badgeColor: '#4a154b',
                      desc: 'Connect your Slack account to HeyGen and make videos from the comfort and familiarity of your Slack workspace.',
                    },
                    {
                      name: 'YouTube',
                      badge: '▶',
                      badgeBg: '#ff0000',
                      badgeColor: '#ffffff',
                      desc: 'Connect YouTube to publish your videos directly from HeyGen with one click.',
                    },
                    {
                      name: 'LinkedIn Verified ...',
                      badge: 'in',
                      badgeBg: '#0a66c2',
                      badgeColor: '#ffffff',
                      desc: 'Connect your LinkedIn account to enable Verified Skills integration with HeyGen.',
                    },
                    {
                      name: 'Google Drive',
                      badge: '▲',
                      badgeBg: '#f4f5f7',
                      badgeColor: '#0f9d58',
                      desc: 'Connect Google Drive to import footage from your own files, without making them public.',
                    },
                  ].map((conn) => (
                    <div
                      key={conn.name}
                      className="rounded-[18px] border border-[#eaecee] bg-white p-5 flex flex-col justify-between gap-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 border border-black/5"
                            style={{
                              backgroundColor: conn.badgeBg,
                              color: conn.badgeColor,
                            }}
                          >
                            {conn.badge}
                          </span>
                          <span className="text-[14px] font-extrabold text-[#232833] truncate">
                            {conn.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => showToast(`Connected ${conn.name}`)}
                          className="h-8 px-4 rounded-full bg-[#19191a] hover:bg-[#343842] text-white text-[12px] font-bold shrink-0"
                        >
                          Connect
                        </button>
                      </div>
                      <p className="text-[11.5px] leading-[16px] text-[#687080]">{conn.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. UPGRADE PLAN / "Pick your plan" MODAL (Exact match to step_61_shot_3_popup_03_upgrade_plan.png)
  if (activeModal === 'upgrade') {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1219]/45 backdrop-blur-[4px] p-4"
        onClick={() => setActiveModal(null)}
      >
        <div
          className="relative w-full max-w-[1000px] max-h-[92vh] overflow-y-auto rounded-[22px] bg-white p-6 sm:p-7 shadow-[0_24px_64px_rgba(0,0,0,0.24)] border border-[#eaecee]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar: Individual | Business segmented pill + Looking for API plans? + X */}
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex rounded-full bg-[#f2f3f5] p-1 border border-[#eaecee]">
              {(['Individual', 'Business'] as const).map((aud) => (
                <button
                  key={aud}
                  type="button"
                  onClick={() => setPlanAudience(aud)}
                  className={`px-3.5 py-1 rounded-full text-[12px] font-bold transition-all ${
                    planAudience === aud
                      ? 'bg-white text-[#232833] shadow-sm'
                      : 'text-[#687080]'
                  }`}
                >
                  {aud}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  router.push('/developers/api');
                }}
                className="text-[12px] font-semibold text-[#687080] underline hover:text-[#232833]"
              >
                Looking for API plans?
              </button>
              <button
                type="button"
                aria-label="Close upgrade modal"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#687080] hover:bg-[#f2f3f5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Heading & Monthly / Annual Toggle */}
          <div className="text-center mb-6">
            <h2 className="text-[30px] leading-[36px] font-extrabold text-[#232833] mb-3">
              Pick your plan
            </h2>
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#f2f3f5] border border-[#eaecee]">
              <span className="text-[12px] font-bold text-[#232833]">Monthly</span>
              <button
                type="button"
                onClick={() =>
                  setBillingCycle(billingCycle === 'Monthly' ? 'Annual' : 'Monthly')
                }
                className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors ${
                  billingCycle === 'Annual'
                    ? 'bg-[#00c4ff] justify-end'
                    : 'bg-[#cfd3dc] justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
              <span className="text-[12px] font-semibold text-[#4e5666]">Annual</span>
              <span className="px-2 py-0.5 rounded-full bg-[#24d18f] text-[#19191a] text-[10.5px] font-extrabold">
                2 Months Free
              </span>
            </div>
          </div>

          {/* 3-Column Plan Cards Grid matching step_61_shot_3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* PLAN 1: FREE ($0) */}
            <div className="rounded-[20px] bg-white border border-[#eaecee] p-3 flex flex-col justify-between shadow-sm">
              <div>
                <div className="rounded-[16px] bg-[#7c7e83] text-white p-4 mb-4">
                  <div className="flex items-baseline justify-between mb-0.5">
                    <span className="text-[20px] font-extrabold">Free</span>
                    <span className="text-[24px] font-extrabold">$0</span>
                  </div>
                  <div className="text-[11.5px] text-white/90 mb-3.5">For trying it out</div>
                  <button
                    type="button"
                    disabled
                    className="w-full h-10 rounded-full bg-[#66686d] text-white/75 text-[12.5px] font-bold"
                  >
                    Current Plan
                  </button>
                </div>

                <div className="px-2 space-y-2.5 text-[12px] text-[#232833]">
                  <div className="font-extrabold text-[12px]">Explore AI video creation</div>
                  {[
                    '3 videos a month, watermarked',
                    'Videos up to 1 minute each',
                    'Access to Avatar 6 and Video Agent',
                    'One Custom Video Avatar, plus 500+ ready-made presenters',
                    '30+ languages',
                  ].map((feat) => (
                    <div key={feat} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#232833] mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PLAN 2: CREATOR ($29/mo) */}
            <div className="rounded-[20px] bg-white border border-[#eaecee] p-3 flex flex-col justify-between shadow-sm">
              <div>
                <div
                  className="rounded-[16px] text-[#19191a] p-4 mb-4"
                  style={{
                    background: 'linear-gradient(135deg, #ffba32 0%, #fce097 100%)',
                  }}
                >
                  <div className="flex items-baseline justify-between mb-0.5">
                    <span className="text-[20px] font-extrabold">Creator</span>
                    <div>
                      <span className="text-[24px] font-extrabold">
                        ${billingCycle === 'Annual' ? 24 : 29}
                      </span>
                      <span className="text-[12px] font-bold">/mo</span>
                    </div>
                  </div>
                  <div className="text-[11.5px] text-[#19191a]/85 mb-3.5">
                    For publishing video
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectPlan('plan-creator')}
                    className="w-full h-10 rounded-full bg-[#19191a] hover:bg-[#343842] text-white text-[12.5px] font-bold"
                  >
                    Get Started
                  </button>
                </div>

                <div className="px-2 space-y-2.5 text-[12px] text-[#232833]">
                  <div className="font-extrabold text-[12px]">
                    Access to advanced AI video generation
                  </div>
                  {[
                    'Avatar 6 Turbo, our newest expressive AI Avatar engine',
                    'Avatar Lipsync, our proven AI Avatar engine',
                    'Video Agent, with expanded access',
                    'HeyGen Voice, with up to 10 hours of text to speech',
                    'HeyGen Video 1: text, image, and reference to video',
                  ].map((feat) => (
                    <div key={feat} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#f0a500] mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}

                  <div className="pt-2 font-extrabold text-[11.5px]">
                    Everything in Free, plus:
                  </div>
                  {[
                    '600 credits',
                    'Export your videos in 1080p',
                    'Remove HeyGen branding',
                    'Custom Video Avatar with your own voice and likeness',
                  ].map((feat) => (
                    <div key={feat} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#f0a500] mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PLAN 3: PRO (Most Popular, $49/mo) */}
            <div className="rounded-[20px] bg-white border border-[#eaecee] p-3 flex flex-col justify-between shadow-sm">
              <div>
                <div
                  className="rounded-[16px] text-[#19191a] p-4 mb-3"
                  style={{
                    background: 'linear-gradient(135deg, #27d7ff 0%, #b3f3ff 100%)',
                  }}
                >
                  <div className="flex items-baseline justify-between mb-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[20px] font-extrabold">Pro</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#ffd97d] text-[#19191a] text-[10px] font-extrabold">
                        Most Popular
                      </span>
                    </div>
                    <div>
                      <span className="text-[24px] font-extrabold">
                        ${billingCycle === 'Annual' ? 39 : 49}
                      </span>
                      <span className="text-[12px] font-bold">/mo</span>
                    </div>
                  </div>
                  <div className="text-[11.5px] text-[#19191a]/85 mb-3.5">
                    For high volume, best quality creations
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectPlan('plan-pro')}
                    className="w-full h-10 rounded-full bg-[#19191a] hover:bg-[#343842] text-white text-[12.5px] font-bold"
                  >
                    Get Started
                  </button>
                </div>

                <div className="px-1 space-y-2.5">
                  <select
                    aria-label="Select Pro credits tier"
                    value={proCreditsTier}
                    onChange={(e) => setProCreditsTier(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-[#e2e3e6] text-[12px] font-bold text-[#232833]"
                  >
                    <option value="1,000 credits">1,000 credits</option>
                    <option value="2,000 credits">2,000 credits</option>
                    <option value="5,000 credits">5,000 credits</option>
                  </select>

                  <div className="text-[11.5px] font-extrabold text-[#232833] px-1">
                    Frontier features, with more room
                  </div>

                  <div className="rounded-[14px] bg-[#d6f6ff] border border-[#84e3ff] p-3 space-y-2 text-[11.5px]">
                    <div className="font-extrabold text-[#232833]">Pro only features:</div>
                    {[
                      {
                        title: 'Avatar 6 Pro',
                        sub: 'Our most lifelike avatar yet',
                      },
                      {
                        title: '1 Professional Voice Clone',
                        sub: 'Highest-fidelity clone of your own voice, $29/mo Free',
                      },
                      {
                        title: 'Access to Seedance 2.5',
                        sub: 'The leading video model, with no second subscription',
                      },
                      {
                        title: 'Cinematic Avatars',
                        sub: 'Place your avatar in dynamic, text-prompted cinematic scenes',
                      },
                      {
                        title: '4K video export',
                        sub: 'Ship at the highest resolution HeyGen offers',
                      },
                    ].map((f) => (
                      <div key={f.title} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00a7d9] mt-0.5 shrink-0" />
                        <div>
                          <div className="font-extrabold text-[#232833]">{f.title}</div>
                          <div className="text-[10.5px] text-[#4e5666]">{f.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => showToast('Showing full plan feature comparison')}
              className="inline-flex items-center gap-1 text-[12.5px] font-extrabold text-[#232833] hover:text-[#00a7d9]"
            >
              <span>See full comparison</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. ASK ORBY RIGHT FLOATING PANEL (Exact match to step_65_shot_1_popup_12_ask_orby.png)
  if (activeModal === 'orby') {
    const ORBY_SUGGESTIONS = [
      'What can HeyGen do?',
      'Create my first video',
      'Create my avatar',
      'Which tool should I use for my video?',
      'See more',
    ];

    const handleSendOrby = (promptText: string) => {
      if (!promptText.trim()) return;
      setOrbyMessages((prev) => [
        ...prev,
        { role: 'user', text: promptText },
        {
          role: 'orby',
          text: `You can use Video Agent (/home/video-agent) to generate complete videos from a prompt, Scene-by-Scene AI Studio (/apps/studio) for multi-track editing, or Translate (/home/translate) for 175+ language dubbing.`,
        },
      ]);
      setOrbyQuery('');
    };

    return (
      <div
        role="region"
        aria-label="Ask Orby"
        className="fixed top-[9px] bottom-[9px] right-[9px] z-50 w-[370px] max-w-[92vw] rounded-[20px] bg-white border border-[#eaecee] shadow-[0_12px_42px_rgba(0,0,0,0.12)] flex flex-col justify-between p-4 select-none"
      >
        {/* Top Bar: + (New chat) | [Chat | Updates] | X (Close) */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            title="New chat"
            onClick={() => setOrbyMessages([])}
            className="w-8 h-8 rounded-full hover:bg-[#f2f3f5] flex items-center justify-center text-[#232833]"
          >
            <Plus className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center rounded-full bg-[#f2f3f5] p-1 border border-[#eaecee]">
            <button
              type="button"
              aria-label="Chat"
              onClick={() => setOrbyTab('chat')}
              className={`w-8 h-7 rounded-full flex items-center justify-center transition-all ${
                orbyTab === 'chat'
                  ? 'bg-white text-[#232833] shadow-sm'
                  : 'text-[#687080]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              aria-label="Updates"
              onClick={() => setOrbyTab('updates')}
              className={`w-8 h-7 rounded-full flex items-center justify-center transition-all ${
                orbyTab === 'updates'
                  ? 'bg-white text-[#232833] shadow-sm'
                  : 'text-[#687080]'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            aria-label="Close Orby"
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full hover:bg-[#f2f3f5] flex items-center justify-center text-[#232833]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center Greeting or Conversation */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between py-6 px-2">
          <div className="my-auto flex flex-col items-center text-center">
            <div className="relative mb-3">
              <IconOrbyBot className="w-14 h-14" />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#00bf8f] border-2 border-white" />
            </div>
            <h3 className="text-[18px] leading-[23px] font-extrabold text-[#232833]">
              Hi there,
              <br />
              how can I help?
            </h3>
          </div>

          {orbyMessages.length > 0 ? (
            <div className="space-y-2.5 my-4">
              {orbyMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl text-[12.5px] leading-relaxed ${
                    m.role === 'orby'
                      ? 'bg-[#f4f5f7] text-[#232833]'
                      : 'bg-[#19191a] text-white ml-6'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 px-1">
              {ORBY_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => handleSendOrby(sug)}
                  className="w-full text-left py-1.5 px-2 rounded-xl hover:bg-[#f7f8fa] flex items-center gap-2.5 text-[13px] font-bold text-[#232833] transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#687080] shrink-0" />
                  <span>{sug}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendOrby(orbyQuery);
          }}
          className="pt-2 border-t border-[#eaecee] flex items-center gap-2"
        >
          <input
            type="text"
            value={orbyQuery}
            onChange={(e) => setOrbyQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="flex-1 h-10 px-3 text-[13px] text-[#232833] placeholder:text-[#8c93a3] focus:outline-none"
          />
          <button
            type="button"
            aria-label="Talk instead of typing"
            onClick={() => showToast('Voice input ready')}
            className="w-8 h-8 rounded-full hover:bg-[#f2f3f5] flex items-center justify-center text-[#4e5666]"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            type="submit"
            aria-label="Send"
            className="w-8 h-8 rounded-full bg-[#e6e8ec] hover:bg-[#19191a] text-[#4e5666] hover:text-white flex items-center justify-center transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // 5. CHOOSE AVATAR DIALOG (Exact match to step_74_shot_1 & step_88_shot_1)
  if (activeModal === 'choose-avatar') {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1219]/45 backdrop-blur-[4px] p-4"
        onClick={() => setActiveModal(null)}
      >
        <div
          className="relative w-full max-w-[795px] h-[680px] max-h-[88vh] rounded-[22px] bg-white p-7 shadow-2xl border border-[#eaecee] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setActiveModal(null)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#687080] hover:bg-[#f2f3f5]"
          >
            <X className="w-4 h-4" />
          </button>

          <h2 className="text-[20px] font-extrabold text-[#232833] mb-4">Choose Avatar</h2>

          <div className="flex items-center gap-6 mb-6">
            <button
              type="button"
              onClick={() => setChooseAvatarTab('my')}
              className={`relative pb-2 text-[14.5px] font-extrabold ${
                chooseAvatarTab === 'my' ? 'text-[#232833]' : 'text-[#687080]'
              }`}
            >
              <span>My Avatars</span>
              {chooseAvatarTab === 'my' && (
                <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-[#00c4ff]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setChooseAvatarTab('public')}
              className={`relative pb-2 text-[14.5px] font-extrabold ${
                chooseAvatarTab === 'public' ? 'text-[#232833]' : 'text-[#687080]'
              }`}
            >
              <span>Public Avatars</span>
              {chooseAvatarTab === 'public' && (
                <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-[#00c4ff]" />
              )}
            </button>
          </div>

          {chooseAvatarTab === 'my' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              {/* Stacked Portrait Cards Illustration matching step_74_shot_1 */}
              <div className="relative w-[170px] h-[175px] mb-5 flex items-center justify-center">
                <div className="absolute w-[110px] h-[145px] rounded-[16px] bg-[#f2f3f5] border border-[#e2e3e6] -rotate-6 -translate-x-5" />
                <div className="absolute w-[110px] h-[145px] rounded-[16px] bg-[#f2f3f5] border border-[#e2e3e6] rotate-6 translate-x-5" />
                <img
                  src="/heygen-assets/thumbnails/avatar-marieke-look1.webp"
                  alt="Create your first avatar"
                  className="relative z-10 w-[124px] h-[156px] object-cover rounded-[16px] border-2 border-[#a882ff] shadow-lg"
                />
              </div>

              <h3 className="text-[20px] font-extrabold text-[#232833] mb-1.5">
                Create your first avatar
              </h3>
              <p className="text-[12.5px] leading-[18px] text-[#687080] max-w-[390px] mb-6">
                An identity that looks, moves, and sounds like you. Ready for any video, in any
                outfit or setting.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  router.push('/avatars/create/avatar-hub?returnTo=%2Fhome%2Fvideo-agent');
                }}
                className="h-10 px-8 rounded-full bg-[#19191a] hover:bg-[#343842] text-white text-[13px] font-bold"
              >
                Create avatar
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-4 pr-1">
              {avatars.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    showToast(`Selected avatar: ${av.name}`);
                  }}
                  className="rounded-2xl border border-[#eaecee] hover:border-[#00c4ff] p-2.5 text-left transition-all"
                >
                  <img
                    src={av.main_thumbnail_url}
                    alt={av.name}
                    className="w-full h-36 object-cover rounded-xl mb-2"
                  />
                  <div className="text-[13.5px] font-extrabold text-[#232833]">{av.name}</div>
                  <div className="text-[11px] text-[#687080]">{av.category}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 6. CHOOSE A VOICE DIALOG (Exact match to step_74_shot_2 & step_88_shot_5)
  if (activeModal === 'choose-voice') {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1219]/45 backdrop-blur-[4px] p-4"
        onClick={() => setActiveModal(null)}
      >
        <div
          className="relative w-full max-w-[795px] h-[720px] max-h-[90vh] rounded-[22px] bg-white p-7 shadow-2xl border border-[#eaecee] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setActiveModal(null)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#687080] hover:bg-[#f2f3f5]"
          >
            <X className="w-4 h-4" />
          </button>

          <h2 className="text-[20px] font-extrabold text-[#232833] mb-5">Choose a Voice</h2>

          {/* Top 3 Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
            <button
              type="button"
              onClick={() => setActiveModal('create-voice')}
              className="h-[60px] px-4 rounded-[16px] bg-[#f7f8fa] hover:bg-[#eff1f5] flex items-center gap-3 text-left"
            >
              <span className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                <Mic className="w-4 h-4 text-[#232833]" />
              </span>
              <span className="text-[12.5px] font-bold text-[#232833]">
                Create your HeyGen voice
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('design-voice')}
              className="h-[60px] px-4 rounded-[16px] bg-[#f7f8fa] hover:bg-[#eff1f5] flex items-center gap-3 text-left"
            >
              <span className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                <IconVideoAgentWand className="w-4 h-4 text-[#232833]" />
              </span>
              <span className="text-[12.5px] font-bold text-[#232833]">Design a voice</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('import-voice')}
              className="h-[60px] px-4 rounded-[16px] bg-[#f7f8fa] hover:bg-[#eff1f5] flex items-center gap-3 text-left"
            >
              <span className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                <Download className="w-4 h-4 text-[#232833]" />
              </span>
              <span className="text-[12.5px] font-bold text-[#232833]">Import from 3rd party</span>
            </button>
          </div>

          {/* Tabs: My voices | HeyGen library */}
          <div className="flex items-center gap-6 mb-4">
            <button
              type="button"
              onClick={() => setChooseVoiceTab('my')}
              className={`relative pb-2 text-[14.5px] font-extrabold ${
                chooseVoiceTab === 'my' ? 'text-[#232833]' : 'text-[#687080]'
              }`}
            >
              <span>My voices</span>
              {chooseVoiceTab === 'my' && (
                <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-[#00c4ff]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setChooseVoiceTab('library')}
              className={`relative pb-2 text-[14.5px] font-extrabold ${
                chooseVoiceTab === 'library' ? 'text-[#232833]' : 'text-[#687080]'
              }`}
            >
              <span>HeyGen library</span>
              {chooseVoiceTab === 'library' && (
                <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-[#00c4ff]" />
              )}
            </button>
          </div>

          {chooseVoiceTab === 'my' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <img
                src="/heygen-assets/icons/empty-voices-box.png"
                alt="No voices yet"
                className="w-24 h-24 object-contain mb-3"
              />
              <div className="text-[14px] font-extrabold text-[#232833] mb-1">No voices yet</div>
              <p className="text-[12.5px] text-[#687080]">Voices you save will appear here</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto divide-y divide-[#eaecee]">
              {voices.map((v) => (
                <div
                  key={v.id}
                  onClick={() => {
                    setActiveModal(null);
                    showToast(`Selected voice: ${v.name}`);
                  }}
                  className="h-14 px-2 flex items-center justify-between hover:bg-[#f7f8fa] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Play className="w-3.5 h-3.5 fill-current text-[#232833]" />
                    <div>
                      <div className="text-[13px] font-bold text-[#232833]">{v.name}</div>
                      <div className="text-[11.5px] text-[#687080]">{v.subtitle_tags}</div>
                    </div>
                  </div>
                  <img
                    src={v.flag_url}
                    alt={v.language}
                    className="w-5 h-3.5 object-cover rounded-[2px]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 7. CREATE YOUR HEYGEN VOICE MODAL (Exact match to step_99_shot_1.png — 600x322px)
  if (activeModal === 'create-voice') {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1219]/45 backdrop-blur-[4px] p-4"
        onClick={() => setActiveModal(null)}
      >
        <div
          className="relative w-full max-w-[540px] rounded-[20px] bg-white p-7 shadow-2xl border border-[#eaecee]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#687080] hover:bg-[#f2f3f5]"
          >
            <X className="w-4 h-4" />
          </button>

          <h2 className="text-center text-[20px] font-extrabold text-[#232833] mb-1">
            Create your HeyGen voice
          </h2>
          <p className="text-center text-[12.5px] text-[#687080] mb-6">
            How do you want to add your voice?
          </p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={async () => {
                await fetch('/api/voices', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    mode: 'clone',
                    name: 'Recorded Studio Voice Clone',
                    speaker_full_name: 'Workspace Creator',
                    language: 'English (US)',
                    gender: 'Female',
                    subtitle_tags: 'Custom Recorded Voice Clone',
                    consent_accepted: true,
                    provider: 'custom',
                  }),
                });
                await bootstrap();
                setActiveModal(null);
                showToast('Voice recording clone added to your voice library');
              }}
              className="w-full p-4 rounded-[16px] border border-[#eaecee] hover:border-[#00c4ff] hover:bg-[#f9feff] flex items-center justify-between text-left transition-all"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-10 h-10 rounded-full bg-[#f4f5f7] flex items-center justify-center text-[#232833]">
                  <Mic className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-[14px] font-extrabold text-[#232833]">Record audio</div>
                  <div className="text-[12px] text-[#687080]">
                    Read a short script out loud. About two minutes.
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#687080]" />
            </button>

            <button
              type="button"
              onClick={async () => {
                await fetch('/api/voices', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    mode: 'clone',
                    name: 'Uploaded Audio Voice Clone',
                    speaker_full_name: 'Workspace Creator',
                    language: 'English (US)',
                    gender: 'Female',
                    subtitle_tags: 'Uploaded Clean Recording Clone',
                    consent_accepted: true,
                    provider: 'custom',
                  }),
                });
                await bootstrap();
                setActiveModal(null);
                showToast('Uploaded voice audio clone added to your voice library');
              }}
              className="w-full p-4 rounded-[16px] border border-[#eaecee] hover:border-[#00c4ff] hover:bg-[#f9feff] flex items-center justify-between text-left transition-all"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-10 h-10 rounded-full bg-[#f4f5f7] flex items-center justify-center text-[#232833]">
                  <Music className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-[14px] font-extrabold text-[#232833]">Upload audio</div>
                  <div className="text-[12px] text-[#687080]">
                    Use a clean recording you already have.
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#687080]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 8. DESIGN A VOICE MODAL (Exact match to step_99_shot_2.png — 862x455px)
  if (activeModal === 'design-voice') {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1219]/45 backdrop-blur-[4px] p-4"
        onClick={() => setActiveModal(null)}
      >
        <div
          className="relative w-full max-w-[770px] rounded-[22px] bg-white p-7 shadow-2xl border border-[#eaecee]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setActiveModal(null)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#687080] hover:bg-[#f2f3f5]"
          >
            <X className="w-4 h-4" />
          </button>

          <h2 className="text-[20px] font-extrabold text-[#232833] mb-1">Design a voice</h2>
          <p className="text-[12.5px] text-[#687080] mb-5">
            Adjust the prompt and regenerate voices until you find the perfect fit.
          </p>

          <div className="rounded-[18px] bg-[#f7f8fa] p-5 space-y-3">
            <label className="block text-[13px] font-extrabold text-[#232833]">
              Describe your new voice
            </label>

            <div className="relative rounded-[14px] bg-white border border-[#eaecee] p-3.5">
              <textarea
                value={designVoicePrompt}
                onChange={(e) => setDesignVoicePrompt(e.target.value)}
                placeholder="e.g. an energetic but controlled voice, like a great presenter..."
                className="w-full h-24 resize-none border-0 text-[13px] text-[#232833] placeholder:text-[#8c93a3] focus:outline-none"
              />
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setDesignVoicePrompt(
                      'An energetic, warm presenter voice with crisp studio articulation and natural pacing.'
                    )
                  }
                  className="h-8 px-3.5 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] flex items-center gap-1.5 text-[11.5px] font-bold text-[#232833]"
                >
                  <IconVideoAgentWand className="w-3.5 h-3.5" />
                  <span>Try a sample</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (!designVoicePrompt.trim()) return;
                    await fetch('/api/voices', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        mode: 'design',
                        name: 'AI Designed Studio Voice',
                        speaker_full_name: 'AI Voice Designer',
                        language: 'English (US)',
                        gender: 'Female',
                        subtitle_tags: designVoicePrompt.slice(0, 60),
                        consent_accepted: true,
                        provider: 'custom',
                      }),
                    });
                    await bootstrap();
                    setActiveModal(null);
                    showToast('Designed voice added to your library!');
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    designVoicePrompt.trim()
                      ? 'bg-[#19191a] text-white'
                      : 'bg-[#d8dbe0] text-white'
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="py-5 text-center text-[12.5px] font-bold text-[#4e5666]">
              Please enter a prompt to design a voice.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 9. IMPORT VOICE FROM 3RD PARTY MODAL (Exact match to step_99_shot_3.png — 862x737px)
  if (activeModal === 'import-voice') {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1219]/45 backdrop-blur-[4px] p-4"
        onClick={() => setActiveModal(null)}
      >
        <div
          className="relative w-full max-w-[770px] min-h-[580px] rounded-[22px] bg-white p-8 shadow-2xl border border-[#eaecee] flex flex-col justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setActiveModal(null)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#687080] hover:bg-[#f2f3f5]"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-6">
            <h2 className="text-[20px] font-extrabold text-[#232833]">Import voice</h2>

            {/* Light Cyan Info Banner */}
            <div className="rounded-[18px] bg-[#eafaff] px-5 py-4 flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#4e5666] text-white flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <p className="text-[12px] leading-[17px] text-[#4e5666]">
                HeyGen can only access your resources while this API key is valid. If you rotate
                it with your provider, update the key here before continuing.
              </p>
            </div>

            <div>
              <div className="text-[12.5px] font-extrabold text-[#232833] mb-2.5">
                Service provider
              </div>
              <div className="w-[116px] h-[88px] rounded-[16px] border-[1.75px] border-[#00c4ff] bg-white flex items-center justify-center text-[13.5px] font-black text-[#19191a]">
                IIElevenLabs
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[12.5px] font-extrabold text-[#232833] mb-2">
                <span>API key</span>
                <Lock className="w-3.5 h-3.5 text-[#a882ff]" />
              </label>
              <input
                type="password"
                value={elevenLabsApiKey}
                onChange={(e) => setElevenLabsApiKey(e.target.value)}
                placeholder="Paste your API key here"
                className="w-full h-11 px-4 rounded-xl border border-[#e2e3e6] text-[13px] text-[#232833] placeholder:text-[#8c93a3] focus:outline-none focus:border-[#00c4ff]"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                disabled={!elevenLabsApiKey.trim()}
                onClick={async () => {
                  await fetch('/api/voices', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      mode: 'import',
                      name: 'ElevenLabs Imported Voice',
                      speaker_full_name: 'ElevenLabs API',
                      language: 'English (US)',
                      gender: 'Female',
                      subtitle_tags: 'Imported 3rd Party ElevenLabs Voice',
                      consent_accepted: true,
                      provider: 'elevenlabs',
                    }),
                  });
                  await bootstrap();
                  setActiveModal(null);
                  showToast('ElevenLabs voice imported into your workspace!');
                }}
                className={`h-10 px-5 rounded-full text-[13px] font-bold transition-colors ${
                  elevenLabsApiKey.trim()
                    ? 'bg-[#19191a] text-white'
                    : 'bg-[#e6e8ec] text-[#9da3b0] cursor-not-allowed'
                }`}
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-10 px-5 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] text-[13px] font-bold text-[#232833]"
              >
                Cancel
              </button>
            </div>
          </div>

          <div />
        </div>
      </div>
    );
  }

  // 10. CREATE CUSTOM AVATAR & LIKENESS CONSENT MODAL
  if (activeModal === 'create-avatar') {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1219]/45 backdrop-blur-[4px] p-4"
        onClick={() => setActiveModal(null)}
      >
        <div
          className="relative w-full max-w-[540px] rounded-[22px] bg-white p-7 shadow-2xl border border-[#eaecee]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#687080] hover:bg-[#f2f3f5]"
          >
            <X className="w-4 h-4" />
          </button>

          <h2 className="text-[20px] font-extrabold text-[#232833] mb-1">
            Create Your Digital Twin Avatar
          </h2>
          <p className="text-[12.5px] text-[#687080] mb-5">
            Upload 15 seconds of footage and record your mandatory likeness authorization consent.
          </p>

          <form onSubmit={handleCreateCustomAvatar} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-bold text-[#232833] mb-1">
                  Avatar Display Name
                </label>
                <input
                  type="text"
                  required
                  value={avatarName}
                  onChange={(e) => setAvatarName(e.target.value)}
                  placeholder="e.g. Alex Studio Twin"
                  className="w-full h-10 px-3.5 rounded-xl border border-[#e2e3e6] text-[13px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#232833] mb-1">
                  Subject Legal Full Name
                </label>
                <input
                  type="text"
                  required
                  value={subjectFullName}
                  onChange={(e) => setSubjectFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full h-10 px-3.5 rounded-xl border border-[#e2e3e6] text-[13px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-bold text-[#232833] mb-1">Category</label>
                <select
                  value={avatarCategory}
                  onChange={(e) =>
                    setAvatarCategory(
                      e.target.value as 'Professional' | 'Lifestyle' | 'UGC'
                    )
                  }
                  className="w-full h-10 px-3 rounded-xl border border-[#e2e3e6] text-[13px]"
                >
                  <option value="Professional">Professional</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="UGC">UGC</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#232833] mb-1">Gender</label>
                <select
                  value={avatarGender}
                  onChange={(e) => setAvatarGender(e.target.value as 'Female' | 'Male')}
                  className="w-full h-10 px-3 rounded-xl border border-[#e2e3e6] text-[13px]"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f7f8fa] border border-[#eaecee] space-y-2">
              <div className="text-[12px] font-bold text-[#232833] flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#00c4ff]" />
                <span>Mandatory Likeness &amp; Biometric Consent Statement</span>
              </div>
              <p className="text-[11.5px] text-[#4e5666] leading-relaxed">
                &ldquo;I, <strong>{subjectFullName || '[Full Name]'}</strong>, hereby authorize the
                creation and use of my digital avatar likeness on this platform.&rdquo;
              </p>
              <label className="flex items-center gap-2 text-[12px] font-semibold text-[#232833] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="rounded border-[#cfd3dc]"
                />
                <span>I confirm that I am the subject and grant explicit likeness consent</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-10 px-5 rounded-full border border-[#e2e3e6] text-[13px] font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingAvatar}
                className="h-10 px-6 rounded-full bg-[#19191a] hover:bg-[#343842] text-white text-[13px] font-bold"
              >
                {submittingAvatar ? 'Verifying & Creating...' : 'Verify Consent & Create Avatar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 11. STEP 3: CREATE A NEW AVATAR LOOK MODAL
  if (activeModal === 'create-look') {
    const LOOK_PRESETS = [
      {
        name: 'Executive Boardroom Suit',
        thumb: '/heygen-assets/thumbnails/avatar-annie-look1.webp',
        prompt: 'Tailored navy blazer in modern glass boardroom with soft key lighting',
      },
      {
        name: 'Neon Cyber Podcast Studio',
        thumb: '/heygen-assets/thumbnails/avatar-sawyer-brick.webp',
        prompt: 'Warm brick podcast loft with Shure SM7B microphone and tungsten Edison bulbs',
      },
      {
        name: 'Warm Editorial Loft',
        thumb: '/heygen-assets/thumbnails/avatar-marieke-look2.webp',
        prompt: 'Sunlit architectural apartment with neutral knitwear and natural depth of field',
      },
      {
        name: 'Medical Clinical Coat',
        thumb: '/heygen-assets/thumbnails/avatar-livia-look1.webp',
        prompt: 'Clean healthcare clinic consultation room with white clinical coat',
      },
    ];
    const currentPreset =
      LOOK_PRESETS.find((p) => p.name === lookOutfitPreset) || LOOK_PRESETS[0];

    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1219]/45 backdrop-blur-[4px] p-4"
        onClick={() => setActiveModal(null)}
      >
        <div
          className="relative w-full max-w-[560px] rounded-[22px] bg-white p-7 shadow-2xl border border-[#eaecee]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#687080] hover:bg-[#f2f3f5]"
          >
            <X className="w-4 h-4" />
          </button>

          <h2 className="text-[20px] font-extrabold text-[#232833] mb-1">
            Create a New Avatar Look
          </h2>
          <p className="text-[12.5px] text-[#687080] mb-5">
            Put your avatar in any outfit or setting while preserving facial identity.
          </p>

          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmittingLook(true);
              try {
                await fetch('/api/avatars', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    id: lookTargetAvatarId,
                    new_look_url: currentPreset.thumb,
                  }),
                });
                await bootstrap();
                setActiveModal(null);
                showToast(`Generated "${lookOutfitPreset}" look!`);
              } finally {
                setSubmittingLook(false);
              }
            }}
          >
            <div>
              <label className="block text-[12px] font-bold text-[#232833] mb-1">
                Base Avatar Identity
              </label>
              <select
                value={lookTargetAvatarId}
                onChange={(e) => setLookTargetAvatarId(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-[#e2e3e6] text-[13px] font-semibold"
              >
                {avatars.map((av) => (
                  <option key={av.id} value={av.id}>
                    {av.name} ({av.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="text-[12px] font-bold text-[#232833] mb-2">
                Choose Outfit &amp; Environment Preset
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {LOOK_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setLookOutfitPreset(preset.name);
                      setLookPrompt(preset.prompt);
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      lookOutfitPreset === preset.name
                        ? 'border-2 border-[#00c4ff] bg-[#f4fcff]'
                        : 'border-[#e2e3e6] hover:bg-[#f7f8fa]'
                    }`}
                  >
                    <img
                      src={preset.thumb}
                      alt={preset.name}
                      className="w-11 h-11 rounded-lg object-cover shrink-0"
                    />
                    <span className="text-[12px] font-bold text-[#232833] leading-tight">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#232833] mb-1">
                Custom Look &amp; Setting Prompt
              </label>
              <textarea
                value={lookPrompt}
                onChange={(e) => setLookPrompt(e.target.value)}
                className="w-full h-20 p-3 rounded-xl border border-[#e2e3e6] text-[12.5px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-10 px-5 rounded-full border border-[#e2e3e6] text-[13px] font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingLook}
                className="h-10 px-6 rounded-full bg-[#19191a] hover:bg-[#343842] text-white text-[13px] font-bold"
              >
                {submittingLook ? 'Generating Look...' : 'Generate Avatar Look'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
}

'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/shell/AppShell';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import { ReferenceIcon } from '@heygen/ui/icons';
import {
  ArrowUpRight,
  Copy,
  Key,
  FileText,
  BookOpen,
  DollarSign,
  History,
  Lightbulb,
  Send,
  Lock,
  RotateCw,
  Calendar,
  Download,
  BarChart2,
  List,
  Database,
  UserCheck,
  Mic,
  Sparkles,
  Clock,
} from 'lucide-react';

const PRESET_AMOUNTS = [15, 30, 50, 100, 250, 500];

export function DevelopersPortalContent({ forcedSection }: { forcedSection?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (forcedSection || searchParams.get('tab') || 'overview').toLowerCase();
  const initialSkipped = searchParams.get('skipped') === '1' || searchParams.get('view') === 'dashboard';

  const { wallet, bootstrap, showToast, setActiveModal } = useHeyGenStore();

  const [skippedWizard, setSkippedWizard] = useState<boolean>(initialSkipped);
  const [amount, setAmount] = useState<number>(0);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [addingFunds, setAddingFunds] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [usageTab, setUsageTab] = useState<'analytics' | 'activity'>('analytics');

  const handleAddFunds = async () => {
    const topUpUsd = amount >= 5 ? amount : 15;
    setAddingFunds(true);
    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'top_up_credits',
          amount_usd: topUpUsd,
        }),
      });
      if (res.ok) {
        await bootstrap();
        showToast(`Added $${topUpUsd} (+${topUpUsd * 2} API credits) to your balance!`);
      }
    } finally {
      setAddingFunds(false);
    }
  };

  const handleGenerateApiKey = () => {
    const key = `hg_live_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
    setApiKey(key);
    showToast('Generated new HeyGen API key');
  };

  const handleToggleAutoReload = async () => {
    const res = await fetch('/api/billing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'toggle_auto_reload',
        enabled: !wallet?.auto_reload_enabled,
      }),
    });
    if (res.ok) {
      await bootstrap();
      showToast(
        !wallet?.auto_reload_enabled ? 'Auto-reload enabled' : 'Auto-reload disabled'
      );
    }
  };

  return (
    <div>
      {/* Top Announcement Banner matching step_34_shot_3.png & step_271_shot_2..7.png */}
      <div className="fixed top-0 left-0 right-0 z-20 h-[40px] bg-[#f7f8fa] border-b border-[#eaecee] flex items-center justify-center gap-2 text-[12.5px] font-bold text-[#232833]">
        <span>Try HeyGen Platform and API Playground</span>
        <span className="px-2 py-0.5 rounded-full bg-[#e3f4fa] text-[#00a7d9] text-[11px] font-extrabold">
          Beta
        </span>
        <ReferenceIcon name="arrow-right-up" className="w-3.5 h-3.5 text-[#687080]" />
      </div>

      <div className="w-full max-w-[920px] pt-[168px] min-[480px]:pt-[90px] pb-16 px-[32px] sm:px-[48px]">
        {/* TAB 1: OVERVIEW (Onboarding Wizard OR Skipped Dashboard matching step_271_shot_7.png) */}
        {activeTab === 'overview' && !skippedWizard && (
          <>
            <h1 className="text-[28px] leading-[34px] font-extrabold tracking-[-0.02em] text-[#232833] mb-[28px]">
              Get started with the API
            </h1>

            <div className="space-y-[16px] max-w-[780px]">
              {/* Step 1: Add funds to your balance */}
              <div className="flex items-start gap-[16px]">
                <div className="mt-6 w-[26px] h-[26px] rounded-full border border-[#e2e3e6] flex items-center justify-center text-[12px] font-bold text-[#232833] shrink-0">
                  1
                </div>

                <div className="flex-1 rounded-[18px] bg-white border border-[#eaecee] p-[24px] grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-6">
                    <h2 className="text-[14.5px] font-bold text-[#232833] mb-1.5">
                      Add funds to your balance
                    </h2>
                    <p className="text-[12.5px] text-[#687080]">
                      Add funds to start making API calls. Minimum top-up: $5.
                    </p>
                  </div>

                  <div className="md:col-span-6 space-y-3">
                    <div>
                      <label className="block text-[12.5px] font-bold text-[#232833] mb-1.5">
                        Amount
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-[13px] text-[#687080]">$</span>
                        <input
                          type="number"
                          min="0"
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          className="w-full h-[38px] pl-7 pr-3.5 rounded-[10px] border border-[#e2e3e6] text-[13px] font-semibold text-[#232833] focus:outline-none focus:border-[#00c4ff]"
                        />
                      </div>
                      <div className="text-[11.5px] text-[#687080] mt-1">
                        Minimum top-up: $5.
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {PRESET_AMOUNTS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setAmount(preset)}
                          className={`h-[32px] rounded-full border text-[12.5px] font-bold transition-colors ${
                            amount === preset
                              ? 'border-[#00c4ff] bg-[#e3f4fa] text-[#232833]'
                              : 'border-[#e2e3e6] bg-white text-[#232833] hover:bg-[#f7f8fa]'
                          }`}
                        >
                          ${preset}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={addingFunds}
                      onClick={handleAddFunds}
                      className="w-full h-[38px] rounded-full bg-[#19191a] hover:bg-[#343842] text-white text-[13px] font-bold transition-colors"
                    >
                      {addingFunds ? 'Adding funds...' : 'Add funds'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2: Generate your first API key */}
              <div className="flex items-center gap-[16px]">
                <div className="w-[26px] h-[26px] rounded-full border border-[#e2e3e6] flex items-center justify-center text-[12px] font-bold text-[#232833] shrink-0">
                  2
                </div>

                <div className="flex-1 rounded-[18px] bg-white border border-[#eaecee] p-[22px] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-[14.5px] font-bold text-[#687080] mb-1">
                      Generate your first API key
                    </h2>
                    <p className="text-[12.5px] text-[#8c93a3]">
                      Generate avatars, create videos, and more using your API key.
                    </p>
                    {apiKey && (
                      <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#f7f8fa] border border-[#00c4ff] text-[12px] font-mono text-[#232833]">
                        <span>{apiKey}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(apiKey);
                            showToast('Copied API key to clipboard');
                          }}
                          className="text-[#00a7d9]"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateApiKey}
                    className="h-[36px] px-4 rounded-full bg-[#e6e8ec] hover:bg-[#19191a] text-[#687080] hover:text-white text-[12.5px] font-bold transition-colors"
                  >
                    Generate API key
                  </button>
                </div>
              </div>

              {/* Step 3: Set up auto-reload */}
              <div className="flex items-center gap-[16px]">
                <div className="w-[26px] h-[26px] rounded-full border border-[#e2e3e6] flex items-center justify-center text-[12px] font-bold text-[#232833] shrink-0">
                  3
                </div>

                <div className="flex-1 rounded-[18px] bg-white border border-[#eaecee] p-[22px] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-[14.5px] font-bold text-[#687080]">Set up auto-reload</h2>
                      <span className="px-2.5 py-0.5 rounded-full border border-[#e2e3e6] text-[11px] font-semibold text-[#8c93a3]">
                        Optional
                      </span>
                    </div>
                    <p className="text-[12.5px] text-[#8c93a3]">
                      Automatically add funds when your balance falls below your set threshold.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleAutoReload}
                    className={`h-[36px] px-4 rounded-full text-[12.5px] font-bold transition-colors ${
                      wallet?.auto_reload_enabled
                        ? 'bg-[#e6f9f3] text-[#00a87e]'
                        : 'bg-[#e6e8ec] hover:bg-[#19191a] text-[#687080] hover:text-white'
                    }`}
                  >
                    {wallet?.auto_reload_enabled ? 'Auto-reload ON' : 'Turn on'}
                  </button>
                </div>
              </div>

              {/* Bottom All set / Skip buttons */}
              <div className="pl-[42px] pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setSkippedWizard(true)}
                  className="h-[36px] px-4 rounded-full bg-[#e6e8ec] hover:bg-[#19191a] text-[#687080] hover:text-white text-[12.5px] font-bold transition-colors"
                >
                  All set
                </button>
                <button
                  type="button"
                  onClick={() => setSkippedWizard(true)}
                  className="h-[36px] px-4 rounded-full bg-white hover:bg-[#f7f8fa] border border-[#e2e3e6] text-[#232833] text-[12.5px] font-bold transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          </>
        )}

        {/* TAB 1B: OVERVIEW DASHBOARD (After clicking Skip — exact match to step_271_shot_7.png) */}
        {activeTab === 'overview' && skippedWizard && (
          <div className="max-w-[780px] space-y-7">
            <h1 className="font-solar-display text-[32px] leading-[38px] font-bold tracking-[-0.01em] text-[#232833]">
              Overview
            </h1>

            {/* Usage Card */}
            <div className="rounded-[18px] border border-[#eaecee] bg-white p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <ReferenceIcon name="coins-ds" className="w-4 h-4 text-[#232833]" />
                  <span className="text-[15px] font-bold text-[#232833]">Usage</span>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/developers/billing')}
                  className="h-[32px] px-3.5 rounded-full bg-[#19191a] hover:bg-[#343842] text-white text-[12px] font-bold"
                >
                  Add balance
                </button>
              </div>
              <div className="flex items-center justify-between text-[12.5px] mb-2">
                <span className="font-semibold text-[#232833]">Total spent</span>
                <span className="text-[#687080]">0 used</span>
              </div>
              <div className="w-full h-[6px] rounded-full bg-[#e6e8ec]" />
            </div>

            {/* API Keys Section */}
            <div>
              <h2 className="text-[15px] font-bold text-[#232833] mb-1">API Keys</h2>
              <p className="text-[12.5px] text-[#687080] mb-3.5">
                Manage your API keys for programmatic access.
              </p>
              <div className="rounded-[18px] border border-dashed border-[#dcdFE6] bg-white py-11 px-6 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#f4f5f7] flex items-center justify-center mb-3 text-[#687080]">
                  <ReferenceIcon name="key" className="w-5 h-5" />
                </div>
                <div className="text-[14px] font-bold text-[#232833] mb-1">No API Keys</div>
                <div className="text-[12.5px] text-[#687080] mb-4">
                  Generate your first API key to get started
                </div>
                {apiKey && (
                  <div className="mb-3 px-3 py-1.5 rounded-xl bg-[#f7f8fa] border border-[#00c4ff] text-[12px] font-mono text-[#232833]">
                    {apiKey}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleGenerateApiKey}
                  className="h-[34px] px-4 rounded-full bg-[#19191a] hover:bg-[#343842] text-white text-[12.5px] font-bold"
                >
                  Create API Key
                </button>
              </div>
            </div>

            {/* Developer resources Section */}
            <div>
              <h2 className="text-[15px] font-bold text-[#232833] mb-1">Developer resources</h2>
              <p className="text-[12.5px] text-[#687080] mb-3.5">
                Docs, references and tools for building on the HeyGen API.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'API Doc', iconName: 'text-type', rightIcon: 'arrow-up-right' },
                  { label: 'API References', iconName: 'book', rightIcon: 'arrow-up-right' },
                  { label: 'Pricing', iconName: 'ds-billing', rightIcon: 'arrow-up-right' },
                  { label: 'Changelog', iconName: 'history', rightIcon: 'arrow-up-right' },
                  { label: 'Cookbook', iconName: 'brainstorm', rightIcon: 'arrow-up-right' },
                  { label: 'Copy to your agent', iconName: 'copy', rightIcon: 'copy' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => showToast(`Opened ${item.label}`)}
                    className="h-[60px] px-4 rounded-[14px] border border-[#eaecee] bg-white hover:bg-[#f7f8fa] flex items-center justify-between text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f4f5f7] flex items-center justify-center text-[#4e5666]">
                        <ReferenceIcon name={item.iconName} className="w-4 h-4" />
                      </div>
                      <span className="text-[13px] font-bold text-[#232833]">{item.label}</span>
                    </div>
                    <ReferenceIcon name={item.rightIcon} className="w-3.5 h-3.5 text-[#687080]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DEVELOPERS BILLING (Exact match to step_271_shot_2.png) */}
        {activeTab === 'billing' && (
          <div className="max-w-[780px]">
            <h1 className="text-[28px] leading-[34px] font-extrabold tracking-[-0.02em] text-[#232833] mb-6">
              Billing
            </h1>

            {/* Top 2 Cards: Balance + Add funds */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">
              {/* Left Card: Balance & Auto-reload */}
              <div className="rounded-[20px] border border-[#eaecee] bg-white p-6 flex flex-col justify-between">
                <div>
                  <div className="text-[12.5px] text-[#687080] mb-1">Balance</div>
                  <div className="text-[28px] leading-[34px] font-extrabold text-[#232833] pb-5 border-b border-[#eaecee] mb-5">
                    0 remaining
                  </div>
                  <div className="text-[14px] font-bold text-[#232833] mb-1.5">Auto-reload</div>
                  <p className="text-[12.5px] leading-[18px] text-[#687080] mb-5">
                    Automatically add funds when your balance falls below your set threshold.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleAutoReload}
                  className="w-full h-[36px] rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] text-[12.5px] font-bold text-[#232833] transition-colors"
                >
                  {wallet?.auto_reload_enabled ? 'Auto-reload ON' : 'Turn on'}
                </button>
              </div>

              {/* Right Card: Add funds */}
              <div className="rounded-[20px] border border-[#eaecee] bg-white p-6">
                <div className="text-[14px] font-bold text-[#232833] mb-3">Add funds</div>
                <label className="block text-[12px] text-[#687080] mb-1.5">Amount</label>
                <div className="relative flex items-center mb-1.5">
                  <span className="absolute left-3.5 text-[13px] text-[#687080]">$</span>
                  <input
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full h-[38px] pl-7 pr-3.5 rounded-[10px] border border-[#e2e3e6] text-[13px] font-semibold text-[#232833]"
                  />
                </div>
                <div className="text-[11.5px] text-[#687080] mb-3.5">Minimum top-up: $5.</div>

                <div className="grid grid-cols-6 gap-1.5 mb-4">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`h-[30px] rounded-full border text-[11.5px] font-bold transition-colors ${
                        amount === preset
                          ? 'border-[#00c4ff] bg-[#e3f4fa] text-[#232833]'
                          : 'border-[#e2e3e6] bg-white text-[#232833] hover:bg-[#f7f8fa]'
                      }`}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddFunds}
                  disabled={addingFunds}
                  className={`w-full h-[36px] rounded-full text-[12.5px] font-bold mb-3 transition-colors ${
                    amount >= 5
                      ? 'bg-[#19191a] text-white'
                      : 'bg-[#e6e8ec] text-[#8c93a3]'
                  }`}
                >
                  {addingFunds ? 'Adding funds...' : 'Add funds'}
                </button>

                <p className="text-[11.5px] leading-[16px] text-[#687080] text-center">
                  Add a valid payment method in order to turn on API Credits auto-recharge for your
                  plan.
                </p>
              </div>
            </div>

            {/* Bottom 2 Columns: Payment method & Invoice history */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <h2 className="text-[14px] font-bold text-[#232833] mb-3">Payment method</h2>
                <div className="rounded-[18px] border border-dashed border-[#dcdFE6] bg-white p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#f4f5f7] flex items-center justify-center text-[#687080] shrink-0">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[#232833] mb-0.5">
                        No payment method detected
                      </div>
                      <p className="text-[12px] leading-[17px] text-[#687080]">
                        Add a valid payment method in order to turn on API Credits auto-recharge
                        for your plan.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Payment method setup opened')}
                    className="h-[32px] px-4 rounded-full bg-[#19191a] text-white text-[12px] font-bold"
                  >
                    Add card
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-[14px] font-bold text-[#232833] mb-3">Invoice history</h2>
                <div className="rounded-[18px] border border-[#eaecee] bg-white p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#f4f5f7] flex items-center justify-center text-[#687080] shrink-0">
                      <History className="w-4 h-4" />
                    </div>
                    <p className="text-[12px] leading-[17px] text-[#687080]">
                      Past invoices and receipts for this workspace, in the billing portal.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Opened Billing Portal')}
                    className="h-[32px] px-4 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] text-[12px] font-bold text-[#232833] inline-flex items-center gap-1.5"
                  >
                    <span>View invoice history</span>
                    <span className="text-[11px]">↗</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DEVELOPERS USAGE (Exact match to step_271_shot_3.png) */}
        {activeTab === 'usage' && (
          <div className="max-w-[780px]">
            <h1 className="text-[28px] leading-[34px] font-extrabold tracking-[-0.02em] text-[#232833] mb-5">
              Usage
            </h1>

            <h2 className="text-[13.5px] font-bold text-[#232833] mb-3">Capacity</h2>

            {/* Capacity Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-3.5">
              {/* Card 1 */}
              <div className="rounded-[16px] border border-[#eaecee] bg-white p-4">
                <div className="flex items-center gap-1.5 text-[12px] text-[#687080] mb-2">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Custom Video Avatars</span>
                </div>
                <div className="text-[15px] font-extrabold text-[#232833] mb-3">0 of 1</div>
                <button
                  type="button"
                  onClick={() => setActiveModal('upgrade')}
                  className="h-[26px] px-3 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] text-[11.5px] font-bold text-[#232833]"
                >
                  Upgrade plan
                </button>
              </div>

              {/* Card 2 */}
              <div className="rounded-[16px] border border-[#eaecee] bg-white p-4">
                <div className="flex items-center gap-1.5 text-[12px] text-[#687080] mb-2">
                  <Mic className="w-3.5 h-3.5" />
                  <span>General voice clones</span>
                </div>
                <div className="text-[15px] font-extrabold text-[#232833]">0 of 10</div>
              </div>

              {/* Card 3 */}
              <div className="rounded-[16px] border border-[#eaecee] bg-white p-4">
                <div className="flex items-center gap-1.5 text-[12px] text-[#687080] mb-2">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Professional Voice Clone</span>
                </div>
                <div className="text-[15px] font-extrabold text-[#232833] mb-3">—</div>
                <button
                  type="button"
                  onClick={() => setActiveModal('upgrade')}
                  className="h-[26px] px-3 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] text-[11.5px] font-bold text-[#232833]"
                >
                  Upgrade plan
                </button>
              </div>

              {/* Card 4: API credits */}
              <div className="rounded-[16px] border border-[#eaecee] bg-white p-4">
                <div className="flex items-center gap-1.5 text-[12px] text-[#687080] mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>API credits</span>
                </div>
                <div className="text-[15px] font-extrabold text-[#232833] mb-3">0 credits</div>
                <button
                  type="button"
                  onClick={() => router.push('/developers/billing')}
                  className="h-[26px] px-3 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] text-[11.5px] font-bold text-[#232833]"
                >
                  Add funds
                </button>
              </div>
            </div>

            {/* Plan limits bar */}
            <div className="rounded-[14px] border border-[#eaecee] bg-white px-4 py-3 flex items-center gap-4 text-[12.5px] mb-5">
              <div className="flex items-center gap-1.5 font-bold text-[#232833]">
                <Clock className="w-3.5 h-3.5 text-[#687080]" />
                <span>Plan limits</span>
              </div>
              <div className="text-[#687080]">
                Concurrent videos <strong className="text-[#232833]">10</strong>
              </div>
            </div>

            {/* Analytics / Activity Filter Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUsageTab('analytics')}
                  className={`h-[34px] px-3.5 rounded-full text-[12.5px] font-bold transition-colors ${
                    usageTab === 'analytics'
                      ? 'bg-[#e3f4fa] border border-[#00c4ff] text-[#232833]'
                      : 'text-[#687080] hover:text-[#232833]'
                  }`}
                >
                  Analytics
                </button>
                <button
                  type="button"
                  onClick={() => setUsageTab('activity')}
                  className={`h-[34px] px-3.5 rounded-full text-[12.5px] font-bold transition-colors ${
                    usageTab === 'activity'
                      ? 'bg-[#e3f4fa] border border-[#00c4ff] text-[#232833]'
                      : 'text-[#687080] hover:text-[#232833]'
                  }`}
                >
                  Activity
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="h-[34px] px-3.5 rounded-full border border-[#e2e3e6] bg-white text-[12px] font-semibold text-[#232833] flex items-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#687080]" />
                  <span>11/16/26 - 11/22/26</span>
                  <span className="text-[10px] text-[#687080]">⌄</span>
                </button>
                <button
                  type="button"
                  disabled
                  className="h-[34px] px-3.5 rounded-full bg-[#e6e8ec] text-[#8c93a3] text-[12px] font-bold flex items-center gap-1.5 cursor-not-allowed"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Empty State Card */}
            <div className="rounded-[18px] border border-[#eaecee] bg-white h-[250px] flex flex-col items-center justify-center text-center px-6">
              <div className="w-10 h-10 rounded-full bg-[#f4f5f7] flex items-center justify-center text-[#687080] mb-3">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div className="text-[14px] font-bold text-[#232833] mb-1">
                No usage in this period
              </div>
              <p className="text-[12.5px] text-[#687080] max-w-[300px]">
                No API requests were recorded in this period. Try a wider date range.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: DEVELOPERS MODELS (Exact match to step_271_shot_4.png) */}
        {activeTab === 'models' && (
          <div className="max-w-[780px]">
            <h1 className="text-[28px] leading-[34px] font-extrabold tracking-[-0.02em] text-[#232833] mb-2">
              Models
            </h1>
            <p className="text-[13px] leading-[20px] text-[#687080] max-w-[660px] mb-9">
              The models that power the HeyGen API. Choose the avatar rendering engine that fits
              each request, give it a voice with HeyGen Voice, or generate a whole scene with
              HeyGen Video.
            </p>

            {/* Section 1: Models to render your avatar. */}
            <div className="mb-10">
              <h2 className="text-[22px] font-extrabold text-[#232833] text-center mb-5">
                Models to{' '}
                <span className="underline decoration-[#00c4ff] decoration-2 underline-offset-4">
                  render
                </span>{' '}
                your avatar.
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Avatar V',
                    desc: 'Our highest-fidelity engine. Cross-reference animation...',
                    img: '/heygen-assets/images/dev-model-avatar-v.jpg',
                  },
                  {
                    title: 'Avatar IV',
                    desc: 'Our default engine. Broadest avatar coverage,...',
                    img: '/heygen-assets/images/dev-model-avatar-iv.jpg',
                  },
                  {
                    title: 'Avatar III',
                    desc: 'Our most affordable engine. Subtle, steady motion for...',
                    img: '/heygen-assets/images/dev-model-avatar-iii.jpg',
                  },
                ].map((m) => (
                  <div
                    key={m.title}
                    onClick={() => showToast(`Exploring ${m.title} API documentation`)}
                    className="relative h-[160px] rounded-[18px] overflow-hidden bg-[#121318] p-5 flex flex-col justify-between cursor-pointer group"
                  >
                    <img
                      src={m.img}
                      alt={m.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="relative z-10">
                      <h3 className="text-[18px] font-extrabold text-white mb-1">{m.title}</h3>
                      <p className="text-[12px] leading-[16px] text-white/80 line-clamp-2">
                        {m.desc}
                      </p>
                    </div>
                    <div className="relative z-10">
                      <span className="inline-flex items-center gap-1.5 h-[30px] px-3.5 rounded-full bg-white/15 backdrop-blur-md text-white text-[12px] font-bold">
                        <span>Explore</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Models to speak in your voice. */}
            <div className="mb-10">
              <h2 className="text-[22px] font-extrabold text-[#232833] text-center mb-5">
                Models to{' '}
                <span className="underline decoration-[#00a87e] decoration-2 underline-offset-4">
                  speak
                </span>{' '}
                in your voice.
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    title: 'HeyGen Voice',
                    desc: "HeyGen's in-house voice model. Browse the catalog...",
                    img: '/heygen-assets/images/dev-model-heygen-voice.jpg',
                  },
                  {
                    title: 'Professional Voice Clone',
                    desc: 'Train a studio-grade clone from 20+ minutes of...',
                    img: '/heygen-assets/images/dev-model-pvc.jpg',
                  },
                ].map((m) => (
                  <div
                    key={m.title}
                    onClick={() => showToast(`Exploring ${m.title} API documentation`)}
                    className="relative h-[160px] rounded-[18px] overflow-hidden bg-[#121318] p-5 flex flex-col justify-between cursor-pointer group"
                  >
                    <img
                      src={m.img}
                      alt={m.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="relative z-10">
                      <h3 className="text-[18px] leading-[22px] font-extrabold text-white mb-1">
                        {m.title}
                      </h3>
                      <p className="text-[12px] leading-[16px] text-white/80 line-clamp-2">
                        {m.desc}
                      </p>
                    </div>
                    <div className="relative z-10">
                      <span className="inline-flex items-center gap-1.5 h-[30px] px-3.5 rounded-full bg-white/15 backdrop-blur-md text-white text-[12px] font-bold">
                        <span>Explore</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Models to generate any video. */}
            <div>
              <h2 className="text-[22px] font-extrabold text-[#232833] text-center mb-5">
                Models to{' '}
                <span className="underline decoration-[#e066ff] decoration-2 underline-offset-4">
                  generate
                </span>{' '}
                any video.
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  onClick={() => showToast('Exploring HeyGen Video API documentation')}
                  className="relative h-[160px] rounded-[18px] overflow-hidden bg-[#121318] p-5 flex flex-col justify-between cursor-pointer group"
                >
                  <img
                    src="/heygen-assets/images/dev-model-heygen-video.jpg"
                    alt="HeyGen Video"
                    className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="relative z-10">
                    <h3 className="text-[18px] font-extrabold text-white mb-1">HeyGen Video</h3>
                    <p className="text-[12px] leading-[16px] text-white/80 line-clamp-2">
                      Our general-purpose video model. Generate 5-15...
                    </p>
                  </div>
                  <div className="relative z-10">
                    <span className="inline-flex items-center gap-1.5 h-[30px] px-3.5 rounded-full bg-white/15 backdrop-blur-md text-white text-[12px] font-bold">
                      <span>Explore</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DEVELOPERS WEBHOOK (Exact match to step_271_shot_5.png) */}
        {activeTab === 'webhook' && (
          <div className="max-w-[780px]">
            <h1 className="text-[28px] leading-[34px] font-extrabold tracking-[-0.02em] text-[#232833] mb-2">
              Webhooks
            </h1>
            <p className="text-[13px] leading-[20px] text-[#687080] max-w-[680px] mb-6">
              Get a POST request the moment a video finishes, a translation completes, or an avatar
              is ready, instead of polling for status. Register one endpoint for this workspace and
              choose which events it receives.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">
              {/* Left Card: Endpoint */}
              <div className="rounded-[20px] border border-[#eaecee] bg-white p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-[14.5px] font-bold text-[#232833]">Endpoint</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#f4f5f7] text-[#687080] text-[11px] font-semibold">
                      Not set up
                    </span>
                  </div>
                  <p className="text-[12px] text-[#687080] mb-4">
                    Publicly reachable HTTPS URL that receives events.
                  </p>

                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://domain.com/webhook"
                    className="w-full h-[38px] px-3.5 rounded-[10px] border border-[#e2e3e6] text-[12.5px] mb-4 focus:outline-none focus:border-[#00c4ff]"
                  />

                  <div className="space-y-2.5 text-[12px] leading-[17px] text-[#687080] pb-5 border-b border-[#eaecee] mb-4">
                    <p>
                      Paste your URL and verify it. HeyGen sends a signed test request and expects
                      a 2xx response.
                    </p>
                    <p>
                      Store the signing secret and use it to verify every payload you receive.
                    </p>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    disabled={!webhookUrl.trim()}
                    onClick={() => showToast(`Verified webhook endpoint: ${webhookUrl}`)}
                    className={`h-[34px] px-4 rounded-full text-[12px] font-bold transition-colors ${
                      webhookUrl.trim()
                        ? 'bg-[#19191a] text-white'
                        : 'bg-[#e6e8ec] text-[#8c93a3] cursor-not-allowed'
                    }`}
                  >
                    Verify webhook
                  </button>
                </div>
              </div>

              {/* Right Card: How delivery works */}
              <div className="rounded-[20px] border border-[#eaecee] bg-white p-6">
                <h2 className="text-[14.5px] font-bold text-[#232833] mb-1">
                  How delivery works
                </h2>
                <p className="text-[12px] text-[#687080] mb-4">
                  What HeyGen sends to your endpoint and what it expects back.
                </p>

                <div className="space-y-3 text-[12px] leading-[17px] text-[#4e5666] pb-4 border-b border-[#eaecee] mb-4">
                  <div className="flex items-start gap-2.5">
                    <Send className="w-3.5 h-3.5 text-[#687080] mt-0.5 shrink-0" />
                    <span>
                      HeyGen sends a POST with JSON{' '}
                      <code className="px-1 py-0.5 rounded bg-[#f4f5f7] text-[#232833] font-mono text-[11px]">
                        event_type
                      </code>{' '}
                      and{' '}
                      <code className="px-1 py-0.5 rounded bg-[#f4f5f7] text-[#232833] font-mono text-[11px]">
                        event_data
                      </code>{' '}
                      to your URL.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Lock className="w-3.5 h-3.5 text-[#687080] mt-0.5 shrink-0" />
                    <span>
                      Verify the{' '}
                      <code className="px-1 py-0.5 rounded bg-[#f4f5f7] text-[#232833] font-mono text-[11px]">
                        signature
                      </code>{' '}
                      header: an HMAC-SHA256 of the raw body using your signing secret.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <RotateCw className="w-3.5 h-3.5 text-[#687080] mt-0.5 shrink-0" />
                    <span>
                      Respond with a 2xx status. Deliveries time out after 5 seconds and retry up
                      to 4 times with backoff.
                    </span>
                  </div>
                </div>

                <div className="text-[12px] text-[#687080] mb-2">Example payload</div>
                <pre className="rounded-[12px] bg-[#f7f8fa] p-3.5 text-[11px] leading-[16px] font-mono text-[#232833] overflow-x-auto">
                  {`{
  "event_type": "avatar_video.success",
  "event_data": {
    "video_id": "7f3a…c91e",
    "url": "https://…/video.mp4",
    "callback_id": "your-reference"
  }
}`}
                </pre>
              </div>
            </div>

            {/* Bottom Resources section */}
            <div>
              <h2 className="text-[14px] font-bold text-[#232833] mb-0.5">Resources</h2>
              <p className="text-[12px] text-[#687080] mb-3">
                Reference material on developers.heygen.com.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    title: 'Webhook docs',
                    sub: 'Setup, delivery, retrie...',
                    icon: FileText,
                  },
                  {
                    title: 'Event catalog',
                    sub: 'Every event type wit...',
                    icon: List,
                  },
                  {
                    title: 'Verify a signature',
                    sub: 'Node and Python ex...',
                    icon: Key,
                  },
                ].map((r) => {
                  const Icon = r.icon;
                  return (
                    <div
                      key={r.title}
                      className="rounded-[14px] border border-[#eaecee] bg-white p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f4f5f7] flex items-center justify-center text-[#4e5666]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-[#232833]">{r.title}</div>
                          <div className="text-[11.5px] text-[#687080]">{r.sub}</div>
                        </div>
                      </div>
                      <span className="text-[12px] text-[#687080]">↗</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DEVELOPERS CONNECTIONS (Exact match to step_271_shot_6.png) */}
        {activeTab === 'connections' && (
          <div className="max-w-[780px]">
            <h1 className="text-[28px] leading-[34px] font-extrabold tracking-[-0.02em] text-[#232833] mb-6">
              Connections
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: 'Slack',
                  desc: 'Connect your Slack account to HeyGen and make videos from the comfort and familiarity of your Slack workspace.',
                  badgeBg: 'bg-[#f4f5f7]',
                  badgeText: '#',
                  badgeColor: 'text-[#e01e5a]',
                },
                {
                  name: 'YouTube',
                  desc: 'Connect YouTube to publish your videos directly from HeyGen with one click.',
                  badgeBg: 'bg-[#ff0000]',
                  badgeText: '▶',
                  badgeColor: 'text-white',
                },
                {
                  name: 'LinkedIn Verified Skills',
                  desc: 'Connect your LinkedIn account to enable Verified Skills integration with HeyGen.',
                  badgeBg: 'bg-[#0a66c2]',
                  badgeText: 'in',
                  badgeColor: 'text-white',
                },
                {
                  name: 'Google Drive',
                  desc: 'Connect Google Drive to import footage from your own files, without making them public.',
                  badgeBg: 'bg-[#f4f5f7]',
                  badgeText: '△',
                  badgeColor: 'text-[#0f9d58]',
                },
              ].map((conn) => (
                <div
                  key={conn.name}
                  className="rounded-[18px] border border-[#eaecee] bg-white p-5 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full ${conn.badgeBg} ${conn.badgeColor} flex items-center justify-center font-extrabold text-[14px]`}
                      >
                        {conn.badgeText}
                      </div>
                      <span className="text-[14px] font-bold text-[#232833]">{conn.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast(`Connecting ${conn.name}...`)}
                      className="h-[32px] px-4 rounded-full bg-[#19191a] hover:bg-[#343842] text-white text-[12px] font-bold"
                    >
                      Connect
                    </button>
                  </div>
                  <p className="text-[12.5px] leading-[18px] text-[#687080]">{conn.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DevelopersApiPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-12 text-center text-sm text-[#687080]">Loading Developers Portal...</div>}>
        <DevelopersPortalContent />
      </Suspense>
    </AppShell>
  );
}

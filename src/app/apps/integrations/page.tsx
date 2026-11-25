'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import { ArrowUpRight, CheckCircle2, X, Plug, Send } from 'lucide-react';

interface IntegrationItem {
  id: string;
  name: string;
  badge?: string;
  iconBg: string;
  iconTextColor?: string;
  iconText: string;
  desc: string;
  category: string;
}

const INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT App',
    badge: 'NEW',
    iconBg: '#10a37f',
    iconText: '✺',
    desc: 'Generate video directly in ChatGPT.',
    category: 'AI Assistant',
  },
  {
    id: 'n8n',
    name: 'n8n',
    badge: 'NEW',
    iconBg: '#fff5f7',
    iconTextColor: '#ea4b71',
    iconText: 'o-o',
    desc: 'Build workflow automations with HeyGen in n8n. Connect to 400+ apps an...',
    category: 'Automation',
  },
  {
    id: 'autohive',
    name: 'Autohive',
    badge: 'NEW',
    iconBg: '#f6d317',
    iconTextColor: '#19191a',
    iconText: '❖',
    desc: 'Connect HeyGen with Autohive to add personalized AI video to...',
    category: 'Automation',
  },
  {
    id: 'slack',
    name: 'Slack',
    badge: 'NEW',
    iconBg: '#f4f5f7',
    iconTextColor: '#4a154b',
    iconText: '❖',
    desc: 'Create videos from Slack conversations without switching apps. Turn...',
    category: 'Messaging',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    iconBg: '#ffffff',
    iconTextColor: '#ff7a59',
    iconText: 'HubSpot',
    desc: 'Create and send personalized videos at scale. Sync with your CRM to...',
    category: 'CRM',
  },
  {
    id: 'vimeo',
    name: 'Vimeo',
    iconBg: '#19191a',
    iconTextColor: '#1ab7ea',
    iconText: 'v',
    desc: 'The Vimeo integration helps you centralize and manage your AI-generated videos...',
    category: 'Video Hosting',
  },
  {
    id: 'adobe-express',
    name: 'Adobe Express Plugin',
    iconBg: '#19191a',
    iconTextColor: '#ff5993',
    iconText: 'A',
    desc: 'Bring HeyGen into Adobe for seamless editing. Create standout videos with just a...',
    category: 'Design',
  },
  {
    id: 'canva',
    name: 'Canva App',
    iconBg: '#00c4cc',
    iconText: 'Canva',
    desc: 'Integrate HeyGen with Canva to power up designs. Create polished videos rig...',
    category: 'Design',
  },
  {
    id: 'tolstoy',
    name: 'Tolstoy AI Video Player',
    iconBg: '#19191a',
    iconText: '••',
    desc: 'Embed HeyGen videos on sites, emails, or SMS. Boost views and drive traffic...',
    category: 'Interactive',
  },
  {
    id: 'trupeer',
    name: 'Trupeer AI Screen Recorder',
    iconBg: '#ffffff',
    iconTextColor: '#232833',
    iconText: '[+]',
    desc: 'Upgrade screen recordings with AI voiceovers and effects. Supports 20+...',
    category: 'Screen Recording',
  },
  {
    id: 'flowshare',
    name: 'FlowShare',
    iconBg: '#0b2e4e',
    iconText: 'ƒ',
    desc: 'Turn tasks into step-by-step guides instantly. Great for onboarding, training, or...',
    category: 'Documentation',
  },
  {
    id: 'mindstamp',
    name: 'Mindstamp',
    iconBg: '#2e1d59',
    iconText: '◎',
    desc: 'Add interactivity to your videos with buttons, quizzes, and more. Boost...',
    category: 'Interactive',
  },
  {
    id: 'repurpose',
    name: 'Repurpose.io',
    iconBg: '#ef6c74',
    iconText: 'R',
    desc: 'Turn your HeyGen video into a post and auto-share it everywhere. Distribute...',
    category: 'Social Media',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    iconBg: '#ff4f00',
    iconText: 'zapier',
    desc: 'Connect HeyGen to thousands of apps and automate tasks. No code...',
    category: 'Automation',
  },
  {
    id: 'make',
    name: 'Make',
    iconBg: '#ffffff',
    iconTextColor: '#6d00cc',
    iconText: '///',
    desc: 'Visually build automations for HeyGen videos. Streamline tasks and...',
    category: 'Automation',
  },
  {
    id: 'pabbly',
    name: 'Pabbly',
    iconBg: '#12b866',
    iconText: 'P',
    desc: 'Connect 2,000+ tools to automate video workflows. Boost productivity with...',
    category: 'Automation',
  },
];

export default function IntegrationsPage() {
  const { showToast } = useHeyGenStore();
  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationItem | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.partner-integration.io/v1/heygen');

  const isConnected = (id: string) => connectedIds.includes(id);

  return (
    <AppShell>
      <div className="w-full max-w-[1080px] pt-[48px] pb-16 px-4 sm:pl-[52px] sm:pr-[32px]">
        <h1 className="text-[28px] leading-[34px] font-extrabold text-[#232833] mb-1">
          Integrations
        </h1>
        <p className="text-[13px] text-[#687080] mb-8">
          Connect HeyGen with your favorite tools
        </p>

        {/* 4-Column Grid matching step_38_shot_1.png */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
          {INTEGRATIONS.map((item) => {
            const connected = isConnected(item.id);
            return (
              <div
                key={item.name}
                onClick={() => setSelectedIntegration(item)}
                className="group h-[182px] rounded-[18px] bg-white border border-[#eaecee] hover:border-[#00c4ff] p-[18px] flex flex-col justify-between cursor-pointer transition-all shadow-[0_2px_6px_rgba(0,0,0,0.02)]"
              >
                <div>
                  <div className="flex items-start justify-between mb-3.5">
                    <div
                      className="w-11 h-11 rounded-[12px] flex items-center justify-center font-extrabold text-sm border border-black/5"
                      style={{
                        backgroundColor: item.iconBg,
                        color: item.iconTextColor || '#ffffff',
                      }}
                    >
                      {item.iconText}
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="w-6 h-6 rounded-full bg-[#f7f8fa] group-hover:bg-[#e3f4fa] flex items-center justify-center text-[#687080]">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-[#00bf8f] text-white text-[10px] font-extrabold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="text-[14.5px] font-extrabold text-[#232833] truncate">
                      {item.name}
                    </h3>
                    {connected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00bf8f] shrink-0" />
                    )}
                  </div>
                  <p className="text-[12px] leading-[17px] text-[#687080] line-clamp-3">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Integration Connection & Webhook Configuration Modal */}
      {selectedIntegration && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1219]/45 backdrop-blur-[4px] p-4"
          onClick={() => setSelectedIntegration(null)}
        >
          <div
            className="relative w-full max-w-[480px] rounded-[22px] bg-white p-6 shadow-2xl border border-[#eaecee]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedIntegration(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#687080] hover:bg-[#f2f3f5]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center font-extrabold text-sm border border-black/10"
                style={{
                  backgroundColor: selectedIntegration.iconBg,
                  color: selectedIntegration.iconTextColor || '#ffffff',
                }}
              >
                {selectedIntegration.iconText}
              </div>
              <div>
                <h2 className="text-[18px] font-extrabold text-[#232833]">
                  {selectedIntegration.name}
                </h2>
                <span className="text-[11.5px] font-semibold text-[#687080]">
                  {selectedIntegration.category} Integration
                </span>
              </div>
            </div>

            <p className="text-[13px] text-[#4e5666] mb-4">{selectedIntegration.desc}</p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-[12px] font-bold text-[#232833] mb-1">
                  Callback / Webhook Endpoint URL
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#e2e3e6] text-[12.5px] font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  showToast(`Dispatched test video.completed webhook to ${selectedIntegration.name}`)
                }
                className="h-10 px-4 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] text-[12.5px] font-bold text-[#232833] flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Test Event</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const active = isConnected(selectedIntegration.id);
                  setConnectedIds((prev) =>
                    active
                      ? prev.filter((id) => id !== selectedIntegration.id)
                      : [...prev, selectedIntegration.id]
                  );
                  showToast(
                    active
                      ? `Disconnected ${selectedIntegration.name}`
                      : `Connected ${selectedIntegration.name} to workspace!`
                  );
                  setSelectedIntegration(null);
                }}
                className={`h-10 px-5 rounded-full text-[13px] font-bold flex items-center gap-2 ${
                  isConnected(selectedIntegration.id)
                    ? 'bg-[#fff5f5] text-[#e54945] border border-[#feb2b2]'
                    : 'bg-[#19191a] text-white hover:bg-[#343842]'
                }`}
              >
                <Plug className="w-4 h-4" />
                <span>
                  {isConnected(selectedIntegration.id)
                    ? 'Disconnect Integration'
                    : 'Connect Integration'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

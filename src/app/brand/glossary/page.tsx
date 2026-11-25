'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import { Plus, Trash2, X } from 'lucide-react';

export default function BrandGlossaryPage() {
  const { organization, bootstrap, showToast } = useHeyGenStore();
  const [manageOpen, setManageOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [language, setLanguage] = useState('All Languages');
  const [pronunciation, setPronunciation] = useState('');

  const glossary = organization?.brand_kit?.glossary || [];

  const handleAddTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/workspace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_glossary_term',
        term,
        language,
        pronunciation,
      }),
    });
    if (res.ok) {
      setTerm('');
      setPronunciation('');
      await bootstrap();
      showToast(`Added "${term}" to Brand Glossary`);
    }
  };

  return (
    <AppShell>
      <div className="w-full max-w-[1040px] pt-[30px] pb-16 px-[32px]">
        {/* Exact Header matching step_268_shot_5.png */}
        <h1 className="text-[28px] leading-[34px] font-extrabold tracking-[-0.02em] text-[#232833]">
          Brand Glossary
        </h1>

        {/* Exact Centered Empty State matching step_268_shot_5.png */}
        <div className="mt-[106px] flex flex-col items-center justify-center text-center select-none">
          {/* Layered Brand Glossary Illustration Card */}
          <div
            onClick={() => setManageOpen(!manageOpen)}
            title="Click to manage Brand Glossary terms"
            className="relative w-[228px] h-[146px] mb-6 cursor-pointer"
          >
            {/* Background Card: Apply Glossary to script */}
            <div className="absolute top-0 left-1 w-[158px] h-[108px] rounded-[12px] bg-[#f7f8fa] border border-[#eaecee] p-3 text-left shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-1.5 mb-2.5">
                <div className="w-5 h-2.5 rounded-full bg-[#00c4ff] flex items-center justify-end px-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <span className="text-[7px] font-bold text-[#232833] px-1.5 py-0.5 rounded bg-white border border-[#eaecee]">
                  Apply Glossary to script
                </span>
              </div>

              <div className="relative rounded-[8px] bg-white border border-[#eaecee] p-2 h-[56px]">
                <div className="text-[7px] text-[#8c93a3] leading-tight">
                  We are thrilled to introduce{' '}
                  <span className="inline-block px-1 py-0.2 rounded bg-[#ff7a2f] text-white font-bold">
                    Xander
                  </span>
                </div>
                {/* Floating cyan pronunciation callout */}
                <div className="absolute -top-2 right-1.5 px-1.5 py-0.5 rounded-[5px] bg-[#e3f4fa] border border-[#00c4ff] text-[7px] font-extrabold text-[#007091] shadow-sm">
                  &ldquo;Zander&rdquo;
                </div>
              </div>
            </div>

            {/* Foreground Card: Brand Glossary Mini Modal */}
            <div className="absolute bottom-1 right-1 w-[162px] rounded-[12px] bg-white border border-[#eaecee] shadow-[0_10px_24px_rgba(15,18,25,0.09)] p-2.5 text-left">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[7.5px] font-extrabold text-[#232833]">Brand Glossary</span>
                <span className="text-[8px] text-[#8c93a3] leading-none">×</span>
              </div>

              {/* Mini segmented pill */}
              <div className="h-[16px] rounded-full bg-[#f4f5f7] p-0.5 grid grid-cols-3 gap-0.5 text-[5.5px] font-semibold text-[#687080] mb-2">
                <span className="rounded-full bg-white text-[#232833] font-bold flex items-center justify-center shadow-2xs">
                  Pronunciation
                </span>
                <span className="flex items-center justify-center truncate">Force Translate</span>
                <span className="flex items-center justify-center truncate">Don&apos;t Translate</span>
              </div>

              <div className="text-[6px] font-bold text-[#4e5666] mb-1">
                Add New Pronunciation
              </div>

              <div className="flex items-center gap-1">
                <div className="flex-1 h-[16px] px-1.5 rounded-[4px] border border-[#e2e3e6] flex items-center text-[6px] text-[#232833]">
                  Xander
                </div>
                <span className="text-[7px] text-[#8c93a3]">→</span>
                <div className="flex-1 h-[16px] px-1.5 rounded-[4px] border border-[#00c4ff] bg-[#f9feff] flex items-center justify-between text-[6px] text-[#007091] font-bold">
                  <span>Zander</span>
                  <span className="text-[#8c93a3]">×</span>
                </div>
                <div className="h-[16px] px-2 rounded-full bg-[#19191a] text-white text-[6px] font-bold flex items-center justify-center">
                  Add
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-[15px] leading-[22px] font-bold text-[#232833] mb-2">
            Stay linguistically consistent, every time
          </h2>
          <p className="text-[13px] leading-[19px] text-[#687080] max-w-[390px]">
            Store brand terms, translation preferences, and pronunciation rules for consistent
            voice across videos.
          </p>
        </div>

        {/* Interactive Glossary Drawer when user clicks illustration */}
        {manageOpen && (
          <div className="mt-10 max-w-[780px] mx-auto rounded-2xl border border-[#eaecee] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-[#232833]">
                Manage Brand Glossary Rules ({glossary.length})
              </span>
              <button
                type="button"
                onClick={() => setManageOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-[#f2f3f5] flex items-center justify-center text-[#687080]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={handleAddTerm}
              className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 mb-4"
            >
              <input
                type="text"
                required
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Brand Term (e.g. HeyGen)"
                className="h-9 px-3 rounded-xl border border-[#e2e3e6] text-[12.5px]"
              />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="h-9 px-3 rounded-xl border border-[#e2e3e6] text-[12.5px]"
              >
                <option value="All Languages">All Languages</option>
                <option value="English (US)">English (US)</option>
                <option value="Spanish (es-ES)">Spanish (es-ES)</option>
              </select>
              <input
                type="text"
                required
                value={pronunciation}
                onChange={(e) => setPronunciation(e.target.value)}
                placeholder="Phonetic (e.g. Hey-Jen)"
                className="h-9 px-3 rounded-xl border border-[#e2e3e6] text-[12.5px]"
              />
              <button
                type="submit"
                className="h-9 px-4 rounded-full bg-[#19191a] text-white text-[12.5px] font-bold flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Term</span>
              </button>
            </form>
            <div className="divide-y divide-[#eaecee]">
              {glossary.map((g) => (
                <div key={g.id} className="py-2.5 flex items-center justify-between text-[12.5px]">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[#232833]">{g.term}</span>
                    <span className="text-[#687080]">{g.language}</span>
                    <span className="text-[#007091] font-mono">→ {g.pronunciation}</span>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await fetch(`/api/workspace?glossary_id=${g.id}`, { method: 'DELETE' });
                      await bootstrap();
                      showToast('Glossary term removed');
                    }}
                    className="p-1 text-[#687080] hover:text-[#e54945]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

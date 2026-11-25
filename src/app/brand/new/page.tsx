'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import referenceTemplates from '../../../../data/reference/templates.json';
import { Check, SlidersHorizontal, X } from 'lucide-react';

const BRAND_CATEGORY_TABS = [
  'General',
  'Personal Brand',
  'Course & E-Learning',
  'Corporate Training',
  'Creator Channels',
  'Real Estate',
] as const;

export default function NewBrandSystemPage() {
  const { organization, bootstrap, showToast } = useHeyGenStore();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] =
    useState<(typeof BRAND_CATEGORY_TABS)[number]>('General');
  const [selectedPreset, setSelectedPreset] = useState<{
    id: string;
    name: string;
    bg: string;
    textColor: string;
    accent: string;
    headline: string;
  } | null>(null);
  const [importedBrand, setImportedBrand] = useState<{
    domain: string;
    colors: string[];
    fontFamily: string;
  } | null>(null);

  const handleImportWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl.trim()) return;
    setImporting(true);
    try {
      const detectedColors = ['#00c4ff', '#232833', '#7548ff', '#00bf8f'];
      await fetch('/api/workspace', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_kit: {
            ...organization?.brand_kit,
            colors: detectedColors,
            fontFamily: 'TT Norms Pro',
          },
        }),
      });
      await bootstrap();
      setImportedBrand({
        domain: websiteUrl.trim(),
        colors: detectedColors,
        fontFamily: 'TT Norms Pro',
      });
      showToast(`Imported Brand System from ${websiteUrl.trim()}`);
    } finally {
      setImporting(false);
    }
  };

  const handleSavePreset = async (presetName: string, colors: string[]) => {
    await fetch('/api/workspace', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brand_kit: {
          ...organization?.brand_kit,
          colors,
          fontFamily: presetName,
        },
      }),
    });
    await bootstrap();
    showToast(`Saved "${presetName}" to your Brand Systems`);
  };

  return (
    <AppShell hideFloatingOrby={true}>
      <div className="w-full max-w-[1080px] pt-[34px] pb-16 px-4 sm:px-[32px]">
        {/* Heading matching step_227_shot_1.png */}
        <h1 className="text-[28px] leading-[34px] font-extrabold tracking-[-0.02em] text-[#151619] mb-6">
          New Brand System
        </h1>

        {/* Centered Website Brand Importer */}
        <div className="w-full flex flex-col items-center text-center mb-8">
          <h2 className="text-[16px] font-extrabold text-[#151619] mb-1.5">
            Instantly create a Brand System from your website
          </h2>
          <p className="text-[12.5px] text-[#687080] mb-4">
            We can detect your brand and build a system with your logos, colors, and fonts.
          </p>

          <form
            onSubmit={handleImportWebsite}
            className="w-full max-w-[530px] flex items-center gap-2.5 mb-7"
          >
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="Paste your brand's website URL"
              className="flex-1 h-[40px] px-4 rounded-full border border-[#e2e3e6] text-[13px] text-[#232833] placeholder:text-[#8c93a3] focus:outline-none focus:border-[#00c4ff]"
            />
            <button
              type="submit"
              disabled={!websiteUrl.trim() || importing}
              className={`h-[40px] px-5 rounded-full text-[13px] font-bold transition-colors ${
                websiteUrl.trim()
                  ? 'bg-[#19191a] text-white hover:bg-[#343842]'
                  : 'bg-[#e6e8ec] text-[#9da3b0] cursor-not-allowed'
              }`}
            >
              {importing ? 'Importing...' : 'Import'}
            </button>
          </form>

          {/* 6 Category Tabs inside Pill Track matching step_227_shot_1.png */}
          <div
            role="tablist"
            className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-[#eceef2] bg-white p-1.5 shadow-2xs"
          >
            {BRAND_CATEGORY_TABS.map((tab) => {
              const selected = selectedCategoryTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setSelectedCategoryTab(tab)}
                  className={`h-[34px] px-4 rounded-full text-[12.5px] font-bold transition-all ${
                    selected
                      ? 'bg-[#ebf9fd] text-[#151619] border border-[#00c4ff]'
                      : 'text-[#4e5666] hover:text-[#151619] hover:bg-[#f7f8fa]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inline Preset Preview Bar when a Preset is Selected */}
        {selectedPreset && (
          <div className="mb-8 rounded-[20px] border-2 border-[#00c4ff] bg-white p-5 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#eceef2]">
              <div className="flex items-center gap-3">
                <span
                  className="w-6 h-6 rounded-full border border-black/10"
                  style={{ backgroundColor: selectedPreset.bg }}
                />
                <span className="text-[16px] font-extrabold text-[#151619]">
                  {selectedPreset.name}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    handleSavePreset(selectedPreset.name, [
                      selectedPreset.bg,
                      selectedPreset.textColor,
                      selectedPreset.accent,
                    ])
                  }
                  className="h-[36px] px-4 rounded-full bg-[#151619] hover:bg-[#2a2d34] text-white text-[12.5px] font-bold inline-flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save this Brand System</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    showToast(`Opened typography & color tokens for ${selectedPreset.name}`)
                  }
                  className="h-[36px] px-4 rounded-full border border-[#e2e5ea] hover:bg-[#f7f8fa] text-[12.5px] font-bold text-[#151619] inline-flex items-center gap-1.5"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Customize</span>
                </button>
                <button
                  type="button"
                  aria-label="Close preset preview"
                  onClick={() => setSelectedPreset(null)}
                  className="w-8 h-8 rounded-full hover:bg-[#f2f3f5] flex items-center justify-center text-[#687080]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                'Title Slide',
                'Chapter Divider',
                'Quote Highlight',
                'Data Metric Card',
                'Lower Third',
                'Split Comparison',
                'Key Takeaway',
                'Outro CTA',
              ].map((frameName, idx) => (
                <div
                  key={frameName}
                  className="aspect-[16/9] rounded-xl p-3 flex flex-col justify-between border border-black/10"
                  style={{
                    backgroundColor: selectedPreset.bg,
                    color: selectedPreset.textColor,
                  }}
                >
                  <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">
                    0{idx + 1} · {frameName}
                  </span>
                  <div className="text-[13px] font-extrabold leading-tight">
                    {selectedPreset.headline}
                  </div>
                  <span
                    className="h-1.5 w-10 rounded-full"
                    style={{ backgroundColor: selectedPreset.accent }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {importedBrand && (
          <div className="mb-8 rounded-[20px] border border-[#00c4ff] bg-white p-6 shadow-sm space-y-4">
            <div className="text-[15px] font-extrabold text-[#232833]">
              Detected Brand Assets — {importedBrand.domain}
            </div>
            <div className="flex flex-wrap gap-3">
              {importedBrand.colors.map((c) => (
                <div
                  key={c}
                  className="px-4 py-2 rounded-xl border border-[#eaecee] flex items-center gap-2 text-[12.5px] font-mono font-bold"
                >
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7 Preset Sections (49 Brand System Presets Total) matching step_227_shot_1.png */}
        <div className="space-y-9">
          {referenceTemplates.brandSystemPresetSections.map((sec) => (
            <section key={sec.section}>
              <h2 className="text-[16px] font-extrabold text-[#151619] mb-3.5">{sec.section}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sec.presets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    aria-label={preset.name}
                    onClick={() => setSelectedPreset(preset)}
                    className="group relative aspect-[280/158] rounded-[16px] border border-[#e2e5ea] hover:border-[#00c4ff] overflow-hidden p-4 flex flex-col justify-between text-left shadow-xs transition-all hover:scale-[1.02]"
                    style={{
                      backgroundColor: preset.bg,
                      color: preset.textColor,
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[9.5px] font-bold tracking-wider uppercase opacity-75">
                        {preset.name}
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: preset.accent }}
                      />
                    </div>

                    <div
                      className={`text-[18px] leading-[22px] tracking-tight ${
                        preset.font.includes('serif')
                          ? 'font-serif'
                          : preset.font.includes('mono')
                          ? 'font-mono font-bold'
                          : 'font-extrabold'
                      } ${preset.font.includes('italic') ? 'italic' : ''}`}
                    >
                      {preset.headline}
                    </div>

                    <div
                      className="px-2.5 py-1 rounded-md text-[10px] font-bold w-fit"
                      style={{
                        backgroundColor: preset.accent,
                        color: preset.bg === '#161618' || preset.bg === '#232e26' ? '#151619' : '#fff',
                      }}
                    >
                      01 · {sec.section}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

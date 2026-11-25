'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/shell/AppShell';
import { AIStudioEditor } from '@/components/studio/AIStudioEditor';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import referenceTemplates from '../../../../data/reference/templates.json';
import {
  ReferenceIcon,
  RefIconStudioDashedRect,
} from '@heygen/ui/icons';
import {
  ChevronLeft,
  Heart,
} from 'lucide-react';

const TEMPLATE_TABS = [
  'My Templates',
  'Recommended',
  'Training',
  'Corporate',
  'Marketing',
  'Sales',
  'Tutorials & Explainers',
  'Real Estate',
  'Finance',
  'Learning & Development',
  'Explainer Video',
] as const;

function AIStudioLandingContent() {
  const searchParams = useSearchParams();
  const initialEditorOpen = searchParams.get('editor') === '1';

  const {
    templates,
    setActiveStudioProject,
    bootstrap,
    showToast,
  } = useHeyGenStore();

  const [editorOpen, setEditorOpen] = useState(initialEditorOpen);
  const [newVideoRatio, setNewVideoRatio] = useState<'16:9' | '9:16'>('16:9');
  const [templateRatioFilter, setTemplateRatioFilter] = useState<'16:9' | '9:16'>('16:9');
  const [selectedTemplateTab, setSelectedTemplateTab] = useState<string>('Recommended');
  const [templateSearch, setTemplateSearch] = useState('');
  const [expandedSeeMore, setExpandedSeeMore] = useState(false);

  if (editorOpen) {
    return <AIStudioEditor onBackToLanding={() => setEditorOpen(false)} />;
  }

  const handleCreateBlankStudioVideo = async () => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `AI Studio Video (${newVideoRatio === '16:9' ? 'Landscape' : 'Portrait'})`,
        project_type: 'studio',
        aspect_ratio: newVideoRatio,
        resolution: '1080p',
      }),
    });
    const data = await res.json();
    await bootstrap();
    if (data.project?.id) {
      setActiveStudioProject(data.project.id);
    }
    setEditorOpen(true);
  };

  const handleUseTemplate = async (templateId: string) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_from_template',
        template_id: templateId,
      }),
    });
    const data = await res.json();
    await bootstrap();
    if (data.project?.id) {
      setActiveStudioProject(data.project.id);
    }
    setEditorOpen(true);
    showToast(`Opened template in AI Studio Editor`);
  };

  const mergedTemplates = [
    ...templates.filter((t) => t.is_published),
    ...referenceTemplates.aiStudioTemplates
      .slice(templates.length)
      .map((rt) => ({
        id: rt.id,
        title: rt.title,
        subtitle: rt.tags.join(', '),
        category: rt.tags[0] || 'Corporate',
        thumbnail_url: rt.localImage,
        is_published: true,
        is_favorite: false,
      })),
  ];

  const allFilteredTemplates = mergedTemplates.filter((tpl) => {
    if (!tpl.is_published) return false;
    if (
      templateSearch &&
      !tpl.title.toLowerCase().includes(templateSearch.toLowerCase()) &&
      !tpl.subtitle.toLowerCase().includes(templateSearch.toLowerCase())
    ) {
      return false;
    }
    if (selectedTemplateTab === 'My Templates') {
      return tpl.is_favorite;
    }
    if (
      selectedTemplateTab !== 'Recommended' &&
      !tpl.category.toLowerCase().includes(selectedTemplateTab.toLowerCase()) &&
      !tpl.subtitle.toLowerCase().includes(selectedTemplateTab.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const filteredTemplates = expandedSeeMore
    ? allFilteredTemplates
    : allFilteredTemplates.slice(0, 9);

  return (
    <div className="w-full max-w-[1050px] pt-[24px] pb-16 px-4 sm:px-[32px]">
      {/* Top Breadcrumb: < Back to Apps matching step_36_shot_3.png & step_347_shot_3 */}
      <div className="pl-[56px] min-[480px]:pl-0 h-[24px] flex items-center mb-[44px] min-[480px]:mb-[26px]">
        <Link
          href="/apps"
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#232833] hover:text-[#00a7d9]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Apps</span>
        </Link>
      </div>

      {/* Main Heading: Welcome to AI Studio */}
      <h1 className="text-center font-solar-display text-[32px] leading-[38px] font-bold tracking-[-0.01em] text-[#98a0ae] min-[480px]:text-[#232833] max-w-[260px] min-[480px]:max-w-none mx-auto mb-[36px]">
        Welcome to AI Studio
      </h1>

      {/* Section 1: Get started */}
      <section className="mb-[44px] max-w-[970px]">
        <div className="flex items-center justify-between mb-[14px]">
          <div className="flex items-center gap-2">
            <ReferenceIcon name="create-video" className="w-4 h-4 text-[#232833]" />
            <h2 className="text-[14px] font-bold text-[#232833]">Get started</h2>
          </div>
          <button
            type="button"
            onClick={() => setEditorOpen(true)}
            className="inline-flex items-center gap-1 text-[13px] font-bold text-[#232833] hover:text-[#00a7d9]"
          >
            <span>See All</span>
            <ReferenceIcon name="right" className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dashed New video Launcher Card (288x246px on mobile, 288x200px on desktop matching step_36_shot_3.png & studio-375x812.png) */}
        <div className="w-[288px] max-w-full">
          <div
            onClick={handleCreateBlankStudioVideo}
            className="group relative w-[288px] max-w-full h-[246px] min-[480px]:h-[200px] rounded-[20px] bg-[#f7f8fa] hover:bg-[#eceef2] flex items-center justify-center cursor-pointer transition-all"
          >
            <RefIconStudioDashedRect />
            {/* Top-left Landscape / Portrait toggle pill */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-3 left-3 h-8 rounded-full bg-[#e6e8ec] p-1 flex items-center gap-1"
            >
              <button
                type="button"
                aria-label="Start in landscape"
                onClick={() => setNewVideoRatio('16:9')}
                className={`w-7 h-6 rounded-full flex items-center justify-center transition-all ${
                  newVideoRatio === '16:9'
                    ? 'bg-white text-[#232833] shadow-sm'
                    : 'text-[#687080]'
                }`}
              >
                <ReferenceIcon name="desktop" className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                aria-label="Start in portrait"
                onClick={() => setNewVideoRatio('9:16')}
                className={`w-7 h-6 rounded-full flex items-center justify-center transition-all ${
                  newVideoRatio === '9:16'
                    ? 'bg-white text-[#232833] shadow-sm'
                    : 'text-[#687080]'
                }`}
              >
                <ReferenceIcon name="mobile" className="w-3.5 h-3.5" />
              </button>
            </div>

            <ReferenceIcon name="plus" className="w-6 h-6 text-[#4e5666]" />
          </div>

          <div className="mt-2.5 pl-1">
            <div className="text-[13.5px] font-bold text-[#232833]">New video</div>
            <div className="text-[11.5px] text-[#687080]">
              {newVideoRatio === '16:9' ? 'Start in landscape' : 'Start in portrait'}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Use a template (Rounded block container matching step_36_shot_3.png & studio-375x812.png) */}
      <section className="w-full max-w-[970px] rounded-[24px] bg-[#f7f8fa] p-[16px] min-[480px]:p-[24px] border border-[#eef0f3]">
        {/* Header + Search + Landscape/Portrait Toggle */}
        <div className="flex items-center justify-between gap-3 mb-[16px] min-[480px]:mb-[18px]">
          <h2 className="text-[20px] font-extrabold text-[#232833]">Use a template</h2>

          <div className="flex items-center gap-2">
            {/* Compact search circle on <=479px; input pill on >=480px */}
            <button
              type="button"
              aria-label="Search templates"
              className="min-[480px]:hidden w-[34px] h-[34px] rounded-full bg-white border border-[#e2e3e6] flex items-center justify-center text-[#232833]"
            >
              <ReferenceIcon name="Search" className="w-3.5 h-3.5" />
            </button>

            <div className="hidden min-[480px]:block relative w-[220px]">
              <ReferenceIcon name="Search" className="w-3.5 h-3.5 text-[#687080] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                placeholder="Search templates"
                className="w-full h-[34px] pl-9 pr-3.5 rounded-full bg-white border border-[#e2e3e6] text-[12.5px] text-[#232833] placeholder:text-[#8c93a3] focus:outline-none focus:border-[#00c4ff]"
              />
            </div>

            <div className="h-[34px] rounded-full bg-[#e6e8ec] p-1 flex items-center gap-1">
              <button
                type="button"
                aria-label="Filter landscape templates"
                onClick={() => setTemplateRatioFilter('16:9')}
                className={`w-7 h-6 rounded-full flex items-center justify-center ${
                  templateRatioFilter === '16:9'
                    ? 'bg-white text-[#232833] shadow-sm'
                    : 'text-[#687080]'
                }`}
              >
                <ReferenceIcon name="desktop" className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                aria-label="Filter portrait templates"
                onClick={() => setTemplateRatioFilter('9:16')}
                className={`w-7 h-6 rounded-full flex items-center justify-center ${
                  templateRatioFilter === '9:16'
                    ? 'bg-white text-[#232833] shadow-sm'
                    : 'text-[#687080]'
                }`}
              >
                <ReferenceIcon name="mobile" className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Underline Tabs Row */}
        <div className="relative flex items-center gap-6 overflow-x-auto pb-2 mb-[22px] no-scrollbar">
          {TEMPLATE_TABS.map((tab) => {
            const active = selectedTemplateTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedTemplateTab(tab)}
                className={`relative pb-2 text-[13px] font-bold whitespace-nowrap transition-colors ${
                  active ? 'text-[#232833]' : 'text-[#687080] hover:text-[#232833]'
                }`}
              >
                <span>{tab}</span>
                {active && (
                  <span className="absolute left-0 right-0 bottom-0 h-[2.5px] rounded-full bg-[#00c4ff]" />
                )}
              </button>
            );
          })}
        </div>

        {/* 3-Column Template Cards Grid matching step_36_shot_3.png */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => handleUseTemplate(tpl.id)}
              className="group cursor-pointer select-none"
            >
              <div className="relative h-[168px] rounded-[16px] bg-white p-1.5 shadow-sm border border-[#eaecee] overflow-hidden">
                {tpl.id === 'tpl-stress-free-moving' ? (
                  <div className="relative w-full h-full rounded-[12px] overflow-hidden bg-[#d8dbe2]">
                    <img
                      src="/heygen-assets/thumbnails/avatar-kurt-look2.webp"
                      alt={tpl.title}
                      className="w-full h-full object-cover object-top pl-16 transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    {/* Top-right orange corner ribbon matching step_36_shot_3.png */}
                    <div
                      className="absolute top-0 right-0 w-24 h-6 bg-[#e05a2b]"
                      style={{ clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0% 100%)' }}
                    />
                    {/* Bottom-left white diagonal polygon card with headline */}
                    <div
                      className="absolute left-0 bottom-0 w-[64%] h-[74%] bg-white p-3.5 flex flex-col justify-center"
                      style={{
                        clipPath: 'polygon(0 0, 78% 0, 98% 35%, 98% 100%, 0 100%)',
                      }}
                    >
                      <div className="text-[6.5px] font-bold text-[#e05a2b] mb-1">
                        Company Tagline
                      </div>
                      <div className="text-[11px] leading-[13.5px] font-extrabold text-[#232833] mb-1.5">
                        Headline about a
                        <br />
                        stress-free move
                      </div>
                      <div className="text-[6px] text-[#687080] leading-tight">
                        One line on careful handling and
                        <br />
                        on-time delivery
                      </div>
                    </div>
                    <div
                      className="absolute left-[48%] bottom-0 w-[18%] h-[50%] bg-[#e05a2b]"
                      style={{
                        clipPath: 'polygon(0 0, 22% 0, 100% 100%, 78% 100%)',
                      }}
                    />
                  </div>
                ) : (
                  <img
                    src={tpl.thumbnail_url}
                    alt={tpl.title}
                    className="w-full h-full object-cover rounded-[12px] transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                )}
                <button
                  type="button"
                  aria-label={`Favorite ${tpl.title}`}
                  onClick={async (e) => {
                    e.stopPropagation();
                    await fetch('/api/templates', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: tpl.id, is_favorite: !tpl.is_favorite }),
                    });
                    await bootstrap();
                    showToast(
                      !tpl.is_favorite
                        ? `Saved "${tpl.title}" to My Templates`
                        : `Removed "${tpl.title}" from My Templates`
                    );
                  }}
                  className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md ${
                    tpl.is_favorite
                      ? 'bg-white text-[#e54945]'
                      : 'bg-black/30 text-white opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${tpl.is_favorite ? 'fill-current' : ''}`} />
                </button>
              </div>
              <div className="mt-2.5 px-1">
                <h3 className="text-[13.5px] font-bold text-[#232833] truncate">{tpl.title}</h3>
                <p className="text-[11.5px] text-[#687080] truncate">{tpl.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {!expandedSeeMore && allFilteredTemplates.length > 9 && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setExpandedSeeMore(true)}
              className="h-[36px] px-5 rounded-full bg-white hover:bg-[#eff1f5] border border-[#e2e3e6] text-[12.5px] font-bold text-[#232833] transition-colors"
            >
              See More
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function AIStudioPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-12 text-center text-sm text-[#687080]">Loading AI Studio...</div>}>
        <AIStudioLandingContent />
      </Suspense>
    </AppShell>
  );
}

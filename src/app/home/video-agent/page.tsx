'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/shell/AppShell';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import referenceTemplates from '../../../../data/reference/templates.json';
import {
  ReferenceIcon,
  IconAvatarNav,
  IconVoiceWave,
  IconSingleScenePortrait,
  IconVideoAgentWand,
} from '@heygen/ui/icons';
import {
  Plus,
  Maximize2,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  ClipboardList,
} from 'lucide-react';

const INTRO_IMAGES = [
  '/heygen-assets/images/prompt-tips-how-to.jpg',
  '/heygen-assets/images/agent-internal-update.jpg',
  '/heygen-assets/images/prompt-educational-video.jpg',
  '/heygen-assets/images/prompt-ads-promo.png',
  '/heygen-assets/images/prompt-expert-explainer.png',
  '/heygen-assets/images/prompt-news-brief.jpg',
];

const GALLERY_TABS = [
  'For You',
  'Personal Brand',
  'Course & E‑learning',
  'Corporate Training',
  'Creator Channels',
  'Real Estate',
] as const;

export function VideoAgentContent({ isAppSubroute = false }: { isAppSubroute?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';
  const initialCategory = searchParams.get('category') || '';

  const {
    avatars,
    voices,
    aiProviders,
    aiModels,
    bootstrap,
    showToast,
    setActiveModal,
    setActiveStudioProject,
  } = useHeyGenStore();

  const [promptText, setPromptText] = useState(initialPrompt);
  const [selectedRatio, setSelectedRatio] = useState<'Auto' | 'Portrait' | 'Landscape'>('Auto');
  const [ratioPopoverOpen, setRatioPopoverOpen] = useState(false);
  const [selectedInspiration, setSelectedInspiration] = useState<string>(
    initialCategory || 'Recreate'
  );
  const [inlineDrawerCategory, setInlineDrawerCategory] = useState<
    'Intros' | 'Captions' | 'Format' | 'Brand' | null
  >(null);
  const [brandDrawerTab, setBrandDrawerTab] = useState<'Presets' | 'Your brand systems'>('Presets');
  const [activeGalleryTab, setActiveGalleryTab] = useState<(typeof GALLERY_TABS)[number]>('For You');
  const [autoPilotMode, setAutoPilotMode] = useState<'Auto-pilot' | 'Plan'>('Auto-pilot');
  const [autoPilotPopoverOpen, setAutoPilotPopoverOpen] = useState(false);
  const [recreateModalOpen, setRecreateModalOpen] = useState(false);
  const [recreatePlan, setRecreatePlan] = useState<'Creator' | 'Pro'>('Pro');
  const [generating, setGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [jobError, setJobError] = useState<string | null>(null);

  const handleScriptWriter = () => {
    const topic = promptText.trim() || initialCategory || 'AI Video Automation';
    setPromptText(
      `[Scene 1 - Hook]\nStop spending weeks on video production. With HeyGen Video Agent, you can turn any prompt about ${topic} into a studio-quality video in minutes.\n\n[Scene 2 - Core Value]\nPair lifelike AI avatars with expressive multilingual voices and automatic B-roll captions.`
    );
    showToast('AI Script Writer generated a 2-scene script');
  };

  const handleGenerateVideo = async () => {
    const finalPrompt =
      promptText.trim() ||
      'Create an engaging presenter video introducing HeyGen Video Agent with dynamic intros and captions.';
    setGenerating(true);
    setJobError(null);
    setGeneratedVideoUrl(null);

    try {
      const avatarId = avatars[0]?.id || 'avatar-annie';
      const voiceId = voices[0]?.id || 'voice-annie';
      const mappedRatio = selectedRatio === 'Portrait' ? '9:16' : '16:9';

      const projRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: initialCategory
            ? `${initialCategory} — Video Agent`
            : finalPrompt.slice(0, 42).trim(),
          project_type: 'video_agent',
          aspect_ratio: mappedRatio,
          script: finalPrompt,
          avatar_id: avatarId,
          voice_id: voiceId,
          duration_sec: 8,
        }),
      });
      const projData = await projRes.json();

      const provider =
        aiProviders.find((p) => p.id === 'prov-local-ffmpeg') || aiProviders[3];
      const model =
        aiModels.find((m) => m.provider_id === provider?.id) ||
        aiModels.find((m) => m.id === 'mdl-local-ffmpeg-composer');

      const jobRes = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projData.project?.id,
          task_type: 'text_to_video',
          provider_id: provider?.id || 'prov-local-ffmpeg',
          model_id: model?.id || 'mdl-local-ffmpeg-composer',
          input_params: {
            prompt: finalPrompt,
            script: finalPrompt,
            inspiration: selectedInspiration,
            avatar_id: avatarId,
            voice_id: voiceId,
            aspect_ratio: mappedRatio,
            duration_sec: 8,
          },
        }),
      });
      const jobData = await jobRes.json();
      await bootstrap();

      if (!jobRes.ok || jobData.generation_job?.status === 'failed') {
        setJobError(
          jobData.generation_job?.error_message || jobData.error || 'Video generation failed'
        );
      } else if (jobData.generation_job?.output_url) {
        setGeneratedVideoUrl(jobData.generation_job.output_url);
        if (projData.project?.id) {
          setActiveStudioProject(projData.project.id);
        }
        showToast('Video Agent completed generation!');
      }
    } finally {
      setGenerating(false);
    }
  };

  const visibleGallerySections =
    activeGalleryTab === 'For You'
      ? referenceTemplates.videoAgentGallerySections
      : referenceTemplates.videoAgentGallerySections.filter(
          (sec) => sec.tab === activeGalleryTab
        );

  return (
    <div
      className="relative w-full max-w-[1080px] pt-[24px] min-[480px]:pt-[58px] pb-16 px-4 sm:px-[32px]"
      onClick={() => {
        if (ratioPopoverOpen) setRatioPopoverOpen(false);
        if (autoPilotPopoverOpen) setAutoPilotPopoverOpen(false);
      }}
    >
      {/* Back to Apps link: always shown on mobile <=479px next to Toggle navigation (step_363_shot_1) or when isAppSubroute */}
      <div
        className={`${
          isAppSubroute ? 'block' : 'block min-[480px]:hidden'
        } pl-[56px] min-[480px]:pl-0 mb-[44px] min-[480px]:mb-4 h-[24px] flex items-center`}
      >
        <button
          type="button"
          onClick={() => router.push('/apps')}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#232833] hover:text-[#00a7d9]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Apps</span>
        </button>
      </div>

      {/* Ambient aura behind Video Agent composer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[20px] left-0 min-[480px]:left-[190px] w-full min-[480px]:w-[580px] max-w-full h-[540px] rounded-full opacity-45 blur-[80px]"
        style={{
          background:
            'radial-gradient(circle, rgba(4, 211, 214, 0.35), rgba(194, 89, 255, 0.22) 55%, transparent 100%)',
        }}
      />

      <h1 className="relative z-10 text-center font-solar-display text-[26px] leading-[30px] min-[480px]:text-[34px] min-[480px]:leading-[40px] font-bold tracking-[-0.01em] text-[#232833] mb-[24px] min-[480px]:mb-[32px]">
        What should your video be about?
      </h1>

      {/* 2-Column Video Agent Layout: On mobile (<1024px), Composer is order-1 and Add inspiration is order-2 (step_363_shot_1) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-[24px] items-stretch">
        {/* Left Card on Desktop / Second Card on Mobile: Add inspiration OR Inline Intros/Captions/Format/Brand Drawer */}
        <div
          className={`order-2 lg:order-1 ${
            inlineDrawerCategory ? 'lg:col-span-4' : 'lg:col-span-5'
          } rounded-[32px] bg-white/95 border border-[#232833]/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-[22px] flex flex-col max-h-[630px] transition-all`}
        >
          {inlineDrawerCategory ? (
            <>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={() => setInlineDrawerCategory(null)}
                    className="h-8 px-3 rounded-full bg-[#f4f5f7] hover:bg-[#e6e8ec] inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#232833]"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  {inlineDrawerCategory === 'Brand' && (
                    <button
                      type="button"
                      onClick={() => router.push('/brand/new')}
                      className="h-8 px-3 rounded-full border border-[#e2e5ea] hover:bg-[#f7f8fa] inline-flex items-center gap-1 text-[11.5px] font-bold text-[#232833]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add new brand system</span>
                    </button>
                  )}
                </div>
                <h2 className="text-[18px] font-extrabold text-[#232833] mb-1">
                  {inlineDrawerCategory}
                </h2>
                <p className="text-[12px] leading-[16px] text-[#687080]">
                  {inlineDrawerCategory === 'Intros' &&
                    'Choose how your video opens and sets the scene.'}
                  {inlineDrawerCategory === 'Captions' &&
                    'Pick an animated HyperFrames caption style for your video.'}
                  {inlineDrawerCategory === 'Format' &&
                    'Choose the overall structure and presentation of your video.'}
                  {inlineDrawerCategory === 'Brand' &&
                    "Pick a look for your video's colors, fonts, and layout."}
                </p>
              </div>

              {/* 1. INTROS DRAWER (All 27 Observed Intro Templates) */}
              {inlineDrawerCategory === 'Intros' && (
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {referenceTemplates.videoAgentIntros.map((card, idx) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => {
                        setSelectedInspiration(card.title);
                        setInlineDrawerCategory(null);
                        showToast(`Applied "${card.title}" intro preset`);
                      }}
                      className="relative w-full h-[156px] rounded-[16px] overflow-hidden cursor-pointer group border border-[#eaecee] text-left block"
                    >
                      <img
                        src={INTRO_IMAGES[idx % INTRO_IMAGES.length]}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center p-3 text-center">
                        <span className="text-[14px] leading-[18px] font-extrabold tracking-wide text-white uppercase drop-shadow">
                          {card.overlayPrimary}
                        </span>
                        <span className="text-[12px] leading-[15px] font-bold tracking-wider text-white/90 uppercase drop-shadow">
                          {card.overlaySecondary}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 left-3 right-3 text-[11.5px] font-bold text-white drop-shadow truncate">
                        {card.title}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* 2. CAPTIONS DRAWER (All 75 Observed HyperFrames Presets) */}
              {inlineDrawerCategory === 'Captions' && (
                <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2.5 pr-1">
                  {referenceTemplates.videoAgentCaptions.map((captionName, idx) => (
                    <button
                      key={captionName}
                      type="button"
                      onClick={() => {
                        setSelectedInspiration(`Caption: ${captionName}`);
                        setInlineDrawerCategory(null);
                        showToast(`Selected "${captionName}" caption preset`);
                      }}
                      className="h-[88px] rounded-[14px] bg-[#1b1e24] hover:bg-[#252a33] border border-[#2f3542] p-2.5 flex flex-col items-center justify-between text-center transition-all group"
                    >
                      <div className="my-auto">
                        <span
                          className={`text-[12px] font-extrabold tracking-tight px-2 py-0.5 rounded ${
                            idx % 4 === 0
                              ? 'bg-[#facc15] text-[#151619]'
                              : idx % 4 === 1
                              ? 'bg-[#00c4ff] text-[#151619]'
                              : idx % 4 === 2
                              ? 'bg-[#ec4899] text-white'
                              : 'text-white underline decoration-[#00e5ff]'
                          }`}
                        >
                          {captionName.split(' ').slice(0, 2).join(' ')}
                        </span>
                      </div>
                      <span className="text-[10.5px] font-semibold text-white/80 truncate w-full">
                        {captionName}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* 3. FORMAT DRAWER (All 4 Observed Format Cards + Local MP4 Previews) */}
              {inlineDrawerCategory === 'Format' && (
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {referenceTemplates.videoAgentFormats.map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => {
                        setSelectedInspiration(`Format: ${fmt.title}`);
                        setInlineDrawerCategory(null);
                        showToast(`Selected "${fmt.title}" video format`);
                      }}
                      className="w-full rounded-[16px] border border-[#eaecee] hover:border-[#00c4ff] overflow-hidden bg-[#f8f9fb] text-left transition-all"
                    >
                      <div className="relative h-[136px] w-full bg-black">
                        <video
                          src={fmt.localVideo}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11.5px] font-bold">
                          {fmt.title}
                        </div>
                      </div>
                      {fmt.description && (
                        <div className="px-3 py-2 text-[11.5px] text-[#687080]">
                          {fmt.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* 4. BRAND DRAWER (Presets: Clearspace, Opal, Mat | Your brand systems) */}
              {inlineDrawerCategory === 'Brand' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div
                    role="tablist"
                    className="grid grid-cols-2 rounded-full bg-[#f4f5f7] p-1 mb-3 shrink-0"
                  >
                    {(['Presets', 'Your brand systems'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        role="tab"
                        aria-selected={brandDrawerTab === t}
                        onClick={() => setBrandDrawerTab(t)}
                        className={`h-7 rounded-full text-[11.5px] font-bold transition-colors ${
                          brandDrawerTab === t
                            ? 'bg-white text-[#151619] shadow-xs'
                            : 'text-[#687080] hover:text-[#151619]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {brandDrawerTab === 'Presets' ? (
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                      <h3 className="text-[12.5px] font-bold text-[#232833]">Modern</h3>
                      {[
                        {
                          name: 'Clearspace',
                          bg: 'rgb(145, 185, 223)',
                          textColor: '#1a2b42',
                          tagline: 'Make room for focus.',
                        },
                        {
                          name: 'Opal',
                          bg: 'rgb(240, 238, 243)',
                          textColor: '#231f2e',
                          tagline: 'Good work starts with clear space.',
                        },
                        {
                          name: 'Mat',
                          bg: 'rgb(35, 46, 38)',
                          textColor: '#efe8d8',
                          tagline: 'Mat',
                        },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          aria-label={preset.name}
                          onClick={() => {
                            setSelectedInspiration(`Brand: ${preset.name}`);
                            setInlineDrawerCategory(null);
                            showToast(`Applied "${preset.name}" brand preset`);
                          }}
                          className="w-full text-left group"
                        >
                          <div
                            className="w-full aspect-[280/158] rounded-xl border-2 border-[#eaecee] group-hover:border-[#00c4ff] p-4 flex flex-col justify-between transition-all shadow-xs"
                            style={{
                              backgroundColor: preset.bg,
                              color: preset.textColor,
                            }}
                          >
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                              {preset.name}
                            </span>
                            <span className="text-[16px] font-extrabold leading-snug">
                              {preset.tagline}
                            </span>
                          </div>
                          <div className="mt-1 text-[12px] font-bold text-[#232833]">
                            {preset.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[12.5px] text-[#687080]">
                      <p className="mb-3">You have no brand systems yet.</p>
                      <button
                        type="button"
                        onClick={() => router.push('/brand/new')}
                        className="h-8 px-4 rounded-full bg-[#151619] text-white text-[12px] font-bold"
                      >
                        Create Brand System
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-[18px] font-extrabold text-[#232833] mb-1">Add inspiration</h2>
              <p className="text-[12.5px] leading-[17px] text-[#687080] mb-4">
                Choose inspiration for how your video looks, feels, and flows.
              </p>

              <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1">
                {/* Card 1: + Recreate */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedInspiration('Recreate');
                    setRecreateModalOpen(true);
                  }}
                  className="relative h-[196px] rounded-[16px] bg-[#2e323b] text-white p-4 flex flex-col items-center justify-center text-center transition-all overflow-hidden"
                  style={{
                    boxShadow:
                      'inset 0 0 0 2px rgba(194, 89, 255, 0.65), 0 4px 14px rgba(0, 196, 255, 0.15)',
                  }}
                >
                  <Plus className="w-6 h-6 mb-2 text-white" />
                  <div className="text-[14px] font-bold mb-1">Recreate</div>
                  <div className="text-[11.5px] text-white/75 leading-snug">
                    Reference any
                    <br />
                    video.
                    <br />
                    Make it yours.
                  </div>
                </button>

                {/* Card 2: Intros */}
                <div
                  onClick={() => {
                    setSelectedInspiration('Intros');
                    setInlineDrawerCategory('Intros');
                  }}
                  className={`relative h-[196px] rounded-[16px] overflow-hidden cursor-pointer border-2 ${
                    selectedInspiration === 'Intros' ? 'border-[#00c4ff]' : 'border-transparent'
                  }`}
                >
                  <img
                    src="/heygen-assets/images/agent-internal-update.jpg"
                    alt="Intros"
                    className="w-full h-full object-cover brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#493b2a]/55 via-black/35 to-[#3d2817]/75 flex flex-col items-center justify-between py-3.5 px-3 text-center">
                    <div className="text-[20px] leading-[20px] font-serif font-extrabold tracking-tight text-[#d8cfc2]/80 uppercase select-none">
                      BEIGE
                    </div>
                    <div className="flex flex-col items-center justify-center my-auto">
                      <div className="text-[14px] font-bold text-white mb-2 drop-shadow">
                        Intros
                      </div>
                      <span className="px-4 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/40 text-white text-[12px] font-semibold">
                        Explore
                      </span>
                    </div>
                    <div className="text-[20px] leading-[20px] font-serif font-extrabold tracking-tight text-[#d8cfc2]/80 uppercase select-none">
                      OVER
                    </div>
                  </div>
                </div>

                {/* Card 3: Captions */}
                <div
                  onClick={() => {
                    setSelectedInspiration('Captions');
                    setInlineDrawerCategory('Captions');
                  }}
                  className={`relative h-[196px] rounded-[16px] overflow-hidden cursor-pointer border-2 ${
                    selectedInspiration === 'Captions' ? 'border-[#00c4ff]' : 'border-transparent'
                  }`}
                >
                  <img
                    src="/heygen-assets/images/video-agent-captions.jpg"
                    alt="Captions"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center p-3">
                    <div className="text-[14px] font-bold text-white mb-2">Captions</div>
                    <span className="px-4 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/40 text-white text-[12px] font-semibold">
                      Explore
                    </span>
                    <span className="absolute bottom-3.5 text-[11px] font-serif italic text-white/95 whitespace-nowrap">
                      Bring your{' '}
                      <span className="text-[#00e5ff] underline decoration-[#00e5ff]">story</span>{' '}
                      to life
                    </span>
                  </div>
                </div>

                {/* Card 4: Format */}
                <div
                  onClick={() => {
                    setSelectedInspiration('Format');
                    setInlineDrawerCategory('Format');
                  }}
                  className={`relative h-[196px] rounded-[16px] overflow-hidden cursor-pointer border-2 ${
                    selectedInspiration === 'Format' ? 'border-[#00c4ff]' : 'border-transparent'
                  }`}
                >
                  <video
                    src="/heygen-assets/videos/prompt-builder-hub.mp4"
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-3">
                    <div className="text-[14px] font-bold text-white mb-2 drop-shadow">Format</div>
                    <span className="px-4 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/40 text-white text-[12px] font-semibold">
                      Explore
                    </span>
                  </div>
                </div>

                {/* Card 5: Brand */}
                <div
                  onClick={() => {
                    setSelectedInspiration('Brand');
                    setInlineDrawerCategory('Brand');
                  }}
                  className={`relative h-[150px] rounded-[16px] overflow-hidden cursor-pointer border-2 ${
                    selectedInspiration === 'Brand' ? 'border-[#00c4ff]' : 'border-transparent'
                  }`}
                >
                  <img
                    src="/heygen-assets/images/video-agent-brand.jpg"
                    alt="Brand"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-end pb-5">
                    <div className="text-[14px] font-bold text-white">Brand</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Card on Desktop / First Card on Mobile: Avatar and References + Script Composer */}
        <div
          className={`order-1 lg:order-2 ${
            inlineDrawerCategory ? 'lg:col-span-8' : 'lg:col-span-7'
          } rounded-[32px] bg-white border border-[#232833]/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-[18px] min-[480px]:p-[22px] flex flex-col justify-between min-h-[450px] min-[480px]:min-h-[630px] transition-all`}
        >
          <div>
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] font-medium text-[#687080]">
                Avatar and References
              </span>
              <button
                type="button"
                onClick={() => router.push('/apps/studio')}
                title="Open in Full AI Studio"
                className="hidden min-[480px]:flex w-7 h-7 rounded-lg items-center justify-center text-[#4e5666] hover:bg-[#f2f3f5]"
              >
                <ReferenceIcon name="expand-corners" className="w-4 h-4" />
              </button>
            </div>

            {/* Selector Pill Bar + External [+] Button matching OnboardingAutoSubmitter-CNazkwiz.css (.pb-delivery & .pb-delivery-chip) */}
            <div className="pb-3.5 min-[480px]:pb-4 mb-3.5 min-[480px]:mb-4 border-b border-[#232833]/10">
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0 p-3 rounded-[16px] bg-[#232833]/[0.04] flex flex-col min-[480px]:flex-row items-stretch min-[480px]:items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveModal('choose-avatar')}
                    className="w-[140px] min-[480px]:w-auto min-[480px]:flex-1 min-w-0 flex items-center bg-transparent hover:bg-[#eaecee] rounded-full border border-[#e2e3e6] px-4 h-[40px] gap-2 text-left transition-colors"
                  >
                    <ReferenceIcon name="char-full-body" className="w-4 h-4 text-[#232833] shrink-0" />
                    <span className="text-[14px] font-semibold text-[#232833] truncate">Auto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModal('choose-voice')}
                    className="w-full min-[480px]:flex-1 min-w-0 flex items-center bg-transparent hover:bg-[#eaecee] rounded-full border border-[#e2e3e6] px-4 h-[40px] gap-2 text-left transition-colors"
                  >
                    <ReferenceIcon name="audio" className="w-4 h-4 text-[#232833] shrink-0" />
                    <span className="text-[14px] font-semibold text-[#232833] truncate">Auto</span>
                  </button>

                  <div
                    className="relative w-[104px] min-[480px]:w-auto min-[480px]:flex-1 min-w-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setRatioPopoverOpen(!ratioPopoverOpen)}
                      className="w-full flex items-center bg-transparent hover:bg-[#eaecee] rounded-full border border-[#e2e3e6] px-4 h-[40px] gap-2 text-left transition-colors"
                    >
                      <ReferenceIcon name="aspect-ratio" className="w-4 h-4 text-[#232833] shrink-0" />
                      <span className="text-[14px] font-semibold text-[#232833] truncate">
                        {selectedRatio}
                      </span>
                    </button>

                    {ratioPopoverOpen && (
                      <div
                        role="listbox"
                        className="absolute right-0 top-[44px] z-30 w-[136px] rounded-[16px] bg-white border border-[#eaecee] shadow-[0_10px_32px_rgba(0,0,0,0.12)] p-1.5 space-y-0.5"
                      >
                        {(['Auto', 'Portrait', 'Landscape'] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setSelectedRatio(opt);
                              setRatioPopoverOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-[12.5px] font-bold transition-colors ${
                              selectedRatio === opt
                                ? 'bg-[#e3f4fa] text-[#232833]'
                                : 'text-[#232833] hover:bg-[#f7f8fa]'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Add reference media"
                  onClick={() => showToast('Reference media attached from workspace assets')}
                  className="w-[34px] h-[34px] rounded-full bg-[#232833]/[0.04] hover:bg-[#eaecee] flex items-center justify-center text-[#232833] shrink-0"
                >
                  <ReferenceIcon name="add" className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[12px] font-normal text-[#687080] mt-2.5 flex items-center gap-1.5">
                <ReferenceIcon name="info" className="w-3.5 h-3.5 text-[#687080] shrink-0" />
                <span>Free plan: videos up to 60 seconds.</span>
              </div>
            </div>

            {/* Main Script / Idea Textarea (.pb-doc-input: font-size: 24px, line-height: 34.8px) */}
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Describe your video idea or paste a script."
              className="w-full h-[88px] min-[480px]:h-[285px] resize-none border-0 text-[24px] leading-[34.8px] text-[#232833] placeholder:text-[#687080] focus:outline-none"
            />

            {jobError && (
              <div className="mt-3 p-3.5 rounded-2xl bg-[#fff5f5] border border-[#feb2b2] text-[12.5px] text-[#c53030]">
                <strong>Provider Status:</strong> {jobError}
              </div>
            )}

            {generatedVideoUrl && (
              <div className="mt-3 p-4 rounded-2xl bg-[#f7f8fa] border border-[#00c4ff] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#232833] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00bf8f]" />
                    <span>Generated Video Ready</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={generatedVideoUrl}
                      download
                      className="text-[12px] font-semibold text-[#00a7d9] hover:underline"
                    >
                      Download MP4
                    </a>
                    <button
                      type="button"
                      onClick={() => router.push('/apps/studio?editor=1')}
                      className="px-3 py-1 rounded-full bg-[#19191a] text-white text-[11.5px] font-semibold"
                    >
                      Edit in AI Studio →
                    </button>
                  </div>
                </div>
                <video
                  src={generatedVideoUrl}
                  controls
                  className="w-full max-h-[190px] rounded-xl bg-black"
                />
              </div>
            )}
          </div>

          {/* Bottom Controls Bar (Stacked Auto-pilot above Generate video on <=479px matching step_363_shot_1; single row on >=480px) */}
          <div className="pt-4 flex flex-col min-[480px]:flex-row flex-wrap items-stretch min-[480px]:items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={handleScriptWriter}
              className="w-fit h-[38px] px-4 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] text-[12.5px] font-bold text-[#232833] flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#232833] shrink-0" />
              <span>Script Writer</span>
            </button>

            <div className="flex flex-col min-[480px]:flex-row items-end min-[480px]:items-center gap-2.5 min-[480px]:gap-2 shrink-0">
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setAutoPilotPopoverOpen(!autoPilotPopoverOpen)}
                  className="h-[38px] px-4 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] text-[12.5px] font-bold text-[#232833] flex items-center gap-2 whitespace-nowrap"
                >
                  <IconVideoAgentWand className="w-3.5 h-3.5 shrink-0" />
                  <span>{autoPilotMode}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#687080] shrink-0" />
                </button>

                {autoPilotPopoverOpen && (
                  <div
                    role="listbox"
                    className="absolute right-0 bottom-[46px] z-30 w-[238px] rounded-[18px] bg-white border border-[#eaecee] shadow-[0_12px_36px_rgba(0,0,0,0.14)] p-2 space-y-1"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setAutoPilotMode('Plan');
                        setAutoPilotPopoverOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl flex items-start gap-2.5 transition-colors ${
                        autoPilotMode === 'Plan' ? 'bg-[#f4f5f7]' : 'hover:bg-[#f7f8fa]'
                      }`}
                    >
                      <ClipboardList className="w-4 h-4 text-[#232833] mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[12.5px] font-extrabold text-[#232833]">Plan</div>
                        <div className="text-[11px] leading-[15px] text-[#687080]">
                          Review the plan before I make your video.
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAutoPilotMode('Auto-pilot');
                        setAutoPilotPopoverOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl flex items-start gap-2.5 transition-colors ${
                        autoPilotMode === 'Auto-pilot' ? 'bg-[#f4f5f7]' : 'hover:bg-[#f7f8fa]'
                      }`}
                    >
                      <IconVideoAgentWand className="w-4 h-4 text-[#232833] mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[12.5px] font-extrabold text-[#232833]">
                          Auto-pilot
                        </div>
                        <div className="text-[11px] leading-[15px] text-[#687080]">
                          Auto-generate your video.
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={generating}
                onClick={handleGenerateVideo}
                className="h-[40px] px-5 rounded-full bg-[#737680] hover:bg-[#232833] text-white text-[13px] font-bold flex items-center gap-2 border-[2px] border-[#00c4ff] shadow-[0_2px_12px_rgba(0,196,255,0.25)] transition-all disabled:opacity-60 whitespace-nowrap"
              >
                <span>{generating ? 'Generating...' : 'Generate video'}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Either 3 App Quick Action Cards (/apps/video-agent) OR 6-Tab 29-Card Template Gallery (/home/video-agent) */}
      {isAppSubroute ? (
        <section className="relative z-10 mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Photo to Video',
              subtitle: 'Create an avatar video from a photo',
              href: '/home/photo-to-video',
            },
            {
              title: 'Translate Video',
              subtitle: 'Translate any video into 195+ languages',
              href: '/home/translate',
            },
            {
              title: 'Create Avatar',
              subtitle: 'Clone yourself or create a character',
              href: '/avatars/create/avatar-hub',
            },
          ].map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => router.push(item.href)}
              className="p-5 rounded-[18px] bg-white border border-[#eaecee] hover:border-[#00c4ff] text-left transition-all shadow-xs"
            >
              <div className="text-[14.5px] font-extrabold text-[#232833] mb-1">{item.title}</div>
              <div className="text-[12px] text-[#687080]">{item.subtitle}</div>
            </button>
          ))}
        </section>
      ) : (
        <section className="relative z-10 mt-12">
          {/* 6 Category Tabs */}
          <div
            role="tablist"
            aria-label="What should your video be about?"
            className="flex flex-wrap items-center justify-center gap-2 mb-8"
          >
            {GALLERY_TABS.map((tab) => {
              const selected = activeGalleryTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveGalleryTab(tab)}
                  className={`h-[36px] px-4 rounded-full text-[13px] font-bold transition-all ${
                    selected
                      ? 'bg-[#e8f8fd] text-[#151619] border border-[#00c4ff]'
                      : 'bg-white hover:bg-[#f4f5f7] text-[#4e5666] border border-[#e6e8ec]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* 5 Category Regions (29 Cards Total) */}
          <div role="tabpanel" className="space-y-10">
            {visibleGallerySections.map((section) => (
              <div key={section.id} role="region" aria-label={section.heading}>
                <h2 className="text-[20px] font-extrabold text-[#232833] mb-4">
                  {section.heading}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.cards.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => {
                        if ('href' in card && card.href) {
                          router.push(card.href);
                        } else {
                          setPromptText(card.subtitle);
                          setSelectedInspiration(card.title);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          showToast(`Loaded "${card.title}" template into Video Agent`);
                        }
                      }}
                      className="group relative h-[184px] rounded-[18px] overflow-hidden text-left shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-[#eaecee]"
                    >
                      <img
                        src={card.localImage}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/55 p-4 flex flex-col justify-between">
                        <h3 className="hg-card-display-title text-white drop-shadow">
                          {card.title}
                        </h3>
                        <div>
                          <span className="inline-flex items-center gap-1.5 h-[34px] px-4 rounded-full bg-white/20 group-hover:bg-white/30 backdrop-blur-md border border-white/50 text-white text-[12px] font-bold transition-all">
                            <span>{card.cta}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* UNLOCK RECREATE IN VIDEO AGENT MODAL */}
      {recreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1219]/45 backdrop-blur-[4px] p-4"
          onClick={() => setRecreateModalOpen(false)}
        >
          <div
            className="relative w-full max-w-[790px] rounded-[22px] bg-white p-7 shadow-2xl border border-[#eaecee] grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setRecreateModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#687080] hover:bg-[#f2f3f5]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="md:col-span-6 space-y-4">
              <h3 className="text-[25px] leading-[31px] font-extrabold text-[#232833]">
                Unlock Recreate in Video Agent
              </h3>

              <div role="radiogroup" className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRecreatePlan('Creator')}
                  className={`p-3 rounded-[14px] border text-left transition-all ${
                    recreatePlan === 'Creator'
                      ? 'border-2 border-[#00c4ff] bg-white'
                      : 'border-[#e2e3e6] bg-white'
                  }`}
                >
                  <div className="text-[13px] font-extrabold text-[#232833]">Creator</div>
                  <div className="text-[13px] font-extrabold text-[#232833]">
                    $29<span className="font-normal text-[#687080]">/mo</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRecreatePlan('Pro')}
                  className={`p-3 rounded-[14px] border text-left transition-all ${
                    recreatePlan === 'Pro'
                      ? 'border-2 border-[#00c4ff] bg-white'
                      : 'border-[#e2e3e6] bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-extrabold text-[#232833]">Pro</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#00c4ff] text-[#19191a] text-[9.5px] font-extrabold">
                      Most Popular
                    </span>
                  </div>
                  <div className="text-[13px] font-extrabold text-[#232833]">
                    $49<span className="font-normal text-[#687080]">/mo</span>
                  </div>
                </button>
              </div>

              <div className="text-[12px] font-semibold text-[#4e5666]">
                Everything in Creator, plus:
              </div>

              <div className="space-y-2.5 text-[12.5px] font-semibold text-[#232833]">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00c4ff] mt-0.5 shrink-0" />
                  <span>Recreate any video scene by scene, then make it your own</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00c4ff] shrink-0" />
                  <span>1,000 monthly credits</span>
                  <span className="px-2 py-0.5 rounded bg-[#d5f6ff] text-[#007091] text-[10.5px] font-extrabold">
                    +67% vs Creator
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00c4ff] shrink-0" />
                  <span>Every frontier model as it ships</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00c4ff] shrink-0" />
                  <span>4K video export</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00c4ff] shrink-0" />
                  <span>Customizable monthly usage</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setRecreateModalOpen(false);
                  setActiveModal('upgrade');
                }}
                className="w-full h-11 rounded-full bg-[#19191a] hover:bg-[#343842] text-white text-[13.5px] font-bold transition-colors"
              >
                Get {recreatePlan}
              </button>

              <div className="text-center text-[11.5px] font-bold text-[#007091]">
                <strong className="text-[13px]">27</strong> people just upgraded in the last 20
                minutes
              </div>
            </div>

            <div className="md:col-span-6 rounded-[18px] bg-[#f4f1ea] p-4 flex items-center justify-center">
              <video
                src="/heygen-assets/videos/recreate-upsell-beige-v2.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-[380px] object-cover rounded-[14px]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VideoAgentPage() {
  return (
    <AppShell showUpgradePill={true}>
      <Suspense
        fallback={
          <div className="p-12 text-center text-sm text-[#687080]">Loading Video Agent...</div>
        }
      >
        <VideoAgentContent />
      </Suspense>
    </AppShell>
  );
}

'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import { ReferenceIcon, IconVoiceWave } from '@heygen/ui/icons';
import {
  UserPlus,
  Play,
  ChevronDown,
  Smartphone,
  Monitor,
  ArrowUp,
  ChevronRight,
  CheckCircle2,
  Mic,
  Upload,
  X,
  Check,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

function IconMotionPerson({ className = 'w-4 h-4' }: { className?: string }) {
  return <ReferenceIcon name="movement-expressive" className={className} />;
}

const AVATAR_ENGINES = [
  {
    id: 'Avatar V',
    desc: 'Moves like you. Motion adapts to script.',
    badge: '/heygen-assets/icons/avatar-v-badge.png',
  },
  {
    id: 'Avatar IV',
    desc: 'Generic motion that adapts to script.',
    badge: '/heygen-assets/icons/avatar-iv-badge.png',
  },
  {
    id: 'Avatar III',
    desc: 'Applies lip sync.',
    badge: '/heygen-assets/icons/avatar-iii-badge.png',
  },
] as const;

export function AvatarScriptComposerView({
  submitVariant = 'generate-pill',
  initialMode = 'Presenter',
}: {
  submitVariant?: 'generate-pill' | 'arrow-circle';
  initialMode?: 'Presenter' | 'Cinematic';
}) {
  const router = useRouter();
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const {
    avatars,
    voices,
    projects,
    bootstrap,
    showToast,
    setActiveModal,
    setActiveStudioProject,
  } = useHeyGenStore();

  const [mode, setMode] = useState<'Presenter' | 'Cinematic'>(initialMode);
  const [cinematicPrompt, setCinematicPrompt] = useState('');
  const [cinematicEnhance, setCinematicEnhance] = useState(true);
  const [cinematicAvatarSelected, setCinematicAvatarSelected] = useState(true);
  const [selectedAvatarId] = useState<string>('');
  const [engineModel, setEngineModel] = useState<'Avatar V' | 'Avatar IV' | 'Avatar III'>(
    'Avatar V'
  );
  const [enginePopoverOpen, setEnginePopoverOpen] = useState(false);
  const [motionPanelOpen, setMotionPanelOpen] = useState(false);
  const [customMotionText, setCustomMotionText] = useState('');
  const [moreExpressive, setMoreExpressive] = useState(true);
  const [selectedVoiceId] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<'Portrait' | 'Landscape'>('Portrait');
  const [ratioPopoverOpen, setRatioPopoverOpen] = useState(false);
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [resolutionPopoverOpen, setResolutionPopoverOpen] = useState(false);
  const [scriptText, setScriptText] = useState('');
  const [uploadRecordModalOpen, setUploadRecordModalOpen] = useState(false);
  const [recordAudioTab, setRecordAudioTab] = useState<'record' | 'upload'>('record');
  const [generating, setGenerating] = useState(false);
  const [latestVideoUrl, setLatestVideoUrl] = useState<string | null>(null);

  const selectedAvatar = avatars.find((a) => a.id === selectedAvatarId) || null;
  const selectedVoice = voices.find((v) => v.id === selectedVoiceId) || voices[0];

  const handlePreviewVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(
        scriptText.trim() ||
          `Hello! This is a preview of ${selectedVoice?.name || 'HeyGen Voice'}.`
      );
      window.speechSynthesis.speak(utter);
    }
    showToast(`Playing voice preview: ${selectedVoice?.name || 'Annie - Lifelike'}`);
  };

  const handleGenerateAvatarVideo = async () => {
    const finalScript =
      scriptText.trim() ||
      'Welcome to HeyGen! This talking avatar video was generated in Presenter mode.';
    setGenerating(true);
    try {
      const av = selectedAvatar || avatars[0];
      const vId = selectedVoiceId || 'voice-annie';
      const mappedRatio = aspectRatio === 'Portrait' ? '9:16' : '16:9';
      const projRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${av?.name || 'Avatar'} — ${mode} Video`,
          project_type: 'avatar_video',
          aspect_ratio: mappedRatio,
          resolution,
          thumbnail_url:
            av?.main_thumbnail_url || '/heygen-assets/thumbnails/avatar-annie-main.webp',
          script: finalScript,
          avatar_id: av?.id || 'avatar-annie',
          voice_id: vId,
          duration_sec: 6,
        }),
      });
      const projData = await projRes.json();

      const jobRes = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projData.project?.id,
          task_type: 'talking_avatar',
          provider_id: 'prov-local-ffmpeg',
          model_id: 'mdl-local-ffmpeg-composer',
          input_params: {
            script: finalScript,
            mode,
            engine: engineModel,
            motion: customMotionText || 'Natural gestures',
            avatar_id: av?.id || 'avatar-annie',
            voice_id: vId,
            aspect_ratio: mappedRatio,
            resolution,
            duration_sec: 6,
          },
        }),
      });
      const jobData = await jobRes.json();
      await bootstrap();

      if (jobData.generation_job?.output_url) {
        setLatestVideoUrl(jobData.generation_job.output_url);
        showToast('Talking avatar video generated successfully!');
      }
    } finally {
      setGenerating(false);
    }
  };

  const recentAvatarProjects = projects.filter(
    (p) => p.status !== 'trashed' && p.project_type === 'avatar_video'
  );

  return (
    <div
      className="w-full max-w-[1050px] pt-[24px] min-[480px]:pt-[46px] pb-16 px-4 sm:px-[32px] flex flex-col items-center"
      onClick={() => {
        if (enginePopoverOpen) setEnginePopoverOpen(false);
        if (ratioPopoverOpen) setRatioPopoverOpen(false);
        if (resolutionPopoverOpen) setResolutionPopoverOpen(false);
      }}
    >
      {/* Mobile (<480px) Back to Apps link next to Toggle navigation matching step_347_shot_2 */}
      <div className="w-full pl-[56px] mb-[44px] h-[24px] flex items-center min-[480px]:hidden">
        <button
          type="button"
          onClick={() => router.push('/apps')}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#232833]"
        >
          <span>‹</span>
          <span>Back to Apps</span>
        </button>
      </div>

      {/* Main Heading */}
      <h1 className="text-center font-solar-display text-[32px] leading-[38px] font-bold tracking-[-0.01em] text-[#232833] mb-[22px] min-[480px]:mb-[24px]">
        {mode === 'Cinematic' ? 'What shot are you imagining?' : 'What should your avatar say?'}
      </h1>

      {/* Presenter | Cinematic Pill Switcher */}
      <div
        role="tablist"
        className="w-full max-w-[335px] min-[480px]:w-auto grid grid-cols-2 min-[480px]:inline-flex items-center rounded-full bg-[#f2f3f5] p-1 border border-[#eaecee] mb-[20px]"
      >
        {(['Presenter', 'Cinematic'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={mode === tab}
            onClick={() => setMode(tab)}
            className={`px-4 py-1.5 rounded-full text-[12.5px] font-bold transition-all ${
              mode === tab
                ? 'bg-white text-[#232833] shadow-sm'
                : 'text-[#687080] hover:text-[#232833]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {mode === 'Cinematic' ? (
        <div className="w-full max-w-[700px] mb-[48px] flex flex-col items-center">
          <div className="w-full rounded-[22px] bg-white border border-[#eaecee] shadow-[0_6px_28px_rgba(0,0,0,0.06)] p-[20px]">
            <div className="text-[11px] font-extrabold tracking-[0.06em] text-[#232833] uppercase mb-2">
              DESCRIBE YOUR SHOT
            </div>
            <textarea
              value={cinematicPrompt}
              onChange={(e) => setCinematicPrompt(e.target.value)}
              placeholder="e.g., She walks up to the stage and confidently presents the opening remarks..."
              className="w-full h-[112px] resize-none border-0 bg-transparent text-[15px] leading-[22px] text-[#232833] placeholder:text-[#8c93a3] focus:outline-none"
            />

            {/* Media / Avatar Strip + Enhance Prompt Switch */}
            <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-[#f0f1f4]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Add an avatar or media"
                  onClick={() => setActiveModal('choose-avatar')}
                  className="w-11 h-11 rounded-[12px] bg-[#f4f5f7] hover:bg-[#e6e8ec] border border-dashed border-[#cfd3dc] flex items-center justify-center text-[#687080]"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
                {cinematicAvatarSelected && (
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={() => setActiveModal('choose-avatar')}
                      className="w-11 h-11 rounded-[12px] overflow-hidden border border-[#eaecee] block"
                    >
                      <img
                        src="/heygen-assets/thumbnails/avatar-marieke-look1.jpg"
                        alt="Marieke"
                        className="w-full h-full object-cover"
                      />
                    </button>
                    <button
                      type="button"
                      aria-label="Remove Marieke"
                      onClick={() => setCinematicAvatarSelected(false)}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#19191a] text-white flex items-center justify-center text-[10px]"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={cinematicEnhance}
                  onClick={() => setCinematicEnhance(!cinematicEnhance)}
                  className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors ${
                    cinematicEnhance
                      ? 'bg-[#00b8ff] justify-end'
                      : 'bg-[#cfd3dc] justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
                <span className="text-[12.5px] font-bold text-[#232833]">Enhance prompt</span>
              </div>
            </div>

            {/* Cinematic Bottom Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  aria-label="Orientation: Landscape"
                  className="h-[34px] px-3 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] flex items-center gap-1.5 text-[12px] font-bold text-[#232833]"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <ChevronDown className="w-3 h-3 text-[#687080]" />
                </button>
                <button
                  type="button"
                  className="h-[34px] px-3 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] flex items-center gap-1 text-[12px] font-bold text-[#232833]"
                >
                  <span>1080p</span>
                  <ChevronDown className="w-3 h-3 text-[#687080]" />
                </button>
                <button
                  type="button"
                  className="h-[34px] px-3 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] flex items-center gap-1 text-[12px] font-bold text-[#232833]"
                >
                  <span>Quality</span>
                  <ChevronDown className="w-3 h-3 text-[#687080]" />
                </button>
                <span className="h-[34px] px-3 rounded-full bg-[#f4f5f7] inline-flex items-center text-[12px] font-bold text-[#4e5666]">
                  10 sec
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11.5px] font-medium text-[#687080]">
                  Cinematic mode not on free plan
                </span>
                <button
                  type="button"
                  onClick={() => setActiveModal('upgrade')}
                  className="h-[32px] px-3.5 rounded-full border border-[#00c4ff] text-[#0099cc] hover:bg-[#f0fbff] text-[12px] font-bold"
                >
                  Upgrade
                </button>
                <button
                  type="button"
                  disabled
                  className="h-[34px] px-4 rounded-full bg-[#e6e8ec] text-[#9da3b0] text-[12.5px] font-bold cursor-not-allowed"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[12px] text-[#687080] flex items-center gap-1.5">
            <span>Want a specific model?</span>
            <button
              type="button"
              onClick={() => router.push('/apps/creative-studio/video')}
              className="font-bold text-[#232833] underline underline-offset-2 hover:text-[#00a7d9]"
            >
              Go to Creative Studio
            </button>
          </div>
        </div>
      ) : (
        /* Main Script Composer Card (700px wide matching step_28_shot_1.png & step_347_shot_2) */
        <div className="w-full max-w-[700px] rounded-[22px] bg-white border border-[#eaecee] shadow-[0_6px_28px_rgba(0,0,0,0.06)] p-[16px] min-[480px]:p-[20px] mb-[48px]">
        <div className="flex flex-col min-[480px]:flex-row gap-0 min-[480px]:gap-[20px] mb-[12px] min-[480px]:mb-[18px]">
          {/* Left Vertical Avatar Slot (Stacked on <=479px with AVATAR label matching step_347_shot_2; 96x174px on >=480px) */}
          <div className="relative pb-4 mb-3 border-b border-[#f0f1f4] min-[480px]:pb-0 min-[480px]:mb-0 min-[480px]:border-b-0">
            <div className="min-[480px]:hidden text-[11px] font-extrabold tracking-[0.06em] text-[#8c93a3] uppercase mb-2">
              AVATAR
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('choose-avatar')}
              className="mx-auto min-[480px]:mx-0 w-[106px] h-[122px] min-[480px]:w-[96px] min-[480px]:h-[174px] rounded-[12px] bg-[#fafbfc] min-[480px]:bg-[#f4f5f7] hover:bg-[#eaecee] border border-dashed border-[#e2e5ea] min-[480px]:border-[#d2d5dc] flex flex-col items-center justify-center overflow-hidden transition-colors"
            >
              {selectedAvatar ? (
                <img
                  src={selectedAvatar.main_thumbnail_url}
                  alt={selectedAvatar.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ReferenceIcon name="add-avatar" className="w-6 h-6 text-[#9da3b0]" />
              )}
            </button>
          </div>

          {/* Right Script Input */}
          <div className="flex-1 pt-0 min-[480px]:pt-2 relative">
            <div className="text-[11px] font-extrabold tracking-[0.06em] text-[#8c93a3] min-[480px]:text-[#232833] uppercase mb-2">
              VIDEO SCRIPT
            </div>
            <div className="relative">
              {!scriptText && (
                <div className="pointer-events-none absolute top-0 left-0 text-[15px] leading-[22px] text-[#7e8594]">
                  <span>Type your script, or </span>
                  <button
                    type="button"
                    onClick={() => setUploadRecordModalOpen(true)}
                    className="pointer-events-auto underline underline-offset-2 text-[#687080] hover:text-[#232833]"
                  >
                    upload/record
                  </button>
                </div>
              )}
              <textarea
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                aria-label="Video script"
                className="w-full h-[80px] min-[480px]:h-[130px] resize-none border-0 bg-transparent text-[15px] leading-[22px] text-[#232833] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Observed Inline APPLY CUSTOM MOTION Panel (step_88_shot_4_popup_22_composer_motion.png) */}
        {motionPanelOpen && (
          <div className="mb-4 pt-2">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[11px] font-extrabold tracking-[0.05em] text-[#232833] uppercase">
                APPLY CUSTOM MOTION
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#f2f3f5] text-[#687080] text-[9.5px] font-extrabold uppercase">
                BETA
              </span>
              <HelpCircle className="w-3.5 h-3.5 text-[#8c93a3]" />
            </div>

            <div className="rounded-[14px] border border-[#e2e3e6] p-3 bg-white">
              <textarea
                value={customMotionText}
                onChange={(e) => setCustomMotionText(e.target.value)}
                placeholder="e.g., lean in, look at camera, thumbs up at the end..."
                className="w-full h-14 resize-none border-0 text-[13px] text-[#232833] placeholder:text-[#8c93a3] focus:outline-none"
              />
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  title="Suggestions"
                  onClick={() =>
                    setCustomMotionText('Lean in warmly, nod at key points, smile at the conclusion')
                  }
                  className="text-[#4e5666] hover:text-[#232833]"
                >
                  <Lightbulb className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMoreExpressive(!moreExpressive)}
                    className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors ${
                      moreExpressive
                        ? 'bg-[#00b8ff] justify-end'
                        : 'bg-[#cfd3dc] justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </button>
                  <span className="text-[12px] font-bold text-[#232833]">More expressive</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex flex-nowrap items-center gap-1.5 min-[480px]:gap-2">
            {/* 1. Avatar V Engine Selector Popover (step_88_shot_3_popup_21_composer_avatar_v.png) */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setEnginePopoverOpen(!enginePopoverOpen)}
                className="h-[34px] px-2.5 min-[480px]:px-3 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] flex items-center gap-1.5 text-[12px] min-[480px]:text-[12.5px] font-bold text-[#232833] whitespace-nowrap"
              >
                <img
                  src={
                    AVATAR_ENGINES.find((e) => e.id === engineModel)?.badge ||
                    '/heygen-assets/icons/avatar-v-badge.png'
                  }
                  alt={engineModel}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span>{engineModel}</span>
                <ReferenceIcon name="down" className="w-3.5 h-3.5 text-[#687080]" />
              </button>

              {enginePopoverOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 top-[42px] z-30 w-[295px] rounded-[18px] bg-white border border-[#eaecee] shadow-[0_12px_36px_rgba(0,0,0,0.14)] p-2 space-y-1"
                >
                  {AVATAR_ENGINES.map((eng) => {
                    const selected = engineModel === eng.id;
                    return (
                      <button
                        key={eng.id}
                        type="button"
                        onClick={() => {
                          setEngineModel(eng.id);
                          setEnginePopoverOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#f7f8fa] flex items-center justify-between gap-2.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={eng.badge}
                            alt={eng.id}
                            className="w-5 h-5 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <div className="text-[12.5px] font-extrabold text-[#232833]">
                              {eng.id}
                            </div>
                            <div className="text-[11px] text-[#687080]">{eng.desc}</div>
                          </div>
                        </div>
                        {selected && <Check className="w-4 h-4 text-[#00c4ff] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Motion Toggle Button -> expands inline APPLY CUSTOM MOTION BETA panel (step_88_shot_4) */}
            <button
              type="button"
              onClick={() => setMotionPanelOpen(!motionPanelOpen)}
              className={`h-[34px] px-2.5 min-[480px]:px-3.5 rounded-full border flex items-center gap-1.5 text-[12px] min-[480px]:text-[12.5px] font-bold transition-colors whitespace-nowrap ${
                motionPanelOpen
                  ? 'border-[#00c4ff] bg-[#f4fcff] text-[#232833]'
                  : 'border-[#e2e3e6] hover:bg-[#f7f8fa] text-[#232833]'
              }`}
            >
              <IconMotionPerson className="w-4 h-4 text-[#232833]" />
              <span>Motion</span>
            </button>

            {/* 3. Voice Selector -> opens Choose a Voice Modal (step_88_shot_5) + Integrated Play Button */}
            <div className="h-[34px] rounded-full border border-[#e2e3e6] flex items-center overflow-hidden bg-white shrink-0">
              <button
                type="button"
                onClick={() => setActiveModal('choose-voice')}
                className="h-full flex items-center gap-1.5 pl-2.5 pr-2 hover:bg-[#f7f8fa] text-[12px] min-[480px]:text-[12.5px] font-bold text-[#232833]"
              >
                <ReferenceIcon name="audio" className="w-3.5 h-3.5 text-[#232833]" />
                <span>Voice</span>
              </button>
              <button
                type="button"
                aria-label="Preview Voice"
                onClick={handlePreviewVoice}
                className="h-full px-2.5 bg-[#e6e8ec] hover:bg-[#d8dbe0] flex items-center justify-center text-[#687080]"
              >
                <ReferenceIcon name="play-s" className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Right Resolution, Ratio & Submit */}
          <div className="flex items-center gap-2.5 w-full min-[480px]:w-auto justify-between min-[480px]:justify-end pt-1 min-[480px]:pt-0">
            <div className="flex items-center gap-2">
            {/* 4. Aspect Ratio Popover Trigger (step_88_shot_6) */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setRatioPopoverOpen(!ratioPopoverOpen)}
                className="h-[34px] px-2.5 rounded-full hover:bg-[#f7f8fa] flex items-center gap-1 text-[12.5px] font-semibold text-[#232833]"
                title={`Orientation: ${aspectRatio}`}
              >
                {aspectRatio === 'Portrait' ? (
                  <ReferenceIcon name="portrait-phone" className="w-4 h-4" />
                ) : (
                  <ReferenceIcon name="desktop" className="w-4 h-4" />
                )}
                <ReferenceIcon name="down" className="w-3 h-3 text-[#687080]" />
              </button>

              {ratioPopoverOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 top-[40px] z-30 w-[128px] rounded-[14px] bg-white border border-[#eaecee] shadow-xl p-1.5 space-y-0.5"
                >
                  {(['Portrait', 'Landscape'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setAspectRatio(r);
                        setRatioPopoverOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-[12px] font-bold ${
                        aspectRatio === r
                          ? 'bg-[#e3f4fa] text-[#232833]'
                          : 'text-[#232833] hover:bg-[#f7f8fa]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Resolution Popover Trigger (step_88_shot_7) */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setResolutionPopoverOpen(!resolutionPopoverOpen)}
                className="h-[34px] px-2.5 rounded-full hover:bg-[#f7f8fa] flex items-center gap-1 text-[12.5px] font-semibold text-[#232833]"
              >
                <span>{resolution}</span>
                <ReferenceIcon name="down" className="w-3 h-3 text-[#687080]" />
              </button>

              {resolutionPopoverOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 top-[40px] z-30 w-[128px] rounded-[14px] bg-white border border-[#eaecee] shadow-xl p-1.5 space-y-0.5"
                >
                  {(['720p', '1080p'] as const).map((res) => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => {
                        setResolution(res);
                        setResolutionPopoverOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-[12px] font-bold ${
                        resolution === res
                          ? 'bg-[#e3f4fa] text-[#232833]'
                          : 'text-[#232833] hover:bg-[#f7f8fa]'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              )}
            </div>
            </div>

            {/* Submit Button */}
            {submitVariant === 'arrow-circle' ? (
              <button
                type="button"
                disabled={generating}
                onClick={handleGenerateAvatarVideo}
                aria-label="Generate video"
                className="w-[36px] h-[36px] rounded-full bg-[#19191a] hover:bg-[#343842] text-white flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <ReferenceIcon name="arrow-up" className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={generating}
                onClick={handleGenerateAvatarVideo}
                className="h-[36px] px-5 rounded-full bg-[#19191a] hover:bg-[#343842] text-white text-[13px] font-bold transition-colors disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Generate'}
              </button>
            )}
          </div>
        </div>

        {latestVideoUrl && (
          <div className="mt-4 pt-4 border-t border-[#eaecee] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[13px] font-bold text-[#00a87e]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Latest Avatar Video Ready</span>
            </div>
            <video src={latestVideoUrl} controls className="h-24 rounded-xl bg-black" />
          </div>
        )}
      </div>
      )}

      {/* Recent Creations Section */}
      <div className="w-full max-w-[700px]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14.5px] font-bold text-[#232833]">Recent Creations</h2>
          <Link
            href="/projects"
            className="text-[13px] font-medium text-[#687080] hover:text-[#232833] flex items-center gap-1"
          >
            <span>All Projects</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentAvatarProjects.length === 0 ? (
          <div className="w-full h-[265px] rounded-[18px] bg-[#f7f8fa] flex flex-col items-center justify-center text-center p-6">
            <img
              src="/heygen-assets/icons/empty-looks.svg"
              alt="No projects"
              className="w-14 h-14 mb-3 object-contain"
            />
            <div className="text-[13px] font-bold text-[#232833] mb-1">No projects here yet</div>
            <div className="text-[12px] text-[#687080]">
              Videos you create with Presenter and Cinematic mode will appear here
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentAvatarProjects.slice(0, 4).map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  setActiveStudioProject(proj.id);
                  router.push('/apps/studio?editor=1');
                }}
                className="group rounded-[16px] bg-[#f7f8fa] hover:bg-[#eff1f5] border border-[#eaecee] p-3 flex items-center gap-3.5 cursor-pointer transition-all"
              >
                <img
                  src={proj.thumbnail_url}
                  alt={proj.title}
                  className="w-20 h-14 rounded-xl object-cover shrink-0 bg-white"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-bold text-[#232833] truncate">
                    {proj.title}
                  </div>
                  <div className="text-[11.5px] text-[#687080] mt-0.5 flex items-center gap-2">
                    <span className="capitalize">{proj.status}</span>
                    <span>·</span>
                    <span>{proj.resolution}</span>
                    <span>·</span>
                    <span>{proj.duration_sec}s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECORD AUDIO / UPLOAD AUDIO MODAL (Exact match to step_88_shot_2_popup_20_composer_upload_record.png — 530x608px) */}
      {uploadRecordModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1219]/45 backdrop-blur-[4px] p-4"
          onClick={() => setUploadRecordModalOpen(false)}
        >
          <div
            className="relative w-full max-w-[530px] min-h-[560px] rounded-[20px] bg-white p-7 shadow-2xl border border-[#eaecee] flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setUploadRecordModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#687080] hover:bg-[#f2f3f5]"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-[20px] font-extrabold text-[#232833] mb-4">Record Audio</h3>

              {/* Tabs: Record Audio | Upload Audio */}
              <div className="flex items-center gap-6 mb-5">
                <button
                  type="button"
                  onClick={() => setRecordAudioTab('record')}
                  className={`relative pb-2 text-[14px] font-extrabold ${
                    recordAudioTab === 'record' ? 'text-[#232833]' : 'text-[#687080]'
                  }`}
                >
                  <span>Record Audio</span>
                  {recordAudioTab === 'record' && (
                    <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-[#00c4ff]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setRecordAudioTab('upload')}
                  className={`relative pb-2 text-[14px] font-extrabold ${
                    recordAudioTab === 'upload' ? 'text-[#232833]' : 'text-[#687080]'
                  }`}
                >
                  <span>Upload Audio</span>
                  {recordAudioTab === 'upload' && (
                    <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-[#00c4ff]" />
                  )}
                </button>
              </div>

              {recordAudioTab === 'record' ? (
                <div className="space-y-5">
                  <div className="h-[225px] rounded-[16px] border border-[#eaecee] flex items-center justify-center p-6 text-center text-[13px] font-semibold text-[#4e5666]">
                    Record an audio clip, and your avatar will lip-sync it.
                  </div>

                  {/* Large Red Circular Record Button */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      aria-label="Record audio clip"
                      onClick={() => {
                        setScriptText(
                          '[Recorded Live Microphone Audio — 00:08] Hello! This is my recorded voice script for avatar lip-sync.'
                        );
                        setUploadRecordModalOpen(false);
                        showToast('Audio clip attached to script');
                      }}
                      className="w-16 h-16 rounded-full bg-[#ea384c] border-4 border-white shadow-[0_4px_18px_rgba(234,56,76,0.35)] hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Pink Microphone Warning Banner matching step_88_shot_2 */}
                  <div className="px-4 py-3 rounded-[12px] bg-[#fff5f5] border border-[#f5b7b7] text-[12px] font-semibold text-[#4e5666]">
                    No microphone found. Connect one, then try recording again.
                  </div>

                  {/* Bottom Device Selector */}
                  <div className="h-10 px-3.5 rounded-[12px] border border-[#eaecee] flex items-center justify-between text-[12.5px] text-[#687080]">
                    <span className="flex items-center gap-2">
                      <Mic className="w-3.5 h-3.5" />
                      <span>Loading devices...</span>
                    </span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              ) : (
                <div className="py-10 flex flex-col items-center justify-center text-center">
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setScriptText(
                          `[Audio Track Attached: ${f.name}] Welcome to HeyGen AI Studio!`
                        );
                        setUploadRecordModalOpen(false);
                        showToast(`Attached audio file: ${f.name}`);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => audioInputRef.current?.click()}
                    className="w-full h-[225px] rounded-[16px] border border-dashed border-[#cfd3dc] hover:border-[#00c4ff] flex flex-col items-center justify-center gap-3 text-[13.5px] font-bold text-[#232833]"
                  >
                    <Upload className="w-6 h-6 text-[#00a7d9]" />
                    <span>Click to upload MP3, WAV, or M4A audio file</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

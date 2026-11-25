'use client';

import React, { Suspense, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/shell/AppShell';
import { AvatarScriptComposerView } from '@/components/avatar/AvatarScriptComposerView';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import { IconVoiceWave } from '@heygen/ui/icons';
import {
  ChevronLeft,
  ChevronDown,
  Plus,
  Sparkles,
  CloudUpload,
  Wand2,
  Image as ImageIcon,
  Volume2,
  ArrowUp,
  Link2,
  X,
  Smartphone,
  Monitor,
  Play,
  MoreHorizontal,
  Globe,
} from 'lucide-react';

const AI_CLIPPING_CAPTIONS = [
  'None',
  'Subtle Gray',
  'Shadow Mint',
  'Subtle Cyan',
  'Stamp Red',
  'Retro Gold',
  'Block Dark',
  'Racing',
  'Modern Dark',
  'Modern Boxed',
  'Chunky',
  'Clean',
  'Shadow Lime',
  'Tag Yellow',
  'Pop Purple',
  'Spotlight',
  'Outline Classic',
  'Exotic',
  'Golden',
  'Simple',
  'Pop Single',
  'Energy',
  'Bold',
  'Elegant',
  'Neon Pink',
];

function AppDynamicSubrouteContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast, setActiveModal } = useHeyGenStore();
  const slugArray = Array.isArray(params?.slug) ? params.slug : [String(params?.slug || '')];
  const fullSlug = slugArray.join('/');

  // 1. Creative Studio states
  const [csTab, setCsTab] = useState<'Video' | 'Image' | 'Voice'>('Video');
  const [csShotPrompt, setCsShotPrompt] = useState('');

  // 2. AI Clipping states
  const [clipUrl, setClipUrl] = useState('');
  const [clipFormat, setClipFormat] = useState<'9:16 Vertical' | '16:9 Landscape' | '1:1 Square'>(
    '9:16 Vertical'
  );
  const [clipCaption, setClipCaption] = useState('None');
  const [clipInstructions, setClipInstructions] = useState('');

  // 3. Batch Mode states
  const [batchName, setBatchName] = useState('');
  const [batchRatio, setBatchRatio] = useState<'9:16' | '16:9'>('9:16');
  const [batchModel, setBatchModel] = useState<'Lip sync' | 'Avatar 6'>('Lip sync');
  const [batchScriptTab, setBatchScriptTab] = useState(1);
  const [batchScriptText, setBatchScriptText] = useState('');

  const BackToApps = () => (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => router.push('/apps')}
        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#151619] hover:text-[#00a7d9]"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Apps</span>
      </button>
    </div>
  );

  // ROUTE 1: /apps/creative-studio/video (step_271_shot_1.png)
  if (fullSlug === 'creative-studio/video' || fullSlug === 'creative-studio') {
    return (
      <div className="relative w-full max-w-[1050px] pt-[24px] pb-16 px-4 sm:px-[32px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[10px] left-[280px] w-[420px] h-[260px] rounded-full opacity-45 blur-[75px]"
          style={{
            background:
              'radial-gradient(circle, rgba(0, 216, 255, 0.45), rgba(194, 89, 255, 0.22) 60%, transparent 100%)',
          }}
        />
        <BackToApps />

        <h1 className="relative z-10 text-center text-[32px] leading-[38px] font-extrabold text-[#151619] mb-7">
          Creative Studio
        </h1>

        {/* Top Mode Pill Bar + Model Selector matching step_271_shot_1.png */}
        <div className="relative z-10 max-w-[780px] mx-auto mb-3 rounded-[18px] bg-white/85 backdrop-blur-md border border-[#e6e8ec] p-2 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div role="tablist" className="flex items-center gap-1">
            {(['Video', 'Image', 'Voice'] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={csTab === t}
                onClick={() => setCsTab(t)}
                className={`h-[36px] px-4 rounded-[12px] text-[13px] font-bold transition-all ${
                  csTab === t
                    ? 'bg-[#ebf9fd] text-[#151619] border border-[#00c4ff]'
                    : 'text-[#4e5666] hover:text-[#151619]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="h-[42px] px-3.5 rounded-[12px] hover:bg-[#f7f8fa] flex items-center gap-2.5 text-left"
          >
            <img
              src="/heygen-assets/icons/avatar-v-badge.png"
              alt="HeyGen Video"
              className="w-7 h-7 rounded-full object-cover"
            />
            <div>
              <div className="text-[12.5px] font-extrabold text-[#151619] leading-tight">
                HeyGen Video
              </div>
              <div className="text-[11px] text-[#687080] leading-tight">
                Reference to Video • 0.24 credits/s
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#687080] ml-1" />
          </button>
        </div>

        {/* Main Shot Composer Card */}
        <div className="relative z-10 max-w-[780px] mx-auto rounded-[20px] bg-white border border-[#e6e8ec] p-5 shadow-[0_6px_28px_rgba(0,0,0,0.04)] mb-4">
          <button
            type="button"
            onClick={() => setActiveModal('choose-avatar')}
            className="h-[38px] px-4 rounded-full bg-[#f4f5f7] hover:bg-[#e6e8ec] text-[12.5px] font-bold text-[#232833] inline-flex items-center gap-2 mb-4"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add reference</span>
          </button>

          <div className="text-[11px] font-extrabold tracking-[0.06em] text-[#687080] uppercase mb-1.5">
            DESCRIBE YOUR SHOT
          </div>
          <textarea
            value={csShotPrompt}
            onChange={(e) => setCsShotPrompt(e.target.value)}
            placeholder="e.g., She walks onto a sunlit stage and opens with a confident smile. Slow dolly in."
            rows={3}
            className="w-full resize-none border-0 outline-none text-[13.5px] text-[#151619] placeholder:text-[#8c93a3] bg-transparent"
          />

          <div className="pt-3 mt-2 border-t border-[#f0f1f4] flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() =>
                setCsShotPrompt(
                  'Cinematic medium close-up of presenter walking onto a sunlit stage, smiling warmly with a slow dolly-in.'
                )
              }
              className="h-[32px] px-3.5 rounded-full border border-[#e2e5ea] hover:bg-[#f7f8fa] text-[12px] font-bold text-[#151619] inline-flex items-center gap-1.5"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Script Enhance</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="h-[32px] px-2.5 rounded-full hover:bg-[#f4f5f7] text-[12px] font-bold text-[#232833] inline-flex items-center gap-1"
              >
                <span>⏳ Auto · 8s</span>
                <ChevronDown className="w-3 h-3 text-[#687080]" />
              </button>
              <button
                type="button"
                className="h-[32px] px-2.5 rounded-full hover:bg-[#f4f5f7] text-[12px] font-bold text-[#232833] inline-flex items-center gap-1"
              >
                <span>🪄 768p</span>
                <ChevronDown className="w-3 h-3 text-[#687080]" />
              </button>
              <button
                type="button"
                className="h-[32px] px-2.5 rounded-full hover:bg-[#f4f5f7] text-[12px] font-bold text-[#232833] inline-flex items-center gap-1"
              >
                <span>16:9</span>
                <ChevronDown className="w-3 h-3 text-[#687080]" />
              </button>
              <button
                type="button"
                className="h-[32px] px-2.5 rounded-full hover:bg-[#f4f5f7] text-[12px] font-bold text-[#232833] inline-flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Audio on</span>
                <ChevronDown className="w-3 h-3 text-[#687080]" />
              </button>
              <span
                role="status"
                title="3 free videos left. Each HeyGen Video generation uses 1 of your plan's free videos."
                className="w-7 h-7 rounded-full bg-[#e3f4fa] text-[#00a7d9] inline-flex items-center justify-center text-[11px] font-extrabold"
              >
                3
              </span>
              <button
                type="button"
                onClick={() => showToast('Queued shot generation in Creative Studio')}
                className="h-[34px] px-4 rounded-full bg-[#151619] hover:bg-[#2a2d34] text-white text-[12.5px] font-bold"
              >
                Generate
              </button>
            </div>
          </div>
        </div>

        {/* 4 Quick Prompt Suggestion Pills */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-8">
          {['Multi-Scene Cut', 'UGC-Style Ad', 'Dynamic Camera Move', 'Multi-Character Scene'].map(
            (pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => setCsShotPrompt(pill)}
                className="h-[30px] px-3.5 rounded-full border border-[#e2e5ea] bg-white hover:bg-[#f7f8fa] text-[11.5px] font-semibold text-[#4e5666]"
              >
                {pill}
              </button>
            )
          )}
        </div>

        {/* Bottom Empty State Container */}
        <div className="max-w-[780px] mx-auto h-[230px] rounded-[20px] border border-dashed border-[#e2e5ea] flex flex-col items-center justify-center text-center p-6">
          <div className="text-[13px] font-bold text-[#232833] mb-1">Nothing here yet</div>
          <div className="text-[12px] text-[#687080]">
            Your shots land here. Start with a prompt, or a start frame.
          </div>
        </div>
      </div>
    );
  }

  // ROUTE 2: /apps/ppt-to-video (step_265_shot_2.png)
  if (fullSlug === 'ppt-to-video') {
    return (
      <div className="w-full max-w-[1050px] pt-[24px] pb-16 px-4 sm:px-[32px]">
        <BackToApps />
        <h1 className="text-center text-[32px] leading-[38px] font-extrabold text-[#151619] mb-9">
          PPT/PDF to Video
        </h1>

        <div className="max-w-[760px] mx-auto space-y-5">
          <button
            type="button"
            onClick={() => showToast('Select a PPTX or PDF file up to 50MB')}
            className="w-full rounded-[20px] border border-[#e6e8ec] hover:border-[#00c4ff] bg-white p-5 flex items-center gap-6 text-left shadow-2xs transition-all"
          >
            <div
              className="w-[126px] h-[92px] rounded-[14px] flex items-center justify-center text-white shrink-0"
              style={{
                background: 'linear-gradient(135deg, #22d3ee 0%, #00a8ff 100%)',
              }}
            >
              <CloudUpload className="w-9 h-9" />
            </div>
            <div>
              <div className="text-[16px] font-extrabold text-[#151619] mb-1">
                Upload a Presentation
              </div>
              <div className="text-[12.5px] text-[#687080]">
                Upload a PPT for editable slides or a PDF for static ones. Supports files up to
                50MB.
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => router.push('/home/video-agent')}
            className="w-full rounded-[20px] border border-[#e6e8ec] hover:border-[#c259ff] bg-white p-5 flex items-center gap-6 text-left shadow-2xs transition-all"
          >
            <div
              className="w-[126px] h-[92px] rounded-[14px] flex items-center justify-center text-white shrink-0"
              style={{
                background: 'linear-gradient(135deg, #e0c3fc 0%, #f598ef 100%)',
              }}
            >
              <Wand2 className="w-8 h-8" />
            </div>
            <div>
              <div className="text-[16px] font-extrabold text-[#151619] mb-1">
                Generate a Presentation
              </div>
              <div className="text-[12.5px] text-[#687080]">
                Generate a new presentation from a prompt or document and turn it into a video.
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // ROUTE 3: /apps/avatar-shots?mode=cinematic (step_265_shot_3.png)
  if (fullSlug === 'avatar-shots') {
    const isCinematic = searchParams.get('mode') === 'cinematic';
    return (
      <div className="w-full max-w-[1050px] pt-6 px-4 sm:px-8">
        <BackToApps />
        <AvatarScriptComposerView initialMode={isCinematic ? 'Cinematic' : 'Presenter'} />
      </div>
    );
  }

  // ROUTE 4: /apps/business-card (step_265_shot_4.png)
  if (fullSlug === 'business-card') {
    return (
      <div className="w-full max-w-[1050px] pt-[24px] pb-16 px-4 sm:px-[32px] overflow-hidden">
        <BackToApps />

        <div className="max-w-[680px] mx-auto text-center pt-4">
          <h1 className="text-[42px] sm:text-[46px] leading-[52px] font-extrabold tracking-[-0.03em] text-[#151619] mb-3">
            Your card needs
            <br />
            your Personal Avatar
          </h1>
          <p className="text-[14.5px] text-[#687080] mb-8">
            It answers everyone who opens your card, with your face.
          </p>

          {/* 3 Fanned Business Cards matching step_265_shot_4.png */}
          <div className="relative flex items-center justify-center gap-4 my-8">
            {/* Left Card */}
            <div className="hidden sm:flex w-[210px] h-[320px] rounded-[22px] bg-[#eff2ec] border border-[#e2e6de] p-5 flex-col items-center justify-between opacity-75 -mr-8 scale-95">
              <img
                src="/heygen-assets/thumbnails/avatar-marieke-look1.jpg"
                alt="Maya Collins"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <div className="font-serif text-[18px] text-[#232833]">Maya Collins</div>
                <div className="text-[10px] text-[#687080]">Realtor · Harbor &amp; Pine Realty</div>
              </div>
              <span className="w-full py-2 rounded-full bg-[#7e9183] text-white text-[10.5px] font-bold">
                • Talk to my Personal Avatar
              </span>
            </div>

            {/* Center Main Card */}
            <div className="relative z-10 w-[260px] h-[380px] rounded-[24px] bg-[#f3eee6] border border-[#e5dfd3] shadow-xl p-6 flex flex-col items-center justify-between">
              <div className="relative w-36 h-36 rounded-t-full overflow-hidden border-2 border-white shadow-xs">
                <img
                  src="/heygen-assets/thumbnails/avatar-marieke-look1.jpg"
                  alt="Maya Collins"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="-mt-4 px-2.5 py-0.5 rounded-full bg-white text-[9.5px] font-bold text-[#151619] shadow-2xs">
                🟢 Personal Avatar
              </span>
              <div>
                <div className="font-serif text-[24px] text-[#151619]">Maya Collins</div>
                <div className="text-[11px] text-[#687080]">Realtor · Harbor &amp; Pine Realty</div>
                <div className="text-[11px] text-[#687080]">San Diego</div>
                <div className="text-[11px] font-semibold text-[#151619] mt-1">
                  maya@harborandpine.com
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#687080]">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">in</span>
              </div>
              <span className="w-full py-2.5 rounded-full bg-[#151619] text-white text-[11.5px] font-bold">
                🟢 Talk to my Personal Avatar
              </span>
            </div>

            {/* Right Card */}
            <div className="hidden sm:flex w-[210px] h-[320px] rounded-[22px] bg-[#6e7073] text-white p-5 flex-col items-center justify-between opacity-85 -ml-8 scale-95">
              <img
                src="/heygen-assets/thumbnails/avatar-marieke-look1.jpg"
                alt="Maya Collins"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <div className="text-[18px] font-extrabold">Maya Collins</div>
                <div className="text-[10px] text-white/80">Realtor · Harbor &amp; Pine Realty</div>
              </div>
              <span className="w-full py-2 rounded-full bg-white text-[#151619] text-[10.5px] font-bold">
                Talk to my Personal Avatar
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push('/avatars/create/avatar-hub')}
            className="h-[42px] px-6 rounded-full bg-[#151619] hover:bg-[#2a2d34] text-white text-[13px] font-bold mb-3"
          >
            Create my Personal Avatar
          </button>
          <p className="text-[11.5px] text-[#687080]">
            Only avatars verified as you can be used on your card. Verify one in Avatars to see it
            here.
          </p>
        </div>
      </div>
    );
  }

  // ROUTE 5: /apps/upscale-video (step_268_shot_1.png)
  if (fullSlug === 'upscale-video') {
    return (
      <div className="w-full max-w-[1050px] pt-[24px] pb-16 px-4 sm:px-[32px]">
        <BackToApps />

        <div className="text-center mb-7">
          <h1 className="text-[32px] leading-[38px] font-extrabold text-[#151619] mb-1.5">
            Upscale Images and Videos
          </h1>
          <p className="text-[13.5px] text-[#687080]">
            Make your videos and images sharper and bigger.
          </p>
        </div>

        <div className="relative max-w-[780px] mx-auto h-[410px] rounded-[22px] bg-white border border-[#e6e8ec] shadow-[0_6px_28px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-35 blur-[65px]"
            style={{
              background:
                'radial-gradient(circle at 50% 45%, rgba(0, 224, 255, 0.45), rgba(144, 238, 196, 0.35) 45%, rgba(255, 182, 225, 0.25) 75%, transparent 100%)',
            }}
          />

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
            <CloudUpload className="w-7 h-7 text-[#232833] mb-2.5" />
            <div className="text-[13.5px] font-extrabold text-[#151619] mb-1">
              Click to upload a video or image
            </div>
            <div className="text-[11.5px] text-[#687080] mb-4">
              Videos: MP4, MOV, WEBM · Images: JPG, PNG, WebP (max 20 MB)
            </div>
            <button
              type="button"
              onClick={() => showToast('Opened workspace media library')}
              className="h-[34px] px-4 rounded-full bg-white hover:bg-[#f7f8fa] border border-[#e2e5ea] text-[12px] font-bold text-[#151619] inline-flex items-center gap-1.5 shadow-2xs"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Choose from library</span>
            </button>
          </div>

          <div className="relative z-10 pt-3 border-t border-[#f0f1f4] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3 text-[12px] font-bold text-[#232833]">
              <button type="button" className="inline-flex items-center gap-1 hover:text-[#00a7d9]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Starlight Precise 2.6</span>
                <ChevronDown className="w-3 h-3 text-[#687080]" />
              </button>
              <button type="button" className="inline-flex items-center gap-1 hover:text-[#00a7d9]">
                <span>Frame rate</span>
                <ChevronDown className="w-3 h-3 text-[#687080]" />
              </button>
              <button type="button" className="inline-flex items-center gap-1 hover:text-[#00a7d9]">
                <span>🪄 4K</span>
                <ChevronDown className="w-3 h-3 text-[#687080]" />
              </button>
            </div>

            <button
              type="button"
              disabled
              className="h-[34px] px-4 rounded-full bg-[#9ca1a9] text-white text-[12px] font-bold inline-flex items-center gap-1.5 cursor-not-allowed"
            >
              <span>Enhance</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ROUTE 6: /apps/speech-cleanup (step_268_shot_2.png)
  if (fullSlug === 'speech-cleanup') {
    return (
      <div className="w-full max-w-[1050px] pt-[24px] pb-16 px-4 sm:px-[32px]">
        <BackToApps />

        <div className="text-center max-w-[580px] mx-auto mb-7">
          <h1 className="text-[32px] leading-[38px] font-extrabold text-[#151619] mb-2">
            Speech Cleanup
          </h1>
          <p className="text-[13.5px] leading-[20px] text-[#687080]">
            Remove &apos;um&apos;, &apos;uh&apos;, awkward pauses, and false starts from your video
            — our AI trims them with seamless cuts.
          </p>
        </div>

        <div
          className="relative max-w-[610px] mx-auto rounded-[22px] border border-[#e2e6ef] p-8 flex flex-col items-center text-center shadow-xs"
          style={{
            background:
              'linear-gradient(180deg, #cfd9e8 0%, #e4ebf5 45%, #f5f7fa 100%)',
          }}
        >
          <button
            type="button"
            onClick={() =>
              showToast('Upload an MP4, MOV, or WEBM video and AI removes filler words automatically')
            }
            className="absolute top-4 right-5 text-[12px] font-bold text-[#151619] hover:underline"
          >
            How it works
          </button>

          {/* 3 Tilted Blue Step Cards matching step_268_shot_2.png */}
          <div className="flex flex-wrap items-center justify-center gap-3 my-6">
            <div className="w-[140px] h-[176px] rounded-[16px] bg-gradient-to-b from-[#0b65c6] to-[#062356] text-white p-3.5 flex flex-col justify-between text-left -rotate-6 shadow-lg">
              <div>
                <span className="inline-flex w-5 h-5 rounded-full bg-white/20 items-center justify-center text-[10px] font-bold mb-1.5">
                  1
                </span>
                <div className="text-[10.5px] font-bold leading-snug">
                  Upload your video to HeyGen
                </div>
              </div>
              <div className="text-center text-[18px] font-bold opacity-80">↑</div>
            </div>

            <div className="w-[146px] h-[184px] rounded-[16px] bg-gradient-to-b from-[#0b65c6] to-[#062356] text-white p-3.5 flex flex-col justify-between text-left z-10 shadow-xl">
              <div>
                <span className="inline-flex w-5 h-5 rounded-full bg-white/20 items-center justify-center text-[10px] font-bold mb-1.5">
                  2
                </span>
                <div className="text-[10.5px] font-bold leading-snug">
                  Let our AI remove the filler words and pauses for you seamlessly
                </div>
              </div>
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-black/60 text-[#38bdf8] text-[10px] font-bold">
                    umm
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/60 text-[#38bdf8] text-[10px] font-bold">
                    Ugh
                  </span>
                </div>
                <div className="text-[9.5px] text-white/75">detected</div>
              </div>
            </div>

            <div className="w-[140px] h-[176px] rounded-[16px] bg-gradient-to-b from-[#0b65c6] to-[#062356] text-white p-3.5 flex flex-col justify-between text-left rotate-6 shadow-lg">
              <div>
                <span className="inline-flex w-5 h-5 rounded-full bg-white/20 items-center justify-center text-[10px] font-bold mb-1.5">
                  3
                </span>
                <div className="text-[10.5px] font-bold leading-snug">
                  Filler words are removed automatically with seamless cuts
                </div>
              </div>
              <div className="text-center text-[16px] font-bold opacity-80">≣</div>
            </div>
          </div>

          <div className="text-[13.5px] font-extrabold text-[#151619] mb-1">
            Drag a video here to upload
          </div>
          <div className="text-[11.5px] text-[#687080] mb-4">
            Supported formats: MP4, MOV, WEBM
          </div>
          <button
            type="button"
            onClick={() => showToast('Selected video file for Speech Cleanup')}
            className="h-[36px] px-5 rounded-full bg-[#151619] hover:bg-[#2a2d34] text-white text-[12.5px] font-bold"
          >
            Choose file
          </button>
        </div>
      </div>
    );
  }

  // ROUTE 7: /apps/instant-highlights (AI Clipping — step_268_shot_3.png)
  if (fullSlug === 'instant-highlights') {
    return (
      <div className="w-full max-w-[1050px] pt-[24px] pb-16 px-4 sm:px-[32px]">
        <BackToApps />

        <div className="text-center mb-8">
          <h1 className="text-[32px] leading-[38px] font-extrabold text-[#151619] mb-1.5">
            AI Clipping
          </h1>
          <p className="text-[13.5px] text-[#687080]">
            Transform your long video into multiple highlight reels—in just one click!
          </p>
        </div>

        <div className="max-w-[840px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Dropzone Card (5 cols) */}
          <div className="md:col-span-5 rounded-[20px] bg-[#f7f8fa] border border-[#eceef2] p-6 flex flex-col justify-between min-h-[470px]">
            <div className="my-auto flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-white border-2 border-[#00c4ff] shadow-xs flex items-center justify-center mb-4">
                <CloudUpload className="w-6 h-6 text-[#151619]" />
              </div>
              <div className="text-[14px] font-extrabold text-[#151619] mb-1.5">
                Drag and drop video here to upload
              </div>
              <div className="text-[11.5px] text-[#687080] mb-4">
                File type: MP4, MOV, WEBM, File size: up to 10 GB
              </div>
              <button
                type="button"
                onClick={() => showToast('Browse local video files for AI Clipping')}
                className="text-[12.5px] font-extrabold text-[#151619] underline underline-offset-2"
              >
                Browse local files
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-center text-[11px] font-semibold text-[#687080]">Or</div>
              <div className="relative flex items-center">
                <Link2 className="w-3.5 h-3.5 text-[#687080] absolute left-3" />
                <input
                  type="text"
                  value={clipUrl}
                  onChange={(e) => setClipUrl(e.target.value)}
                  placeholder="Drop in the specific URL for your video"
                  className="w-full h-[38px] pl-8 pr-3 rounded-[10px] bg-white border border-[#e2e5ea] text-[12px] text-[#151619] placeholder:text-[#8c93a3]"
                />
              </div>
            </div>
          </div>

          {/* Right Configuration Column (7 cols) */}
          <div className="md:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[12px] font-bold text-[#151619] mb-1.5">Clip duration</div>
                <button
                  type="button"
                  className="h-[36px] px-3.5 rounded-full border border-[#e2e5ea] bg-white text-[12px] font-bold text-[#151619] inline-flex items-center gap-2"
                >
                  <span>Auto (0–3 min)</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#687080]" />
                </button>
              </div>

              <div>
                <div className="text-[12px] font-bold text-[#151619] mb-1.5">Output Format</div>
                <div className="inline-flex rounded-full bg-[#f4f5f7] p-1 border border-[#eceef2]">
                  {(['9:16 Vertical', '16:9 Landscape', '1:1 Square'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      aria-pressed={clipFormat === fmt}
                      onClick={() => setClipFormat(fmt)}
                      className={`h-[28px] px-3 rounded-full text-[11.5px] font-bold transition-all ${
                        clipFormat === fmt
                          ? 'bg-white text-[#151619] shadow-2xs'
                          : 'text-[#687080]'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 25 Caption Style Cards */}
            <div>
              <div className="text-[12px] font-bold text-[#151619] mb-2">Caption Style</div>
              <div className="grid grid-cols-3 gap-2.5 max-h-[225px] overflow-y-auto pr-1">
                {AI_CLIPPING_CAPTIONS.map((styleName, idx) => {
                  const active = clipCaption === styleName;
                  return (
                    <button
                      key={styleName}
                      type="button"
                      onClick={() => setClipCaption(styleName)}
                      className={`h-[98px] rounded-[14px] p-3 flex flex-col items-center justify-between text-center border transition-all ${
                        active
                          ? 'bg-[#ebf9fd] border-[#00c4ff]'
                          : 'bg-[#f7f8fa] border-[#eceef2] hover:border-[#cfd3dc]'
                      }`}
                    >
                      <div className="my-auto">
                        {styleName === 'None' ? (
                          <X className="w-4 h-4 text-[#687080]" />
                        ) : (
                          <span
                            className={`text-[10.5px] font-extrabold leading-tight block ${
                              idx % 4 === 1
                                ? 'text-[#232833]'
                                : idx % 4 === 2
                                ? 'text-[#00a87e] drop-shadow'
                                : idx % 4 === 3
                                ? 'text-[#00a7d9]'
                                : 'bg-[#e11d48] text-white px-1.5 py-0.5 rounded'
                            }`}
                          >
                            Bring your story
                            <br />
                            to life
                          </span>
                        )}
                      </div>
                      <span className="text-[11.5px] font-semibold text-[#232833] truncate w-full">
                        {styleName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Instructions */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-bold text-[#151619]">Additional instructions</span>
                <button
                  type="button"
                  onClick={() =>
                    setClipInstructions(
                      'Focus on high-energy insights, product demos, and key takeaways.'
                    )
                  }
                  className="text-[11.5px] font-bold text-[#00a7d9] inline-flex items-center gap-1 hover:underline"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>Surprise me</span>
                </button>
              </div>
              <textarea
                value={clipInstructions}
                onChange={(e) => setClipInstructions(e.target.value)}
                placeholder="For example: 'Don't remove the scene with the cat!'"
                rows={3}
                className="w-full rounded-[12px] border border-[#e2e5ea] p-3 text-[12.5px] text-[#151619] placeholder:text-[#8c93a3] focus:outline-none focus:border-[#00c4ff]"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ROUTE 8: /apps/batch-mode (step_268_shot_4.png)
  if (fullSlug === 'batch-mode') {
    return (
      <div className="w-full max-w-[1050px] pt-[24px] pb-16 px-4 sm:px-[32px]">
        <BackToApps />

        <div className="text-center mb-7">
          <h1 className="text-[32px] leading-[38px] font-extrabold text-[#151619] mb-1.5">
            Batch mode
          </h1>
          <p className="text-[13.5px] text-[#687080]">
            Create multiple video variants with different scripts, avatars, or voices all in one go.
          </p>
        </div>

        <div className="max-w-[820px] mx-auto space-y-4">
          {/* Top Settings Card */}
          <div className="rounded-[18px] border border-[#e6e8ec] bg-white p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-[12px] font-bold text-[#151619] mb-1.5">Project Name</div>
              <input
                type="text"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                placeholder="Give this batch a name.."
                className="w-full h-[36px] px-3.5 rounded-full border border-[#e2e5ea] text-[12.5px] text-[#151619] placeholder:text-[#8c93a3]"
              />
            </div>

            <div>
              <div className="text-[12px] font-bold text-[#151619] mb-1.5">Aspect Ratio</div>
              <div className="grid grid-cols-2 rounded-full bg-[#f4f5f7] p-1">
                <button
                  type="button"
                  aria-pressed={batchRatio === '9:16'}
                  onClick={() => setBatchRatio('9:16')}
                  className={`h-7 rounded-full text-[11.5px] font-bold inline-flex items-center justify-center gap-1 ${
                    batchRatio === '9:16' ? 'bg-white text-[#151619] shadow-2xs' : 'text-[#687080]'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Portrait (9:16)</span>
                </button>
                <button
                  type="button"
                  aria-pressed={batchRatio === '16:9'}
                  onClick={() => setBatchRatio('16:9')}
                  className={`h-7 rounded-full text-[11.5px] font-bold inline-flex items-center justify-center gap-1 ${
                    batchRatio === '16:9' ? 'bg-white text-[#151619] shadow-2xs' : 'text-[#687080]'
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>Landscape (16:9)</span>
                </button>
              </div>
            </div>

            <div>
              <div className="text-[12px] font-bold text-[#151619] mb-1.5">Avatar Model</div>
              <div className="grid grid-cols-2 rounded-full bg-[#f4f5f7] p-1">
                {(['Lip sync', 'Avatar 6'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={batchModel === m}
                    onClick={() => setBatchModel(m)}
                    className={`h-7 rounded-full text-[11.5px] font-bold ${
                      batchModel === m ? 'bg-white text-[#151619] shadow-2xs' : 'text-[#687080]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Script + Avatars Card */}
          <div className="rounded-[18px] border border-[#e6e8ec] bg-white overflow-hidden">
            <div className="bg-[#f7f8fa] px-4 pt-2.5 flex items-center gap-2 border-b border-[#eceef2]">
              <button
                type="button"
                onClick={() => setBatchScriptTab(1)}
                className="px-4 py-2 rounded-t-[12px] bg-white text-[12.5px] font-extrabold text-[#151619] inline-flex items-center gap-2"
              >
                <span>Script {batchScriptTab}</span>
                <span className="px-1.5 py-0.2 rounded bg-[#e3f4fa] text-[#0099cc] text-[10.5px]">
                  2
                </span>
                <MoreHorizontal className="w-3.5 h-3.5 text-[#687080]" />
              </button>
              <button
                type="button"
                onClick={() => showToast('Added new script variant tab')}
                className="w-7 h-7 rounded-full bg-white hover:bg-[#eceef2] flex items-center justify-center text-[#232833]"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-6">
                <textarea
                  value={batchScriptText}
                  onChange={(e) => setBatchScriptText(e.target.value)}
                  placeholder="Write or paste your script here. Divide your script into scenes with new paragraphs."
                  className="w-full h-[320px] rounded-[14px] border border-[#e2e5ea] p-3.5 text-[12.5px] text-[#151619] placeholder:text-[#8c93a3] resize-none focus:outline-none focus:border-[#00c4ff]"
                />
                <div className="mt-2 text-[11px] text-[#8c93a3]">
                  Character Limit: {batchScriptText.length}/2000
                </div>
              </div>

              <div className="md:col-span-6 space-y-3">
                {[
                  {
                    name: 'Leonardo',
                    img: '/heygen-assets/thumbnails/avatar-leonardo.webp',
                  },
                  {
                    name: 'Kristy',
                    img: '/heygen-assets/thumbnails/avatar-kristy.webp',
                  },
                ].map((av) => (
                  <div
                    key={av.name}
                    className="rounded-[14px] bg-[#f7f8fa] p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={av.img}
                        alt={av.name}
                        className="w-12 h-12 rounded-[10px] object-cover"
                      />
                      <span className="text-[13px] font-extrabold text-[#151619]">{av.name}</span>
                    </div>
                    <div className="inline-flex items-center rounded-full bg-white border border-[#e2e5ea] h-8 px-2.5 gap-2">
                      <button
                        type="button"
                        aria-label="Select a voice"
                        onClick={() => setActiveModal('choose-voice')}
                        className="text-[#232833]"
                      >
                        <IconVoiceWave className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-[1px] h-3.5 bg-[#e2e5ea]" />
                      <button
                        type="button"
                        aria-label="Play audio preview"
                        onClick={() => showToast(`Playing preview for ${av.name}`)}
                        className="text-[#232833]"
                      >
                        <Play className="w-3 h-3 fill-current" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setActiveModal('choose-avatar')}
                  className="w-full rounded-[14px] bg-[#f7f8fa] hover:bg-[#eff1f5] p-3 flex items-center gap-3 text-left transition-colors"
                >
                  <span className="w-12 h-12 rounded-[10px] bg-[#eceef2] flex items-center justify-center text-[#232833]">
                    <Plus className="w-4 h-4" />
                  </span>
                  <span className="text-[13px] font-extrabold text-[#151619]">Add Avatar</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => showToast('Queued 2 batch videos for generation')}
              className="h-[38px] px-5 rounded-full bg-[#151619] hover:bg-[#2a2d34] text-white text-[12.5px] font-bold"
            >
              Generate 2 Videos
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for /apps/translate -> redirect or render translate view
  return (
    <div className="w-full max-w-[1050px] pt-[24px] pb-16 px-4 sm:px-[32px]">
      <BackToApps />
      <AvatarScriptComposerView />
    </div>
  );
}

export default function AppDynamicSubroutePage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-12 text-center text-sm text-[#687080]">Loading App...</div>}>
        <AppDynamicSubrouteContent />
      </Suspense>
    </AppShell>
  );
}

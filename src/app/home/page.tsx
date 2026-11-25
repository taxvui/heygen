'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/shell/AppShell';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import {
  ReferenceIcon,
  IconAvatarNav,
} from '@heygen/ui/icons';
import {
  User,
  CheckCircle2,
  Home,
  PlusCircle,
  Dumbbell,
  Scale,
  Briefcase,
  Palette,
  MapPin,
  Globe,
  Headphones,
  GraduationCap,
  HeartHandshake,
  BookOpen,
  Code2,
  Building2,
  Presentation,
  Sparkles,
  Clock,
  Image as ImageIcon,
  BookA,
} from 'lucide-react';

interface VideoPromptCard {
  id: string;
  title: string;
  mobileTitle: string;
  modalTitle: string;
  subtitle: string;
  image: string;
  bannerImage: string;
  prompt: string;
  href?: string;
}

const VIDEO_PROMPT_CARDS: VideoPromptCard[] = [
  {
    id: 'ads-promo',
    title: 'Ads & Promo',
    mobileTitle: 'Ads & Promo',
    modalTitle: 'Ads & Promo',
    subtitle: 'Create a casual, hook-driven ad built for social attention.',
    image: '/heygen-assets/images/prompt-ads-promo.png',
    bannerImage: '/heygen-assets/images/banner-tik-tok-style-ad.jpg',
    prompt:
      'Create a high-converting 30-second product promo video with an energetic presenter and clear call to action.',
  },
  {
    id: 'educational-video',
    title: 'Educational\nVideo',
    mobileTitle: 'Educational Video',
    modalTitle: 'Educational Video',
    subtitle: 'Make any topic easier to understand with a short, step-by-step lesson.',
    image: '/heygen-assets/images/prompt-educational-video.jpg',
    bannerImage: '/heygen-assets/images/prompt-educational-video.jpg',
    prompt:
      'Create a step-by-step educational explainer breaking down core concepts with clean visual chapters.',
  },
  {
    id: 'expert-explainer',
    title: 'Expert Explainer',
    mobileTitle: 'Expert Explainer',
    modalTitle: 'Expert Explainer',
    subtitle: 'Turn your expertise into a clear explainer that makes a hard topic click.',
    image: '/heygen-assets/images/prompt-expert-explainer.png',
    bannerImage: '/heygen-assets/images/prompt-expert-explainer.png',
    prompt:
      'Create an authoritative expert breakdown explaining a complex framework in simple terms.',
  },
  {
    id: 'tips-how-to',
    title: 'Tips & How-To',
    mobileTitle: 'Tips & How-To',
    modalTitle: 'Tips & How-To',
    subtitle: 'Share a tip or how-to as a clear, step-by-step video.',
    image: '/heygen-assets/images/prompt-tips-how-to.jpg',
    bannerImage: '/heygen-assets/images/prompt-tips-how-to.jpg',
    prompt: 'Share 3 practical tips and actionable how-to steps for busy professionals.',
  },
  {
    id: 'news-brief',
    title: 'News Brief Video',
    mobileTitle: 'News & Updates',
    modalTitle: 'News Brief Video',
    subtitle: 'Summarize a story fast with the key context and takeaways.',
    image: '/heygen-assets/images/prompt-news-brief.jpg',
    bannerImage: '/heygen-assets/images/prompt-news-brief.jpg',
    prompt: 'Deliver a crisp anchor-style weekly industry news update with headline highlights.',
  },
  {
    id: 'video-podcast',
    title: 'Video Podcast',
    mobileTitle: 'Video Podcast',
    modalTitle: 'Video Podcast',
    subtitle: 'Generate a podcast video with multiple AI avatars.',
    image: '/heygen-assets/images/prompt-video-podcast.jpg',
    bannerImage: '/heygen-assets/images/prompt-video-podcast.jpg',
    prompt: 'Host a conversational two-person video podcast segment discussing emerging trends.',
    href: '/apps/video-podcast-v2',
  },
];

const PERSONALIZE_INDUSTRIES = [
  { label: 'Real Estate', icon: Home },
  { label: 'Healthcare', icon: PlusCircle },
  { label: 'Fitness & Wellness', icon: Dumbbell },
  { label: 'Legal', icon: Scale },
  { label: 'Finance / Insurance', icon: Briefcase },
  { label: 'Marketing & Creative', icon: Palette },
  { label: 'Local Services', icon: MapPin },
  { label: 'Travel, Events & Design', icon: Globe },
  { label: 'Consulting & Recruiting', icon: Headphones },
  { label: 'Education & Exam Prep', icon: GraduationCap },
  { label: 'Life & Career Coaching', icon: User },
  { label: 'Faith & Community', icon: HeartHandshake },
  { label: 'Online Courses', icon: BookOpen },
  { label: 'Software & Products', icon: Code2 },
  { label: 'Venues & Hospitality', icon: Building2 },
  { label: 'Training / L&D', icon: Presentation },
  { label: 'Personal & School', icon: GraduationCap },
  { label: 'Something else', icon: Sparkles },
];

export default function HomePage() {
  const router = useRouter();
  const { user, setActiveModal, showToast } = useHeyGenStore();
  const stepDone = user?.onboarding_step || 0;
  const [personalizeInlineOpen, setPersonalizeInlineOpen] = useState(false);
  const [selectedPromptCard, setSelectedPromptCard] = useState<VideoPromptCard | null>(null);
  const [createVideoSheetOpen, setCreateVideoSheetOpen] = useState(false);
  const [promptScriptText, setPromptScriptText] = useState('');
  const [seedanceOn, setSeedanceOn] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get('createVideo') === '1') {
        setCreateVideoSheetOpen(true);
      }
    }
  }, []);

  return (
    <AppShell hideFloatingOrby={false}>
      <div
        data-pacific-component="SADesignAMore"
        className="relative mx-auto flex w-full max-w-[1200px] flex-col pt-[116px] lg:pt-[56px] pb-6 px-[16px] min-[480px]:px-[32px]"
      >
        {/* Ambient Radial Prism Aura Backdrop matching HomeOrb-Bon6UsRb.css & step_510.json */}
        <div aria-hidden="true" className="pointer-events-none sticky top-0 z-0 h-0">
          <div className="relative h-[45vh] max-h-[450px]">
            <img
              src="/reference-assets/images/prism-orb.png"
              className="home-bg-orb"
              alt=""
              width={100}
              height={100}
              loading="eager"
            />
          </div>
        </div>

        {/*
          MOBILE (<= 479px) TOP 2-COLUMN LAUNCHER CARDS: "Create Avatar" & "Create Video"
          Exact match to step_510.json (y=116px, h=102px, gap=12px, mb=32px -> Video Prompts at y=250px)
        */}
        <section className="relative z-10 grid grid-cols-2 gap-[12px] mb-[32px] min-[480px]:hidden">
          <button
            type="button"
            onClick={() => router.push('/avatars/create/avatar-hub?returnTo=%2Fhome')}
            className="h-[102px] rounded-[28px] bg-white/85 backdrop-blur-md border border-[#eaecee] p-[16px] flex flex-col justify-between text-left shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
          >
            <div className="w-[40px] h-[40px] rounded-[10px] bg-white border border-[#f2f4f7] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#00c4ff]">
              <IconAvatarNav className="w-[24px] h-[24px]" />
            </div>
            <span className="text-[14px] leading-[18px] font-semibold text-[#232833]">
              Create Avatar
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCreateVideoSheetOpen(true)}
            className="h-[102px] rounded-[28px] bg-white/85 backdrop-blur-md border border-[#eaecee] p-[16px] flex flex-col justify-between text-left shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
          >
            <div className="w-[40px] h-[40px] rounded-[10px] bg-white border border-[#f2f4f7] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#232833]">
              <ReferenceIcon name="create-video" className="w-[24px] h-[24px]" />
            </div>
            <span className="text-[14px] leading-[18px] font-semibold text-[#232833]">
              Create Video
            </span>
          </button>
        </section>

        {/*
          DESKTOP & TABLET (>= 480px) HERO HEADING
          Exact match to step_459.json & step_510.json welcomeH2:
          "-tw-mt-8 tw-text-center tw-font-solar-display tw-text-[34px] tw-font-bold tw-text-textTitle [@media(min-height:1000px)]:tw-text-[44px]"
        */}
        <h1 className="hidden min-[480px]:block relative z-10 text-center font-solar-display text-[34px] leading-[51px] [@media(min-height:1000px)]:text-[44px] [@media(min-height:1000px)]:leading-[66px] max-[900px]:max-w-[290px] max-[900px]:mx-auto font-bold text-[#232833] mb-[32px]">
          Welcome to HeyGen
        </h1>

        <section className="hidden min-[480px]:block relative z-10 mb-[32px]">
          <div className="flex items-center gap-2 mb-[12px] h-[20px]">
            <ReferenceIcon name="user" className="w-[14px] h-[14px] text-[#232833]" />
            <h2 className="text-[14px] leading-[20px] font-semibold text-[#232833]">
              Finish your account setup - {stepDone}/4
            </h2>
          </div>

          {/* 4-Step Cards Frosted Container (4 columns side-by-side at >=650px including 768x1024) */}
          <div className="w-full rounded-[24px] bg-[#f5f7f9]/85 backdrop-blur-md p-[16px] border border-[#eef0f3] grid grid-cols-2 min-[650px]:grid-cols-4 gap-[16px]">
            {/* STEP 1: Create your Avatar */}
            <div className="min-h-[214px] rounded-[16px] bg-white border-[2px] border-[#00c4ff] p-[18px] flex flex-col justify-between gap-3 shadow-[0_2px_10px_rgba(0,196,255,0.08)]">
              <div>
                <div className="flex items-center justify-between mb-[10px]">
                  {stepDone >= 1 ? (
                    <CheckCircle2 className="w-[17px] h-[17px] text-[#00c4ff]" />
                  ) : (
                    <span className="w-[16px] h-[16px] rounded-full border-[1.75px] border-[#00c4ff]" />
                  )}
                  <span className="text-[11px] font-bold tracking-[0.04em] text-[#687080]">
                    STEP 1
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-[6px]">
                  <ReferenceIcon name="user" className="w-[16px] h-[16px] text-[#232833] shrink-0" />
                  <h3 className="text-[14.5px] leading-[18px] font-bold text-[#232833]">
                    Create your Avatar
                  </h3>
                </div>
                <p className="text-[11.5px] leading-[16px] text-[#687080]">
                  Just 15 seconds, and don&apos;t worry about the background or outfit. This step captures how you move; everything else can be changed later.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  router.push(
                    '/avatars/create/avatar-hub?source=home_digital_twin&returnTo=%2Fhome&dt_entry=onboarding_steps'
                  )
                }
                className="w-full h-[32px] rounded-[100px] bg-white hover:bg-[#eaecee] border border-[#e2e3e6] text-[14px] leading-[20px] font-semibold text-[#232833] transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* STEP 2: Review your Voice */}
            <div
              className="min-h-[214px] rounded-[16px] p-[18px] flex flex-col justify-between border border-[#eaecee]/80 transition-all"
              style={{
                background:
                  'linear-gradient(155deg, rgba(255,255,255,0.92) 15%, rgba(246,233,255,0.75) 65%, rgba(255,255,255,0.95) 100%)',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-[10px]">
                  {stepDone >= 2 ? (
                    <CheckCircle2 className="w-[17px] h-[17px] text-[#00c4ff]" />
                  ) : (
                    <span className="w-[16px] h-[16px] rounded-full border-[1.5px] border-[#d2d5dc]" />
                  )}
                  <span className="text-[11px] font-bold tracking-[0.04em] text-[#687080]">
                    STEP 2
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-[6px]">
                  <ReferenceIcon name="voice" className="w-[15px] h-[15px] text-[#232833] shrink-0" />
                  <h3 className="text-[14.5px] leading-[18px] font-bold text-[#232833]">
                    Review your Voice
                  </h3>
                </div>
                <p className="text-[11.5px] leading-[16px] text-[#687080]">
                  Give your voice a listen. If something feels off, you can improve it anytime.
                </p>
              </div>
              <div className="text-[11.5px] font-medium text-[#687080]">
                Unlocks after step 1
              </div>
            </div>

            {/* STEP 3: Create a Look */}
            <div
              className="min-h-[214px] rounded-[16px] p-[18px] flex flex-col justify-between border border-[#eaecee]/80 transition-all"
              style={{
                background:
                  'linear-gradient(155deg, rgba(226,251,252,0.78) 0%, rgba(235,252,255,0.85) 55%, rgba(255,255,255,0.96) 100%)',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-[10px]">
                  {stepDone >= 3 ? (
                    <CheckCircle2 className="w-[17px] h-[17px] text-[#00c4ff]" />
                  ) : (
                    <span className="w-[16px] h-[16px] rounded-full border-[1.5px] border-[#b7dce2]" />
                  )}
                  <span className="text-[11px] font-bold tracking-[0.04em] text-[#687080]">
                    STEP 3
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-[6px]">
                  <ReferenceIcon name="magic" className="w-[15px] h-[15px] text-[#232833] shrink-0" />
                  <h3 className="text-[14.5px] leading-[18px] font-bold text-[#232833]">
                    Create a Look
                  </h3>
                </div>
                <p className="text-[11.5px] leading-[16px] text-[#687080]">
                  Put yourself in any outfit or setting. You&apos;ll always still look like you.
                </p>
              </div>
              <div className="text-[11.5px] font-medium text-[#687080]">
                Unlocks after step 1
              </div>
            </div>

            {/* STEP 4: Make your first video */}
            <div className="min-h-[214px] rounded-[16px] bg-white/95 p-[18px] flex flex-col justify-between border border-[#eaecee] transition-all">
              <div>
                <div className="flex items-center justify-between mb-[10px]">
                  {stepDone >= 4 ? (
                    <CheckCircle2 className="w-[17px] h-[17px] text-[#00c4ff]" />
                  ) : (
                    <span className="w-[16px] h-[16px] rounded-full border-[1.5px] border-[#d2d5dc]" />
                  )}
                  <span className="text-[11px] font-bold tracking-[0.04em] text-[#687080]">
                    STEP 4
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-[6px]">
                  <ReferenceIcon name="video" className="w-[15px] h-[15px] text-[#232833] shrink-0" />
                  <h3 className="text-[14.5px] leading-[18px] font-bold text-[#232833]">
                    Make your first video
                  </h3>
                </div>
                <p className="text-[11.5px] leading-[16px] text-[#687080]">
                  Start from a script, a prompt, or scene by scene in AI Studio.
                </p>
              </div>
              <div className="text-[11.5px] font-medium text-[#687080]">
                Unlocks after step 2 or 3
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Video Prompts (y=250 on 375x812, y=449..493 on 1354x917 per step_510.json) */}
        <section className="relative z-10 w-full">
          <div className="flex items-center justify-between mb-[16px] min-[480px]:mb-[12px] h-[32px]">
            <div className="flex items-center gap-2">
              <ReferenceIcon name="video" className="w-[14px] h-[14px] text-[#232833]" />
              <h2 className="text-[14px] leading-[20px] font-semibold text-[#232833]">
                Video Prompts
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setPersonalizeInlineOpen(!personalizeInlineOpen)}
              className={`h-[32px] px-3 rounded-[100px] text-[14px] leading-[20px] font-semibold transition-all ${
                personalizeInlineOpen
                  ? 'bg-[#f0f2f5] text-[#232833] underline underline-offset-4'
                  : 'text-[#4e5666] underline underline-offset-4 hover:bg-[#eaecee] hover:text-[#232833]'
              }`}
            >
              Personalize
            </button>
          </div>

          {personalizeInlineOpen ? (
            <div
              className="w-full rounded-[22px] p-6 sm:p-[28px] relative overflow-hidden shadow-[0_8px_32px_rgba(85,182,255,0.2)]"
              style={{
                background:
                  'linear-gradient(125deg, #c79cff 0%, #7cb8ff 38%, #47c6ff 68%, #34d6bf 100%)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[22px] leading-[28px] font-extrabold text-[#19191a]">
                  What kind of work do you do?
                </h3>
                <button
                  type="button"
                  aria-label="Close personalize"
                  onClick={() => setPersonalizeInlineOpen(false)}
                  className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-[#19191a] transition-colors"
                >
                  <ReferenceIcon name="close" className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {PERSONALIZE_INDUSTRIES.map((ind) => {
                  const Icon = ind.icon;
                  return (
                    <button
                      key={ind.label}
                      type="button"
                      onClick={() => {
                        setPersonalizeInlineOpen(false);
                        showToast(`Personalized Video Prompts for ${ind.label}`);
                      }}
                      className="h-[58px] px-4 rounded-full bg-white/25 hover:bg-white/40 border border-white/60 backdrop-blur-md flex items-center gap-3.5 text-left transition-all"
                    >
                      <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#232833] shrink-0 shadow-sm">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-[13.5px] font-bold text-[#19191a] truncate">
                        {ind.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {/*
                MOBILE (<= 479px) 3-ROW x 2-COLUMN HORIZONTAL CAROUSEL
                Exact match to step_510.json:
                375x812: width=280 (328 - 48), height=101, y=298, 411, 524 (row gap = 12px)
                430x932: width=335 (383 - 48), height=101, y=298, 411, 524 (row gap = 12px)
              */}
              <div className="min-[480px]:hidden grid grid-rows-3 grid-flow-col auto-cols-[calc(100%-48px)] gap-[12px] overflow-x-auto no-scrollbar -mr-[16px] pr-[16px]">
                {VIDEO_PROMPT_CARDS.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => {
                      if (card.href) {
                        router.push(card.href);
                      } else {
                        setPromptScriptText('');
                        setSelectedPromptCard(card);
                      }
                    }}
                    className="group relative h-[101px] rounded-[24px] px-5 py-4 flex flex-col justify-center gap-1.5 overflow-hidden cursor-pointer select-none shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                  >
                    <img
                      src={card.image}
                      alt={card.mobileTitle}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" />

                    <h3 className="relative z-10 font-solar-display text-[20px] leading-[24px] font-bold text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.45)]">
                      {card.mobileTitle}
                    </h3>

                    <div className="relative z-10">
                      <span className="inline-flex items-center gap-1 h-[36px] px-4 rounded-full bg-white/20 backdrop-blur-md border border-white/50 text-white text-[14px] font-medium">
                        <span>Create Now</span>
                        <ReferenceIcon name="right" className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/*
                TABLET & DESKTOP (>= 480px) VIDEO PROMPTS GRID
                Exact match to step_459.json adsCard:
                { x: 336, y: 493, width: 313, height: 176.0625 }
                "xs:tw-aspect-video xs:tw-min-h-40 xs:tw-justify-between xs:tw-gap-3 xs:tw-rounded-2xl xs:tw-p-5"
              */}
              <div className="hidden min-[480px]:grid grid-cols-1 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-3 gap-[16px]">
                {VIDEO_PROMPT_CARDS.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => {
                      if (card.href) {
                        router.push(card.href);
                      } else {
                        setPromptScriptText('');
                        setSelectedPromptCard(card);
                      }
                    }}
                    className="group relative w-full aspect-video min-h-[160px] rounded-[16px] p-5 flex flex-col justify-between gap-3 overflow-hidden cursor-pointer select-none transition-transform duration-200 hover:scale-[1.02] active:scale-[0.985]"
                  >
                    <img
                      src={card.image}
                      alt={card.title.replace('\n', ' ')}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" />

                    <h3 className="relative z-10 hg-card-display-title text-white whitespace-pre-line drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]">
                      {card.title}
                    </h3>

                    <div className="relative z-10">
                      <span className="inline-flex items-center gap-1.5 h-[36px] px-[16px] rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/50 text-white text-[12.5px] font-semibold transition-all">
                        <span>Create Now</span>
                        <ReferenceIcon name="right" className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/*
          Observed Mobile Bottom-Sheet Dialog on "Create Video" click at <= 479px
          ("Make your first video", 375x444px at bottom: 0)
        */}
        {createVideoSheetOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Make your first video"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0f1219]/45"
            onClick={() => setCreateVideoSheetOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[480px] rounded-t-[24px] sm:rounded-[24px] bg-white p-6 shadow-[0_-12px_36px_rgba(0,0,0,0.16)]"
            >
              <div className="flex items-start justify-between mb-1">
                <h2 className="text-[19px] font-extrabold text-[#232833]">
                  Make your first video
                </h2>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setCreateVideoSheetOpen(false)}
                  className="w-7 h-7 rounded-full hover:bg-[#f2f3f5] flex items-center justify-center text-[#687080]"
                >
                  <ReferenceIcon name="close" className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[12.5px] text-[#687080] mb-4">
                Not sure which to pick? Start with Guided Creation.
              </p>

              <div className="space-y-3">
                <div className="rounded-[16px] border-[1.5px] border-[#00c4ff] bg-[#f9feff] p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-[#e3f4fa] text-[#007091] text-[10px] font-extrabold uppercase">
                      Recommended
                    </span>
                    <span className="text-[14px] font-bold text-[#232833]">Guided Creation</span>
                  </div>
                  <p className="text-[12px] leading-[17px] text-[#687080] mb-3">
                    The default for everyone — no experience needed. We guide you step by step, for
                    higher quality and more control.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCreateVideoSheetOpen(false);
                      router.push('/apps/studio');
                    }}
                    className="w-full h-[36px] rounded-full bg-[#19191a] text-white text-[12.5px] font-bold"
                  >
                    Create with guidance
                  </button>
                </div>

                <div className="rounded-[16px] border border-[#eaecee] bg-white p-4">
                  <div className="text-[14px] font-bold text-[#232833] mb-1">Prompt to Video</div>
                  <p className="text-[12px] leading-[17px] text-[#687080] mb-3">
                    For advanced users. More freedom, less control. Best for courses, training and
                    educational videos.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCreateVideoSheetOpen(false);
                      router.push('/home/video-agent');
                    }}
                    className="w-full h-[36px] rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] text-[#232833] text-[12.5px] font-bold"
                  >
                    Describe your video
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Observed Video Agent Prompt Modal on /home (760x792px) */}
        {selectedPromptCard && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4"
            onClick={() => setSelectedPromptCard(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[760px] max-h-[92vh] overflow-y-auto rounded-[22px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] flex flex-col"
            >
              {/* Top Hero Banner with gradient fade to white */}
              <div className="relative h-[205px] w-full overflow-hidden shrink-0">
                <img
                  src={selectedPromptCard.bannerImage}
                  alt={selectedPromptCard.modalTitle}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/65 to-transparent" />

                <button
                  type="button"
                  aria-label="Close prompt modal"
                  onClick={() => setSelectedPromptCard(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/55 hover:bg-black/75 text-white flex items-center justify-center transition-colors"
                >
                  <ReferenceIcon name="close" className="w-4 h-4" />
                </button>

                <div className="absolute bottom-3 left-6 right-6">
                  <h2 className="font-solar-display text-[26px] leading-[32px] font-bold text-[#151619] mb-1">
                    {selectedPromptCard.modalTitle}
                  </h2>
                  <p className="text-[13.5px] text-[#4b5058]">
                    {selectedPromptCard.subtitle}
                  </p>
                </div>
              </div>

              {/* Modal Body */}
              <div className="px-6 pt-3 pb-6 space-y-4">
                <div>
                  <div className="text-[12.5px] font-bold text-[#151619] mb-2">Avatar</div>
                  <div className="rounded-[14px] border border-[#eceef2] px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-[#f4f5f7] flex items-center justify-center text-[#525866]">
                        <ReferenceIcon name="user" className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="text-[13px] font-bold text-[#151619]">Auto</div>
                        <div className="text-[11.5px] text-[#727880]">
                          An avatar + voice will be chosen for you
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal('choose-avatar')}
                      className="h-[32px] px-3.5 rounded-full border border-[#e2e5ea] hover:bg-[#f7f8fa] text-[12px] font-semibold text-[#151619] inline-flex items-center gap-1.5"
                    >
                      <ReferenceIcon name="plus" className="w-3.5 h-3.5" />
                      <span>Choose an avatar</span>
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-[12.5px] font-bold text-[#151619] mb-2">Video Details</div>
                  <div className="rounded-[14px] border border-[#22b8e6] ring-2 ring-[#22b8e6]/15 p-3.5 min-h-[152px] flex flex-col justify-between bg-white">
                    <textarea
                      value={promptScriptText}
                      onChange={(e) => setPromptScriptText(e.target.value)}
                      placeholder="Type your script or a prompt for me to generate one for you"
                      rows={4}
                      className="w-full resize-none border-0 outline-none text-[13px] text-[#151619] placeholder:text-[#8c929c] bg-transparent"
                    />
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setPromptScriptText(selectedPromptCard.prompt)}
                        className="h-[28px] px-3 rounded-full border border-[#e2e5ea] hover:bg-[#f7f8fa] text-[11.5px] font-semibold text-[#151619] inline-flex items-center gap-1.5"
                      >
                        <ReferenceIcon name="recommend" className="w-3.5 h-3.5" />
                        <span>Script Writer</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[12.5px] font-bold text-[#151619] mb-2">Options</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="h-[34px] px-3.5 rounded-full border border-[#e2e5ea] hover:bg-[#f7f8fa] text-[12px] font-semibold text-[#151619] inline-flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#525866]" />
                      <span>Auto</span>
                      <ReferenceIcon name="down" className="w-3.5 h-3.5 text-[#727880]" />
                    </button>
                    <button
                      type="button"
                      className="h-[34px] px-3.5 rounded-full border border-[#e2e5ea] hover:bg-[#f7f8fa] text-[12px] font-semibold text-[#151619] inline-flex items-center gap-1.5"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[#525866]" />
                      <span>Auto</span>
                      <ReferenceIcon name="down" className="w-3.5 h-3.5 text-[#727880]" />
                    </button>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={seedanceOn}
                      onClick={() => setSeedanceOn(!seedanceOn)}
                      className="h-[34px] px-3.5 rounded-full border border-[#e2e5ea] hover:bg-[#f7f8fa] text-[12px] font-semibold text-[#151619] inline-flex items-center gap-1.5"
                    >
                      <span>Seedance</span>
                      <span className="text-[#8c929c] font-bold">{seedanceOn ? 'ON' : 'OFF'}</span>
                    </button>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={captionsOn}
                      onClick={() => setCaptionsOn(!captionsOn)}
                      className="h-[34px] px-3.5 rounded-full border border-[#e2e5ea] hover:bg-[#f7f8fa] text-[12px] font-semibold text-[#151619] inline-flex items-center gap-1.5"
                    >
                      <span className="px-1 py-0.2 rounded border border-[#525866] text-[9px] font-bold">
                        CC
                      </span>
                      <span>Captions</span>
                      <span className="text-[#727880] font-bold">{captionsOn ? 'ON' : 'OFF'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push('/brand/new')}
                      className="h-[34px] px-3.5 rounded-full border border-[#e2e5ea] hover:bg-[#f7f8fa] text-[12px] font-semibold text-[#151619] inline-flex items-center gap-1.5"
                    >
                      <ReferenceIcon name="plus" className="w-3.5 h-3.5" />
                      <span>Brand System</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    <button
                      type="button"
                      className="h-[42px] px-3.5 rounded-[12px] bg-[#f7f8fa] border border-[#eceef2] hover:bg-[#f0f2f5] text-left inline-flex items-center gap-2.5"
                    >
                      <BookA className="w-4 h-4 text-[#727880]" />
                      <div>
                        <div className="text-[11.5px] font-bold text-[#151619] leading-tight">
                          No glossary
                        </div>
                        <div className="text-[10px] text-[#8c929c] leading-tight">Glossary</div>
                      </div>
                      <ReferenceIcon name="down" className="w-3.5 h-3.5 text-[#727880] ml-1" />
                    </button>
                    <button
                      type="button"
                      className="h-[34px] px-3.5 rounded-full border border-[#e2e5ea] hover:bg-[#f7f8fa] text-[12px] font-semibold text-[#151619] inline-flex items-center gap-1.5"
                    >
                      <ReferenceIcon name="plus" className="w-3.5 h-3.5" />
                      <span>Attachments</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const finalPrompt = promptScriptText.trim() || selectedPromptCard.prompt;
                      const cat = selectedPromptCard.modalTitle;
                      setSelectedPromptCard(null);
                      router.push(
                        `/home/video-agent?category=${encodeURIComponent(cat)}&prompt=${encodeURIComponent(finalPrompt)}`
                      );
                    }}
                    className="h-[40px] px-5 rounded-full bg-[#151619] hover:bg-[#2a2d34] text-white text-[13px] font-bold inline-flex items-center gap-2 transition-colors"
                  >
                    <span>Continue</span>
                    <ReferenceIcon name="arrow-right" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

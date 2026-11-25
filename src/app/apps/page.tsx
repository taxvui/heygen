'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/shell/AppShell';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import { ReferenceIcon } from '@heygen/ui/icons';

const APP_CATEGORIES = ['All Apps', 'Create', 'Enhance', 'Edit', 'Interactive'] as const;

const FEATURED_CARDS = [
  {
    id: 'featured-translate',
    title: 'Translate Videos',
    cta: 'Try Translate Videos',
    image: '/reference-assets/images/apps-v2-video-translate.jpg',
    href: '/apps/translate',
  },
  {
    id: 'featured-ppt',
    title: 'PPT/PDF to Video',
    cta: 'Try PPT/PDF to Video',
    image: '/reference-assets/images/apps-v2-pdf-ppt.jpg',
    href: '/apps/ppt-to-video',
  },
  {
    id: 'featured-creative-studio',
    title: 'Creative Studio',
    cta: 'Try Creative Studio',
    image: '/reference-assets/images/apps-v2-ai-video-generator.jpg',
    href: '/apps/creative-studio/video',
  },
];

interface AppSectionCard {
  id: string;
  title: string;
  description: string;
  category: 'Create' | 'Enhance' | 'Edit' | 'Interactive';
  isNew?: boolean;
  image: string;
  href?: string;
  opensBusinessModal?: boolean;
}

const APP_SECTIONS: {
  id: string;
  heading: string;
  category: 'Create' | 'Enhance' | 'Edit';
  cards: AppSectionCard[];
}[] = [
  {
    id: 'sec-create',
    heading: 'Apps to create avatars,\nvideos, images and more.',
    category: 'Create',
    cards: [
      {
        id: 'app-creative-studio',
        title: 'Creative Studio',
        description:
          'Create AI-generated video, images, and avatars — 20+ models all in one composer.',
        category: 'Create',
        isNew: true,
        image: '/reference-assets/images/apps-v2-ai-video-generator.jpg',
        href: '/apps/creative-studio/video',
      },
      {
        id: 'app-video-agent-1',
        title: 'Video Agent',
        description: 'Describe your video and let an AI agent script and build it',
        category: 'Create',
        image: '/reference-assets/images/apps-v2-video-agent-editorial.jpg',
        href: '/apps/video-agent',
      },
      {
        id: 'app-video-podcast',
        title: 'Video Podcast',
        description: 'Generate a podcast video with multiple AI avatars.',
        category: 'Create',
        isNew: true,
        image: '/reference-assets/images/apps-v2-podcast.jpg',
        href: '/apps/video-podcast-v2',
      },
      {
        id: 'app-ppt-pdf',
        title: 'PPT/PDF to Video',
        description: 'Transform documents into engaging avatar videos',
        category: 'Create',
        image: '/reference-assets/images/apps-v2-pdf-ppt.jpg',
        href: '/apps/ppt-to-video',
      },
      {
        id: 'app-cinematic-shots',
        title: 'Cinematic Shots',
        description: 'AI-powered cinematic, film-quality shots of your avatar.',
        category: 'Create',
        image: '/reference-assets/images/apps-v2-cinematic-shots.jpg',
        href: '/apps/avatar-shots?mode=cinematic',
      },
      {
        id: 'app-ai-studio',
        title: 'AI Studio',
        description: 'Create and produce professional avatar videos.',
        category: 'Create',
        image: '/reference-assets/images/apps-v2-ai-studio-hero.webp',
        href: '/apps/studio',
      },
      {
        id: 'app-business-card',
        title: 'AI Business Card',
        description: 'A card people can talk to. Your Personal Avatar answers for you.',
        category: 'Interactive',
        isNew: true,
        image: '/reference-assets/images/apps-business-card-cover.jpg',
        href: '/apps/business-card',
      },
    ],
  },
  {
    id: 'sec-enhance',
    heading: 'Apps to enhance\nall that you create.',
    category: 'Enhance',
    cards: [
      {
        id: 'app-upscale',
        title: 'Upscale Images and Videos',
        description: 'Make your videos and images sharper and bigger.',
        category: 'Enhance',
        image: '/reference-assets/images/apps-v2-upscale.jpg',
        href: '/apps/upscale-video',
      },
      {
        id: 'app-speech-cleanup',
        title: 'Speech Cleanup',
        description: 'Remove unwanted pauses and words automatically',
        category: 'Enhance',
        isNew: true,
        image: '/reference-assets/images/apps-v2-speech-cleanup.jpg',
        href: '/apps/speech-cleanup',
      },
      {
        id: 'app-interactive-video',
        title: 'Interactive Video',
        description: 'Create branching, interactive video experiences',
        category: 'Interactive',
        image: '/reference-assets/images/apps-v2-interactive.jpg',
        opensBusinessModal: true,
      },
      {
        id: 'app-video-agent-2',
        title: 'Video Agent',
        description: 'Describe your video and let an AI agent script and build it',
        category: 'Enhance',
        image: '/reference-assets/images/apps-v2-video-agent-editorial.jpg',
        href: '/apps/video-agent',
      },
    ],
  },
  {
    id: 'sec-edit',
    heading: 'Apps to edit, change,\nand remix your content',
    category: 'Edit',
    cards: [
      {
        id: 'app-ai-clipping',
        title: 'AI Clipping',
        description: 'Add a longer video and AI will create shortened clips.',
        category: 'Edit',
        image: '/reference-assets/images/apps-ai-clipping.jpg',
        href: '/apps/instant-highlights',
      },
      {
        id: 'app-translate-videos',
        title: 'Translate Videos',
        description: 'Convert any video into 175+ languages',
        category: 'Edit',
        image: '/reference-assets/images/apps-v2-video-translate.jpg',
        href: '/apps/translate',
      },
      {
        id: 'app-batch-mode',
        title: 'Batch Mode',
        description: 'Create multiple avatar videos at once from a spreadsheet.',
        category: 'Edit',
        image: '/reference-assets/images/apps-v2-batch-upload.jpg',
        href: '/apps/batch-mode',
      },
    ],
  },
];

export default function AppsLibraryPage() {
  const router = useRouter();
  const { setActiveModal } = useHeyGenStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All Apps');
  const [businessModalOpen, setBusinessModalOpen] = useState(false);

  const visibleSections =
    selectedCategory === 'All Apps'
      ? APP_SECTIONS
      : APP_SECTIONS.map((sec) => ({
          ...sec,
          cards: sec.cards.filter((c) => c.category === selectedCategory),
        })).filter((sec) => sec.cards.length > 0);

  return (
    <AppShell showUpgradePill={true} hideFloatingOrby={false}>
      <div className="w-full px-4 sm:px-8 xl:px-[72px] pt-[92px] xl:pt-[24px] pb-16">
        <div className="mx-auto w-full max-w-[1200px]">
          {/* Heading matching step_505.json */}
          <div>
            <h1 className="m-0 text-2xl font-extrabold leading-normal text-[#1D2129] sm:text-3xl md:text-4xl">
              App Library
            </h1>
          </div>

          {/* AppsV2PromoBanner matching step_505.json & step_518.json */}
          <div className="mt-6">
            <div
              data-pacific-component="AppsV2PromoBanner"
              onClick={() => router.push('/apps/video-agent')}
              className="relative flex cursor-pointer items-center gap-6 overflow-hidden rounded-[27px] px-6 py-4"
              style={{
                background:
                  'linear-gradient(135deg, rgba(0, 121, 255, 0.2) 0%, rgba(252, 160, 255, 0.2) 100%)',
              }}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <h2 className="m-0 text-2xl font-extrabold leading-tight text-[#1D2129] sm:text-[34px]">
                  Prompt to Video
                </h2>
                <p className="m-0 max-w-xl whitespace-pre-line text-sm text-[#1D2129]">
                  {
                    'From idea to finished video with just a prompt. Type your idea.\nClick generate. Get a share-ready video faster than you can think.'
                  }
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/apps/video-agent');
                  }}
                  className="items-center justify-center whitespace-nowrap text-[14px] font-semibold leading-[20px] tracking-normal h-[40px] gap-[8px] relative isolate inline-flex rounded-[20px] border-0 px-[17px] bg-white/[0.14] shadow-[0_4px_12px_rgba(0,0,0,0.18)] hover:bg-white/25 text-[#1D2129] z-10 w-fit"
                  style={{
                    boxShadow:
                      '0 4px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.495), inset 0 0 0 1px rgba(255,255,255,0.108)',
                  }}
                >
                  <span>Try Video Agent</span>
                  <ReferenceIcon name="arrow-right" className="w-4 h-4 shrink-0" />
                </button>
              </div>

              <img
                src="/reference-assets/images/apps-v2-video-agent-banner.jpg"
                alt=""
                width={331}
                height={163}
                loading="lazy"
                draggable={false}
                className="hidden h-[163px] shrink-0 select-none rounded-[22px] object-cover md:block md:w-[240px] lg:w-[331px]"
              />
            </div>
          </div>

          {/* Segmented Category Pill Tabs matching step_505.json */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="no-scrollbar max-w-full overflow-x-auto overflow-y-hidden">
              <div className="inline-flex items-center justify-between bg-[#F2F3F5] border border-[#E5E6EB] rounded-[100px] h-[40px] p-1 cursor-pointer">
                {APP_CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-sm font-semibold leading-5 rounded-[100px] transition-all whitespace-nowrap flex items-center justify-center px-3 h-[32px] w-auto cursor-pointer ${
                        active
                          ? 'bg-white text-[#1D2129] shadow-md'
                          : 'bg-transparent text-[#4E5969] hover:bg-[#E5E6EB]/50'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top 3 Featured App Cards matching step_505.json */}
          {selectedCategory === 'All Apps' && (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
              {FEATURED_CARDS.map((app) => (
                <div
                  key={app.id}
                  onClick={() => router.push(app.href)}
                  className="group relative flex aspect-[341/215] w-full flex-col justify-between overflow-hidden rounded-3xl p-4 transition-all duration-150 cursor-pointer hover:shadow-lg"
                >
                  <img
                    src={app.image}
                    alt=""
                    width={341}
                    height={215}
                    loading="eager"
                    className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-black/40" />

                  <h3 className="z-10 m-0 max-w-[70%] text-xl font-extrabold leading-tight text-white sm:text-2xl">
                    {app.title}
                  </h3>

                  <button
                    type="button"
                    className="items-center justify-center whitespace-nowrap text-[14px] font-semibold leading-[20px] tracking-normal h-[40px] gap-[8px] relative isolate inline-flex rounded-[20px] border-0 px-[17px] bg-white/[0.14] shadow-[0_4px_12px_rgba(0,0,0,0.18)] backdrop-blur-md text-white z-10 w-fit"
                    style={{
                      boxShadow:
                        '0 4px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.495), inset 0 0 0 1px rgba(255,255,255,0.108)',
                    }}
                  >
                    <span>{app.cta}</span>
                    <ReferenceIcon name="arrow-right" className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 3 Categorized App Sections (14 Cards Total matching step_505.json) */}
          <div className="w-full space-y-12 mt-8">
            {visibleSections.map((section) => (
              <section key={section.id}>
                <h2 className="text-[22px] leading-[28px] font-extrabold text-[#1D2129] whitespace-pre-line mb-5">
                  {section.heading}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {section.cards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => {
                        if (card.opensBusinessModal) {
                          setBusinessModalOpen(true);
                        } else if (card.href) {
                          router.push(card.href);
                        }
                      }}
                      className="group rounded-[18px] border border-[#E5E6EB] hover:border-[#00c4ff] bg-white overflow-hidden cursor-pointer shadow-2xs transition-all flex flex-col justify-between"
                    >
                      <div className="relative h-[120px] w-full overflow-hidden bg-[#F2F3F5]">
                        <img
                          src={card.image}
                          alt=""
                          width={251}
                          height={120}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {card.isNew && (
                          <span className="absolute left-2 top-2 inline-flex items-center rounded-sm bg-[#00C3FF] px-1.5 py-0.5 text-xs font-black uppercase leading-none tracking-wide text-[#1D2129]">
                            New
                          </span>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 items-center justify-between gap-2 px-4 pt-3 pb-4">
                        <div className="flex min-w-0 flex-col gap-1">
                          <span className="truncate text-base font-bold leading-5 text-[#1D2129]">
                            {card.title}
                          </span>
                          <span className="line-clamp-3 text-xs leading-4 text-[#4E5969]">
                            {card.description}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Observed Interactive Video Upgrade to Business Dialog (step_240.json) */}
          {businessModalOpen && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-4"
              onClick={() => setBusinessModalOpen(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-[540px] rounded-[22px] bg-white p-7 shadow-2xl border border-[#eaecee] space-y-4"
              >
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setBusinessModalOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-[#f2f3f5] flex items-center justify-center text-[#687080]"
                >
                  <ReferenceIcon name="close" className="w-4 h-4" />
                </button>

                <div className="text-[11.5px] font-bold uppercase tracking-wider text-[#00a7d9]">
                  Upgrade to HeyGen for Business
                </div>
                <h3 className="text-[22px] leading-[28px] font-extrabold text-[#151619]">
                  Unlock Interactive Videos with the Business Plan
                </h3>
                <p className="text-[13px] leading-[19px] text-[#4e5666]">
                  Interactivity is included in HeyGen&apos;s Business plans for teams building
                  dynamic education &amp; training content.
                </p>

                <div className="space-y-2.5 pt-1 text-[12.5px] font-semibold text-[#232833]">
                  <div className="text-[#4e5666]">With the Business plan, you can:</div>
                  <div className="flex items-center gap-2.5">
                    <ReferenceIcon name="check" className="w-4 h-4 text-[#00c4ff] shrink-0" />
                    <span>Create branching scenarios so viewers choose their own path</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ReferenceIcon name="check" className="w-4 h-4 text-[#00c4ff] shrink-0" />
                    <span>Use embedded links and clickable choices</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ReferenceIcon name="check" className="w-4 h-4 text-[#00c4ff] shrink-0" />
                    <span>Add quizzes and knowledge checks directly in your video</span>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setBusinessModalOpen(false)}
                    className="h-10 px-4 rounded-full border border-[#e2e5ea] text-[12.5px] font-bold text-[#232833]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBusinessModalOpen(false);
                      setActiveModal('upgrade');
                    }}
                    className="h-10 px-5 rounded-full bg-[#151619] hover:bg-[#2a2d34] text-white text-[12.5px] font-bold"
                  >
                    View Business Plans
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

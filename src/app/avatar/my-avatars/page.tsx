'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/shell/AppShell';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import { AvatarScriptComposerView } from '@/components/avatar/AvatarScriptComposerView';
import { AvatarRecord } from '@/lib/db/types';
import { ReferenceIcon } from '@heygen/ui/icons';
import referenceAvatarsData from '../../../../data/reference/avatars.json';
import {
  Heart,
  ShieldCheck,
} from 'lucide-react';

const AVATAR_CATEGORIES = [
  'All',
  'Professional',
  'Lifestyle',
  'UGC',
  'Community',
  'Favorites',
] as const;

function AvatarsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'public' ? 'public' : 'my';

  const { avatars, avatarConsents, bootstrap, showToast } = useHeyGenStore();

  const [activeTab, setActiveTab] = useState<'my' | 'public'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Female' | 'Male'>('All');
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [selectedEthnicity, setSelectedEthnicity] = useState<string | null>(null);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredAvatarId, setHoveredAvatarId] = useState<string | null>(null);

  const handleTabSwitch = (tab: 'my' | 'public') => {
    setActiveTab(tab);
    router.replace(tab === 'public' ? '/avatar/my-avatars?tab=public' : '/avatar/my-avatars');
  };

  const handleToggleFavorite = async (av: AvatarRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    await fetch('/api/avatars', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: av.id, is_favorite: !av.is_favorite }),
    });
    await bootstrap();
    showToast(
      !av.is_favorite ? `Added ${av.name} to Favorites` : `Removed ${av.name} from Favorites`
    );
  };

  const mergedPublicAvatars: AvatarRecord[] = [
    ...referenceAvatarsData.publicAvatars.map((ra, idx) => {
      const dbMatch = avatars.find((a) => a.name.toLowerCase() === ra.name.toLowerCase());
      return {
        id: dbMatch?.id || ra.id,
        name: ra.name,
        category: ra.category as AvatarRecord['category'],
        gender: ra.gender as AvatarRecord['gender'],
        is_new: ra.isNew,
        is_public: true,
        visibility: 'public' as const,
        is_favorite: dbMatch?.is_favorite || false,
        main_thumbnail_url: ra.heroImg,
        look_thumbnails: [ra.sideImg1, ra.sideImg2],
        preview_video_url: '/heygen-assets/videos/avatar-talk-preview.mp4',
        default_voice_id: 'voice-annie',
        created_at: '2026-11-22T00:00:00Z',
      };
    }),
    ...avatars.filter(
      (a) =>
        !referenceAvatarsData.publicAvatars.some(
          (ra) => ra.name.toLowerCase() === a.name.toLowerCase()
        )
    ),
  ];

  const filteredAvatars = mergedPublicAvatars.filter((av) => {
    if (searchQuery && !av.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (genderFilter !== 'All' && av.gender !== genderFilter) {
      return false;
    }
    if (selectedCategory === 'Favorites') {
      return av.is_favorite;
    }
    if (selectedCategory !== 'All' && av.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const customWorkspaceAvatars = avatars.filter((a) => a.category === 'Custom' || a.consent_id);

  return (
    <div
      className="w-full max-w-[1200px] mx-auto pt-[88px] xl:pt-[24px] pb-16 px-4 sm:px-12 xl:px-6"
      onClick={() => {
        if (showFiltersDropdown) setShowFiltersDropdown(false);
      }}
    >
      {/* Top Tabs Header Row matching step_515.json & step_520.json (y=88..132, mb=24px -> Toolbar at y=156) */}
      <div className="flex items-center justify-between gap-3 mb-[24px]">
        <div className="flex items-center gap-4 min-[480px]:gap-6 pt-[4px]">
          <button
            type="button"
            onClick={() => handleTabSwitch('my')}
            className={`relative h-[40px] pb-2 text-[16px] font-extrabold transition-colors ${
              activeTab === 'my' ? 'text-[#232833]' : 'text-[#687080] hover:text-[#232833]'
            }`}
          >
            <span>My Avatars</span>
            {activeTab === 'my' && (
              <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-[#00c4ff]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('public')}
            className={`relative h-[40px] pb-2 text-[16px] font-extrabold transition-colors ${
              activeTab === 'public' ? 'text-[#232833]' : 'text-[#687080] hover:text-[#232833]'
            }`}
          >
            <span>Public Avatars</span>
            {activeTab === 'public' && (
              <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-[#00c4ff]" />
            )}
          </button>
        </div>

        {/* + New Avatar Button (Circular 40x40px icon-only button on <=479px matching step_520.json; text pill on >=480px matching step_515.json) */}
        <div className={activeTab === 'my' ? 'xl:pr-[240px]' : 'xl:pr-[130px]'}>
          <button
            type="button"
            aria-label="New Avatar"
            onClick={() =>
              router.push('/avatars/create/avatar-hub?returnTo=%2Favatar%2Fmy-avatars')
            }
            className="w-[40px] min-[480px]:w-auto h-[40px] px-0 min-[480px]:px-4 rounded-full bg-[#19191a] hover:bg-[#343842] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <ReferenceIcon name="add-avatar" className="w-4 h-4" />
            <span className="hidden min-[480px]:inline">New Avatar</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MY AVATARS VIEW */}
      {activeTab === 'my' && (
        <div>
          {customWorkspaceAvatars.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[15px] font-extrabold text-[#232833]">
                  Your Custom Avatars ({customWorkspaceAvatars.length})
                </h2>
                <span className="text-[12px] text-[#00a87e] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Likeness Consent Verified ({avatarConsents.length} records)</span>
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {customWorkspaceAvatars.map((av) => (
                  <div
                    key={av.id}
                    onClick={() => router.push(`/avatar/my-avatars/${av.id}`)}
                    className="rounded-2xl border border-[#eaecee] bg-white p-3.5 shadow-sm hover:border-[#00c4ff] cursor-pointer transition-all"
                  >
                    <img
                      src={av.main_thumbnail_url}
                      alt={av.name}
                      className="w-full h-44 object-cover rounded-xl mb-2.5"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[14px] font-bold text-[#232833]">{av.name}</div>
                        <div className="text-[11.5px] text-[#00a87e] font-semibold">
                          Consent Verified
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#e3f4fa] text-[#007091] text-[11px] font-bold">
                        Custom
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Centered 4-Card Deck Empty State matching step_284_shot_1.png */}
          <div className="min-h-[560px] flex flex-col items-center justify-center text-center py-12">
            <div className="relative flex items-center justify-center mb-8 h-[210px] w-[260px]">
              <img
                src="/heygen-assets/images/deck-back-1-poster.jpg"
                alt="Deck poster 1"
                className="absolute w-[124px] h-[168px] object-cover rounded-[16px] border-2 border-white shadow-md -rotate-12 -translate-x-10 translate-y-2 opacity-80"
              />
              <img
                src="/heygen-assets/images/deck-back-2-poster.jpg"
                alt="Deck poster 2"
                className="absolute w-[132px] h-[176px] object-cover rounded-[16px] border-2 border-white shadow-md -rotate-6 -translate-x-5 translate-y-1 opacity-90"
              />
              <img
                src="/heygen-assets/images/deck-back-3-poster.jpg"
                alt="Deck poster 3"
                className="absolute w-[132px] h-[176px] object-cover rounded-[16px] border-2 border-white shadow-md rotate-8 translate-x-7 translate-y-2 opacity-85"
              />
              <img
                src="/heygen-assets/images/deck-front-poster.jpg"
                alt="Create your first avatar"
                className="relative z-10 w-[144px] h-[196px] object-cover rounded-[18px] border-2 border-[#a88bff] shadow-xl"
              />
            </div>

            <h2 className="text-[22px] leading-[28px] font-extrabold text-[#151619] mb-2">
              Create your first avatar
            </h2>
            <p className="text-[13px] leading-[19px] text-[#687080] max-w-[390px] mb-6">
              An identity that looks, moves, and sounds like you. Ready for any video, in any outfit
              or setting.
            </p>
            <button
              type="button"
              onClick={() =>
                router.push('/avatars/create/avatar-hub?returnTo=%2Favatar%2Fmy-avatars')
              }
              className="h-[40px] px-6 rounded-full bg-[#151619] hover:bg-[#2a2d34] text-white text-[13px] font-bold transition-colors"
            >
              Create avatar
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: PUBLIC AVATARS VIEW (Exact replica of step_38_shot_2.png & step_90_shot_1..2) */}
      {activeTab === 'public' && (
        <div>
          {/* Search + Filters + Grid/List Controls Row (single compact row on <=479px matching step_349_shot_1) */}
          <div className="flex items-center gap-3 mb-[12px]">
            <div className="relative flex-1 min-w-[80px]">
              <ReferenceIcon name="Search" className="w-3.5 h-3.5 text-[#687080] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full h-[32px] pl-8 pr-2.5 rounded-full border border-[#e2e3e6] text-[12.5px] text-[#232833] placeholder:text-[#8c93a3] focus:outline-none focus:border-[#00c4ff]"
              />
            </div>

            {/* Filters Popover Trigger (Exact match to step_90_shot_1_popup_26_public_avatars_filters.png & step_520.json — 88.61x32px) */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
                className="h-[32px] px-3.5 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] flex items-center gap-1.5 text-[12.5px] font-bold text-[#232833]"
              >
                <ReferenceIcon name="filter" className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              {showFiltersDropdown && (
                <div className="absolute right-0 top-[46px] z-30 w-[340px] sm:w-[362px] rounded-[20px] bg-white border border-[#eaecee] shadow-[0_14px_44px_rgba(0,0,0,0.14)] p-5 space-y-4">
                  {/* Gender */}
                  <div>
                    <div className="text-[12.5px] font-extrabold text-[#232833] mb-2">Gender</div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'Woman', val: 'Female' as const },
                        { label: 'Man', val: 'Male' as const },
                      ].map((g) => {
                        const active = genderFilter === g.val;
                        return (
                          <button
                            key={g.label}
                            type="button"
                            onClick={() => setGenderFilter(active ? 'All' : g.val)}
                            className={`h-8 px-3.5 rounded-full border text-[12px] font-bold transition-colors ${
                              active
                                ? 'border-[#00c4ff] bg-[#e3f4fa] text-[#232833]'
                                : 'border-[#e2e3e6] text-[#232833] hover:bg-[#f7f8fa]'
                            }`}
                          >
                            {g.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <div className="text-[12.5px] font-extrabold text-[#232833] mb-2">Age</div>
                    <div className="flex flex-wrap gap-2">
                      {['Young Adult', 'Middle Aged', 'Elderly'].map((age) => {
                        const active = selectedAge === age;
                        return (
                          <button
                            key={age}
                            type="button"
                            onClick={() => setSelectedAge(active ? null : age)}
                            className={`h-8 px-3.5 rounded-full border text-[12px] font-bold transition-colors ${
                              active
                                ? 'border-[#00c4ff] bg-[#e3f4fa] text-[#232833]'
                                : 'border-[#e2e3e6] text-[#232833] hover:bg-[#f7f8fa]'
                            }`}
                          >
                            {age}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ethnicity */}
                  <div>
                    <div className="text-[12.5px] font-extrabold text-[#232833] mb-2">
                      Ethnicity
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'White',
                        'Asian',
                        'South Asian',
                        'Latino',
                        'Middle Eastern',
                        'Black',
                      ].map((eth) => {
                        const active = selectedEthnicity === eth;
                        return (
                          <button
                            key={eth}
                            type="button"
                            onClick={() => setSelectedEthnicity(active ? null : eth)}
                            className={`h-8 px-3.5 rounded-full border text-[12px] font-bold transition-colors ${
                              active
                                ? 'border-[#00c4ff] bg-[#e3f4fa] text-[#232833]'
                                : 'border-[#e2e3e6] text-[#232833] hover:bg-[#f7f8fa]'
                            }`}
                          >
                            {eth}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reset | Done */}
                  <div className="pt-2 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setGenderFilter('All');
                        setSelectedAge(null);
                        setSelectedEthnicity(null);
                      }}
                      className="h-9 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] text-[12.5px] font-bold text-[#232833]"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFiltersDropdown(false)}
                      className="h-9 rounded-full bg-[#19191a] hover:bg-[#343842] text-white text-[12.5px] font-bold"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Grid | List Segmented Toggle (h=32px outer, h=24px inner buttons matching step_515.json & step_520.json) */}
            <div className="h-[32px] rounded-full bg-[#f2f3f5] p-1 border border-[#eaecee] flex items-center">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`h-[24px] px-2.5 rounded-full flex items-center gap-1.5 text-[12px] font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#232833] shadow-sm'
                    : 'text-[#687080] hover:text-[#232833]'
                }`}
              >
                <ReferenceIcon name="card-view" className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`h-[24px] px-2.5 rounded-full flex items-center gap-1.5 text-[12px] font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-[#232833] shadow-sm'
                    : 'text-[#687080] hover:text-[#232833]'
                }`}
              >
                <ReferenceIcon name="list-view" className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            </div>
          </div>

          {/* Category Filter Chips Row */}
          <div className="flex flex-wrap items-center gap-2 mb-[16px]">
            {AVATAR_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`h-[28px] px-2.5 rounded-full text-[12px] font-semibold transition-all border ${
                    active
                      ? 'bg-[#e3f4fa] text-[#232833] border-[#00c4ff]'
                      : 'bg-white text-[#232833] border-[#e2e3e6] hover:bg-[#f7f8fa]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* 2-Column Multi-Look Bento Grid matching step_515.json & step_520.json */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-2">
              {filteredAvatars.map((av) => (
                <div
                  key={av.id}
                  onClick={() => router.push(`/avatar/my-avatars/${av.id}`)}
                  onMouseEnter={() => setHoveredAvatarId(av.id)}
                  onMouseLeave={() => setHoveredAvatarId(null)}
                  className="group relative flex w-full cursor-pointer flex-col gap-2.5 overflow-hidden rounded-3xl bg-white p-2 pb-[30px] select-none transition-shadow duration-150"
                >
                  {/* Multi-Look Bento Frame (aspect-[4/3] matching step_515.json 156.5x117.375 & step_520.json 144x108) */}
                  <div className="relative aspect-[4/3] w-full rounded-[14px] overflow-hidden grid grid-cols-12 gap-[3px] bg-[#f7f8fa]">
                    {/* Left Main Portrait (8 cols) */}
                    <div className="col-span-8 relative h-full overflow-hidden bg-[#f4f5f7]">
                      <img
                        src={av.main_thumbnail_url}
                        alt={av.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      {hoveredAvatarId === av.id && av.preview_video_url && (
                        <video
                          src={av.preview_video_url}
                          poster={av.main_thumbnail_url}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover z-[1]"
                        />
                      )}
                      {av.is_new && (
                        <span className="absolute top-2.5 left-2.5 z-[2] px-2 py-0.5 rounded-full bg-[#f5ebd6] text-[#4b3d21] text-[10px] font-extrabold tracking-wide uppercase shadow-sm">
                          NEW
                        </span>
                      )}

                      {/* Favorite Toggle Button on Hover */}
                      <button
                        type="button"
                        aria-label={`Favorite ${av.name}`}
                        onClick={(e) => handleToggleFavorite(av, e)}
                        className={`absolute top-2.5 right-2.5 z-[2] w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-opacity ${
                          av.is_favorite
                            ? 'bg-white text-[#e54945] opacity-100'
                            : 'bg-black/30 text-white opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${av.is_favorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Right 2 Stacked Outfit/Environment Look Thumbnails (4 cols) */}
                    <div className="col-span-4 h-full flex flex-col gap-[3px]">
                      <div className="flex-1 overflow-hidden bg-[#f4f5f7]">
                        <img
                          src={av.look_thumbnails[0] || av.main_thumbnail_url}
                          alt={`${av.name} Look 1`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 overflow-hidden bg-[#f4f5f7]">
                        <img
                          src={av.look_thumbnails[1] || av.main_thumbnail_url}
                          alt={`${av.name} Look 2`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Avatar Name Footer matching step_515.json & step_520.json (labelBox height=28px, px-1) */}
                  <div className="flex items-center justify-between self-stretch px-1 h-[28px]">
                    <h3 className="text-[16px] leading-[24px] font-bold text-[#1D2129] truncate">
                      {av.name}
                    </h3>
                    <span className="text-[12px] text-[#687080] opacity-0 group-hover:opacity-100 transition-opacity">
                      57 looks →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-[#eaecee] border border-[#eaecee] rounded-2xl overflow-hidden">
              {filteredAvatars.map((av) => (
                <div
                  key={av.id}
                  onClick={() => router.push(`/avatar/my-avatars/${av.id}`)}
                  className="p-4 flex items-center justify-between hover:bg-[#f7f8fa] cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={av.main_thumbnail_url}
                      alt={av.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <div className="text-[15px] font-bold text-[#232833]">{av.name}</div>
                      <div className="text-[12px] text-[#687080]">
                        {av.category} · {av.gender} · 57 Looks
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleToggleFavorite(av, e)}
                    className="p-2 rounded-full hover:bg-[#eaecee]"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        av.is_favorite ? 'text-[#e54945] fill-current' : 'text-[#687080]'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyAvatarsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-[#687080]">Loading Avatars...</div>}>
      <MyAvatarsShellWrapper />
    </Suspense>
  );
}

function MyAvatarsShellWrapper() {
  const searchParams = useSearchParams();
  const isPublic = searchParams.get('tab') === 'public';
  return (
    <AppShell showUpgradePill={!isPublic}>
      <AvatarsPageContent />
    </AppShell>
  );
}

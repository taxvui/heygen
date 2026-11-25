'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import { VoiceRecord } from '@/lib/db/types';
import { ReferenceIcon, IconVideoAgentWand } from '@heygen/ui/icons';
import referenceVoicesData from '../../../../data/reference/voices.json';
import {
  Square,
  Check,
} from 'lucide-react';

const VOICE_LANGUAGES = [
  { label: 'All languages', flag: '/heygen-assets/icons/flag-globe.webp' },
  { label: 'Arabic', flag: '/heygen-assets/icons/flag-globe.webp', hasSub: true },
  { label: 'Chinese', flag: '/heygen-assets/icons/flag-globe.webp', hasSub: true },
  { label: 'Czech', flag: '/heygen-assets/icons/flag-globe.webp', hasSub: false },
  { label: 'English', flag: '/heygen-assets/icons/flag-us.png', hasSub: true },
  { label: 'French', flag: '/heygen-assets/icons/flag-globe.webp', hasSub: true },
  { label: 'German', flag: '/heygen-assets/icons/flag-globe.webp', hasSub: true },
  { label: 'Japanese', flag: '/heygen-assets/icons/flag-globe.webp', hasSub: true },
  { label: 'Polish', flag: '/heygen-assets/icons/flag-globe.webp', hasSub: false },
  { label: 'Portuguese', flag: '/heygen-assets/icons/flag-globe.webp', hasSub: true },
  { label: 'Russian', flag: '/heygen-assets/icons/flag-globe.webp', hasSub: false },
  { label: 'Spanish', flag: '/heygen-assets/icons/flag-globe.webp', hasSub: true },
];

export default function VoicesPage() {
  const { voices, setActiveModal, showToast } = useHeyGenStore();

  const [activeTab, setActiveTab] = useState<'my' | 'library'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('All languages');
  const [langSearch, setLangSearch] = useState('');
  const [langPopoverOpen, setLangPopoverOpen] = useState(false);
  const [genderFilter, setGenderFilter] = useState('All genders');
  const [genderPopoverOpen, setGenderPopoverOpen] = useState(false);
  const [filtersPopoverOpen, setFiltersPopoverOpen] = useState(false);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [openRowMenuVoiceId, setOpenRowMenuVoiceId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(29);

  const handlePlayVoice = (v: VoiceRecord) => {
    if (playingVoiceId === v.id) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingVoiceId(null);
      return;
    }

    setPlayingVoiceId(v.id);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(
        `Welcome to HeyGen! This is a voice sample of ${v.name}.`
      );
      utter.rate = v.speed || 1.0;
      utter.onend = () => setPlayingVoiceId(null);
      window.speechSynthesis.speak(utter);
    } else {
      setTimeout(() => setPlayingVoiceId(null), 2500);
    }
    showToast(`Playing voice sample: ${v.name}`);
  };

  const mergedVoices: VoiceRecord[] = [
    ...referenceVoicesData.voices.map((rv) => ({
      id: rv.id,
      name: rv.name,
      subtitle_tags: rv.tags,
      gender: rv.gender as VoiceRecord['gender'],
      language: rv.language,
      language_code: 'en-US',
      country_code: rv.country,
      flag_url: rv.flag,
      visibility: 'Public' as const,
      is_favorite: false,
      provider: 'heygen' as const,
      speed: 1.0,
      pitch: 1.0,
      created_at: '2026-11-22T00:00:00Z',
    })),
    ...voices.filter(
      (v) =>
        !referenceVoicesData.voices.some(
          (rv) => rv.name.toLowerCase() === v.name.toLowerCase()
        )
    ),
  ];

  const allFilteredVoices = mergedVoices.filter((v) => {
    if (activeTab === 'my' && v.provider === 'heygen' && !v.consent_id && !v.is_favorite) {
      return false;
    }
    if (
      searchQuery &&
      !v.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !v.subtitle_tags.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (
      languageFilter !== 'All languages' &&
      !v.language.toLowerCase().includes(languageFilter.toLowerCase())
    ) {
      return false;
    }
    if (genderFilter !== 'All genders' && v.gender !== genderFilter) {
      return false;
    }
    return true;
  });

  const filteredVoices = allFilteredVoices.slice(0, visibleCount);

  const activeFiltersCount = selectedUseCases.length + selectedAges.length;

  return (
    <AppShell>
      <div
        className="w-full max-w-[1050px] pt-[80px] min-[480px]:pt-[30px] pb-16 px-4 sm:px-[32px]"
        onClick={() => {
          if (langPopoverOpen) setLangPopoverOpen(false);
          if (genderPopoverOpen) setGenderPopoverOpen(false);
          if (filtersPopoverOpen) setFiltersPopoverOpen(false);
          if (openRowMenuVoiceId) setOpenRowMenuVoiceId(null);
        }}
      >
        {/* Top 3 Action Cards: Compact 3-column pills (Clone | Design | Import) on <=479px matching step_349_shot_2; full labels on >=480px */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-2 min-[480px]:gap-[16px] mb-[24px] min-[480px]:mb-[32px] max-w-[820px]">
          <button
            type="button"
            onClick={() => setActiveModal('create-voice')}
            className="h-[52px] min-[480px]:h-[68px] px-2.5 min-[480px]:px-5 rounded-full min-[480px]:rounded-[18px] bg-[#f7f8fa] hover:bg-[#eff1f5] flex items-center gap-2 min-[480px]:gap-3.5 text-left transition-colors"
          >
            <div className="w-8 h-8 min-[480px]:w-9 min-[480px]:h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-[#232833] shrink-0">
              <ReferenceIcon name="mic" className="w-3.5 h-3.5 min-[480px]:w-4 min-[480px]:h-4" />
            </div>
            <span className="text-[12.5px] min-[480px]:text-[13.5px] font-bold text-[#232833]">
              <span className="min-[480px]:hidden">Clone</span>
              <span className="hidden min-[480px]:inline">Create your HeyGen voice</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('design-voice')}
            className="h-[52px] min-[480px]:h-[68px] px-2.5 min-[480px]:px-5 rounded-full min-[480px]:rounded-[18px] bg-[#f7f8fa] hover:bg-[#eff1f5] flex items-center gap-2 min-[480px]:gap-3.5 text-left transition-colors"
          >
            <div className="w-8 h-8 min-[480px]:w-9 min-[480px]:h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-[#232833] shrink-0">
              <IconVideoAgentWand className="w-3.5 h-3.5 min-[480px]:w-4 min-[480px]:h-4" />
            </div>
            <span className="text-[12.5px] min-[480px]:text-[13.5px] font-bold text-[#232833]">
              <span className="min-[480px]:hidden">Design</span>
              <span className="hidden min-[480px]:inline">Design a voice</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('import-voice')}
            className="h-[52px] min-[480px]:h-[68px] px-2.5 min-[480px]:px-5 rounded-full min-[480px]:rounded-[18px] bg-[#f7f8fa] hover:bg-[#eff1f5] flex items-center gap-2 min-[480px]:gap-3.5 text-left transition-colors"
          >
            <div className="w-8 h-8 min-[480px]:w-9 min-[480px]:h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-[#232833] shrink-0">
              <ReferenceIcon name="download" className="w-3.5 h-3.5 min-[480px]:w-4 min-[480px]:h-4" />
            </div>
            <span className="text-[12.5px] min-[480px]:text-[13.5px] font-bold text-[#232833]">
              <span className="min-[480px]:hidden">Import</span>
              <span className="hidden min-[480px]:inline">Import from 3rd party</span>
            </span>
          </button>
        </div>

        {/* Underline Tabs: My voices | HeyGen library */}
        <div className="flex items-center gap-7 mb-[18px]">
          <button
            type="button"
            onClick={() => setActiveTab('my')}
            className={`relative pb-1.5 text-[15.5px] font-extrabold transition-colors ${
              activeTab === 'my' ? 'text-[#232833]' : 'text-[#687080] hover:text-[#232833]'
            }`}
          >
            <span>My voices</span>
            {activeTab === 'my' && (
              <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-[#00c4ff]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`relative pb-1.5 text-[15.5px] font-extrabold transition-colors ${
              activeTab === 'library' ? 'text-[#232833]' : 'text-[#687080] hover:text-[#232833]'
            }`}
          >
            <span>HeyGen library</span>
            {activeTab === 'library' && (
              <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-[#00c4ff]" />
            )}
          </button>
        </div>

        {/* Search & Dropdown Filters Row matching step_36_shot_2.png & step_97_shot_1..3 */}
        <div className="flex flex-wrap items-center gap-2.5 min-[480px]:gap-3 mb-[16px] max-w-[820px]">
          <div className="relative w-full min-[480px]:flex-1 min-w-[240px]">
            <ReferenceIcon name="Search" className="w-4 h-4 text-[#687080] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search voices..."
              className="w-full h-[36px] pl-10 pr-4 rounded-full border border-[#e2e3e6] text-[13px] text-[#232833] placeholder:text-[#8c93a3] focus:outline-none focus:border-[#00c4ff]"
            />
          </div>

          {/* 1. All languages popover trigger (Exact match to step_97_shot_1.png — 302x402px) */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => {
                setLangPopoverOpen(!langPopoverOpen);
                setGenderPopoverOpen(false);
                setFiltersPopoverOpen(false);
              }}
              className={`h-[36px] px-3.5 rounded-full border bg-white flex items-center gap-2 text-[12.5px] font-semibold text-[#232833] ${
                langPopoverOpen ? 'border-[#00c4ff]' : 'border-[#e2e3e6] hover:bg-[#f7f8fa]'
              }`}
            >
              <img
                src="/heygen-assets/icons/flag-globe.webp"
                alt="Globe"
                className="w-4 h-4 rounded-full object-cover"
              />
              <span>{languageFilter}</span>
              <ReferenceIcon name="down" className="w-3.5 h-3.5 text-[#687080]" />
            </button>

            {langPopoverOpen && (
              <div className="absolute left-0 top-[44px] z-30 w-[260px] rounded-[18px] bg-white border border-[#eaecee] shadow-[0_14px_44px_rgba(0,0,0,0.14)] p-2.5">
                <div className="relative mb-2">
                  <ReferenceIcon name="Search" className="w-3.5 h-3.5 text-[#687080] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={langSearch}
                    onChange={(e) => setLangSearch(e.target.value)}
                    placeholder="Search language.."
                    className="w-full h-9 pl-8 pr-3 rounded-full border border-[#00c4ff] text-[12.5px] text-[#232833] focus:outline-none"
                  />
                </div>
                <div className="max-h-[290px] overflow-y-auto space-y-0.5 pr-1">
                  {VOICE_LANGUAGES.filter((l) =>
                    l.label.toLowerCase().includes(langSearch.toLowerCase())
                  ).map((lang) => {
                    const selected = languageFilter === lang.label;
                    return (
                      <button
                        key={lang.label}
                        type="button"
                        onClick={() => {
                          setLanguageFilter(lang.label);
                          setLangPopoverOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-[12.5px] font-semibold ${
                          selected
                            ? 'bg-[#f4f5f7] text-[#232833]'
                            : 'text-[#232833] hover:bg-[#f7f8fa]'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <img
                            src={lang.flag}
                            alt={lang.label}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span>{lang.label}</span>
                        </span>
                        {selected ? (
                          <Check className="w-3.5 h-3.5 text-[#687080]" />
                        ) : lang.hasSub ? (
                          <ReferenceIcon name="down" className="w-3.5 h-3.5 text-[#687080]" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. All genders popover trigger (Exact match to step_97_shot_2.png — 144x110px) */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => {
                setGenderPopoverOpen(!genderPopoverOpen);
                setLangPopoverOpen(false);
                setFiltersPopoverOpen(false);
              }}
              className={`h-[36px] px-3.5 rounded-full border bg-white flex items-center gap-1.5 text-[12.5px] font-semibold text-[#232833] ${
                genderPopoverOpen ? 'border-[#00c4ff]' : 'border-[#e2e3e6] hover:bg-[#f7f8fa]'
              }`}
            >
              <span>{genderFilter}</span>
              <ReferenceIcon name="down" className="w-3.5 h-3.5 text-[#687080]" />
            </button>

            {genderPopoverOpen && (
              <div
                role="listbox"
                className="absolute left-0 top-[44px] z-30 w-[144px] rounded-[16px] bg-white border border-[#eaecee] shadow-[0_12px_36px_rgba(0,0,0,0.14)] p-1.5 space-y-0.5"
              >
                {(['All genders', 'Female', 'Male'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      setGenderFilter(g);
                      setGenderPopoverOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-[12.5px] font-semibold ${
                      genderFilter === g
                        ? 'bg-[#e3f4fa] text-[#232833]'
                        : 'text-[#232833] hover:bg-[#f7f8fa]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. 0 Filters popover trigger (Exact match to step_97_shot_3.png — 400x334px) */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => {
                setFiltersPopoverOpen(!filtersPopoverOpen);
                setLangPopoverOpen(false);
                setGenderPopoverOpen(false);
              }}
              className={`h-[36px] px-3.5 rounded-full border bg-white flex items-center gap-1.5 text-[12.5px] font-semibold text-[#232833] ${
                filtersPopoverOpen ? 'border-[#00c4ff]' : 'border-[#e2e3e6] hover:bg-[#f7f8fa]'
              }`}
            >
              <span>{activeFiltersCount} Filters</span>
              <ReferenceIcon name="down" className="w-3.5 h-3.5 text-[#687080]" />
            </button>

            {filtersPopoverOpen && (
              <div className="absolute right-0 top-[44px] z-30 w-[340px] sm:w-[370px] rounded-[20px] bg-white border border-[#eaecee] shadow-[0_14px_44px_rgba(0,0,0,0.14)] p-5 space-y-4">
                <div className="text-[14.5px] font-extrabold text-[#232833] pb-2.5 border-b border-[#eaecee]">
                  Filters
                </div>

                <div>
                  <div className="text-[12.5px] font-extrabold text-[#232833] mb-2.5">
                    Use cases
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 text-[12.5px] text-[#4e5666]">
                    {[
                      'Conversational',
                      'Ads and Social',
                      'Informative and educational',
                      'Narrative & Story',
                    ].map((uc) => {
                      const checked = selectedUseCases.includes(uc);
                      return (
                        <label
                          key={uc}
                          className="flex items-start gap-2 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setSelectedUseCases((prev) =>
                                checked ? prev.filter((x) => x !== uc) : [...prev, uc]
                              )
                            }
                            className="mt-0.5 rounded border-[#cfd3dc]"
                          />
                          <span className="leading-snug">{uc}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#eaecee]">
                  <div className="text-[12.5px] font-extrabold text-[#232833] mb-2.5">
                    Voice age
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 text-[12.5px] text-[#4e5666]">
                    {['Young adult', 'Middle-aged', 'Old'].map((age) => {
                      const checked = selectedAges.includes(age);
                      return (
                        <label
                          key={age}
                          className="flex items-center gap-2 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setSelectedAges((prev) =>
                                checked ? prev.filter((x) => x !== age) : [...prev, age]
                              )
                            }
                            className="rounded border-[#cfd3dc]"
                          />
                          <span>{age}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Voice List Table matching step_36_shot_2.png & step_97_shot_4.png */}
        {activeTab === 'my' && filteredVoices.length === 0 ? (
          <div className="max-w-[820px] py-20 flex flex-col items-center justify-center text-center">
            <img
              src="/heygen-assets/icons/empty-voices-box.png"
              alt="No voices yet"
              className="w-16 h-16 mb-3 object-contain"
            />
            <div className="text-[14px] font-bold text-[#232833] mb-1">No voices yet</div>
            <div className="text-[12.5px] text-[#687080]">Voices you save will appear here</div>
          </div>
        ) : (
          <div className="max-w-[820px]">
            <div className="divide-y divide-[#eaecee]">
              {filteredVoices.map((voice) => {
                const isPlaying = playingVoiceId === voice.id;
                const rowMenuOpen = openRowMenuVoiceId === voice.id;
                return (
                  <div
                    key={voice.id}
                    className="py-3 min-[480px]:py-0 min-[480px]:h-[68px] px-2 flex items-start min-[480px]:items-center justify-between hover:bg-[#f9fafb] transition-colors relative"
                  >
                    <div className="flex items-start min-[480px]:items-center gap-3.5 min-[480px]:gap-4 min-w-0 pr-3 min-[480px]:pr-4 flex-1">
                      <button
                        type="button"
                        aria-label={`Play ${voice.name}`}
                        onClick={() => handlePlayVoice(voice)}
                        className="mt-1 min-[480px]:mt-0 w-8 h-8 rounded-full flex items-center justify-center text-[#687080] hover:bg-[#eaecee] shrink-0"
                      >
                        {isPlaying ? (
                          <Square className="w-3.5 h-3.5 fill-current text-[#00a7d9]" />
                        ) : (
                          <ReferenceIcon name="play-s" className="w-4 h-4" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-bold text-[#232833] truncate">
                          {voice.name}
                        </div>

                        {/* Mobile (<480px) stacked Public badge + Flag + full wrapped tags matching voices-375x812.png */}
                        <div className="min-[480px]:hidden mt-1 space-y-1.5">
                          <div>
                            <span className="inline-block px-2.5 py-0.5 rounded-[6px] bg-[#e6f9f3] text-[#00a87e] text-[11px] font-bold">
                              {voice.visibility}
                            </span>
                          </div>
                          <div className="flex items-start gap-2 text-[12px] leading-[17px] text-[#687080]">
                            <img
                              src={voice.flag_url}
                              alt={voice.language}
                              className="mt-0.5 w-[20px] h-[14px] object-cover rounded-[2px] shadow-xs shrink-0"
                            />
                            <span>{voice.subtitle_tags}</span>
                          </div>
                        </div>

                        {/* Desktop (>=480px) single-line truncated tags */}
                        <div className="hidden min-[480px]:block text-[12px] text-[#687080] truncate max-w-[440px]">
                          {voice.subtitle_tags}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="hidden min-[480px]:inline-block px-2.5 py-0.5 rounded-[6px] bg-[#e6f9f3] text-[#00a87e] text-[11px] font-bold">
                        {voice.visibility}
                      </span>

                      <img
                        src={voice.flag_url}
                        alt={voice.language}
                        className="hidden min-[480px]:block w-[22px] h-[15px] object-cover rounded-[2px] shadow-sm"
                      />

                      {/* Voice Row Three-Dot Menu (Exact match to step_97_shot_4.png — 222x108px) */}
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          aria-label={`Configure ${voice.name}`}
                          onClick={() =>
                            setOpenRowMenuVoiceId(rowMenuOpen ? null : voice.id)
                          }
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-[#687080] ${
                            rowMenuOpen ? 'bg-[#e6e8ec]' : 'hover:bg-[#eaecee]'
                          }`}
                        >
                          <ReferenceIcon name="more-level" className="w-4 h-4" />
                        </button>

                        {rowMenuOpen && (
                          <div
                            role="menu"
                            className="absolute right-0 top-[38px] z-30 w-[196px] rounded-[16px] bg-white border border-[#eaecee] shadow-[0_12px_36px_rgba(0,0,0,0.14)] p-1.5 space-y-0.5"
                          >
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                navigator.clipboard?.writeText(voice.id);
                                setOpenRowMenuVoiceId(null);
                                showToast(`Copied Voice ID: ${voice.id}`);
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#f7f8fa] flex items-center gap-2.5 text-[12.5px] font-semibold text-[#232833]"
                            >
                              <ReferenceIcon name="copy" className="w-3.5 h-3.5 text-[#4e5666]" />
                              <span>Get Voice ID</span>
                            </button>

                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setOpenRowMenuVoiceId(null);
                                setActiveModal('design-voice');
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#f7f8fa] flex items-center gap-2.5 text-[12.5px] font-semibold text-[#232833]"
                            >
                              <IconVideoAgentWand className="w-3.5 h-3.5 text-[#4e5666]" />
                              <span>Improve this voice</span>
                            </button>

                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setOpenRowMenuVoiceId(null);
                                setActiveModal('choose-avatar');
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#f7f8fa] flex items-center gap-2.5 text-[12.5px] font-semibold text-[#232833]"
                            >
                              <ReferenceIcon name="plus" className="w-3.5 h-3.5 text-[#4e5666]" />
                              <span>Add to Avatar</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {activeTab === 'library' && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setVisibleCount((prev) => prev + 20);
                    showToast('Loaded all verified voices in HeyGen library');
                  }}
                  className="h-[36px] px-5 rounded-full bg-white hover:bg-[#f4f5f7] border border-[#e2e3e6] text-[12.5px] font-bold text-[#232833] transition-colors"
                >
                  See More
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

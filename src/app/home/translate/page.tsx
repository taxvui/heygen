'use client';

import React, { useRef, useState } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import { ReferenceIcon } from '@heygen/ui/icons';
import { CheckCircle2, Download, Languages, FileText, SlidersHorizontal } from 'lucide-react';

const TARGET_LANGUAGES = [
  'Spanish (es-ES)',
  'French (fr-FR)',
  'German (de-DE)',
  'Japanese (ja-JP)',
  'Mandarin Chinese (zh-CN)',
  'Hindi (hi-IN)',
  'Portuguese (pt-BR)',
  'Arabic (ar-SA)',
  'Italian (it-IT)',
  'Korean (ko-KR)',
  'Dutch (nl-NL)',
  'Turkish (tr-TR)',
];

export default function TranslateVideoPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { projects, organization, bootstrap, showToast } = useHeyGenStore();

  const [sourceUrl, setSourceUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [showProjectSelect, setShowProjectSelect] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [sourceLang, setSourceLang] = useState('Auto-detect (English)');
  const [targetLang, setTargetLang] = useState('Spanish (es-ES)');
  const [speakerCount, setSpeakerCount] = useState('Auto-detect (1 Speaker)');
  const [lipSyncEnabled, setLipSyncEnabled] = useState(true);
  const [useBrandGlossary, setUseBrandGlossary] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState<{
    videoUrl: string;
    subtitleUrl: string;
    transcript: string;
    translated: string;
  } | null>(null);

  const isTranslationConfigOpen =
    showSettingsDrawer || Boolean(selectedFile) || Boolean(sourceUrl.trim());

  const handleRunTranslation = async (sourceLabel: string) => {
    setTranslating(true);
    setTranslationResult(null);
    try {
      const projRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${sourceLabel} (${targetLang.split(' ')[0]})`,
          project_type: 'translation',
          aspect_ratio: '16:9',
          resolution: '1080p',
          script: `Translated to ${targetLang}: Welcome to HeyGen Video Translate with natural lip-sync and voice cloning across 175+ languages.`,
          duration_sec: 8,
        }),
      });
      const projData = await projRes.json();

      const jobRes = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projData.project?.id,
          task_type: 'translation',
          provider_id: 'prov-local-ffmpeg',
          model_id: 'mdl-local-ffmpeg-composer',
          input_params: {
            source_language: sourceLang,
            target_language: targetLang,
            speaker_count: speakerCount,
            lip_sync: lipSyncEnabled,
            brand_glossary: useBrandGlossary ? organization?.brand_kit?.glossary : [],
            script:
              'Welcome to HeyGen Video Translate. Your speech has been transcribed, translated, and synchronized with lip-sync.',
            duration_sec: 8,
          },
        }),
      });
      const jobData = await jobRes.json();
      await bootstrap();

      if (jobData.generation_job?.output_url) {
        setTranslationResult({
          videoUrl: jobData.generation_job.output_url,
          subtitleUrl: jobData.generation_job.subtitle_url || '/renders/subtitles.srt',
          transcript:
            jobData.generation_job.transcript_text ||
            'Welcome to HeyGen Video Translate. Your speech has been transcribed, translated, and synchronized.',
          translated:
            jobData.generation_job.translated_text ||
            `[${targetLang}] Welcome to HeyGen Video Translate. Your speech has been transcribed, translated, and synchronized.`,
        });
        showToast(`Video translated into ${targetLang}!`);
      }
    } finally {
      setTranslating(false);
    }
  };

  return (
    <AppShell>
      <div className="w-full max-w-[1050px] pt-[24px] min-[480px]:pt-[58px] pb-16 px-4 min-[480px]:px-[32px] flex flex-col items-center">
        {/* Mobile (<480px) Back to Apps link next to Toggle navigation matching step_347_shot_4 */}
        <div className="w-full pl-[56px] mb-[44px] h-[24px] flex items-center min-[480px]:hidden">
          <a
            href="/apps"
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#232833]"
          >
            <span>‹</span>
            <span>Back to Apps</span>
          </a>
        </div>

        {/* Heading matching step_32_shot_2.png & step_347_shot_4 */}
        <h1 className="text-center font-solar-display text-[32px] leading-[38px] font-bold tracking-[-0.01em] text-[#232833] max-w-[300px] min-[480px]:max-w-none mx-auto mb-[26px] min-[480px]:mb-[36px]">
          Translate your videos in 175+ languages
        </h1>

        {/* Main Upload / Dropzone Card (716px wide matching reference step_32_shot_2.png) */}
        <div className="w-full max-w-[716px] rounded-[24px] bg-white border border-[#f0f1f4] shadow-[0_6px_28px_rgba(0,0,0,0.04)] p-[14px] min-[480px]:p-[24px]">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedFile(file.name);
                showToast(`Selected file: ${file.name}`);
              }
            }}
          />

          {/* Inner Dashed Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) {
                setSelectedFile(file.name);
                showToast(`Dropped video: ${file.name}`);
              }
            }}
            className="w-full h-[350px] rounded-[16px] bg-[#f7f8fa] border border-dashed border-[#cfd3dc] flex flex-col items-center justify-center text-center px-6"
          >
            <h2 className="text-[16px] font-bold text-[#232833] mb-2">
              {selectedFile
                ? `Ready to translate: ${selectedFile}`
                : 'Drop your videos here to translate'}
            </h2>
            <p className="text-[12.5px] leading-[19px] text-[#687080] max-w-[360px] mb-6">
              Your <strong className="text-[#232833]">Free</strong> plan supports videos up to{' '}
              <strong className="text-[#232833]">1</strong> minutes in length.
              <br />
              Videos can be up to 5 GB in MP4, MOV, or WEBM format
            </p>

            <div className="flex flex-col items-center gap-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-[36px] px-5 rounded-full bg-[#19191a] hover:bg-[#343842] text-white text-[12.5px] font-bold transition-colors"
              >
                Browse local files
              </button>

              <button
                type="button"
                onClick={() => setShowProjectSelect(true)}
                className="h-[36px] px-5 rounded-full bg-white hover:bg-[#f2f3f5] border border-[#e2e3e6] text-[#232833] text-[12.5px] font-bold transition-colors"
              >
                Select an existing project
              </button>
            </div>
          </div>

          {/* Observed "Select an Existing Project" Dialog (step_155.json) */}
          {showProjectSelect && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-4"
              onClick={() => setShowProjectSelect(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-[680px] min-h-[420px] rounded-[20px] bg-white border border-[#eaecee] shadow-2xl p-6 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-[18px] font-extrabold text-[#151619]">
                      Select an Existing Project
                    </h3>
                    <p className="text-[12.5px] text-[#687080]">Pick an existing asset to dub</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="h-8 px-3 rounded-full border border-[#e2e3e6] text-[12px] font-bold text-[#232833] inline-flex items-center gap-1.5"
                    >
                      <ReferenceIcon name="filter" className="w-3.5 h-3.5" />
                      <span>Filters</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-[#f2f3f5] text-[10.5px]">
                        0
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label="Close"
                      onClick={() => setShowProjectSelect(false)}
                      className="w-8 h-8 rounded-full hover:bg-[#f2f3f5] flex items-center justify-center text-[#687080]"
                    >
                      <ReferenceIcon name="close" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 rounded-[16px] bg-[#f7f8fa] border border-[#eceef2] p-6 flex flex-col items-center justify-center text-center">
                  <div className="text-[13.5px] font-bold text-[#232833] mb-1">
                    No folders or videos yet
                  </div>
                  {projects.length > 0 && (
                    <div className="mt-4 w-full grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                      {projects.slice(0, 4).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSelectedProjectId(p.id);
                            setSelectedFile(p.title);
                            setShowProjectSelect(false);
                            setShowSettingsDrawer(true);
                          }}
                          className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                            selectedProjectId === p.id
                              ? 'border-[#00c4ff] bg-[#e3f4fa]'
                              : 'border-[#eaecee] bg-white hover:bg-[#f2f3f5]'
                          }`}
                        >
                          <img
                            src={p.thumbnail_url}
                            alt={p.title}
                            className="w-12 h-8 rounded object-cover"
                          />
                          <span className="text-[12.5px] font-bold text-[#232833] truncate">
                            {p.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* OR Divider */}
          <div className="my-5 flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-[#eaecee]" />
            <span className="text-[11px] font-bold text-[#687080] uppercase">OR</span>
            <div className="flex-1 h-[1px] bg-[#eaecee]" />
          </div>

          {/* URL Input */}
          <div className="relative flex items-center">
            <ReferenceIcon name="iconlink" className="w-4 h-4 text-[#687080] absolute left-4" />
            <input
              type="url"
              value={sourceUrl}
              onFocus={() => setShowSettingsDrawer(true)}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="Paste a Google Drive or Vimeo URL"
              className="w-full h-[44px] pl-10 pr-36 rounded-[12px] border border-[#e2e3e6] text-[13px] text-[#232833] placeholder:text-[#8c93a3] focus:outline-none focus:border-[#00c4ff]"
            />
            {!isTranslationConfigOpen && (
              <button
                type="button"
                onClick={() => setShowSettingsDrawer(true)}
                className="absolute right-2.5 h-7 px-2.5 rounded-full bg-[#f7f8fa] hover:bg-[#eaecee] text-[11px] font-bold text-[#4e5666] flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Language Options</span>
              </button>
            )}
          </div>

          {/* Language, Lip-Sync & Glossary Controls Drawer */}
          {isTranslationConfigOpen && (
            <div className="mt-5 pt-5 border-t border-[#eaecee] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11.5px] font-bold text-[#4e5666] mb-1">
                    Source Language
                  </label>
                  <select
                    aria-label="Source Language"
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-[#e2e3e6] text-[12.5px] font-semibold"
                  >
                    <option value="Auto-detect (English)">Auto-detect (English)</option>
                    <option value="English (US)">English (US)</option>
                    <option value="Spanish (es-ES)">Spanish (es-ES)</option>
                    <option value="French (fr-FR)">French (fr-FR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-[#4e5666] mb-1">
                    Target Language (175+)
                  </label>
                  <select
                    aria-label="Target Language"
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-[#e2e3e6] text-[12.5px] font-semibold"
                  >
                    {TARGET_LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-[#4e5666] mb-1">
                    Speakers
                  </label>
                  <select
                    aria-label="Speaker Count"
                    value={speakerCount}
                    onChange={(e) => setSpeakerCount(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-[#e2e3e6] text-[12.5px] font-semibold"
                  >
                    <option value="Auto-detect (1 Speaker)">Auto-detect (1 Speaker)</option>
                    <option value="2 Speakers">2 Speakers</option>
                    <option value="3+ Speakers">3+ Speakers</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-5 text-[12px] text-[#4e5666]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lipSyncEnabled}
                      onChange={(e) => setLipSyncEnabled(e.target.checked)}
                    />
                    <span>Precision AI Lip-Sync</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useBrandGlossary}
                      onChange={(e) => setUseBrandGlossary(e.target.checked)}
                    />
                    <span>
                      Apply Brand Glossary ({organization?.brand_kit?.glossary?.length || 0} terms)
                    </span>
                  </label>
                </div>

                <button
                  type="button"
                  disabled={translating}
                  onClick={() =>
                    handleRunTranslation(selectedFile || sourceUrl || 'Workspace Video')
                  }
                  className="h-9 px-5 rounded-full bg-[#19191a] hover:bg-[#343842] text-white text-[12.5px] font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>{translating ? 'Translating & Lip-Syncing...' : 'Translate Video'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Translation Output Panel */}
          {translationResult && (
            <div className="mt-5 p-4 rounded-2xl bg-[#f9feff] border border-[#00c4ff] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[13.5px] font-bold text-[#232833]">
                  <CheckCircle2 className="w-4 h-4 text-[#00bf8f]" />
                  <span>Translated Video & Subtitles Ready ({targetLang})</span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={translationResult.subtitleUrl}
                    download
                    className="inline-flex items-center gap-1 text-[12px] font-bold text-[#007091] hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Export SRT Subtitles</span>
                  </a>
                  <a
                    href={translationResult.videoUrl}
                    download
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#19191a] text-white text-[12px] font-bold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export MP4 Video</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px]">
                <div className="p-3 rounded-xl bg-white border border-[#eaecee]">
                  <div className="font-bold text-[#687080] mb-1">Source Speech Transcription</div>
                  <div className="text-[#232833]">{translationResult.transcript}</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#eaecee]">
                  <div className="font-bold text-[#00a7d9] mb-1">
                    Synthesized Translation ({targetLang})
                  </div>
                  <div className="text-[#232833]">{translationResult.translated}</div>
                </div>
              </div>

              <video
                src={translationResult.videoUrl}
                controls
                className="w-full max-h-[240px] rounded-xl bg-black"
              />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

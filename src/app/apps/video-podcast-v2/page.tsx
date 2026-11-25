'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/shell/AppShell';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import { IconVoiceWave } from '@heygen/ui/icons';
import {
  ChevronLeft,
  ChevronDown,
  Play,
  ArrowLeftRight,
  Paperclip,
  Sparkles,
  Plus,
  CheckCircle2,
} from 'lucide-react';

export default function VideoPodcastV2Page() {
  const router = useRouter();
  const { setActiveModal, showToast, bootstrap } = useHeyGenStore();

  const [hostAvatar, setHostAvatar] = useState({
    name: 'Marieke',
    img: '/heygen-assets/thumbnails/avatar-marieke-look1.jpg',
    voice: 'Select a voice',
    lang: 'English',
  });
  const [guestAvatar, setGuestAvatar] = useState({
    name: 'Marieke',
    img: '/heygen-assets/thumbnails/avatar-marieke-look2.jpg',
    voice: 'Select a voice',
    lang: 'English',
  });
  const [podcastContent, setPodcastContent] = useState('');
  const [useOwnScript, setUseOwnScript] = useState(false);
  const [quality, setQuality] = useState<'720p' | '1080p'>('720p');
  const [videoLayout, setVideoLayout] = useState('16:9 Landscape');
  const [length, setLength] = useState('1 min');
  const [sceneInstructions, setSceneInstructions] = useState('');
  const [generating, setGenerating] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  const handleSwapSpeakers = () => {
    const temp = hostAvatar;
    setHostAvatar(guestAvatar);
    setGuestAvatar(temp);
    showToast('Swapped Host and Guest speakers');
  };

  const handleGeneratePreview = async () => {
    const script =
      podcastContent.trim() ||
      'Host: Welcome back to our AI Video Podcast! Today we are exploring how two-speaker avatar podcasts transform content creation. Guest: It is amazing how a single topic turns into a natural studio conversation.';
    setGenerating(true);
    try {
      const projRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Podcast — Video Podcast v2',
          project_type: 'video_agent',
          aspect_ratio: videoLayout.includes('9:16') ? '9:16' : '16:9',
          resolution: quality,
          script,
          duration_sec: 8,
        }),
      });
      const projData = await projRes.json();

      const jobRes = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projData.project?.id,
          task_type: 'text_to_video',
          provider_id: 'prov-local-ffmpeg',
          model_id: 'mdl-local-ffmpeg-composer',
          input_params: {
            prompt: script,
            script,
            aspect_ratio: '16:9',
            resolution: quality,
            duration_sec: 8,
          },
        }),
      });
      const jobData = await jobRes.json();
      await bootstrap();
      if (jobData.generation_job?.output_url) {
        setPreviewVideoUrl(jobData.generation_job.output_url);
        showToast('Podcast preview generated!');
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AppShell hideFloatingOrby={true}>
      <div className="w-full max-w-[1050px] pt-[24px] pb-16 px-4 sm:px-[32px]">
        {/* Top Breadcrumb: < Back to Apps matching step_182.png */}
        <div className="mb-5">
          <button
            type="button"
            onClick={() => router.push('/apps')}
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#151619] hover:text-[#00a7d9]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Apps</span>
          </button>
        </div>

        {/* Main Podcast Studio Card matching step_182.png */}
        <div className="w-full max-w-[880px] mx-auto rounded-[22px] border border-[#e6e8ec] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
          {/* Top Atmospheric Blurred Header Banner (245px height) */}
          <div
            className="relative h-[245px] w-full px-7 pb-5 flex items-end justify-between"
            style={{
              background:
                'linear-gradient(125deg, #8b949e 0%, #9fa3a9 35%, #a89f96 70%, #7d8085 100%)',
            }}
          >
            <div className="text-[28px] leading-[34px] font-extrabold text-[#151619]">
              New Podcast
            </div>

            {/* Overlapping Dual Speaker Circles */}
            <div className="flex items-center -space-x-3">
              <button
                type="button"
                onClick={() => setActiveModal('choose-avatar')}
                className="w-[78px] h-[78px] rounded-full border-2 border-white overflow-hidden shadow-md relative z-10"
              >
                <img
                  src={hostAvatar.img}
                  alt={hostAvatar.name}
                  className="w-full h-full object-cover"
                />
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('choose-avatar')}
                className="w-[78px] h-[78px] rounded-full border-2 border-white overflow-hidden shadow-md relative z-20"
              >
                <img
                  src={guestAvatar.img}
                  alt={guestAvatar.name}
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-7 space-y-6">
            {/* Host & Guest Row */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
              {/* Host Column */}
              <div className="space-y-3">
                <div className="text-[12.5px] font-bold text-[#151619]">Host</div>
                <div className="rounded-full border border-[#eceef2] p-2.5 flex items-center gap-3.5 bg-white">
                  <button
                    type="button"
                    onClick={() => setActiveModal('choose-avatar')}
                    className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#eaecee]"
                  >
                    <img
                      src={hostAvatar.img}
                      alt={hostAvatar.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-extrabold text-[#151619] mb-1.5">
                      {hostAvatar.name}
                    </div>
                    <div className="inline-flex items-center rounded-full border border-[#e2e5ea] overflow-hidden h-[30px]">
                      <button
                        type="button"
                        onClick={() => setActiveModal('choose-voice')}
                        className="px-3 h-full inline-flex items-center gap-1.5 text-[11.5px] font-bold text-[#151619] hover:bg-[#f7f8fa]"
                      >
                        <IconVoiceWave className="w-3.5 h-3.5" />
                        <span>{hostAvatar.voice}</span>
                      </button>
                      <button
                        type="button"
                        disabled
                        aria-label="Play audio preview"
                        className="px-2.5 h-full bg-[#e6e8ec] text-[#9da3b0] flex items-center justify-center"
                      >
                        <Play className="w-3 h-3 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[11.5px] font-semibold text-[#687080] mb-1">
                    Host Language
                  </div>
                  <button
                    type="button"
                    className="w-full h-[38px] px-3.5 rounded-[10px] border border-[#e2e5ea] flex items-center justify-between text-[12.5px] font-medium text-[#151619]"
                  >
                    <span className="flex items-center gap-2">
                      <span>🌎</span>
                      <span>{hostAvatar.lang}</span>
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#687080]" />
                  </button>
                </div>
              </div>

              {/* Swap Speakers Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  aria-label="Swap speakers"
                  onClick={handleSwapSpeakers}
                  className="w-8 h-8 rounded-full hover:bg-[#f4f5f7] flex items-center justify-center text-[#4e5666]"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              {/* Guest Column */}
              <div className="space-y-3">
                <div className="text-[12.5px] font-bold text-[#151619]">Guest</div>
                <div className="rounded-full border border-[#eceef2] p-2.5 flex items-center gap-3.5 bg-white">
                  <button
                    type="button"
                    onClick={() => setActiveModal('choose-avatar')}
                    className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#eaecee]"
                  >
                    <img
                      src={guestAvatar.img}
                      alt={guestAvatar.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-extrabold text-[#151619] mb-1.5">
                      {guestAvatar.name}
                    </div>
                    <div className="inline-flex items-center rounded-full border border-[#e2e5ea] overflow-hidden h-[30px]">
                      <button
                        type="button"
                        onClick={() => setActiveModal('choose-voice')}
                        className="px-3 h-full inline-flex items-center gap-1.5 text-[11.5px] font-bold text-[#151619] hover:bg-[#f7f8fa]"
                      >
                        <IconVoiceWave className="w-3.5 h-3.5" />
                        <span>{guestAvatar.voice}</span>
                      </button>
                      <button
                        type="button"
                        disabled
                        aria-label="Play audio preview"
                        className="px-2.5 h-full bg-[#e6e8ec] text-[#9da3b0] flex items-center justify-center"
                      >
                        <Play className="w-3 h-3 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[11.5px] font-semibold text-[#687080] mb-1">
                    Guest Language
                  </div>
                  <button
                    type="button"
                    className="w-full h-[38px] px-3.5 rounded-[10px] border border-[#e2e5ea] flex items-center justify-between text-[12.5px] font-medium text-[#151619]"
                  >
                    <span className="flex items-center gap-2">
                      <span>🌎</span>
                      <span>{guestAvatar.lang}</span>
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#687080]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Podcast Content */}
            <div>
              <div className="text-[12.5px] font-bold text-[#151619] mb-2">Podcast Content</div>
              <div className="rounded-[16px] border border-[#eceef2] p-4 space-y-3">
                <textarea
                  value={podcastContent}
                  onChange={(e) => setPodcastContent(e.target.value)}
                  placeholder="Type a script, a prompt, or upload a document about the content you'd like to talk about in your podcast. You can also ask for the dialogue in a specific language."
                  rows={5}
                  className="w-full resize-none border-0 outline-none text-[13px] text-[#151619] placeholder:text-[#8c93a3]"
                />
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#f4f5f7]">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => showToast('Document attached to podcast context')}
                      className="h-8 px-3 rounded-full border border-[#e2e5ea] hover:bg-[#f7f8fa] text-[12px] font-semibold text-[#151619] inline-flex items-center gap-1.5"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>Attach a document</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPodcastContent(
                          'Discuss the top 3 breakthroughs in generative video avatars and how enterprises scale localized training.'
                        )
                      }
                      className="h-8 px-3 rounded-full border border-[#e2e5ea] hover:bg-[#f7f8fa] text-[12px] font-semibold text-[#151619] inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Suggest a topic</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-[#4e5666]">
                      Use my own script
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={useOwnScript}
                      onClick={() => setUseOwnScript(!useOwnScript)}
                      className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors ${
                        useOwnScript
                          ? 'bg-[#00b8ff] justify-end'
                          : 'bg-[#cfd3dc] justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality, Video Layout, Length */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-[12px] font-bold text-[#151619] mb-1.5">Quality</div>
                <div className="grid grid-cols-2 rounded-[10px] bg-[#f4f5f7] p-1">
                  <button
                    type="button"
                    aria-pressed={quality === '720p'}
                    onClick={() => setQuality('720p')}
                    className={`h-8 rounded-[8px] text-[12px] font-bold ${
                      quality === '720p'
                        ? 'bg-white text-[#151619] shadow-2xs'
                        : 'text-[#687080]'
                    }`}
                  >
                    Standard 720p
                  </button>
                  <button
                    type="button"
                    aria-pressed={quality === '1080p'}
                    onClick={() => setQuality('1080p')}
                    className={`h-8 rounded-[8px] text-[12px] font-bold ${
                      quality === '1080p'
                        ? 'bg-white text-[#151619] shadow-2xs'
                        : 'text-[#687080]'
                    }`}
                  >
                    Quality 1080p
                  </button>
                </div>
              </div>

              <div>
                <div className="text-[12px] font-bold text-[#151619] mb-1.5">Video Layout</div>
                <select
                  aria-label="Video Layout"
                  value={videoLayout}
                  onChange={(e) => setVideoLayout(e.target.value)}
                  className="w-full h-10 px-3 rounded-[10px] border border-[#e2e5ea] text-[12.5px] font-semibold text-[#151619]"
                >
                  <option value="16:9 Landscape">16:9 Landscape</option>
                  <option value="9:16 Portrait">9:16 Portrait</option>
                </select>
              </div>

              <div>
                <div className="text-[12px] font-bold text-[#151619] mb-1.5">Length</div>
                <select
                  aria-label="Length"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full h-10 px-3 rounded-[10px] border border-[#e2e5ea] text-[12.5px] font-semibold text-[#151619]"
                >
                  <option value="1 min">1 min</option>
                  <option value="2 min">2 min</option>
                  <option value="3 min">3 min</option>
                </select>
              </div>
            </div>

            {/* Scene Instructions */}
            <div>
              <div className="text-[12.5px] font-bold text-[#151619] mb-2">
                Scene Instructions (optional)
              </div>
              <div className="rounded-[14px] border border-[#eceef2] p-3.5 space-y-2">
                <textarea
                  value={sceneInstructions}
                  onChange={(e) => setSceneInstructions(e.target.value)}
                  placeholder="Add details about what angles or looks you'd like to include, or what your ideal podcast setting should look like."
                  rows={2}
                  className="w-full resize-none border-0 outline-none text-[12.5px] text-[#151619] placeholder:text-[#8c93a3]"
                />
                <button
                  type="button"
                  onClick={() => showToast('Reference scene attached')}
                  className="h-7 px-3 rounded-full border border-[#e2e5ea] hover:bg-[#f7f8fa] text-[11.5px] font-semibold text-[#151619] inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add reference</span>
                </button>
              </div>
            </div>

            {previewVideoUrl && (
              <div className="p-4 rounded-2xl bg-[#f7f8fa] border border-[#00c4ff] space-y-2">
                <div className="text-[13px] font-bold text-[#151619] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00bf8f]" />
                  <span>Generated Podcast Preview</span>
                </div>
                <video
                  src={previewVideoUrl}
                  controls
                  className="w-full max-h-[220px] rounded-xl bg-black"
                />
              </div>
            )}
          </div>

          {/* Sticky Bottom Footer Bar matching step_182.png */}
          <div className="px-7 py-4 border-t border-[#eceef2] bg-white flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11.5px] text-[#687080]">
              Edits must stay within 1 minute, 20 seconds, or the original generated preview length
              if longer.
            </span>
            <button
              type="button"
              disabled={generating}
              onClick={handleGeneratePreview}
              className="h-[38px] px-5 rounded-full bg-[#151619] hover:bg-[#2a2d34] text-white text-[12.5px] font-bold transition-colors disabled:opacity-50"
            >
              {generating ? 'Generating Preview...' : 'Generate Preview'}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

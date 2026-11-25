'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import { GlobalModals } from '@/components/shell/GlobalModals';
import { ChevronLeft, X } from 'lucide-react';

function AvatarHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/home';
  const { setActiveModal } = useHeyGenStore();
  const [flowStep, setFlowStep] = useState<'root' | 'myself' | 'new-character'>('root');

  return (
    <div className="min-h-screen bg-white text-[#232833] relative flex flex-col items-center justify-center p-6 overflow-hidden select-none">
      {/* Subtle Top-Left & Bottom-Right Ambient Aura matching step_61_shot_1 & step_227_shot_2 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full opacity-35 blur-[90px]"
        style={{
          background: 'radial-gradient(circle, rgba(194, 89, 255, 0.28), transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 w-[520px] h-[520px] rounded-full opacity-35 blur-[90px]"
        style={{
          background: 'radial-gradient(circle, rgba(0, 196, 255, 0.28), transparent 70%)',
        }}
      />

      {/* Top-Left Back Button (<) when in Myself or A new character sub-flow */}
      {flowStep !== 'root' && (
        <button
          type="button"
          aria-label="Back"
          onClick={() => setFlowStep('root')}
          className="fixed top-7 left-8 z-20 w-9 h-9 rounded-full bg-white hover:bg-[#f2f3f5] border border-[#eaecee] shadow-sm flex items-center justify-center text-[#232833] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Top-Right Close / Exit Button (x) */}
      <button
        type="button"
        aria-label={flowStep === 'root' ? 'Close' : 'Exit'}
        onClick={() => router.push(returnTo)}
        className="fixed top-7 right-8 z-20 w-9 h-9 rounded-full bg-white hover:bg-[#f2f3f5] border border-[#eaecee] shadow-sm flex items-center justify-center text-[#232833] transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {flowStep === 'root' ? (
        /* Step 1: Who is this avatar of? (step_61_shot_1_popup_01_home_get_started.png) */
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-[26px] leading-[32px] font-extrabold tracking-[-0.02em] text-[#232833] mb-7 text-center">
            Who is this avatar of?
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
            {/* Option 1: Myself */}
            <button
              type="button"
              onClick={() => setFlowStep('myself')}
              className="w-[276px] h-[250px] rounded-[18px] bg-white border-[1.75px] border-[#00c4ff] shadow-[0_8px_28px_rgba(0,196,255,0.12)] p-3 flex flex-col justify-between text-left transition-all hover:shadow-[0_12px_32px_rgba(0,196,255,0.18)]"
            >
              <div className="w-full h-[146px] rounded-[12px] bg-[#e9faff] flex items-center justify-center relative overflow-hidden">
                <div className="relative w-[138px] h-[106px] p-1.5 flex items-center justify-center">
                  <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00c4ff] rounded-tl-[3px]" />
                  <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00c4ff] rounded-tr-[3px]" />
                  <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00c4ff] rounded-bl-[3px]" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00c4ff] rounded-br-[3px]" />
                  <img
                    src="/heygen-assets/thumbnails/avatar-marieke-look2.webp"
                    alt="Myself"
                    className="w-full h-full object-cover rounded-[8px]"
                  />
                </div>
              </div>

              <div className="px-2 pb-2">
                <div className="text-[14.5px] font-extrabold text-[#232833] mb-1">Myself</div>
                <p className="text-[11.5px] leading-[16px] text-[#687080]">
                  Create an avatar that looks, moves, and sounds like me.
                </p>
              </div>
            </button>

            {/* Option 2: A new character */}
            <button
              type="button"
              onClick={() => setFlowStep('new-character')}
              className="w-[276px] h-[250px] rounded-[18px] bg-white border border-[#eaecee] hover:border-[#00c4ff] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-3 flex flex-col justify-between text-left transition-all"
            >
              <div className="w-full h-[146px] rounded-[12px] bg-[#eaf8f5] flex items-center justify-center relative overflow-hidden">
                <div className="relative flex items-center justify-center">
                  <img
                    src="/heygen-assets/thumbnails/avatar-annie-look2.webp"
                    alt="Character 1"
                    className="w-[54px] h-[78px] object-cover rounded-[10px] border-2 border-white shadow-sm -rotate-6 -mr-3 z-10"
                  />
                  <img
                    src="/heygen-assets/thumbnails/avatar-kurt-main.webp"
                    alt="Character 2"
                    className="w-[68px] h-[96px] object-cover rounded-[12px] border-2 border-white shadow-md z-20"
                  />
                  <img
                    src="/heygen-assets/images/apps-v2-podcast.jpg"
                    alt="Character 3"
                    className="w-[54px] h-[78px] object-cover rounded-[10px] border-2 border-white shadow-sm rotate-6 -ml-3 z-10"
                  />
                </div>
              </div>

              <div className="px-2 pb-2">
                <div className="text-[14.5px] font-extrabold text-[#232833] mb-1">
                  A new character
                </div>
                <p className="text-[11.5px] leading-[16px] text-[#687080]">
                  Create an avatar of a character you invent, from their look to their voice.
                </p>
              </div>
            </button>
          </div>
        </div>
      ) : (
        /* Step 2a (Myself — step_227_shot_2.png) & Step 2b (A new character — step_227_shot_3.png) */
        <div className="relative z-10 flex flex-col items-center text-center max-w-[680px]">
          <h1 className="text-[32px] leading-[38px] font-extrabold tracking-[-0.025em] text-[#151619] mb-2">
            Let&apos;s create your avatar
          </h1>
          <p className="text-[13.5px] text-[#687080] mb-9">
            {flowStep === 'myself'
              ? 'Upload a photo, then record your motion and voice to build your avatar'
              : 'Upload a photo, then choose a voice to build your avatar.'}
          </p>

          {/* Visual Equation Row */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-10">
            {/* 1. Appearance Card */}
            <div className="relative w-[112px] h-[152px] rounded-[18px] overflow-hidden shadow-md border border-[#eaecee]">
              <img
                src="/heygen-assets/images/avatar-hub-appearance.webp"
                alt="Appearance"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-xs text-white text-[10.5px] font-bold">
                Appearance
              </span>
            </div>

            <span className="text-[16px] font-bold text-[#687080]">+</span>

            {/* 2. Motion Card (Only in Myself flow) */}
            {flowStep === 'myself' && (
              <>
                <div className="relative w-[112px] h-[152px] rounded-[18px] overflow-hidden shadow-md border border-[#eaecee]">
                  <img
                    src="/heygen-assets/images/avatar-hub-motion-poster.jpg"
                    alt="Motion"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-xs text-white text-[10.5px] font-bold">
                    Motion
                  </span>
                </div>
                <span className="text-[16px] font-bold text-[#687080]">+</span>
              </>
            )}

            {/* 3. Voice Card */}
            <div className="relative w-[112px] h-[152px] rounded-[18px] bg-[#ebfcff] border border-[#d6f5fc] shadow-sm flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 mb-3">
                {[18, 26, 22, 26, 18].map((h, idx) => (
                  <span
                    key={idx}
                    style={{ height: `${h}px` }}
                    className="w-[4.5px] rounded-full bg-[#00b8ff]"
                  />
                ))}
              </div>
              <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#525866] text-white text-[10.5px] font-bold">
                Voice
              </span>
            </div>

            <span className="text-[16px] font-bold text-[#687080]">=</span>

            {/* 4. Final Result Avatar Card */}
            <div className="relative w-[130px] h-[172px] rounded-[20px] overflow-hidden border-[3px] border-[#66d9ff] shadow-[0_8px_28px_rgba(0,196,255,0.22)]">
              <img
                src="/heygen-assets/images/avatar-hub-appearance.webp"
                alt="Final Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveModal('create-avatar')}
            className="h-[40px] px-6 rounded-full bg-[#151619] hover:bg-[#2a2d34] text-white text-[13px] font-bold transition-colors"
          >
            Get started
          </button>
        </div>
      )}

      <GlobalModals />
    </div>
  );
}

export default function AvatarHubPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <AvatarHubContent />
    </Suspense>
  );
}

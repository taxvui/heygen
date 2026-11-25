'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/shell/AppShell';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import { IconVoiceWave } from '@heygen/ui/icons';
import referenceAvatarsData from '../../../../../data/reference/avatars.json';
import { ArrowLeft, Heart, MoreHorizontal, ChevronRight, Video } from 'lucide-react';

export default function AvatarProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { avatars, bootstrap, showToast } = useHeyGenStore();

  const avatar =
    avatars.find(
      (a) =>
        a.id === id ||
        a.name.toLowerCase() === id.toLowerCase() ||
        `pub-${a.name.toLowerCase()}` === id.toLowerCase()
    ) || avatars[0];

  const isAnnie =
    !avatar ||
    avatar.name.toLowerCase() === 'annie' ||
    id.toLowerCase().includes('annie') ||
    id === 'e0e84faea390465896db75a83be45085';

  const allLooks = isAnnie
    ? referenceAvatarsData.annie57Looks.map((lk) => ({
        name: lk.title,
        url: lk.localImage,
      }))
    : [
        { name: `${avatar.name} in Primary Look`, url: avatar.main_thumbnail_url },
        {
          name: `${avatar.name} in Look 2`,
          url: avatar.look_thumbnails[0] || avatar.main_thumbnail_url,
        },
        {
          name: `${avatar.name} in Look 3`,
          url: avatar.look_thumbnails[1] || avatar.main_thumbnail_url,
        },
      ];

  return (
    <AppShell>
      <div className="w-full max-w-[1080px] pt-[26px] pb-16 px-4 sm:px-[32px]">
        {/* Top Header Row matching step_90_shot_2 & step_286_shot_1.png */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#eaecee] mb-5 lg:pr-[130px]">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              aria-label="Back to Avatars"
              onClick={() => router.push('/avatar/my-avatars?tab=public')}
              className="w-8 h-8 rounded-full bg-[#f4f5f7] hover:bg-[#e6e8ec] flex items-center justify-center text-[#232833]"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <img
              src={avatar?.main_thumbnail_url || '/heygen-assets/thumbnails/avatar-annie-main.webp'}
              alt={avatar?.name || 'Annie'}
              className="w-11 h-11 rounded-full object-cover border border-[#eaecee]"
            />
            <h1 className="text-[22px] font-extrabold text-[#232833]">
              {avatar?.name || 'Annie'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push('/avatar/voices')}
              className="h-9 px-4 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] flex items-center gap-2 text-[12.5px] font-bold text-[#232833]"
            >
              <IconVoiceWave className="w-3.5 h-3.5" />
              <span>{avatar?.name || 'Annie'}&apos;s voices</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#687080]" />
            </button>

            <button
              type="button"
              aria-label="Favorite avatar"
              onClick={async () => {
                if (!avatar) return;
                await fetch('/api/avatars', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: avatar.id, is_favorite: !avatar.is_favorite }),
                });
                await bootstrap();
                showToast(`Updated favorite status for ${avatar.name}`);
              }}
              className="w-9 h-9 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] flex items-center justify-center text-[#232833]"
            >
              <Heart
                className={`w-4 h-4 ${
                  avatar?.is_favorite ? 'text-[#e54945] fill-current' : ''
                }`}
              />
            </button>

            <button
              type="button"
              aria-label="More options"
              onClick={() => router.push('/apps/studio')}
              className="w-9 h-9 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] flex items-center justify-center text-[#232833]"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Looks Count Subheading */}
        <div className="text-[12.5px] font-bold text-[#232833] mb-4">{allLooks.length} looks</div>

        {/* Looks Cards Grid (All 57 looks of Annie matching step_286_shot_1.png) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allLooks.map((look, i) => (
            <div
              key={i}
              onClick={() => router.push('/home/photo-to-video')}
              className="group relative h-[225px] rounded-[18px] border border-[#eaecee] hover:border-[#00c4ff] bg-[#f7f8fa] overflow-hidden cursor-pointer shadow-xs transition-all"
            >
              <img
                src={look.url}
                alt={look.name}
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent flex flex-col justify-end p-3.5">
                <div className="text-[12.5px] font-bold text-white drop-shadow truncate">
                  {look.name}
                </div>
              </div>
              <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <span className="w-7 h-7 rounded-full bg-white/90 text-[#151619] flex items-center justify-center shadow-xs">
                  <Video className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

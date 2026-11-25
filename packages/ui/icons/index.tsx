import React from 'react';
import {
  ReferenceIcon,
  RefIconPlansProgressRing,
  RefIconStudioDashedRect,
} from '@/components/reference-icons';

export { ReferenceIcon, RefIconPlansProgressRing, RefIconStudioDashedRect };

export function IconAvatarNav({ className = 'w-6 h-6' }: { className?: string }) {
  return <ReferenceIcon name="avatar-menu" className={className} />;
}

export function IconBrandNav({ className = 'w-6 h-6' }: { className?: string }) {
  return <ReferenceIcon name="brand-kit" className={className} />;
}

export function IconAppsNav({ className = 'w-6 h-6' }: { className?: string }) {
  return <ReferenceIcon name="design" className={className} />;
}

export function IconProjectsNav({ className = 'w-6 h-6' }: { className?: string }) {
  return <ReferenceIcon name="folder" className={className} />;
}

export function IconDevelopersNav({ className = 'w-6 h-6' }: { className?: string }) {
  return <ReferenceIcon name="code" className={className} />;
}

export function IconSidebarCollapse({ className = 'w-5 h-5' }: { className?: string }) {
  return <ReferenceIcon name="collapse-chat" className={className} />;
}

export function IconHomeHouse({ className = 'w-5 h-5' }: { className?: string }) {
  return <ReferenceIcon name="home-smile" className={className} />;
}

export function IconVideoAgentWand({ className = 'w-4 h-4' }: { className?: string }) {
  return <ReferenceIcon name="magic" className={className} />;
}

export function IconSceneBySceneCamera({ className = 'w-4 h-4' }: { className?: string }) {
  return <ReferenceIcon name="video" className={className} />;
}

export function IconSingleScenePortrait({ className = 'w-4 h-4' }: { className?: string }) {
  return <ReferenceIcon name="image" className={className} />;
}

export function IconTranslateLang({ className = 'w-4 h-4' }: { className?: string }) {
  return <ReferenceIcon name="translate" className={className} />;
}

export function IconVoiceWave({ className = 'w-4 h-4' }: { className?: string }) {
  return <ReferenceIcon name="voice" className={className} />;
}

export function IconGoldDiamond({ className = 'w-5 h-5' }: { className?: string }) {
  return <ReferenceIcon name="pro" className={className} />;
}

export function IconOrbyBot({ className = 'w-[30px] h-[30px]' }: { className?: string }) {
  return (
    <svg
      data-testid="live-orby"
      aria-hidden="true"
      className={`shrink-0 overflow-visible ${className}`}
      viewBox="0 0 30 30"
      fill="none"
    >
      <path
        d="M6.5 9.2C6.5 6.4 9.5 4.5 14.5 4.8C19.5 5.1 22.8 7.5 22.4 12.2C22 16.9 19.2 21.8 14.4 22.1C9.6 22.4 6.5 17.5 6.5 9.2Z"
        fill="url(#orbyLiveGrad)"
      />
      <ellipse cx="12.2" cy="11.8" rx="1.6" ry="2.2" fill="#ffffff" />
      <ellipse cx="16.8" cy="11.8" rx="1.6" ry="2.2" fill="#ffffff" />
      <circle cx="12.4" cy="12" r="0.8" fill="#0095d9" />
      <circle cx="17" cy="12" r="0.8" fill="#0095d9" />
      <circle cx="21.5" cy="21" r="3.4" fill="#35c838" stroke="#ffffff" strokeWidth="1.5" />
      <defs>
        <linearGradient id="orbyLiveGrad" x1="6" y1="4" x2="23" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6be0ff" />
          <stop offset="1" stopColor="#2dc3ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

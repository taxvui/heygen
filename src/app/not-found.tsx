'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/shell/AppShell';

export function HeyGen404View() {
  return (
    <div className="w-full h-[82vh] flex flex-col items-center justify-center text-center px-6 select-none">
      {/* Exact 404 Folder + Tilted Documents Illustration matching step_36_shot_1.png */}
      <div className="relative w-[180px] h-[165px] mb-4 flex items-center justify-center">
        <svg viewBox="0 0 200 180" className="w-full h-full" fill="none">
          {/* Top sparkle lines */}
          <line x1="102" y1="8" x2="100" y2="20" stroke="#e4e2f5" strokeWidth="4" strokeLinecap="round" />
          <line x1="114" y1="10" x2="115" y2="22" stroke="#e4e2f5" strokeWidth="4" strokeLinecap="round" />
          <line x1="126" y1="14" x2="129" y2="24" stroke="#e4e2f5" strokeWidth="4" strokeLinecap="round" />

          {/* Left tilted paper sheet */}
          <g transform="rotate(-12 75 75)">
            <rect x="48" y="34" width="58" height="74" rx="8" fill="#f3f3fa" />
            <line x1="58" y1="50" x2="92" y2="50" stroke="#e2e1f2" strokeWidth="4" strokeLinecap="round" />
            <line x1="58" y1="62" x2="86" y2="62" stroke="#e2e1f2" strokeWidth="4" strokeLinecap="round" />
            <line x1="58" y1="74" x2="90" y2="74" stroke="#e2e1f2" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Right tilted paper sheet */}
          <g transform="rotate(14 135 78)">
            <rect x="98" y="32" width="62" height="78" rx="8" fill="#f0effa" />
            <line x1="110" y1="48" x2="146" y2="48" stroke="#dfddf2" strokeWidth="4" strokeLinecap="round" />
            <line x1="110" y1="60" x2="142" y2="60" stroke="#dfddf2" strokeWidth="4" strokeLinecap="round" />
            <line x1="110" y1="72" x2="148" y2="72" stroke="#dfddf2" strokeWidth="4" strokeLinecap="round" />
            <line x1="110" y1="84" x2="136" y2="84" stroke="#dfddf2" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Folder body with subtle 3D bottom shadow */}
          <path
            d="M36 74C36 67.3726 41.3726 62 48 62H82L94 74H154C160.627 74 166 79.3726 166 86V146C166 153.732 159.732 160 152 160H50C42.268 160 36 153.732 36 146V74Z"
            fill="url(#folderGrad)"
          />
          <path
            d="M36 144C36 151.732 42.268 158 50 158H152C159.732 158 166 151.732 166 144V148C166 155.732 159.732 162 152 162H50C42.268 162 36 155.732 36 148V144Z"
            fill="#d9d8ea"
          />

          {/* 404 Text on Folder */}
          <text
            x="101"
            y="128"
            textAnchor="middle"
            fill="#dedaf7"
            fontSize="36"
            fontWeight="800"
            fontFamily="TT Norms Pro, sans-serif"
          >
            404
          </text>

          <defs>
            <linearGradient id="folderGrad" x1="101" y1="62" x2="101" y2="160" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f7f7fc" />
              <stop offset="1" stopColor="#e8e8f3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <h1 className="text-[19px] leading-[24px] font-medium text-[#232833] mb-1.5">
        Something&apos;s wrong
      </h1>
      <p className="text-[13px] text-[#9ea4b0] mb-6">
        This page doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/home"
        className="h-[40px] px-5 rounded-full bg-[#19191a] hover:bg-[#343842] text-white text-[13px] font-bold inline-flex items-center justify-center transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}

export default function NotFoundPage() {
  return (
    <AppShell>
      <HeyGen404View />
    </AppShell>
  );
}

'use client';

import React, { Suspense } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { VideoAgentContent } from '@/app/home/video-agent/page';

export default function AppsVideoAgentPage() {
  return (
    <AppShell showUpgradePill={true}>
      <Suspense
        fallback={
          <div className="p-12 text-center text-sm text-[#687080]">Loading Video Agent...</div>
        }
      >
        <VideoAgentContent isAppSubroute={true} />
      </Suspense>
    </AppShell>
  );
}

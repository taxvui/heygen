'use client';

import React, { Suspense, use } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { DevelopersPortalContent } from '../api/page';

export default function DevelopersSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = use(params);
  return (
    <AppShell>
      <Suspense fallback={<div className="p-12 text-center text-sm text-[#687080]">Loading Developers Section...</div>}>
        <DevelopersPortalContent forcedSection={section} />
      </Suspense>
    </AppShell>
  );
}

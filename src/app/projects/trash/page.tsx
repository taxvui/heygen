'use client';

import React, { Suspense } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { ProjectsPageContent } from '../page';

export default function ProjectsTrashPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-12 text-center text-sm text-[#687080]">Loading Trash...</div>}>
        <ProjectsPageContent forcedTrash={true} />
      </Suspense>
    </AppShell>
  );
}

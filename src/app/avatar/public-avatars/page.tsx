'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { HeyGen404View } from '@/app/not-found';

export default function PublicAvatarsNotFoundRoute() {
  return (
    <AppShell>
      <HeyGen404View />
    </AppShell>
  );
}

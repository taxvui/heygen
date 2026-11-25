'use client';

import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { AvatarScriptComposerView } from '@/components/avatar/AvatarScriptComposerView';

export default function SingleScenePhotoToVideoPage() {
  return (
    <AppShell>
      <AvatarScriptComposerView submitVariant="arrow-circle" />
    </AppShell>
  );
}

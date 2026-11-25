'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';

export default function LoginPage() {
  const router = useRouter();
  const { setActiveModal } = useHeyGenStore();

  useEffect(() => {
    setActiveModal('signin');
    router.replace('/home');
  }, [router, setActiveModal]);

  return null;
}

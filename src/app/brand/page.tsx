'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/shell/AppShell';
import { ReferenceIcon } from '@heygen/ui/icons';

export default function BrandSystemsPage() {
  const router = useRouter();

  return (
    <AppShell>
      <div className="min-w-0 xl:flex-1 w-full">
        <div className="mx-auto max-w-[1200px] xl:px-6">
          <div
            data-pacific-component="BrandKitV4Content"
            className="flex size-full flex-col xl:min-h-screen"
          >
            <div
              data-atlas-id="brand-kit-content"
              className="flex flex-1 flex-col px-4 sm:px-12 xl:px-0 pt-[68px] xl:pt-0"
            >
              {/* Top Header Row matching step_500.json */}
              <div className="flex shrink-0 items-start justify-between gap-4 py-6 xl:pr-[134px]">
                <div>
                  <h2 className="m-0 text-[36px] font-extrabold leading-[54px] tracking-[-0.01em] text-[#1D2129]">
                    Brand Systems
                  </h2>
                  <p className="m-0 mb-2 text-[16px] leading-[20px] text-[#1D2129]">
                    Brand systems keep every video consistent without restyling elements one by one.
                  </p>
                </div>
              </div>

              {/* BrandKitV4EmptyDotField + BrandKitV4EmptyCollage matching step_500.json */}
              <div
                data-pacific-component="BrandKitV4EmptyDotField"
                className="relative flex flex-1 items-center justify-center overflow-hidden py-10 text-[#86909C]"
                style={{
                  backgroundImage:
                    'radial-gradient(rgba(134, 144, 156, 0.24) 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                }}
              >
                <div className="[perspective:900px] relative z-[1] flex -translate-y-3.5 flex-col items-center gap-5 w-[513px] max-w-full">
                  <div aria-hidden="true" className="w-full">
                    <div
                      data-pacific-component="BrandKitV4EmptyCollage"
                      className="flex justify-center"
                    >
                      <div className="relative">
                        <img
                          className="h-auto w-[513px] max-w-full select-none"
                          src="/reference-assets/images/brand-kit-v4-empty-collage.png"
                          alt=""
                          width={513}
                          height={377}
                          loading="eager"
                          fetchPriority="high"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <p className="m-0 text-center font-solar-display text-[32px] font-bold leading-[1.05] -tracking-[0.01em] text-[#1D2129]">
                      Create a Brand System to stay visually consistent
                    </p>
                    <p className="m-0 text-center text-[16px] leading-normal text-[#4E5969] max-w-[380px]">
                      Brand systems keep every video consistent without restyling elements one by
                      one.
                    </p>
                  </div>

                  <div className="mt-1 max-w-full">
                    <button
                      type="button"
                      onClick={() => router.push('/brand/new')}
                      className="rounded-[100px] inline-flex items-center justify-center whitespace-nowrap text-[14px] font-semibold leading-[20px] tracking-normal bg-[#1D2129] text-white shadow hover:bg-[#343842] h-[40px] px-4 gap-[8px] transition-colors"
                    >
                      <ReferenceIcon name="add" className="w-4 h-4 shrink-0" />
                      <span>New Brand System</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

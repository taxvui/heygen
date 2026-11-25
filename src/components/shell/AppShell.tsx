'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import {
  ReferenceIcon,
  RefIconPlansProgressRing,
  IconAvatarNav,
  IconBrandNav,
  IconAppsNav,
  IconProjectsNav,
  IconDevelopersNav,
  IconSidebarCollapse,
  IconHomeHouse,
  IconVideoAgentWand,
  IconSceneBySceneCamera,
  IconSingleScenePortrait,
  IconTranslateLang,
  IconVoiceWave,
  IconGoldDiamond,
  IconOrbyBot,
} from '@heygen/ui/icons';
import { LogOut } from 'lucide-react';
import { GlobalModals } from './GlobalModals';

export function AppShell({
  children,
  showUpgradePill = false,
  hideFloatingOrby = false,
}: {
  children: React.ReactNode;
  showUpgradePill?: boolean;
  hideFloatingOrby?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const {
    initialized,
    bootstrap,
    organization,
    sidebarCollapsed,
    setSidebarCollapsed,
    accountMenuOpen,
    setAccountMenuOpen,
    setActiveModal,
    toastMessage,
  } = useHeyGenStore();

  useEffect(() => {
    if (!initialized) {
      bootstrap();
    }
  }, [initialized, bootstrap]);

  // Allow URL query ?drawer=open for automated visual diff testing of the mobile Navigation dialog
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get('drawer') === 'open') {
        setMobileNavOpen(true);
      }
    }
  }, [pathname]);

  // Determine active primary rail section
  const activeSection: 'home' | 'avatar' | 'brand' | 'apps' | 'projects' | 'developers' =
    pathname.startsWith('/avatar')
      ? 'avatar'
      : pathname.startsWith('/brand')
      ? 'brand'
      : pathname.startsWith('/apps') &&
        pathname !== '/apps/studio' &&
        pathname !== '/apps/video-agent' &&
        pathname !== '/apps/avatar-shots'
      ? 'apps'
      : pathname.startsWith('/projects')
      ? 'projects'
      : pathname.startsWith('/developers')
      ? 'developers'
      : 'home';

  const isDevelopersRoute = pathname.startsWith('/developers');

  // Observed mobile (<=479px) Ask Orby visibility per route from reference screenshots step_328..363
  const hideOrbyOnMobile479 =
    pathname === '/home/photo-to-video' ||
    pathname.startsWith('/apps/avatar-shots') ||
    pathname === '/home/studio' ||
    pathname === '/apps/studio' ||
    pathname.startsWith('/avatar/') ||
    pathname.startsWith('/projects');

  const renderContextualSubNav = (isMobileDialog = false) => {
    const itemWidthClass = isMobileDialog
      ? 'w-[176px]'
      : 'w-[176px] min-[1920px]:w-[224px]';

    const linkBaseClass = `${itemWidthClass} h-8 min-[1920px]:h-10 px-2 py-1 rounded-full flex items-center gap-4 text-[13px] transition-colors`;

    return (
      <>
        {activeSection === 'home' && (
          <nav aria-label="Create" className="flex flex-col gap-0.5">
            {[
              { href: '/home', label: 'Home', iconName: 'home-smile' },
              { href: '/home/video-agent', label: 'Video agent', iconName: 'magic' },
              { href: '/apps/studio', label: 'Scene by scene', iconName: 'video' },
              { href: '/home/photo-to-video', label: 'Single scene', iconName: 'image' },
              { href: '/home/translate', label: 'Translate', iconName: 'translate' },
            ].map((item) => {
              const active =
                pathname === item.href ||
                (item.href === '/apps/studio' && pathname === '/home/studio') ||
                (item.href === '/home/video-agent' && pathname === '/apps/video-agent') ||
                (item.href === '/home/photo-to-video' && pathname.startsWith('/apps/avatar-shots'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isMobileDialog && setMobileNavOpen(false)}
                  className={`${linkBaseClass} ${
                    active
                      ? 'bg-[#e3f4fa] text-[#232833] font-semibold'
                      : 'text-[#232833] hover:bg-[#eaecee] font-medium'
                  }`}
                >
                  <ReferenceIcon name={item.iconName} className="w-[16px] h-[16px] shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {activeSection === 'avatar' && (
          <nav aria-label="Manage Avatars" className="flex flex-col gap-0.5">
            {[
              { href: '/avatar/my-avatars', label: 'Avatars', iconName: 'avatar-menu' },
              { href: '/avatar/voices', label: 'Voices', iconName: 'voice' },
            ].map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isMobileDialog && setMobileNavOpen(false)}
                  className={`${linkBaseClass} ${
                    active
                      ? 'bg-[#e3f4fa] text-[#232833] font-semibold'
                      : 'text-[#232833] hover:bg-[#eaecee] font-medium'
                  }`}
                >
                  <ReferenceIcon name={item.iconName} className="w-[16px] h-[16px] shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {activeSection === 'brand' && (
          <div>
            <nav aria-label="Brand" className="flex flex-col gap-0.5">
              {[
                { href: '/brand', label: 'Brand Systems', iconName: 'brand-kit' },
                { href: '/brand/glossary', label: 'Brand Glossary', iconName: 'knowledge-base' },
              ].map((item) => {
                const active =
                  item.href === '/brand/glossary'
                    ? pathname === '/brand/glossary' || pathname === '/brand/brand_glossary'
                    : pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => isMobileDialog && setMobileNavOpen(false)}
                    className={`${linkBaseClass} ${
                      active
                        ? 'bg-[#e3f4fa] text-[#232833] font-semibold'
                        : 'text-[#232833] hover:bg-[#eaecee] font-medium'
                    }`}
                  >
                    <ReferenceIcon name={item.iconName} className="w-[16px] h-[16px] shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 pt-4 border-t border-[#eaecee] px-3 text-[12px] text-[#687080]">
              No brand systems yet
            </div>
          </div>
        )}

        {activeSection === 'apps' && (
          <div>
            <nav aria-label="Apps" className="flex flex-col gap-0.5">
              {[
                { href: '/apps', label: 'Home', iconName: 'home-smile' },
                { href: '/apps/integrations', label: 'Integrations', iconName: 'molecule' },
              ].map((item) => {
                const active =
                  item.href === '/apps'
                    ? pathname === '/apps'
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => isMobileDialog && setMobileNavOpen(false)}
                    className={`${linkBaseClass} ${
                      active
                        ? 'bg-[#e3f4fa] text-[#232833] font-semibold'
                        : 'text-[#232833] hover:bg-[#eaecee] font-medium'
                    }`}
                  >
                    <ReferenceIcon name={item.iconName} className="w-[16px] h-[16px] shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            {pathname !== '/apps' && (
              <div className="mt-4 pt-4 border-t border-[#eaecee] px-2">
                <div className="text-[11px] font-bold tracking-wider text-[#687080] uppercase mb-2">
                  RECENTS
                </div>
                <p className="text-[12px] text-[#687080] leading-snug">
                  Your recent outputs will appear here
                </p>
              </div>
            )}
          </div>
        )}

        {activeSection === 'projects' && (
          <nav aria-label="Projects" className="flex flex-col gap-0.5">
            <Link
              href="/projects"
              onClick={() => isMobileDialog && setMobileNavOpen(false)}
              className={`${linkBaseClass} ${
                pathname === '/projects'
                  ? 'bg-[#e3f4fa] text-[#232833] font-semibold'
                  : 'text-[#4e5666] hover:bg-[#eaecee] font-medium'
              }`}
            >
              <ReferenceIcon name="video-type" className="w-[16px] h-[16px] shrink-0" />
              <span>My Projects</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                if (isMobileDialog) setMobileNavOpen(false);
                router.push('/projects?newFolder=1');
              }}
              className={`${linkBaseClass} text-[#4e5666] hover:bg-[#eaecee] font-medium`}
            >
              <ReferenceIcon name="add-folder" className="w-[16px] h-[16px] shrink-0" />
              <span>New Folder</span>
            </button>
          </nav>
        )}

        {activeSection === 'developers' && (
          <nav aria-label="Developers" className="flex flex-col gap-0.5">
            {[
              { href: '/developers/api', label: 'Overview', iconName: 'home-smile' },
              { href: '/developers/billing', label: 'Billing', iconName: 'ds-billing' },
              { href: '/developers/usage', label: 'Usage', iconName: 'Chart' },
              { href: '/developers/models', label: 'Models', iconName: 'layer' },
              { href: '/developers/webhook', label: 'Webhook', iconName: 'send' },
              { href: '/developers/connections', label: 'Connections', iconName: 'link' },
            ].map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => isMobileDialog && setMobileNavOpen(false)}
                  className={`${linkBaseClass} ${
                    active
                      ? 'bg-[#e3f4fa] text-[#232833] font-semibold'
                      : 'text-[#232833] hover:bg-[#eaecee] font-medium'
                  }`}
                >
                  <ReferenceIcon name={item.iconName} className="w-[16px] h-[16px] shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="my-2 border-t border-[#eaecee]" />
            {[
              { label: 'API Doc', iconName: 'text-type' },
              { label: 'MCP', iconName: 'molecule' },
              { label: 'CLI', iconName: 'code' },
              { label: 'Skills', iconName: 'magic' },
              { label: 'Changelog', iconName: 'history' },
            ].map((ext) => (
              <Link
                key={ext.label}
                href="/developers/api"
                onClick={() => isMobileDialog && setMobileNavOpen(false)}
                className={`${itemWidthClass} h-8 px-2 py-1 rounded-full flex items-center justify-between text-[13px] text-[#232833] hover:bg-[#eaecee] font-medium`}
              >
                <span className="flex items-center gap-4">
                  <ReferenceIcon name={ext.iconName} className="w-[16px] h-[16px] shrink-0" />
                  <span>{ext.label}</span>
                </span>
                <ReferenceIcon name="arrow-up-right" className="w-[14px] h-[14px] text-[#687080]" />
              </Link>
            ))}
          </nav>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white text-[#232833] relative flex overflow-x-hidden">
      {/*
        Observed Reference Breakpoint Tiers (step_343.json, step_345.json, step_403.json):
        - <= 479px: Aside hidden (main at x=0); floating Toggle navigation button at (12, 16) opens 288px dual-column dialog "Navigation".
        - 480px - 649px: Primary 78px icon rail visible, secondary 208px sidebar hidden (main at x=96).
        - 650px - 1919px (includes 768x1024, 820x1180, 1024x1366, 1354x917, 1366x768, 1440x900): Dual sidebar 286px visible (main at x=304).
        - >= 1920px: Wide dual sidebar 334px visible (secondary 256px / 224px links, main at x=352).
      */}
      <aside
        className={`fixed top-[8px] bottom-[8px] left-[8px] z-30 box-content overflow-hidden rounded-[24px] bg-white/80 backdrop-blur-xl border border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hidden min-[480px]:flex transition-[width] duration-250 ease-in-out ${
          sidebarCollapsed
            ? 'w-[78px]'
            : 'w-[78px] min-[650px]:w-[286px] min-[1920px]:w-[334px]'
        }`}
      >
        {/* Primary Left Icon Rail (78px, nav1 at x=22.67, y=19, w=49.66, h=409 in step_403.json & step_526.json) */}
        <div
          data-pacific-component="Rail"
          className="w-[78px] h-full flex flex-col items-center justify-between pt-[10px] pb-[18px] shrink-0 overflow-x-hidden overflow-y-auto no-scrollbar select-none"
        >
          <nav
            aria-label="Main navigation"
            className="w-[49.66px] flex flex-col items-center gap-[4px]"
          >
            {/* Expand navigation row (First item inside Main navigation when collapsed on >=650px per step_528.json: 49.66x48 @ x=22.67, y=15; button 32x32 @ x=31.5, y=23) */}
            {sidebarCollapsed && (
              <div className="hidden min-[650px]:flex h-12 w-full items-center justify-center overflow-hidden -mt-1 -mb-1 max-h-12 opacity-100 transition-[max-height,margin,opacity] duration-250 ease-in-out">
                <button
                  type="button"
                  aria-label="Expand navigation"
                  onClick={() => setSidebarCollapsed(false)}
                  className="flex shrink-0 cursor-pointer items-center justify-center w-8 h-8 min-[1920px]:w-10 min-[1920px]:h-10 rounded-full bg-white shadow text-[#687080] transition-colors hover:bg-[#f2f3f5] hover:text-[#232833]"
                >
                  <IconSidebarCollapse className="w-[18px] h-[18px] min-[1920px]:w-6 min-[1920px]:h-6 shrink-0" />
                </button>
              </div>
            )}

            {/* 1. Home (48x76px at y=19) */}
            <Link
              href="/home"
              className="group relative flex flex-col items-center justify-center rounded-lg px-1 py-2 w-[48px] h-[76px] transition-all duration-200"
            >
              <div
                className={`w-[40px] h-[40px] rounded-[12px] flex items-center justify-center transition-all ${
                  activeSection === 'home'
                    ? 'bg-gradient-to-br from-[#2ecfff] via-[#7559ff] to-[#ff5993] p-[5px] shadow-[0_4px_12px_rgba(0,196,255,0.28)]'
                    : 'hover:bg-[#f2f3f5]'
                }`}
              >
                <img
                  src="/heygen-assets/logos/PRISM_ORB.svg"
                  alt="HeyGen"
                  className="w-[28px] h-[28px] object-contain"
                />
              </div>
              <span
                className={`mt-1.5 text-[11px] leading-[14px] font-semibold ${
                  activeSection === 'home' ? 'text-[#00a7d9]' : 'text-[#4e5666]'
                }`}
              >
                Home
              </span>
            </Link>

            {/* 2. Avatar (48x76px at y=99) */}
            <Link
              href="/avatar/my-avatars"
              className="group relative flex flex-col items-center justify-center rounded-lg px-1 py-2 w-[48px] h-[76px] transition-all duration-200"
            >
              <div
                className={`w-[40px] h-[40px] rounded-[12px] flex items-center justify-center transition-all ${
                  activeSection === 'avatar'
                    ? 'bg-[#00c4ff] text-white shadow-[0_4px_12px_rgba(0,196,255,0.25)]'
                    : 'text-[#4e5666] group-hover:bg-[#f2f3f5] group-hover:text-[#232833]'
                }`}
              >
                <IconAvatarNav className="w-[24px] h-[24px]" />
              </div>
              <span
                className={`mt-1.5 text-[11px] leading-[14px] font-medium ${
                  activeSection === 'avatar' ? 'text-[#00a7d9] font-semibold' : 'text-[#4e5666]'
                }`}
              >
                Avatar
              </span>
            </Link>

            {/* 3. Brand (48x76px at y=179) */}
            <Link
              href="/brand"
              className="group relative flex flex-col items-center justify-center rounded-lg px-1 py-2 w-[48px] h-[76px] transition-all duration-200"
            >
              <div
                className={`w-[40px] h-[40px] rounded-[12px] flex items-center justify-center transition-all ${
                  activeSection === 'brand'
                    ? 'bg-[#f3a6ff] text-[#232833] shadow-[0_4px_12px_rgba(243,166,255,0.3)]'
                    : 'text-[#4e5666] group-hover:bg-[#f2f3f5] group-hover:text-[#232833]'
                }`}
              >
                <IconBrandNav className="w-[24px] h-[24px]" />
              </div>
              <span
                className={`mt-1.5 text-[11px] leading-[14px] font-medium ${
                  activeSection === 'brand' ? 'text-[#c259ff] font-semibold' : 'text-[#4e5666]'
                }`}
              >
                Brand
              </span>
            </Link>

            {/* 4. Apps (48x76px at y=259) */}
            <Link
              href="/apps"
              className="group relative flex flex-col items-center justify-center rounded-lg px-1 py-2 w-[48px] h-[76px] transition-all duration-200"
            >
              <div
                className={`w-[40px] h-[40px] rounded-[12px] flex items-center justify-center transition-all ${
                  activeSection === 'apps'
                    ? 'bg-[#2b2d33] text-white shadow-sm'
                    : 'text-[#4e5666] group-hover:bg-[#f2f3f5] group-hover:text-[#232833]'
                }`}
              >
                <IconAppsNav className="w-[24px] h-[24px]" />
              </div>
              <span
                className={`mt-1.5 text-[11px] leading-[14px] font-medium ${
                  activeSection === 'apps' ? 'text-[#232833] font-semibold' : 'text-[#4e5666]'
                }`}
              >
                Apps
              </span>
            </Link>

            {/* Subtle horizontal rule before Projects (17px total offset from y=335 to y=352) */}
            <div className="w-7 h-[1px] bg-[#eaecee] my-[4px]" />

            {/* 5. Projects (49.66x76px at y=352) */}
            <Link
              href="/projects"
              className="group relative flex flex-col items-center justify-center rounded-lg px-1 py-2 w-[49.66px] h-[76px] transition-all duration-200"
            >
              <div
                className={`w-[40px] h-[40px] rounded-[12px] flex items-center justify-center transition-all ${
                  activeSection === 'projects'
                    ? 'bg-[#2b2d33] text-white shadow-sm'
                    : 'text-[#4e5666] group-hover:bg-[#f2f3f5] group-hover:text-[#232833]'
                }`}
              >
                <IconProjectsNav className="w-[24px] h-[24px]" />
              </div>
              <span
                className={`mt-1.5 text-[11px] leading-[14px] font-medium ${
                  activeSection === 'projects' ? 'text-[#232833] font-semibold' : 'text-[#4e5666]'
                }`}
              >
                Projects
              </span>
            </Link>
          </nav>

          {/* Bottom Utility Stack (Plans & Pricing 64x64 at y=748, Account menu 35.2x35.2 at y=831.4) */}
          <div className="flex flex-col items-center gap-[8px]">
            <Link
              href="/developers/api"
              title="Developers & API"
              className={`w-[44px] h-[44px] rounded-lg flex items-center justify-center transition-colors ${
                activeSection === 'developers'
                  ? 'bg-[#2b2d33] text-white'
                  : 'text-[#687080] hover:bg-[#f2f3f5] hover:text-[#232833]'
              }`}
            >
              <IconDevelopersNav className="w-[22px] h-[22px]" />
            </Link>

            <button
              type="button"
              title="Plans & Pricing"
              aria-label="Plans & Pricing"
              onClick={() => setActiveModal('upgrade')}
              className="group relative flex cursor-pointer flex-col items-center justify-center rounded-lg px-2 py-2 w-[64px] h-[64px] transition-all duration-200"
            >
              <div className="relative w-[48px] h-[48px] flex items-center justify-center">
                <RefIconPlansProgressRing className="absolute inset-0 text-[#00c4ff]" />
                <IconGoldDiamond className="w-[18px] h-[18px]" />
              </div>
            </button>

            <button
              type="button"
              aria-label="Account menu"
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="w-[35.2px] h-[35.2px] rounded-full bg-[#f0f2f5] hover:bg-[#e2e5ea] flex items-center justify-center overflow-hidden transition-colors"
            >
              <ReferenceIcon name="user" className="w-[18px] h-[18px] text-[#bcc1cc]" />
            </button>
          </div>
        </div>

        {/* Secondary Contextual Sidebar (208px at 650-1919px, 256px at >=1920px; hidden at <650px) */}
        {!sidebarCollapsed && (
          <div className="hidden min-[650px]:flex w-[208px] min-[1920px]:w-[256px] h-full shrink-0 flex-col justify-between px-4 py-3 pb-[18px] select-none">
            <div>
              {/* Heading row at x=103, y=21, w=176, h=36; Collapse navigation button at x=247, y=25, w=32, h=32 in step_526.json */}
              <div className="mb-2 flex w-full items-center justify-between pl-2 pt-1 h-[36px]">
                <span className="text-[13px] leading-[20px] font-semibold text-[#4e5666] truncate">
                  {activeSection === 'home' && 'Create'}
                  {activeSection === 'avatar' && 'Manage Avatars'}
                  {activeSection === 'brand' && 'Brand'}
                  {activeSection === 'apps' && 'Apps'}
                  {activeSection === 'projects' && 'Projects'}
                  {activeSection === 'developers' && 'Developers'}
                </span>
                <button
                  type="button"
                  aria-label="Collapse navigation"
                  onClick={() => setSidebarCollapsed(true)}
                  className="flex shrink-0 cursor-pointer items-center justify-center w-8 h-8 min-[1920px]:w-10 min-[1920px]:h-10 rounded-full text-[#687080] transition-colors hover:bg-[#f2f3f5] hover:text-[#232833]"
                >
                  <IconSidebarCollapse className="w-[18px] h-[18px] min-[1920px]:w-6 min-[1920px]:h-6 shrink-0" />
                </button>
              </div>

              {renderContextualSubNav(false)}
            </div>

            {activeSection === 'projects' && (
              <div className="pt-3 border-t border-[#eaecee]">
                <Link
                  href="/projects/trash"
                  className={`w-[176px] min-[1920px]:w-[224px] h-8 px-2 py-1 rounded-full flex items-center gap-4 text-[13px] transition-colors ${
                    pathname === '/projects/trash'
                      ? 'bg-[#e3f4fa] text-[#232833] font-semibold'
                      : 'text-[#4e5666] hover:bg-[#eaecee] font-medium'
                  }`}
                >
                  <ReferenceIcon name="delete" className="w-[16px] h-[16px] shrink-0" />
                  <span>Trash</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </aside>

      {/*
        Exact Mobile Floating "Toggle navigation" Button at <= 479px
        Observed at x=12px, y=16px (or y=52px on /developers/* below 40px Beta banner), 40x40px circle
      */}
      {!mobileNavOpen && (
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileNavOpen(true)}
          className={`min-[480px]:hidden fixed left-[12px] ${
            isDevelopersRoute ? 'top-[52px]' : 'top-[16px]'
          } z-30 w-[40px] h-[40px] rounded-full bg-white border border-[#eaecee] shadow-[0_2px_10px_rgba(0,0,0,0.06)] flex items-center justify-center`}
        >
          <div className="pointer-events-none relative w-[16px] h-[13px] flex flex-col justify-between items-start">
            <span className="w-[14px] h-[1.75px] rounded-full bg-[#4e5666]" />
            <span className="w-[16px] h-[1.75px] rounded-full bg-[#4e5666]" />
            <span className="w-[11px] h-[1.75px] rounded-full bg-[#4e5666]" />
            <span className="absolute -top-[3px] -right-[2px] w-[7px] h-[7px] rounded-full bg-[#df4b40] ring-2 ring-white" />
          </div>
        </button>
      )}

      {/*
        Exact Mobile "Navigation" Dual-Column Dialog at <= 479px
        288px wide, top: 8px, bottom: 8px, left: 8px, rounded-[20px]
      */}
      {mobileNavOpen && (
        <div
          className="min-[480px]:hidden fixed inset-0 z-50 bg-[#0f1219]/35"
          onClick={() => setMobileNavOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="fixed top-[8px] bottom-[8px] left-[8px] w-[288px] max-w-[calc(100vw-16px)] rounded-[20px] bg-white border border-[#eaecee] shadow-[0_12px_36px_rgba(0,0,0,0.16)] flex overflow-hidden select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left 74px Primary Rail inside Mobile Dialog */}
            <div className="w-[74px] h-full flex flex-col items-center justify-between pt-[14px] pb-[18px] shrink-0">
              <nav aria-label="Main navigation" className="w-[56px] flex flex-col items-center gap-[10px]">
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setMobileNavOpen(false)}
                  className="w-[34px] h-[34px] rounded-full hover:bg-[#f2f3f5] flex items-center justify-center text-[#232833] mb-1"
                >
                  <ReferenceIcon name="close" className="w-[18px] h-[18px]" />
                </button>

                {/* 1. Home */}
                <Link
                  href="/home"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex flex-col items-center gap-1 w-full"
                >
                  <div
                    className={`w-[40px] h-[40px] rounded-[13px] flex items-center justify-center ${
                      activeSection === 'home'
                        ? 'bg-gradient-to-br from-[#2ecfff] via-[#7559ff] to-[#ff5993] p-[5px] shadow-[0_4px_12px_rgba(0,196,255,0.28)]'
                        : 'hover:bg-[#f2f3f5]'
                    }`}
                  >
                    <img
                      src="/heygen-assets/logos/PRISM_ORB.svg"
                      alt="HeyGen"
                      className="w-[28px] h-[28px] object-contain"
                    />
                  </div>
                  <span
                    className={`text-[11px] leading-[13px] font-semibold ${
                      activeSection === 'home' ? 'text-[#00a7d9]' : 'text-[#4e5666]'
                    }`}
                  >
                    Home
                  </span>
                </Link>

                {/* 2. Avatar */}
                <Link
                  href="/avatar/my-avatars"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex flex-col items-center gap-1 w-full"
                >
                  <div
                    className={`w-[38px] h-[38px] rounded-[12px] flex items-center justify-center ${
                      activeSection === 'avatar'
                        ? 'bg-[#00c4ff] text-white'
                        : 'text-[#232833] hover:bg-[#f2f3f5]'
                    }`}
                  >
                    <IconAvatarNav className="w-[22px] h-[22px]" />
                  </div>
                  <span className="text-[11px] leading-[13px] font-medium text-[#4e5666]">
                    Avatar
                  </span>
                </Link>

                {/* 3. Video Agent */}
                <Link
                  href="/home/video-agent"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex flex-col items-center gap-1 w-full"
                >
                  <div className="w-[38px] h-[38px] rounded-[12px] flex items-center justify-center text-[#232833] hover:bg-[#f2f3f5]">
                    <IconVideoAgentWand className="w-[20px] h-[20px]" />
                  </div>
                  <span className="text-[10.5px] leading-[12px] font-medium text-[#4e5666] whitespace-nowrap">
                    Video Agent
                  </span>
                </Link>

                {/* 4. Brand */}
                <Link
                  href="/brand"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex flex-col items-center gap-1 w-full"
                >
                  <div
                    className={`w-[38px] h-[38px] rounded-[12px] flex items-center justify-center ${
                      activeSection === 'brand'
                        ? 'bg-[#f3a6ff] text-[#232833]'
                        : 'text-[#232833] hover:bg-[#f2f3f5]'
                    }`}
                  >
                    <IconBrandNav className="w-[22px] h-[22px]" />
                  </div>
                  <span className="text-[11px] leading-[13px] font-medium text-[#4e5666]">
                    Brand
                  </span>
                </Link>

                {/* 5. Apps */}
                <Link
                  href="/apps"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex flex-col items-center gap-1 w-full"
                >
                  <div
                    className={`w-[38px] h-[38px] rounded-[12px] flex items-center justify-center ${
                      activeSection === 'apps'
                        ? 'bg-[#2b2d33] text-white'
                        : 'text-[#232833] hover:bg-[#f2f3f5]'
                    }`}
                  >
                    <IconAppsNav className="w-[22px] h-[22px]" />
                  </div>
                  <span className="text-[11px] leading-[13px] font-medium text-[#4e5666]">
                    Apps
                  </span>
                </Link>

                <div className="w-7 h-[1px] bg-[#eaecee] my-0.5" />

                {/* 6. Projects */}
                <Link
                  href="/projects"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex flex-col items-center gap-1 w-full"
                >
                  <div
                    className={`w-[38px] h-[38px] rounded-[12px] flex items-center justify-center ${
                      activeSection === 'projects'
                        ? 'bg-[#2b2d33] text-white'
                        : 'text-[#232833] hover:bg-[#f2f3f5]'
                    }`}
                  >
                    <IconProjectsNav className="w-[22px] h-[22px]" />
                  </div>
                  <span className="text-[11px] leading-[13px] font-medium text-[#4e5666]">
                    Projects
                  </span>
                </Link>
              </nav>

              {/* Bottom Stack inside Mobile Dialog */}
              <div className="flex flex-col items-center gap-[10px]">
                <Link
                  href="/developers/api"
                  onClick={() => setMobileNavOpen(false)}
                  title="Developers"
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[#232833] hover:bg-[#f2f3f5]"
                >
                  <IconDevelopersNav className="w-[18px] h-[18px]" />
                </Link>
                <button
                  type="button"
                  aria-label="Plans & Pricing"
                  onClick={() => {
                    setMobileNavOpen(false);
                    setActiveModal('upgrade');
                  }}
                  className="relative w-[42px] h-[42px] flex items-center justify-center"
                >
                  <RefIconPlansProgressRing className="absolute inset-0 text-[#00c4ff] w-[42px] h-[42px]" />
                  <IconGoldDiamond className="w-[15px] h-[15px]" />
                </button>
                <button
                  type="button"
                  aria-label="Account menu"
                  onClick={() => {
                    setMobileNavOpen(false);
                    setAccountMenuOpen(!accountMenuOpen);
                  }}
                  className="w-[34px] h-[34px] rounded-full bg-[#f0f2f5] flex items-center justify-center"
                >
                  <ReferenceIcon name="user" className="w-[18px] h-[18px] text-[#bcc1cc]" />
                </button>
              </div>
            </div>

            {/* Right 214px Contextual Column inside Mobile Dialog */}
            <div className="flex-1 h-full flex flex-col justify-between pt-[14px] pb-[18px] px-[12px]">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileNavOpen(false);
                    setActiveModal('orby');
                  }}
                  className="h-[40px] pl-1 pr-4 rounded-full bg-white border border-transparent shadow-[0_2px_4px_-2px_rgba(0,0,0,0.06),0_4px_8px_-2px_rgba(0,0,0,0.1)] flex items-center gap-2 mb-[18px]"
                >
                  <IconOrbyBot className="w-[30px] h-[30px]" />
                  <span className="text-[14px] font-semibold text-[#4e5666]">Ask Orby</span>
                </button>

                <div className="px-2 mb-[12px]">
                  <h2 className="text-[13px] font-semibold text-[#4e5666]">
                    {activeSection === 'home' && 'Create'}
                    {activeSection === 'avatar' && 'Manage Avatars'}
                    {activeSection === 'brand' && 'Brand'}
                    {activeSection === 'apps' && 'Apps'}
                    {activeSection === 'projects' && 'Projects'}
                    {activeSection === 'developers' && 'Developers'}
                  </h2>
                </div>

                {renderContextualSubNav(true)}
              </div>

              {activeSection === 'projects' && (
                <div className="pt-3 border-t border-[#eaecee]">
                  <Link
                    href="/projects/trash"
                    onClick={() => setMobileNavOpen(false)}
                    className="w-[176px] h-8 px-2 py-1 rounded-full flex items-center gap-4 text-[13px] text-[#4e5666] hover:bg-[#eaecee] font-medium"
                  >
                    <ReferenceIcon name="delete" className="w-[16px] h-[16px] shrink-0" />
                    <span>Trash</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Account Menu Popover */}
      {accountMenuOpen && (
        <div
          className="fixed left-[68px] bottom-[16px] z-50 w-[200px] rounded-[18px] bg-white border border-[#eaecee] shadow-[0_10px_32px_rgba(0,0,0,0.12)] py-2 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setActiveModal('settings', 'General')}
            className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-[#f7f8fa] transition-colors"
          >
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-7 h-7 rounded-full bg-[#f2f3f5] flex items-center justify-center text-[11px] font-bold text-[#687080]">
                {organization?.name?.slice(0, 1) || 'D'}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-[#232833] leading-tight">
                  {organization?.name || 'Default Space'}
                </div>
                <div className="text-[11px] text-[#687080] flex items-center gap-1 mt-0.5 capitalize">
                  <span>1</span>
                  <span>·</span>
                  <span>{organization?.plan_tier || 'Free'} plan</span>
                </div>
              </div>
            </div>
            <ReferenceIcon name="right" className="w-3.5 h-3.5 text-[#687080]" />
          </button>

          <div className="my-1.5 border-t border-[#eaecee]" />

          <button
            type="button"
            onClick={() => setActiveModal('upgrade')}
            className="w-full h-9 px-4 flex items-center gap-2.5 text-[13px] font-semibold text-[#232833] hover:bg-[#f7f8fa]"
          >
            <IconGoldDiamond className="w-4 h-4" />
            <span>Upgrade Plan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('settings', 'Account')}
            className="w-full h-9 px-4 flex items-center gap-2.5 text-[13px] font-semibold text-[#232833] hover:bg-[#f7f8fa]"
          >
            <ReferenceIcon name="settings" className="w-4 h-4 text-[#232833]" />
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('orby')}
            className="w-full h-9 px-4 flex items-center justify-between text-[13px] font-semibold text-[#232833] hover:bg-[#f7f8fa]"
          >
            <span className="flex items-center gap-2.5">
              <ReferenceIcon name="help" className="w-4 h-4 text-[#232833]" />
              <span>Help</span>
            </span>
            <ReferenceIcon name="right" className="w-3.5 h-3.5 text-[#687080]" />
          </button>

          <div className="my-1.5 border-t border-[#eaecee]" />

          <button
            type="button"
            onClick={() => setActiveModal('signin')}
            className="w-full h-9 px-4 flex items-center gap-2.5 text-[13px] font-semibold text-[#232833] hover:bg-[#f7f8fa]"
          >
            <LogOut className="w-4 h-4 text-[#232833]" />
            <span>Log out</span>
          </button>
        </div>
      )}

      {/* Top-Right Floating Pills (Ask Orby at x=1197.5, y=24, w=132.5, h=40 on 1354x917 per step_459.json) */}
      {!hideFloatingOrby && (
        <div
          className={`fixed ${
            isDevelopersRoute
              ? 'top-[52px] min-[480px]:top-[52px]'
              : 'top-[16px] min-[480px]:top-[24px]'
          } right-[16px] min-[480px]:right-[24px] z-30 items-center gap-2.5 select-none ${
            hideOrbyOnMobile479 ? 'hidden min-[480px]:flex' : 'flex'
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveModal('orby')}
            className="relative h-10 pl-1 pr-4 rounded-full bg-white border border-transparent text-[14px] font-semibold text-[#4e5666] hover:text-[#232833] shadow-[0_2px_4px_-2px_rgba(0,0,0,0.06),0_4px_8px_-2px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <IconOrbyBot className="w-[30px] h-[30px]" />
            <span>Ask Orby</span>
          </button>

          {showUpgradePill && (
            <button
              type="button"
              onClick={() => setActiveModal('upgrade')}
              className="hidden min-[480px]:flex h-10 px-4 rounded-full bg-white border border-transparent shadow-[0_2px_4px_-2px_rgba(0,0,0,0.06),0_4px_8px_-2px_rgba(0,0,0,0.1)] items-center gap-2 transition-colors"
            >
              <IconGoldDiamond className="w-4 h-4" />
              <span className="text-[14px] font-semibold text-[#4e5666]">Upgrade</span>
            </button>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 min-w-0 min-h-screen transition-all duration-200 ${
          sidebarCollapsed
            ? 'min-[480px]:pl-[96px]'
            : 'min-[480px]:pl-[96px] min-[650px]:pl-[304px] min-[1920px]:pl-[352px]'
        }`}
        onClick={() => {
          if (accountMenuOpen) setAccountMenuOpen(false);
        }}
      >
        {children}
      </main>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full bg-[#19191a] text-white text-[13px] font-semibold shadow-xl flex items-center gap-2.5 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#00c4ff]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Interactive Modals */}
      <GlobalModals />
    </div>
  );
}

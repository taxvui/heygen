'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/shell/AppShell';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import { ProjectRecord } from '@/lib/db/types';
import { ReferenceIcon } from '@heygen/ui/icons';
import {
  Search,
  Filter,
  List,
  ArrowUpDown,
  Copy,
  Trash2,
  Edit3,
  Folder,
  Upload,
  Play,
  History,
  Link2,
  ArrowLeft,
  ChevronRight,
  Lock,
  X,
  Check,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';

const PROJECT_TABS = [
  { id: 'all', label: 'My Projects' },
  { id: 'avatar_video', label: 'Avatar Video' },
  { id: 'video_agent', label: 'Agent' },
  { id: 'translation', label: 'Translations' },
  { id: 'studio', label: 'Apps' },
  { id: 'assets', label: 'Assets' },
] as const;

export function ProjectsPageContent({ forcedTrash = false }: { forcedTrash?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isTrashView =
    forcedTrash || pathname === '/projects/trash' || searchParams.get('tab') === 'trash';
  const fileUploadRef = useRef<HTMLInputElement | null>(null);

  const {
    projects,
    projectVersions,
    assets,
    setActiveStudioProject,
    bootstrap,
    showToast,
  } = useHeyGenStore();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Toolbar Popover States matching step_278_shot_2..4.png
  const [openMenu, setOpenMenu] = useState<'filter' | 'view' | 'sort' | null>(null);
  const [filterCompleted, setFilterCompleted] = useState(false);
  const [filterDrafts, setFilterDrafts] = useState(false);
  const [viewOption, setViewOption] = useState<'Date View' | 'Grid View' | 'List View'>('Date View');
  const [sortByField, setSortByField] = useState<'By Last Modified' | 'By Creation Date'>(
    'By Last Modified'
  );
  const [sortDirection, setSortDirection] = useState<'Descending' | 'Ascending'>('Descending');

  // Create a folder modal state matching step_278_shot_5.png
  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showWorkspaceProjects, setShowWorkspaceProjects] = useState(false);

  useEffect(() => {
    if (searchParams.get('newFolder') === '1') {
      setNewFolderModalOpen(true);
    }
    if (searchParams.get('showProjects') === '1') {
      setShowWorkspaceProjects(true);
    }
    const menuParam = searchParams.get('menu');
    if (menuParam === 'filter' || menuParam === 'view' || menuParam === 'sort') {
      setOpenMenu(menuParam);
    }
  }, [searchParams]);

  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState('');
  const [versionModalProject, setVersionModalProject] = useState<ProjectRecord | null>(null);
  const [assetTypeFilter, setAssetTypeFilter] = useState<'all' | 'image' | 'video' | 'audio'>('all');

  const filteredProjects = projects
    .filter((p) => {
      if (isTrashView) return p.status === 'trashed';
      if (p.status === 'trashed') return false;
      if (selectedFolder !== 'All' && p.folder_name !== selectedFolder) return false;
      if (activeTab !== 'all' && activeTab !== 'assets' && p.project_type !== activeTab) {
        return false;
      }
      if (filterCompleted && !filterDrafts && p.status !== 'completed') return false;
      if (filterDrafts && !filterCompleted && p.status === 'completed') return false;
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const timeA = new Date(
        sortByField === 'By Creation Date' ? a.created_at : a.updated_at
      ).getTime();
      const timeB = new Date(
        sortByField === 'By Creation Date' ? b.created_at : b.updated_at
      ).getTime();
      return sortDirection === 'Descending' ? timeB - timeA : timeA - timeB;
    });

  const filteredAssets = assets.filter((a) => {
    if (assetTypeFilter !== 'all' && a.asset_type !== assetTypeFilter) return false;
    if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalAssetStorageBytes = assets.reduce((acc, a) => acc + (a.size_bytes || 0), 0);

  const handleSaveNewFolder = async () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `${trimmed} — Starter Video`,
        folder_name: trimmed,
        project_type: 'studio',
      }),
    });
    await bootstrap();
    setSelectedFolder(trimmed);
    setNewFolderName('');
    setNewFolderModalOpen(false);
    showToast(`Created folder "${trimmed}"`);
  };

  const handleDuplicateProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'duplicate', project_id: projectId }),
    });
    if (res.ok) {
      await bootstrap();
      showToast('Project duplicated');
    }
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await fetch(
      `/api/projects?id=${projectId}&permanent=${isTrashView ? 'true' : 'false'}`,
      { method: 'DELETE' }
    );
    if (res.ok) {
      await bootstrap();
      showToast(isTrashView ? 'Project permanently deleted' : 'Project moved to Trash');
    }
  };

  const handleRenameSubmit = async (projectId: string) => {
    if (!renameText.trim()) {
      setRenamingId(null);
      return;
    }
    await fetch('/api/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, title: renameText }),
    });
    setRenamingId(null);
    await bootstrap();
    showToast('Project renamed');
  };

  const handleUploadAssetFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'Uploads');
    const res = await fetch('/api/assets', {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      await bootstrap();
      showToast(`Uploaded asset "${file.name}"`);
    }
  };

  // TRASH SUB-VIEW (Exact match to step_278_shot_6.png)
  if (isTrashView) {
    return (
      <div className="w-full max-w-[1080px] pt-[24px] pb-16 px-4 sm:px-[32px]">
        {/* Top Breadcrumb Header */}
        <div className="pb-4 border-b border-[#eaecee] flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.push('/projects')}
            className="w-[32px] h-[32px] rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] flex items-center justify-center text-[#232833]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => router.push('/projects')}
            className="flex items-center gap-1.5 text-[14px] font-bold text-[#232833] hover:opacity-80"
          >
            <Folder className="w-4 h-4 text-[#687080]" />
            <span>Projects</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#8c93a3]" />
          <span className="text-[14px] font-bold text-[#232833]">Trash</span>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="mt-[135px] flex flex-col items-center justify-center text-center select-none">
            {/* Cyan folder + magnifying glass illustration matching step_278_shot_6.png */}
            <div className="relative w-[76px] h-[64px] mb-3 flex items-center justify-center">
              <div className="w-[54px] h-[40px] rounded-[8px] bg-[#bfefff] border border-[#7be3ff] relative">
                <div className="absolute -top-2 left-0 w-[22px] h-[10px] rounded-t-[5px] bg-[#9ae5ff]" />
              </div>
              <div className="absolute -top-1 right-1 w-[28px] h-[28px] rounded-full border-[2.5px] border-[#5fd9ff] bg-white/80 flex items-center justify-center">
                <div className="w-[10px] h-[2.5px] bg-[#5fd9ff] absolute -bottom-1.5 -right-2 rotate-45 rounded-full" />
              </div>
            </div>
            <div className="text-[13.5px] font-bold text-[#4e5666]">No deleted videos found</div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="rounded-[18px] bg-white border border-[#eaecee] p-4 flex items-center justify-between"
              >
                <div>
                  <div className="text-[14px] font-bold text-[#232833]">{proj.title}</div>
                  <div className="text-[12px] text-[#687080]">Trashed video</div>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDeleteProject(proj.id, e)}
                  className="px-3 py-1.5 rounded-full border border-[#feb2b2] text-[#e54945] text-[12px] font-bold"
                >
                  Delete Forever
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-[1080px] pt-[74px] min-[480px]:pt-[30px] pb-16 px-4 sm:px-[32px]"
      onClick={() => {
        if (openMenu) setOpenMenu(null);
      }}
    >
      {/* Page Title matching step_34_shot_2.png & step_278_shot_1.png (hidden on <=479px per step_349_shot_4) */}
      <div className="hidden min-[480px]:flex items-center justify-between mb-[22px]">
        <h1 className="font-solar-display text-[32px] leading-[38px] font-bold tracking-[-0.01em] text-[#232833]">
          Projects
        </h1>
      </div>

      {/* Horizontal Filter Tabs + Right Action Circle Buttons (On <=479px, Search + Utility Buttons row is above Tabs matching step_349_shot_4) */}
      <div className="flex flex-col-reverse min-[480px]:flex-row flex-wrap items-stretch min-[480px]:items-center justify-between gap-4 mb-[24px]">
        <div className="flex flex-nowrap min-[480px]:flex-wrap items-center gap-5 sm:gap-7 overflow-x-auto no-scrollbar">
          {PROJECT_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowWorkspaceProjects(true);
                }}
                className={`relative pb-2 text-[14.5px] font-bold whitespace-nowrap transition-colors ${
                  active ? 'text-[#232833]' : 'text-[#687080] hover:text-[#232833]'
                }`}
              >
                <span>{tab.label}</span>
                {active && (
                  <span className="absolute left-0 right-0 bottom-0 h-[2.5px] rounded-full bg-[#00c4ff]" />
                )}
              </button>
            );
          })}
        </div>

        {/* 4 Circular Utility Buttons + Floating Popover Menus matching step_278_shot_2..4.png & step_349_shot_4 */}
        <div
          className="relative flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* On mobile <=479px, search input is always expanded on the left of the utility buttons (step_349_shot_4) */}
          <div className="relative flex-1 min-[480px]:hidden">
            <ReferenceIcon name="Search" className="w-4 h-4 text-[#687080] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowWorkspaceProjects(true);
              }}
              placeholder="Search Assets"
              className="w-full h-[38px] pl-9 pr-3.5 rounded-full border border-[#e2e3e6] text-[13px] text-[#232833] placeholder:text-[#8c93a3] focus:outline-none"
            />
          </div>

          <button
            type="button"
            aria-label="Upload"
            onClick={() => fileUploadRef.current?.click()}
            className="min-[480px]:hidden w-[38px] h-[38px] rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] flex items-center justify-center text-[#232833]"
          >
            <ReferenceIcon name="upload-one" className="w-4 h-4" />
          </button>

          {searchOpen && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowWorkspaceProjects(true);
              }}
              placeholder="Search projects or assets..."
              className="hidden min-[480px]:block h-[36px] px-3.5 rounded-full border border-[#00c4ff] text-[12.5px] focus:outline-none"
            />
          )}

          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen(!searchOpen)}
            className="hidden min-[480px]:flex w-[36px] h-[36px] rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] items-center justify-center text-[#232833]"
          >
            <ReferenceIcon name="Search" className="w-4 h-4" />
          </button>

          {/* Filter projects button + popover (step_278_shot_2.png) */}
          <div className="relative">
            <button
              type="button"
              aria-label="Filter projects"
              onClick={() => setOpenMenu(openMenu === 'filter' ? null : 'filter')}
              className={`w-[38px] h-[38px] min-[480px]:w-[36px] min-[480px]:h-[36px] rounded-full border flex items-center justify-center transition-colors ${
                openMenu === 'filter'
                  ? 'bg-[#e6e8ec] border-[#dcdFE6] text-[#232833]'
                  : 'border-[#e2e3e6] hover:bg-[#f7f8fa] text-[#232833]'
              }`}
            >
              <ReferenceIcon name="filter" className="w-4 h-4" />
            </button>

            {openMenu === 'filter' && (
              <div
                role="dialog"
                aria-label="Filter projects"
                className="absolute right-0 top-[44px] z-40 w-[224px] rounded-[16px] bg-white border border-[#eaecee] shadow-[0_10px_28px_rgba(15,18,25,0.1)] p-4 select-none"
              >
                <div className="text-[11.5px] font-semibold text-[#687080] mb-3">Filters</div>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2.5 cursor-pointer text-[13px] font-medium text-[#232833]">
                    <input
                      type="checkbox"
                      checked={filterCompleted}
                      onChange={(e) => setFilterCompleted(e.target.checked)}
                      className="w-4 h-4 rounded border-[#d0d5dd] accent-[#00c4ff]"
                    />
                    <span>Completed Videos</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-[13px] font-medium text-[#232833]">
                    <input
                      type="checkbox"
                      checked={filterDrafts}
                      onChange={(e) => setFilterDrafts(e.target.checked)}
                      className="w-4 h-4 rounded border-[#d0d5dd] accent-[#00c4ff]"
                    />
                    <span>Drafts &amp; Proofreads</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* View button + popover (step_278_shot_3.png) */}
          <div className="relative hidden min-[480px]:block">
            <button
              type="button"
              aria-label="View"
              onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}
              className={`w-[36px] h-[36px] rounded-full border flex items-center justify-center transition-colors ${
                openMenu === 'view'
                  ? 'bg-[#e6e8ec] border-[#dcdFE6] text-[#232833]'
                  : 'border-[#e2e3e6] hover:bg-[#f7f8fa] text-[#232833]'
              }`}
            >
              <ReferenceIcon name="list-view" className="w-4 h-4" />
            </button>

            {openMenu === 'view' && (
              <div
                role="dialog"
                aria-label="View options"
                className="absolute right-0 top-[44px] z-40 w-[224px] rounded-[16px] bg-white border border-[#eaecee] shadow-[0_10px_28px_rgba(15,18,25,0.1)] p-3.5 space-y-2.5 select-none"
              >
                {(['Date View', 'Grid View', 'List View'] as const).map((opt) => {
                  const checked = viewOption === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setViewOption(opt)}
                      className="w-full flex items-center gap-2.5 text-left text-[13px] py-0.5"
                    >
                      <span
                        className={`w-[18px] h-[18px] rounded-full flex items-center justify-center border ${
                          checked
                            ? 'bg-[#00c4ff] border-[#00c4ff] text-white'
                            : 'border-[#d0d5dd] bg-white'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                      <span className={checked ? 'font-bold text-[#232833]' : 'font-medium text-[#232833]'}>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sort button + popover (step_278_shot_4.png) */}
          <div className="relative">
            <button
              type="button"
              aria-label="Sort"
              onClick={() => setOpenMenu(openMenu === 'sort' ? null : 'sort')}
              className={`w-[38px] h-[38px] min-[480px]:w-[36px] min-[480px]:h-[36px] rounded-full border flex items-center justify-center transition-colors ${
                openMenu === 'sort'
                  ? 'bg-[#e6e8ec] border-[#dcdFE6] text-[#232833]'
                  : 'border-[#e2e3e6] hover:bg-[#f7f8fa] text-[#232833]'
              }`}
            >
              <ReferenceIcon name="descend" className="w-4 h-4" />
            </button>

            {openMenu === 'sort' && (
              <div
                role="dialog"
                aria-label="Sort options"
                className="absolute right-0 top-[44px] z-40 w-[240px] rounded-[16px] bg-white border border-[#eaecee] shadow-[0_10px_28px_rgba(15,18,25,0.1)] p-3.5 select-none"
              >
                <div className="space-y-2.5 pb-3 border-b border-[#eaecee]">
                  {(['By Last Modified', 'By Creation Date'] as const).map((field) => {
                    const checked = sortByField === field;
                    return (
                      <button
                        key={field}
                        type="button"
                        onClick={() => setSortByField(field)}
                        className="w-full flex items-center gap-2.5 text-left text-[13px] py-0.5"
                      >
                        <span
                          className={`w-[18px] h-[18px] rounded-full flex items-center justify-center border ${
                            checked
                              ? 'bg-[#00c4ff] border-[#00c4ff] text-white'
                              : 'border-[#d0d5dd] bg-white'
                          }`}
                        >
                          {checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                        <span
                          className={
                            checked ? 'font-bold text-[#232833]' : 'font-medium text-[#232833]'
                          }
                        >
                          {field}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-3 space-y-2.5">
                  {(['Descending', 'Ascending'] as const).map((dir) => {
                    const checked = sortDirection === dir;
                    return (
                      <button
                        key={dir}
                        type="button"
                        onClick={() => setSortDirection(dir)}
                        className="w-full flex items-center justify-between text-left text-[13px] py-0.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-[18px] h-[18px] rounded-full flex items-center justify-center border ${
                              checked
                                ? 'bg-[#00c4ff] border-[#00c4ff] text-white'
                                : 'border-[#d0d5dd] bg-white'
                            }`}
                          >
                            {checked && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                          <span
                            className={
                              checked ? 'font-bold text-[#232833]' : 'font-medium text-[#232833]'
                            }
                          >
                            {dir}
                          </span>
                        </div>
                        {dir === 'Descending' ? (
                          <ArrowDown className="w-3.5 h-3.5 text-[#687080]" />
                        ) : (
                          <ArrowUp className="w-3.5 h-3.5 text-[#687080]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {activeTab === 'assets' && (
            <>
              <input
                ref={fileUploadRef}
                type="file"
                className="hidden"
                onChange={handleUploadAssetFile}
              />
              <button
                type="button"
                onClick={() => fileUploadRef.current?.click()}
                className="h-[36px] px-4 rounded-full bg-[#19191a] hover:bg-[#343842] text-white text-[12.5px] font-bold flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Asset</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Default Reference State matching projects-375x812.png & projects-768x1024.png (Try again reveals workspace projects) */}
      {!showWorkspaceProjects ? (
        <div className="mt-[44px] min-[480px]:mt-[64px] flex flex-col items-center justify-center text-center select-none">
          <ReferenceIcon name="ds-warn-triangle" className="w-[38px] h-[38px] text-[#ff791a] mb-3" />
          <p className="text-[13.5px] text-[#687080] mb-3">
            Failed to load videos. Please try again.
          </p>
          <button
            type="button"
            onClick={() => setShowWorkspaceProjects(true)}
            className="h-[26px] px-3 rounded-full border border-[#e2e3e6] bg-white hover:bg-[#f7f8fa] inline-flex items-center gap-1.5 text-[12px] font-bold text-[#232833] transition-colors"
          >
            <ReferenceIcon name="refresh" className="w-3.5 h-3.5 text-[#232833]" />
            <span>Try again</span>
          </button>
        </div>
      ) : activeTab === 'assets' ? (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#f7f8fa] border border-[#eaecee] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {(['all', 'image', 'video', 'audio'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAssetTypeFilter(t)}
                  className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold capitalize ${
                    assetTypeFilter === t
                      ? 'bg-[#19191a] text-white'
                      : 'bg-white text-[#4e5666] border border-[#e2e3e6]'
                  }`}
                >
                  {t === 'all' ? 'All Media' : `${t}s`}
                </button>
              ))}
            </div>

            <div className="text-[12px] font-semibold text-[#687080]">
              Workspace Storage Used:{' '}
              <strong className="text-[#232833]">
                {(totalAssetStorageBytes / (1024 * 1024)).toFixed(2)} MB
              </strong>{' '}
              / 5,120 MB
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="rounded-2xl border border-[#eaecee] bg-white p-3 flex flex-col justify-between shadow-sm hover:border-[#00c4ff] transition-all"
              >
                <div>
                  <div className="h-36 rounded-xl bg-[#f7f8fa] overflow-hidden mb-2.5 flex items-center justify-center">
                    {asset.asset_type === 'video' ? (
                      <video
                        src={asset.url}
                        controls
                        className="w-full h-full object-cover bg-black"
                      />
                    ) : (
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="text-[13px] font-bold text-[#232833] truncate">{asset.name}</div>
                  <div className="text-[11px] text-[#687080] mt-0.5 flex items-center justify-between">
                    <span className="uppercase">{asset.asset_type}</span>
                    <span>{(asset.size_bytes / 1024).toFixed(1)} KB</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#f2f3f5] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.origin + asset.url);
                      showToast('Copied signed delivery URL');
                    }}
                    className="text-[11.5px] font-semibold text-[#00a7d9] flex items-center gap-1 hover:underline"
                  >
                    <Link2 className="w-3 h-3" />
                    <span>Delivery URL</span>
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await fetch(`/api/assets?id=${asset.id}`, { method: 'DELETE' });
                      await bootstrap();
                      showToast('Asset deleted');
                    }}
                    className="p-1 text-[#687080] hover:text-[#e54945]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* MODULE 2: PROJECT MANAGEMENT VIEW */
        <div>
          {viewOption !== 'List View' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    setActiveStudioProject(proj.id);
                    router.push('/apps/studio?editor=1');
                  }}
                  className="group rounded-[18px] bg-white border border-[#eaecee] hover:border-[#00c4ff] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.03)] cursor-pointer transition-all"
                >
                  <div className="relative h-[168px] bg-[#f7f8fa] overflow-hidden">
                    <img
                      src={proj.thumbnail_url}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <span
                      className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase ${
                        proj.status === 'completed'
                          ? 'bg-[#e6f9f3] text-[#00a87e]'
                          : 'bg-white/90 text-[#4e5666]'
                      }`}
                    >
                      {proj.status}
                    </span>
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-white text-[11px] font-mono">
                      {proj.duration_sec}s · {proj.resolution}
                    </span>
                  </div>

                  <div className="p-4">
                    {renamingId === proj.id ? (
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={renameText}
                          onChange={(e) => setRenameText(e.target.value)}
                          className="flex-1 h-8 px-2.5 rounded-lg border border-[#00c4ff] text-[13px] font-bold"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleRenameSubmit(proj.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#19191a] text-white text-[11.5px] font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-[14.5px] font-extrabold text-[#232833] truncate">
                            {proj.title}
                          </h3>
                          <p className="text-[11.5px] text-[#687080] mt-0.5">
                            {proj.folder_name} · {proj.aspect_ratio}
                          </p>
                        </div>
                      </div>
                    )}

                    <div
                      className="mt-3 pt-3 border-t border-[#f2f3f5] flex items-center justify-between text-[12px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          title="Rename project"
                          onClick={() => {
                            setRenamingId(proj.id);
                            setRenameText(proj.title);
                          }}
                          className="p-1.5 rounded-lg hover:bg-[#f2f3f5] text-[#4e5666]"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Duplicate project"
                          onClick={(e) => handleDuplicateProject(proj.id, e)}
                          className="p-1.5 rounded-lg hover:bg-[#f2f3f5] text-[#4e5666]"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Version history"
                          onClick={() => setVersionModalProject(proj)}
                          className="p-1.5 rounded-lg hover:bg-[#f2f3f5] text-[#4e5666]"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Delete project"
                          onClick={(e) => handleDeleteProject(proj.id, e)}
                          className="p-1.5 rounded-lg hover:bg-[#fff5f5] text-[#687080] hover:text-[#e54945]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveStudioProject(proj.id);
                          router.push('/apps/studio?editor=1');
                        }}
                        className="px-3 py-1 rounded-full bg-[#e3f4fa] text-[#007091] font-bold flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Open Studio</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-[#eaecee] border border-[#eaecee] rounded-2xl overflow-hidden">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    setActiveStudioProject(proj.id);
                    router.push('/apps/studio?editor=1');
                  }}
                  className="p-4 flex items-center justify-between hover:bg-[#f7f8fa] cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={proj.thumbnail_url}
                      alt={proj.title}
                      className="w-20 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <div className="text-[14px] font-bold text-[#232833]">{proj.title}</div>
                      <div className="text-[12px] text-[#687080]">
                        {proj.folder_name} · {proj.status} · {proj.resolution} · {proj.duration_sec}s
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => handleDuplicateProject(proj.id, e)}
                      className="px-3 py-1.5 rounded-full border border-[#e2e3e6] text-[12px] font-bold"
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteProject(proj.id, e)}
                      className="px-3 py-1.5 rounded-full border border-[#feb2b2] text-[#e54945] text-[12px] font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create a folder Modal (Exact match to step_278_shot_5.png) */}
      {newFolderModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Create a folder"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1219]/45 p-4"
          onClick={() => setNewFolderModalOpen(false)}
        >
          <div
            className="w-full max-w-[540px] rounded-[20px] bg-white p-6 shadow-[0_20px_50px_rgba(15,18,25,0.22)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[18px] font-extrabold text-[#232833]">Create a folder</h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setNewFolderModalOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-[#f2f3f5] flex items-center justify-center text-[#687080]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-[12px] font-bold text-[#232833] mb-1.5">
                  Folder name
                </label>
                <input
                  type="text"
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className="w-full h-[40px] px-3.5 rounded-[10px] border-[1.5px] border-[#00c4ff] text-[13px] text-[#232833] focus:outline-none shadow-[0_0_0_2px_rgba(0,196,255,0.12)]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#8c93a3] mb-1.5">
                  Access level
                </label>
                <div className="w-full h-[52px] px-3.5 rounded-[12px] border border-[#eaecee] bg-white flex items-center justify-between select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#7be3ff] text-white flex items-center justify-center">
                      <Lock className="w-4 h-4" />
                    </div>
                    <span className="text-[13.5px] font-bold text-[#8c93a3]">Private</span>
                  </div>
                  <span className="text-[12px] text-[#b0b7c3]">⌄</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={!newFolderName.trim()}
              onClick={handleSaveNewFolder}
              className={`w-full h-[40px] rounded-full text-[13px] font-bold transition-colors ${
                newFolderName.trim()
                  ? 'bg-[#19191a] hover:bg-[#343842] text-white'
                  : 'bg-[#e6e8ec] text-[#8c93a3] cursor-not-allowed'
              }`}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {versionModalProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1219]/45 p-4"
          onClick={() => setVersionModalProject(null)}
        >
          <div
            className="w-full max-w-[460px] rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[16px] font-extrabold text-[#232833] mb-3">
              Version History: {versionModalProject.title}
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {projectVersions
                .filter((v) => v.project_id === versionModalProject.id)
                .map((ver) => (
                  <div
                    key={ver.id}
                    className="p-3 rounded-xl bg-[#f7f8fa] border border-[#eaecee] text-[12.5px]"
                  >
                    <div className="font-bold text-[#232833]">
                      Version {ver.version_number} — {ver.label}
                    </div>
                    <div className="text-[11px] text-[#687080]">
                      {new Date(ver.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
            </div>
            <button
              type="button"
              onClick={() => setVersionModalProject(null)}
              className="w-full h-9 rounded-full bg-[#19191a] text-white text-[12.5px] font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-12 text-center text-sm text-[#687080]">Loading Projects...</div>}>
        <ProjectsPageContent />
      </Suspense>
    </AppShell>
  );
}

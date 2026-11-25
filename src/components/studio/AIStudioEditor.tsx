'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useHeyGenStore } from '@/lib/store/useHeyGenStore';
import { CanvasLayer, SceneRecord } from '@/lib/db/types';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Copy,
  ClipboardPaste,
  Play,
  Pause,
  Plus,
  Trash2,
  Download,
  History,
  Type,
  Image as ImageIcon,
  Video,
  Music,
  LayoutTemplate,
  Palette,
  Layers,
  User,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  Sparkles,
  Move,
} from 'lucide-react';

type StudioLeftTab =
  | 'Scenes'
  | 'Avatars'
  | 'Text'
  | 'Images'
  | 'Videos'
  | 'Audio'
  | 'Templates'
  | 'Backgrounds';

export function AIStudioEditor({ onBackToLanding }: { onBackToLanding: () => void }) {
  const {
    projects,
    scenes,
    projectVersions,
    avatars,
    voices,
    templates,
    assets,
    activeStudioProjectId,
    activeSceneId,
    selectedLayerId,
    setActiveScene,
    setSelectedLayer,
    updateProjectScenesWithHistory,
    undoEditor,
    redoEditor,
    editorUndoStack,
    editorRedoStack,
    copySelectedLayer,
    pasteCopiedLayer,
    isPlayingPreview,
    setIsPlayingPreview,
    playheadSec,
    setPlayheadSec,
    timelineZoom,
    setTimelineZoom,
    autosaveStatus,
    bootstrap,
    showToast,
  } = useHeyGenStore();

  const [leftTab, setLeftTab] = useState<StudioLeftTab>('Scenes');
  const [rightInspectorTab, setRightInspectorTab] = useState<
    'Text' | 'Avatar' | 'Voice' | 'Layer' | 'Animation'
  >('Avatar');
  const [showVersionDrawer, setShowVersionDrawer] = useState(false);
  const [mobileStudioPane, setMobileStudioPane] = useState<'canvas' | 'assets' | 'inspector'>('canvas');
  const [renderingVideo, setRenderingVideo] = useState(false);
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);
  const [exportedSubtitleUrl, setExportedSubtitleUrl] = useState<string | null>(null);

  // Dragging state on canvas
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  const project =
    projects.find((p) => p.id === activeStudioProjectId) || projects[0];
  const projectScenes = scenes
    .filter((s) => s.project_id === project?.id)
    .sort((a, b) => a.order_index - b.order_index);
  const activeScene =
    projectScenes.find((s) => s.id === activeSceneId) || projectScenes[0];
  const selectedLayer =
    activeScene?.layers.find((l) => l.id === selectedLayerId) ||
    activeScene?.layers[0] ||
    null;

  const totalDurationSec = projectScenes.reduce(
    (acc, s) => acc + (Number(s.duration_sec) || 5),
    0
  );

  // Playback timer loop
  useEffect(() => {
    if (!isPlayingPreview) return;
    const interval = setInterval(() => {
      setPlayheadSec(
        playheadSec + 0.25 >= totalDurationSec ? 0 : Number((playheadSec + 0.25).toFixed(2))
      );
    }, 250);
    return () => clearInterval(interval);
  }, [isPlayingPreview, playheadSec, totalDurationSec, setPlayheadSec]);

  // Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+C, Ctrl+V, Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undoEditor();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redoEditor();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        copySelectedLayer();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        pasteCopiedLayer();
      } else if (e.key === ' ' && project) {
        e.preventDefault();
        setIsPlayingPreview(!isPlayingPreview);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    undoEditor,
    redoEditor,
    copySelectedLayer,
    pasteCopiedLayer,
    isPlayingPreview,
    setIsPlayingPreview,
    project,
  ]);

  if (!project || !activeScene) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm text-[#687080] mb-4">No project loaded in AI Studio.</p>
        <button
          type="button"
          onClick={onBackToLanding}
          className="px-4 py-2 rounded-full bg-[#19191a] text-white text-xs font-bold"
        >
          Back to AI Studio Templates
        </button>
      </div>
    );
  }

  // Scene mutations
  const handleAddScene = async () => {
    const newSceneId = `scn-${Date.now().toString(36)}`;
    const nextIdx = projectScenes.length;
    const newScene: SceneRecord = {
      id: newSceneId,
      project_id: project.id,
      order_index: nextIdx,
      title: `Scene ${nextIdx + 1}`,
      script: 'Type narration script for this scene...',
      avatar_id: activeScene.avatar_id || 'avatar-annie',
      avatar_look: 'Default',
      avatar_mode: 'Presenter',
      voice_id: activeScene.voice_id || 'voice-annie',
      duration_sec: 8,
      background_type: 'color',
      background_value: '#f3f5f9',
      transition: 'fade',
      layers: [
        {
          id: `lyr-txt-${Date.now().toString(36)}`,
          type: 'text',
          name: `Scene ${nextIdx + 1} Title`,
          x: 60,
          y: 90,
          width: 420,
          height: 90,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: `Scene ${nextIdx + 1} Headline`,
          fontSize: 32,
          fontWeight: 800,
          color: '#232833',
          animation: 'fade-in',
        },
        {
          id: `lyr-av-${Date.now().toString(36)}`,
          type: 'avatar',
          name: 'Avatar Presenter',
          x: 520,
          y: 40,
          width: 340,
          height: 440,
          rotation: 0,
          opacity: 1,
          zIndex: 3,
          src:
            avatars.find((a) => a.id === activeScene.avatar_id)?.main_thumbnail_url ||
            '/heygen-assets/thumbnails/avatar-annie-main.webp',
          animation: 'none',
        },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await updateProjectScenesWithHistory(project.id, (list) => [...list, newScene]);
    setActiveScene(newSceneId);
    showToast(`Added Scene ${nextIdx + 1}`);
  };

  const handleDeleteScene = async (sceneId: string) => {
    if (projectScenes.length <= 1) {
      showToast('A project must have at least 1 scene');
      return;
    }
    await updateProjectScenesWithHistory(project.id, (list) =>
      list.filter((s) => s.id !== sceneId)
    );
    showToast('Scene removed');
  };

  const handleReorderScene = async (sceneId: string, dir: -1 | 1) => {
    await updateProjectScenesWithHistory(project.id, (list) => {
      const idx = list.findIndex((s) => s.id === sceneId);
      const targetIdx = idx + dir;
      if (idx === -1 || targetIdx < 0 || targetIdx >= list.length) return list;
      const copy = [...list];
      const [moved] = copy.splice(idx, 1);
      copy.splice(targetIdx, 0, moved);
      return copy;
    });
  };

  const handleUpdateActiveScene = async (patch: Partial<SceneRecord>) => {
    await updateProjectScenesWithHistory(project.id, (list) =>
      list.map((s) => (s.id === activeScene.id ? { ...s, ...patch } : s))
    );
  };

  const handleAddLayer = async (layer: Omit<CanvasLayer, 'id' | 'zIndex'>) => {
    const newId = `lyr-${Date.now().toString(36)}`;
    const fullLayer: CanvasLayer = {
      ...layer,
      id: newId,
      zIndex: (activeScene.layers.length || 1) + 1,
    };
    await updateProjectScenesWithHistory(project.id, (list) =>
      list.map((s) =>
        s.id === activeScene.id ? { ...s, layers: [...s.layers, fullLayer] } : s
      )
    );
    setSelectedLayer(newId);
    showToast(`Added ${layer.name} to canvas`);
  };

  const handleUpdateLayer = async (layerId: string, patch: Partial<CanvasLayer>) => {
    await updateProjectScenesWithHistory(project.id, (list) =>
      list.map((s) =>
        s.id === activeScene.id
          ? {
              ...s,
              layers: s.layers.map((l) => (l.id === layerId ? { ...l, ...patch } : l)),
            }
          : s
      )
    );
  };

  const handleDeleteLayer = async (layerId: string) => {
    await updateProjectScenesWithHistory(project.id, (list) =>
      list.map((s) =>
        s.id === activeScene.id
          ? { ...s, layers: s.layers.filter((l) => l.id !== layerId) }
          : s
      )
    );
    setSelectedLayer(null);
  };

  const handleChangeAspectRatio = async (ratio: '16:9' | '9:16') => {
    await fetch('/api/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: project.id, aspect_ratio: ratio }),
    });
    await bootstrap();
    showToast(`Canvas aspect ratio switched to ${ratio}`);
  };

  const handleExportVideo = async () => {
    setRenderingVideo(true);
    setExportedVideoUrl(null);
    try {
      // Save version checkpoint first
      await updateProjectScenesWithHistory(
        project.id,
        (s) => s,
        true,
        `Export Snapshot (${new Date().toLocaleTimeString()})`
      );

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'render_project',
          project_id: project.id,
          resolution: project.resolution || '1080p',
        }),
      });
      const data = await res.json();
      await bootstrap();
      if (res.ok && data.render_job?.output_url) {
        setExportedVideoUrl(data.render_job.output_url);
        setExportedSubtitleUrl(data.subtitle_url || null);
        showToast('Video rendered with FFmpeg and ready to download!');
      } else {
        showToast(data.error || 'Video render failed');
      }
    } finally {
      setRenderingVideo(false);
    }
  };

  const LEFT_TABS: { id: StudioLeftTab; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'Scenes', icon: Layers },
    { id: 'Avatars', icon: User },
    { id: 'Text', icon: Type },
    { id: 'Images', icon: ImageIcon },
    { id: 'Videos', icon: Video },
    { id: 'Audio', icon: Music },
    { id: 'Templates', icon: LayoutTemplate },
    { id: 'Backgrounds', icon: Palette },
  ];

  const versionsForProject = projectVersions.filter((v) => v.project_id === project.id);

  return (
    <div className="fixed inset-0 z-40 bg-[#f4f5f8] flex flex-col select-none overflow-hidden">
      {/* TOP STUDIO HEADER BAR */}
      <header className="min-h-[54px] bg-white border-b border-[#eaecee] px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToLanding}
            className="h-8 px-2.5 sm:px-3 rounded-full hover:bg-[#f2f3f5] flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-bold text-[#232833] shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to AI Studio</span>
          </button>

          <div className="h-4 w-[1px] bg-[#eaecee] hidden sm:block" />

          <input
            type="text"
            aria-label="Project title"
            defaultValue={project.title}
            onBlur={async (e) => {
              await fetch('/api/projects', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_id: project.id, title: e.target.value }),
              });
              await bootstrap();
            }}
            className="h-8 w-[130px] sm:w-auto px-2.5 rounded-lg hover:bg-[#f7f8fa] focus:bg-white focus:border focus:border-[#00c4ff] text-[13px] sm:text-[14px] font-extrabold text-[#232833] focus:outline-none truncate"
          />

          <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full bg-[#f2f3f5] text-[11px] font-semibold text-[#687080]">
            {autosaveStatus === 'saving'
              ? 'Autosaving...'
              : autosaveStatus === 'saved'
              ? 'All changes saved'
              : 'Unsaved'}
          </span>
        </div>

        {/* Mobile/Tablet Pane Switcher (<1024px) */}
        <div className="flex lg:hidden items-center gap-1 rounded-full bg-[#f2f3f5] p-0.5 border border-[#eaecee]">
          {(['assets', 'canvas', 'inspector'] as const).map((pane) => (
            <button
              key={pane}
              type="button"
              onClick={() => setMobileStudioPane(pane)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                mobileStudioPane === pane ? 'bg-white text-[#232833] shadow-sm' : 'text-[#687080]'
              }`}
            >
              {pane}
            </button>
          ))}
        </div>

        {/* Center Transport & Undo/Redo/Copy/Paste Toolbar */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            type="button"
            title="Undo (Ctrl+Z)"
            disabled={editorUndoStack.length === 0}
            onClick={undoEditor}
            className="w-8 h-8 rounded-lg hover:bg-[#f2f3f5] flex items-center justify-center text-[#232833] disabled:opacity-35"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Redo (Ctrl+Y)"
            disabled={editorRedoStack.length === 0}
            onClick={redoEditor}
            className="w-8 h-8 rounded-lg hover:bg-[#f2f3f5] flex items-center justify-center text-[#232833] disabled:opacity-35"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="h-4 w-[1px] bg-[#eaecee] mx-1" />
          <button
            type="button"
            title="Copy Layer (Ctrl+C)"
            onClick={copySelectedLayer}
            className="w-8 h-8 rounded-lg hover:bg-[#f2f3f5] flex items-center justify-center text-[#232833]"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Paste Layer (Ctrl+V)"
            onClick={pasteCopiedLayer}
            className="w-8 h-8 rounded-lg hover:bg-[#f2f3f5] flex items-center justify-center text-[#232833]"
          >
            <ClipboardPaste className="w-4 h-4" />
          </button>
          <div className="h-4 w-[1px] bg-[#eaecee] mx-1" />

          {/* Aspect Ratio Switcher */}
          <div className="inline-flex rounded-full bg-[#f2f3f5] p-0.5 border border-[#eaecee]">
            {(['16:9', '9:16'] as const).map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => handleChangeAspectRatio(ratio)}
                className={`px-2.5 py-1 rounded-full text-[11.5px] font-bold ${
                  project.aspect_ratio === ratio
                    ? 'bg-white text-[#232833] shadow-sm'
                    : 'text-[#687080]'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* Right Version History & Export Video */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowVersionDrawer(!showVersionDrawer)}
            className="h-9 px-3.5 rounded-full border border-[#e2e3e6] hover:bg-[#f7f8fa] flex items-center gap-1.5 text-[12px] font-bold text-[#232833]"
          >
            <History className="w-3.5 h-3.5" />
            <span>History ({versionsForProject.length})</span>
          </button>

          <button
            type="button"
            disabled={renderingVideo}
            onClick={handleExportVideo}
            className="h-9 px-5 rounded-full bg-[#19191a] hover:bg-[#343842] text-white text-[12.5px] font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-[#00c4ff]" />
            <span>{renderingVideo ? 'Rendering MP4...' : 'Export Video'}</span>
          </button>
        </div>
      </header>

      {/* Exported Video Banner when completed */}
      {exportedVideoUrl && (
        <div className="bg-[#e6f9f3] border-b border-[#00bf8f]/30 px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[13px] font-bold text-[#007a5a]">
            <CheckCircle2 className="w-4 h-4 text-[#00bf8f]" />
            <span>FFmpeg Render Complete — Playable MP4 & Subtitles Ready!</span>
          </div>
          <div className="flex items-center gap-3">
            {exportedSubtitleUrl && (
              <a
                href={exportedSubtitleUrl}
                download
                className="text-[12px] font-bold text-[#007091] underline"
              >
                Download SRT Subtitles
              </a>
            )}
            <a
              href={exportedVideoUrl}
              download
              className="px-4 py-1 rounded-full bg-[#19191a] text-white text-[12px] font-bold"
            >
              Download Rendered MP4
            </a>
          </div>
        </div>
      )}

      {/* MAIN 3-COLUMN WORKSPACE (LEFT TOOLS + CENTER CANVAS + RIGHT INSPECTOR) */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* ZONE 1: LEFT ASSET & SCENE DRAWER (72px icon rail + 250px drawer) */}
        <aside
          className={`w-full sm:w-[322px] bg-white border-r border-[#eaecee] shrink-0 ${
            mobileStudioPane === 'assets' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* 72px Left Tool Rail */}
          <div className="w-[72px] border-r border-[#eaecee] py-3 flex flex-col items-center gap-2">
            {LEFT_TABS.map((t) => {
              const Icon = t.icon;
              const active = leftTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setLeftTab(t.id)}
                  className={`w-[58px] py-2 rounded-xl flex flex-col items-center gap-1 text-[10.5px] font-bold transition-colors ${
                    active
                      ? 'bg-[#e3f4fa] text-[#007091]'
                      : 'text-[#4e5666] hover:bg-[#f2f3f5]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.id}</span>
                </button>
              );
            })}
          </div>

          {/* 250px Contextual Left Panel */}
          <div className="flex-1 p-3.5 overflow-y-auto">
            {leftTab === 'Scenes' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-extrabold text-[#232833]">
                    Scenes ({projectScenes.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddScene}
                    className="h-7 px-2.5 rounded-full bg-[#19191a] text-white text-[11px] font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Scene</span>
                  </button>
                </div>

                {projectScenes.map((sc, idx) => {
                  const isCurrent = sc.id === activeScene.id;
                  return (
                    <div
                      key={sc.id}
                      onClick={() => setActiveScene(sc.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-2 border-[#00c4ff] bg-[#f9feff]'
                          : 'border-[#eaecee] bg-white hover:bg-[#f7f8fa]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[12px] font-extrabold text-[#232833]">
                          {idx + 1}. {sc.title}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReorderScene(sc.id, -1);
                            }}
                            className="px-1.5 py-0.5 text-[10px] rounded bg-[#f2f3f5] hover:bg-[#e2e3e6]"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReorderScene(sc.id, 1);
                            }}
                            className="px-1.5 py-0.5 text-[10px] rounded bg-[#f2f3f5] hover:bg-[#e2e3e6]"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteScene(sc.id);
                            }}
                            className="p-1 text-[#687080] hover:text-[#e54945]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[11.5px] text-[#687080] line-clamp-2">{sc.script}</p>
                      <div className="mt-2 flex items-center justify-between text-[10.5px] font-semibold text-[#00a7d9]">
                        <span>{sc.duration_sec}s</span>
                        <span>{sc.layers.length} layers</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {leftTab === 'Avatars' && (
              <div className="space-y-3">
                <div className="text-[13px] font-extrabold text-[#232833]">Choose Scene Avatar</div>
                <div className="grid grid-cols-2 gap-2">
                  {avatars.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={async () => {
                        await handleUpdateActiveScene({
                          avatar_id: av.id,
                          voice_id: av.default_voice_id || activeScene.voice_id,
                        });
                        const avatarLayer = activeScene.layers.find((l) => l.type === 'avatar');
                        if (avatarLayer) {
                          await handleUpdateLayer(avatarLayer.id, {
                            name: `${av.name} Presenter`,
                            src: av.main_thumbnail_url,
                          });
                        } else {
                          await handleAddLayer({
                            type: 'avatar',
                            name: `${av.name} Presenter`,
                            x: 520,
                            y: 40,
                            width: 340,
                            height: 440,
                            rotation: 0,
                            opacity: 1,
                            src: av.main_thumbnail_url,
                          });
                        }
                        showToast(`Switched scene avatar to ${av.name}`);
                      }}
                      className={`p-2 rounded-xl border text-left ${
                        activeScene.avatar_id === av.id
                          ? 'border-2 border-[#00c4ff] bg-[#f9feff]'
                          : 'border-[#eaecee] hover:bg-[#f7f8fa]'
                      }`}
                    >
                      <img
                        src={av.main_thumbnail_url}
                        alt={av.name}
                        className="w-full h-24 object-cover rounded-lg mb-1.5"
                      />
                      <div className="text-[12px] font-bold text-[#232833] truncate">{av.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {leftTab === 'Text' && (
              <div className="space-y-2.5">
                <div className="text-[13px] font-extrabold text-[#232833] mb-2">Add Text Layer</div>
                <button
                  type="button"
                  onClick={() =>
                    handleAddLayer({
                      type: 'text',
                      name: 'Display Headline',
                      x: 60,
                      y: 80,
                      width: 440,
                      height: 90,
                      rotation: 0,
                      opacity: 1,
                      content: 'Add a Headline',
                      fontSize: 36,
                      fontWeight: 800,
                      color: '#232833',
                      animation: 'fade-in',
                    })
                  }
                  className="w-full p-3.5 rounded-xl border border-[#eaecee] hover:border-[#00c4ff] text-left bg-[#f7f8fa]"
                >
                  <div className="text-[18px] font-extrabold text-[#232833]">Add a Headline</div>
                  <div className="text-[11px] text-[#687080]">TT Norms Pro · 36px Bold</div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleAddLayer({
                      type: 'text',
                      name: 'Subtitle Callout',
                      x: 60,
                      y: 200,
                      width: 400,
                      height: 60,
                      rotation: 0,
                      opacity: 1,
                      content: 'Supporting subtitle or key takeaway point',
                      fontSize: 20,
                      fontWeight: 600,
                      color: '#4e5666',
                      animation: 'slide-up',
                    })
                  }
                  className="w-full p-3.5 rounded-xl border border-[#eaecee] hover:border-[#00c4ff] text-left bg-[#f7f8fa]"
                >
                  <div className="text-[14px] font-semibold text-[#232833]">Add a Subtitle</div>
                  <div className="text-[11px] text-[#687080]">TT Norms Pro · 20px Semibold</div>
                </button>
              </div>
            )}

            {leftTab === 'Images' && (
              <div className="space-y-3">
                <div className="text-[13px] font-extrabold text-[#232833]">Image Assets</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Ads Ringlight', url: '/heygen-assets/images/prompt-ads-promo.png' },
                    { name: 'Expert Overlay', url: '/heygen-assets/images/prompt-expert-explainer.png' },
                    { name: 'News Studio', url: '/heygen-assets/images/prompt-news-brief.jpg' },
                    { name: 'Prism Orb', url: '/heygen-assets/logos/PRISM_ORB.svg' },
                    ...assets
                      .filter((a) => a.asset_type === 'image')
                      .map((a) => ({ name: a.name, url: a.url })),
                  ].map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        handleAddLayer({
                          type: 'image',
                          name: img.name,
                          x: 70,
                          y: 220,
                          width: 240,
                          height: 150,
                          rotation: 0,
                          opacity: 1,
                          src: img.url,
                          animation: 'zoom-in',
                        })
                      }
                      className="p-1.5 rounded-xl border border-[#eaecee] hover:border-[#00c4ff] text-left"
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-16 object-cover rounded-lg mb-1"
                      />
                      <div className="text-[11px] font-semibold text-[#232833] truncate">
                        {img.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {leftTab === 'Videos' && (
              <div className="space-y-3">
                <div className="text-[13px] font-extrabold text-[#232833]">Background Videos</div>
                {[
                  {
                    name: 'Prompt Builder Hub MP4',
                    url: '/heygen-assets/videos/prompt-builder-hub.mp4',
                  },
                  {
                    name: 'Avatar Talking Footage MP4',
                    url: '/heygen-assets/videos/avatar-preview-talk.mp4',
                  },
                ].map((vid, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      handleUpdateActiveScene({
                        background_type: 'video',
                        background_value: vid.url,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#eaecee] hover:border-[#00c4ff] text-left bg-[#f7f8fa]"
                  >
                    <div className="text-[12px] font-bold text-[#232833] mb-1">{vid.name}</div>
                    <span className="text-[11px] text-[#00a7d9] font-semibold">
                      Set as Scene Background Video →
                    </span>
                  </button>
                ))}
              </div>
            )}

            {leftTab === 'Audio' && (
              <div className="space-y-3">
                <div className="text-[13px] font-extrabold text-[#232833]">
                  Background Music & Audio
                </div>
                {[
                  'Ambient Corporate Pulse (120 BPM)',
                  'Warm Acoustic Inspiration',
                  'Modern Tech Keynote Beat',
                  'Lo-Fi Study & Focus Groove',
                ].map((track) => (
                  <button
                    key={track}
                    type="button"
                    onClick={() => {
                      handleUpdateActiveScene({ audio_track_url: track });
                      showToast(`Attached audio track: ${track}`);
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between ${
                      activeScene.audio_track_url === track
                        ? 'border-[#00c4ff] bg-[#f9feff]'
                        : 'border-[#eaecee] hover:bg-[#f7f8fa]'
                    }`}
                  >
                    <span className="text-[12px] font-bold text-[#232833]">{track}</span>
                    <Music className="w-3.5 h-3.5 text-[#00a7d9]" />
                  </button>
                ))}
              </div>
            )}

            {leftTab === 'Templates' && (
              <div className="space-y-3">
                <div className="text-[13px] font-extrabold text-[#232833]">Apply Scene Template</div>
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      handleUpdateActiveScene({
                        title: tpl.title,
                        script: tpl.scenes_payload[0]?.script || activeScene.script,
                        background_value:
                          tpl.scenes_payload[0]?.background_value || '#f3f5f9',
                      });
                      showToast(`Applied template "${tpl.title}" to current scene`);
                    }}
                    className="w-full p-2 rounded-xl border border-[#eaecee] hover:border-[#00c4ff] text-left"
                  >
                    <img
                      src={tpl.thumbnail_url}
                      alt={tpl.title}
                      className="w-full h-20 object-cover rounded-lg mb-1"
                    />
                    <div className="text-[12px] font-bold text-[#232833]">{tpl.title}</div>
                  </button>
                ))}
              </div>
            )}

            {leftTab === 'Backgrounds' && (
              <div className="space-y-3">
                <div className="text-[13px] font-extrabold text-[#232833]">Scene Background</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    '#f3f5f9',
                    '#eef8fc',
                    '#ffffff',
                    '#232833',
                    '#3718d8',
                    '#005873',
                    '#f8f5f0',
                    '#16171a',
                    '#e6f9f3',
                  ].map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() =>
                        handleUpdateActiveScene({
                          background_type: 'color',
                          background_value: hex,
                        })
                      }
                      className="h-12 rounded-xl border border-[#e2e3e6] flex items-end p-1.5 text-[10px] font-mono"
                      style={{ backgroundColor: hex }}
                    >
                      <span className="bg-white/80 px-1 rounded text-[#232833]">{hex}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ZONE 2: CENTER VIDEO CANVAS & PLAYBACK CONTROLS */}
        <section
          className={`flex-1 flex-col items-center justify-between p-3 sm:p-5 bg-[#eef0f4] overflow-hidden min-w-0 ${
            mobileStudioPane === 'canvas' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Interactive Stage Canvas */}
          <div className="flex-1 w-full flex items-center justify-center min-h-0">
            <div
              ref={canvasRef}
              onMouseMove={(e) => {
                if (!draggingLayerId || !canvasRef.current) return;
                const rect = canvasRef.current.getBoundingClientRect();
                const nextX = Math.round(e.clientX - rect.left - dragOffset.dx);
                const nextY = Math.round(e.clientY - rect.top - dragOffset.dy);
                handleUpdateLayer(draggingLayerId, {
                  x: Math.max(0, Math.min(rect.width - 60, nextX)),
                  y: Math.max(0, Math.min(rect.height - 40, nextY)),
                });
              }}
              onMouseUp={() => setDraggingLayerId(null)}
              className={`relative rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-[#dcdfe6] overflow-hidden transition-all ${
                project.aspect_ratio === '9:16'
                  ? 'w-[310px] h-[540px]'
                  : 'w-full max-w-[860px] aspect-video max-h-[480px]'
              }`}
              style={{
                backgroundColor:
                  activeScene.background_type === 'color'
                    ? activeScene.background_value
                    : '#16171a',
              }}
            >
              {activeScene.background_type === 'video' && (
                <video
                  src={activeScene.background_value}
                  autoPlay
                  muted
                  loop
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
              )}

              {/* Render Interactive Draggable/Resizable Canvas Layers */}
              {activeScene.layers
                .slice()
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((layer) => {
                  const isSelected = selectedLayer?.id === layer.id;
                  return (
                    <div
                      key={layer.id}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setSelectedLayer(layer.id);
                        setRightInspectorTab(
                          layer.type === 'text'
                            ? 'Text'
                            : layer.type === 'avatar'
                            ? 'Avatar'
                            : 'Layer'
                        );
                        if (canvasRef.current) {
                          const rect = canvasRef.current.getBoundingClientRect();
                          setDraggingLayerId(layer.id);
                          setDragOffset({
                            dx: e.clientX - rect.left - layer.x,
                            dy: e.clientY - rect.top - layer.y,
                          });
                        }
                      }}
                      className={`absolute cursor-move transition-shadow ${
                        isSelected
                          ? 'ring-2 ring-[#00c4ff] shadow-[0_0_0_4px_rgba(0,196,255,0.18)]'
                          : 'hover:ring-1 hover:ring-[#00c4ff]/60'
                      }`}
                      style={{
                        left: `${Math.min(layer.x, project.aspect_ratio === '9:16' ? 40 : layer.x)}px`,
                        top: `${layer.y}px`,
                        width: `${Math.min(layer.width, project.aspect_ratio === '9:16' ? 240 : layer.width)}px`,
                        height: `${layer.height}px`,
                        opacity: layer.opacity,
                        transform: `rotate(${layer.rotation}deg)`,
                        zIndex: layer.zIndex,
                      }}
                    >
                      {layer.type === 'text' && (
                        <div
                          className="w-full h-full p-2 flex items-center"
                          style={{
                            fontSize: `${layer.fontSize || 28}px`,
                            fontWeight: layer.fontWeight || 700,
                            color: layer.color || '#232833',
                            lineHeight: 1.2,
                          }}
                        >
                          {layer.content}
                        </div>
                      )}

                      {(layer.type === 'avatar' || layer.type === 'image') && (
                        <img
                          src={layer.src || '/heygen-assets/thumbnails/avatar-annie-main.webp'}
                          alt={layer.name}
                          draggable={false}
                          className="w-full h-full object-contain pointer-events-none"
                        />
                      )}

                      {isSelected && (
                        <span className="absolute -top-6 left-0 px-2 py-0.5 rounded bg-[#00c4ff] text-[#232833] text-[10px] font-extrabold flex items-center gap-1">
                          <Move className="w-2.5 h-2.5" />
                          <span>{layer.name}</span>
                        </span>
                      )}
                    </div>
                  );
                })}

              {/* Live Subtitle Overlay on Canvas during Preview */}
              <div className="absolute bottom-4 left-8 right-8 text-center pointer-events-none">
                <span className="inline-block px-4 py-1.5 rounded-full bg-black/65 text-white text-[13px] font-medium backdrop-blur-sm max-w-[90%] truncate">
                  {activeScene.script}
                </span>
              </div>
            </div>
          </div>

          {/* Center Transport Controls Bar */}
          <div className="mt-3 h-11 px-5 rounded-full bg-white border border-[#eaecee] shadow-sm flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsPlayingPreview(!isPlayingPreview)}
              className="w-8 h-8 rounded-full bg-[#19191a] text-white flex items-center justify-center"
            >
              {isPlayingPreview ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>
            <div className="text-[12px] font-mono font-bold text-[#232833]">
              00:{String(Math.floor(playheadSec)).padStart(2, '0')} / 00:
              {String(Math.floor(totalDurationSec)).padStart(2, '0')}
            </div>
            <div className="h-4 w-[1px] bg-[#eaecee]" />
            <div className="text-[12px] font-semibold text-[#687080]">
              Active: <strong className="text-[#232833]">{activeScene.title}</strong>
            </div>
          </div>
        </section>

        {/* ZONE 3: RIGHT PROPERTIES INSPECTOR */}
        <aside
          className={`w-full sm:w-[310px] bg-white border-l border-[#eaecee] flex-col shrink-0 ${
            mobileStudioPane === 'inspector' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Inspector Tabs: Avatar | Voice | Text | Layer | Animation */}
          <div className="p-2 border-b border-[#eaecee] grid grid-cols-5 gap-1 bg-[#f7f8fa]">
            {(['Avatar', 'Voice', 'Text', 'Layer', 'Animation'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setRightInspectorTab(tab)}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  rightInspectorTab === tab
                    ? 'bg-white text-[#232833] shadow-sm'
                    : 'text-[#687080] hover:text-[#232833]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {rightInspectorTab === 'Avatar' && (
              <div className="space-y-4">
                <h3 className="text-[13.5px] font-extrabold text-[#232833]">Avatar Settings</h3>
                <div>
                  <label className="block text-[11.5px] font-bold text-[#4e5666] mb-1.5">
                    Display Framing Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Presenter', 'Cinematic', 'Circle', 'Voice Only'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleUpdateActiveScene({ avatar_mode: m })}
                        className={`py-2 px-3 rounded-xl border text-[12px] font-bold ${
                          activeScene.avatar_mode === m
                            ? 'border-[#00c4ff] bg-[#e3f4fa] text-[#232833]'
                            : 'border-[#eaecee] text-[#4e5666]'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-[#4e5666] mb-1.5">
                    Scene Narration Script
                  </label>
                  <textarea
                    value={activeScene.script}
                    onChange={(e) => handleUpdateActiveScene({ script: e.target.value })}
                    className="w-full h-28 p-3 rounded-xl border border-[#e2e3e6] text-[12.5px] focus:outline-none focus:border-[#00c4ff]"
                  />
                </div>
              </div>
            )}

            {rightInspectorTab === 'Voice' && (
              <div className="space-y-4">
                <h3 className="text-[13.5px] font-extrabold text-[#232833]">
                  Scene Voice & Speech
                </h3>
                <div>
                  <label className="block text-[11.5px] font-bold text-[#4e5666] mb-1.5">
                    Assigned Voice
                  </label>
                  <select
                    value={activeScene.voice_id}
                    onChange={(e) => handleUpdateActiveScene({ voice_id: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-[#e2e3e6] text-[12.5px] font-semibold"
                  >
                    {voices.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.language})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                      window.speechSynthesis.speak(
                        new SpeechSynthesisUtterance(activeScene.script)
                      );
                    }
                    showToast('Playing scene narration script');
                  }}
                  className="w-full h-9 rounded-full bg-[#19191a] text-white text-[12px] font-bold flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Preview Scene Speech</span>
                </button>
              </div>
            )}

            {rightInspectorTab === 'Text' && (
              <div className="space-y-4">
                <h3 className="text-[13.5px] font-extrabold text-[#232833]">Text Properties</h3>
                {selectedLayer && selectedLayer.type === 'text' ? (
                  <>
                    <div>
                      <label className="block text-[11.5px] font-bold text-[#4e5666] mb-1">
                        Text Content
                      </label>
                      <textarea
                        value={selectedLayer.content || ''}
                        onChange={(e) =>
                          handleUpdateLayer(selectedLayer.id, { content: e.target.value })
                        }
                        className="w-full h-20 p-2.5 rounded-xl border border-[#e2e3e6] text-[12.5px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11.5px] font-bold text-[#4e5666] mb-1">
                          Font Size (px)
                        </label>
                        <input
                          type="number"
                          value={selectedLayer.fontSize || 32}
                          onChange={(e) =>
                            handleUpdateLayer(selectedLayer.id, {
                              fontSize: Number(e.target.value),
                            })
                          }
                          className="w-full h-9 px-2.5 rounded-xl border border-[#e2e3e6] text-[12.5px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11.5px] font-bold text-[#4e5666] mb-1">
                          Text Color
                        </label>
                        <input
                          type="color"
                          value={selectedLayer.color || '#232833'}
                          onChange={(e) =>
                            handleUpdateLayer(selectedLayer.id, { color: e.target.value })
                          }
                          className="w-full h-9 rounded-xl border border-[#e2e3e6] cursor-pointer"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-[12px] text-[#687080]">
                    Select a text layer on the canvas or click &ldquo;Text&rdquo; on the left tool rail to add one.
                  </p>
                )}
              </div>
            )}

            {rightInspectorTab === 'Layer' && selectedLayer && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[13.5px] font-extrabold text-[#232833]">
                    Layer: {selectedLayer.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleDeleteLayer(selectedLayer.id)}
                    className="p-1.5 rounded-lg text-[#e54945] hover:bg-[#fff5f5]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#687080] mb-1">X (px)</label>
                    <input
                      type="number"
                      value={selectedLayer.x}
                      onChange={(e) =>
                        handleUpdateLayer(selectedLayer.id, { x: Number(e.target.value) })
                      }
                      className="w-full h-9 px-2.5 rounded-xl border border-[#e2e3e6] text-[12px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#687080] mb-1">Y (px)</label>
                    <input
                      type="number"
                      value={selectedLayer.y}
                      onChange={(e) =>
                        handleUpdateLayer(selectedLayer.id, { y: Number(e.target.value) })
                      }
                      className="w-full h-9 px-2.5 rounded-xl border border-[#e2e3e6] text-[12px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#687080] mb-1">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={selectedLayer.width}
                      onChange={(e) =>
                        handleUpdateLayer(selectedLayer.id, { width: Number(e.target.value) })
                      }
                      className="w-full h-9 px-2.5 rounded-xl border border-[#e2e3e6] text-[12px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#687080] mb-1">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={selectedLayer.height}
                      onChange={(e) =>
                        handleUpdateLayer(selectedLayer.id, { height: Number(e.target.value) })
                      }
                      className="w-full h-9 px-2.5 rounded-xl border border-[#e2e3e6] text-[12px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#687080] mb-1">
                    Opacity ({Math.round(selectedLayer.opacity * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={selectedLayer.opacity}
                    onChange={(e) =>
                      handleUpdateLayer(selectedLayer.id, { opacity: Number(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {rightInspectorTab === 'Animation' && (
              <div className="space-y-4">
                <h3 className="text-[13.5px] font-extrabold text-[#232833]">
                  Animation & Transitions
                </h3>
                <div>
                  <label className="block text-[11.5px] font-bold text-[#4e5666] mb-1.5">
                    Scene Transition
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['none', 'fade', 'slide', 'dissolve'] as const).map((tr) => (
                      <button
                        key={tr}
                        type="button"
                        onClick={() => handleUpdateActiveScene({ transition: tr })}
                        className={`py-2 px-3 rounded-xl border text-[12px] font-bold capitalize ${
                          activeScene.transition === tr
                            ? 'border-[#00c4ff] bg-[#e3f4fa] text-[#232833]'
                            : 'border-[#eaecee] text-[#4e5666]'
                        }`}
                      >
                        {tr}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedLayer && (
                  <div>
                    <label className="block text-[11.5px] font-bold text-[#4e5666] mb-1.5">
                      Layer Entrance Animation
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['none', 'fade-in', 'slide-up', 'zoom-in'] as const).map((anim) => (
                        <button
                          key={anim}
                          type="button"
                          onClick={() => handleUpdateLayer(selectedLayer.id, { animation: anim })}
                          className={`py-2 px-3 rounded-xl border text-[12px] font-bold capitalize ${
                            selectedLayer.animation === anim
                              ? 'border-[#00c4ff] bg-[#e3f4fa] text-[#232833]'
                              : 'border-[#eaecee] text-[#4e5666]'
                          }`}
                        >
                          {anim}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ZONE 4: BOTTOM MULTI-TRACK TIMELINE */}
      <footer className="h-[195px] bg-white border-t border-[#eaecee] flex flex-col shrink-0">
        {/* Timeline Header Bar */}
        <div className="h-9 px-4 border-b border-[#eaecee] flex items-center justify-between bg-[#fafbfc]">
          <div className="flex items-center gap-3 text-[12px] font-bold text-[#232833]">
            <span>Timeline</span>
            <span className="text-[#687080]">·</span>
            <label className="flex items-center gap-1.5">
              <span className="text-[#687080] font-medium">Scene Duration (s):</span>
              <input
                type="number"
                min="2"
                max="60"
                value={activeScene.duration_sec}
                onChange={(e) =>
                  handleUpdateActiveScene({
                    duration_sec: Math.max(2, Number(e.target.value) || 5),
                  })
                }
                className="w-14 h-6 px-2 rounded border border-[#e2e3e6] text-[12px] font-bold"
              />
            </label>
          </div>

          {/* Scrubbing & Zoom Controls */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-[11.5px] font-semibold text-[#687080]">
              <span>Scrub:</span>
              <input
                type="range"
                min="0"
                max={totalDurationSec}
                step="0.5"
                value={playheadSec}
                onChange={(e) => setPlayheadSec(Number(e.target.value))}
                className="w-28"
              />
            </label>
            <button
              type="button"
              onClick={() => setTimelineZoom(Math.max(0.5, timelineZoom - 0.25))}
              className="p-1 rounded hover:bg-[#eaecee]"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold text-[#4e5666]">
              {Math.round(timelineZoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setTimelineZoom(Math.min(2, timelineZoom + 0.25))}
              className="p-1 rounded hover:bg-[#eaecee]"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Multi-Track Lanes (Scenes Track + Layer Track + Audio Track) */}
        <div className="flex-1 overflow-x-auto p-3 space-y-2 relative">
          {/* Track 1: Scene Track */}
          <div className="flex items-center gap-2">
            <div className="w-24 text-[11px] font-bold text-[#687080] shrink-0">Scenes Track</div>
            <div className="flex items-center gap-2">
              {projectScenes.map((sc, i) => {
                const active = sc.id === activeScene.id;
                const widthPx = Math.max(130, sc.duration_sec * 18 * timelineZoom);
                return (
                  <div
                    key={sc.id}
                    onClick={() => setActiveScene(sc.id)}
                    style={{ width: `${widthPx}px` }}
                    className={`h-11 rounded-xl px-3 flex items-center justify-between cursor-pointer border transition-all ${
                      active
                        ? 'border-2 border-[#00c4ff] bg-[#e3f4fa]'
                        : 'border-[#e2e3e6] bg-[#f7f8fa] hover:bg-[#eff1f5]'
                    }`}
                  >
                    <span className="text-[11.5px] font-bold text-[#232833] truncate">
                      {i + 1}. {sc.title}
                    </span>
                    <span className="text-[10.5px] font-mono text-[#007091] shrink-0">
                      {sc.duration_sec}s
                    </span>
                  </div>
                );
              })}
              <button
                type="button"
                onClick={handleAddScene}
                className="h-11 px-3 rounded-xl border border-dashed border-[#cfd3dc] hover:border-[#00c4ff] text-[11.5px] font-bold text-[#687080] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Scene</span>
              </button>
            </div>
          </div>

          {/* Track 2: Layers Track */}
          <div className="flex items-center gap-2">
            <div className="w-24 text-[11px] font-bold text-[#687080] shrink-0">Layer Track</div>
            <div className="flex items-center gap-1.5">
              {activeScene.layers.map((lyr) => (
                <button
                  key={lyr.id}
                  type="button"
                  onClick={() => setSelectedLayer(lyr.id)}
                  className={`h-7 px-3 rounded-lg text-[11px] font-bold border ${
                    selectedLayer?.id === lyr.id
                      ? 'border-[#c259ff] bg-[#f9f0ff] text-[#232833]'
                      : 'border-[#eaecee] bg-white text-[#4e5666]'
                  }`}
                >
                  {lyr.name} ({lyr.type})
                </button>
              ))}
            </div>
          </div>

          {/* Track 3: Voice & Audio Track */}
          <div className="flex items-center gap-2">
            <div className="w-24 text-[11px] font-bold text-[#687080] shrink-0">Audio Track</div>
            <div className="flex-1 h-7 rounded-lg bg-[#e6f9f3] border border-[#00bf8f]/30 px-3 flex items-center justify-between text-[11px] font-semibold text-[#007a5a]">
              <span className="flex items-center gap-1.5 truncate">
                <Sparkles className="w-3 h-3" />
                <span>
                  Voice: {voices.find((v) => v.id === activeScene.voice_id)?.name || 'Annie'} ·{' '}
                  {activeScene.audio_track_url || 'Narration Audio Track'}
                </span>
              </span>
              <span>{totalDurationSec}s</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Version History Drawer */}
      {showVersionDrawer && (
        <div className="fixed top-[54px] right-0 bottom-0 w-80 bg-white border-l border-[#eaecee] shadow-2xl z-50 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-extrabold text-[#232833]">
                Project Version History
              </h3>
              <button
                type="button"
                onClick={() => setShowVersionDrawer(false)}
                className="text-xs text-[#687080]"
              >
                Close
              </button>
            </div>
            <button
              type="button"
              onClick={() =>
                updateProjectScenesWithHistory(
                  project.id,
                  (s) => s,
                  true,
                  `Checkpoint #${versionsForProject.length + 1}`
                )
              }
              className="w-full h-9 rounded-full bg-[#19191a] text-white text-[12px] font-bold mb-4"
            >
              + Save Manual Version Checkpoint
            </button>
            <div className="space-y-2 overflow-y-auto max-h-[420px]">
              {versionsForProject.map((ver) => (
                <div
                  key={ver.id}
                  className="p-3 rounded-xl border border-[#eaecee] bg-[#f7f8fa] text-[12px]"
                >
                  <div className="font-bold text-[#232833]">
                    v{ver.version_number} — {ver.label}
                  </div>
                  <div className="text-[11px] text-[#687080]">
                    {new Date(ver.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

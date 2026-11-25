'use client';

import { create } from 'zustand';
import {
  AIModelRecord,
  AIProviderRecord,
  AssetRecord,
  AvatarConsentRecord,
  AvatarRecord,
  BillingEventRecord,
  CanvasLayer,
  CreditTransactionRecord,
  CreditWalletRecord,
  GenerationJobRecord,
  NotificationRecord,
  OrganizationMemberRecord,
  OrganizationRecord,
  PlanRecord,
  ProjectRecord,
  ProjectVersionRecord,
  RenderJobRecord,
  SceneRecord,
  SubscriptionRecord,
  SystemSettingRecord,
  TemplateRecord,
  UserRecord,
  VoiceConsentRecord,
  VoiceRecord,
} from '@/lib/db/types';

export type ActiveModalType =
  | null
  | 'signin'
  | 'settings'
  | 'upgrade'
  | 'orby'
  | 'choose-avatar'
  | 'choose-voice'
  | 'create-avatar'
  | 'create-voice'
  | 'design-voice'
  | 'import-voice'
  | 'create-look'
  | 'personalize';

export interface HeyGenAppState {
  initialized: boolean;
  loading: boolean;
  user: UserRecord | null;
  organization: OrganizationRecord | null;
  organizations: OrganizationRecord[];
  members: OrganizationMemberRecord[];
  projects: ProjectRecord[];
  projectVersions: ProjectVersionRecord[];
  scenes: SceneRecord[];
  assets: AssetRecord[];
  avatars: AvatarRecord[];
  avatarConsents: AvatarConsentRecord[];
  voices: VoiceRecord[];
  voiceConsents: VoiceConsentRecord[];
  templates: TemplateRecord[];
  aiProviders: AIProviderRecord[];
  aiModels: AIModelRecord[];
  generationJobs: GenerationJobRecord[];
  renderJobs: RenderJobRecord[];
  plans: PlanRecord[];
  subscription: SubscriptionRecord | null;
  wallet: CreditWalletRecord | null;
  creditTransactions: CreditTransactionRecord[];
  billingEvents: BillingEventRecord[];
  notifications: NotificationRecord[];
  systemSettings: SystemSettingRecord[];

  // UI Navigation & Overlays
  sidebarCollapsed: boolean;
  accountMenuOpen: boolean;
  activeModal: ActiveModalType;
  settingsTab: string;
  toastMessage: string | null;

  // AI Video Studio Editor State
  activeStudioProjectId: string | null;
  activeSceneId: string | null;
  selectedLayerId: string | null;
  copiedLayer: CanvasLayer | null;
  editorUndoStack: SceneRecord[][];
  editorRedoStack: SceneRecord[][];
  isPlayingPreview: boolean;
  playheadSec: number;
  timelineZoom: number;
  autosaveStatus: 'saved' | 'saving' | 'unsaved';

  // Actions
  bootstrap: () => Promise<void>;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setAccountMenuOpen: (open: boolean) => void;
  setActiveModal: (modal: ActiveModalType, tab?: string) => void;
  showToast: (msg: string) => void;

  // Studio Editor Actions
  setActiveStudioProject: (projectId: string) => void;
  setActiveScene: (sceneId: string) => void;
  setSelectedLayer: (layerId: string | null) => void;
  updateProjectScenesWithHistory: (
    projectId: string,
    updater: (scenes: SceneRecord[]) => SceneRecord[],
    saveVersion?: boolean,
    versionLabel?: string
  ) => Promise<void>;
  undoEditor: () => Promise<void>;
  redoEditor: () => Promise<void>;
  copySelectedLayer: () => void;
  pasteCopiedLayer: () => Promise<void>;
  setIsPlayingPreview: (playing: boolean) => void;
  setPlayheadSec: (sec: number) => void;
  setTimelineZoom: (zoom: number) => void;
}

export const useHeyGenStore = create<HeyGenAppState>((set, get) => ({
  initialized: false,
  loading: false,
  user: null,
  organization: null,
  organizations: [],
  members: [],
  projects: [],
  projectVersions: [],
  scenes: [],
  assets: [],
  avatars: [],
  avatarConsents: [],
  voices: [],
  voiceConsents: [],
  templates: [],
  aiProviders: [],
  aiModels: [],
  generationJobs: [],
  renderJobs: [],
  plans: [],
  subscription: null,
  wallet: null,
  creditTransactions: [],
  billingEvents: [],
  notifications: [],
  systemSettings: [],

  sidebarCollapsed: false,
  accountMenuOpen: false,
  activeModal: null,
  settingsTab: 'Account',
  toastMessage: null,

  activeStudioProjectId: 'proj-focus-intro',
  activeSceneId: 'scn-focus-1',
  selectedLayerId: null,
  copiedLayer: null,
  editorUndoStack: [],
  editorRedoStack: [],
  isPlayingPreview: false,
  playheadSec: 0,
  timelineZoom: 1,
  autosaveStatus: 'saved',

  bootstrap: async () => {
    set({ loading: true });
    try {
      const res = await fetch('/api/bootstrap', { cache: 'no-store' });
      const data = await res.json();
      const firstProj = data.projects?.[0];
      const firstScene = data.scenes?.find((s: SceneRecord) => s.project_id === firstProj?.id);
      set({
        initialized: true,
        loading: false,
        user: data.user,
        organization: data.organization,
        organizations: data.organizations || [],
        members: data.members || [],
        projects: data.projects || [],
        projectVersions: data.project_versions || [],
        scenes: data.scenes || [],
        assets: data.assets || [],
        avatars: data.avatars || [],
        avatarConsents: data.avatar_consents || [],
        voices: data.voices || [],
        voiceConsents: data.voice_consents || [],
        templates: data.templates || [],
        aiProviders: data.ai_providers || [],
        aiModels: data.ai_models || [],
        generationJobs: data.generation_jobs || [],
        renderJobs: data.render_jobs || [],
        plans: data.plans || [],
        subscription: data.subscription || null,
        wallet: data.wallet || null,
        creditTransactions: data.credit_transactions || [],
        billingEvents: data.billing_events || [],
        notifications: data.notifications || [],
        systemSettings: data.system_settings || [],
        activeStudioProjectId: get().activeStudioProjectId || firstProj?.id || null,
        activeSceneId: get().activeSceneId || firstScene?.id || null,
      });
    } catch {
      set({ loading: false });
    }
  },

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setAccountMenuOpen: (open) => set({ accountMenuOpen: open }),
  setActiveModal: (modal, tab) =>
    set((s) => ({
      activeModal: modal,
      settingsTab: tab || s.settingsTab,
      accountMenuOpen: false,
    })),

  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      if (get().toastMessage === msg) {
        set({ toastMessage: null });
      }
    }, 3800);
  },

  setActiveStudioProject: (projectId) => {
    const projectScenes = get()
      .scenes.filter((s) => s.project_id === projectId)
      .sort((a, b) => a.order_index - b.order_index);
    set({
      activeStudioProjectId: projectId,
      activeSceneId: projectScenes[0]?.id || null,
      selectedLayerId: null,
      editorUndoStack: [],
      editorRedoStack: [],
      playheadSec: 0,
      isPlayingPreview: false,
    });
  },

  setActiveScene: (sceneId) => set({ activeSceneId: sceneId, selectedLayerId: null }),
  setSelectedLayer: (layerId) => set({ selectedLayerId: layerId }),

  updateProjectScenesWithHistory: async (projectId, updater, saveVersion = false, versionLabel) => {
    const state = get();
    const currentProjectScenes = state.scenes
      .filter((s) => s.project_id === projectId)
      .sort((a, b) => a.order_index - b.order_index);
    const snapshot = JSON.parse(JSON.stringify(currentProjectScenes)) as SceneRecord[];
    const nextProjectScenes = updater(JSON.parse(JSON.stringify(currentProjectScenes))).map(
      (sc, idx) => ({
        ...sc,
        order_index: idx,
      })
    );

    const otherScenes = state.scenes.filter((s) => s.project_id !== projectId);
    set({
      scenes: [...otherScenes, ...nextProjectScenes],
      editorUndoStack: [...state.editorUndoStack.slice(-19), snapshot],
      editorRedoStack: [],
      autosaveStatus: 'saving',
    });

    try {
      const res = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          scenes: nextProjectScenes,
          save_version: saveVersion,
          version_label: versionLabel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        set((st) => ({
          autosaveStatus: 'saved',
          projectVersions: data.versions
            ? [
                ...st.projectVersions.filter((v) => v.project_id !== projectId),
                ...data.versions,
              ]
            : st.projectVersions,
        }));
      } else {
        set({ autosaveStatus: 'unsaved' });
      }
    } catch {
      set({ autosaveStatus: 'unsaved' });
    }
  },

  undoEditor: async () => {
    const state = get();
    const projectId = state.activeStudioProjectId;
    if (!projectId || state.editorUndoStack.length === 0) return;

    const currentProjectScenes = state.scenes
      .filter((s) => s.project_id === projectId)
      .sort((a, b) => a.order_index - b.order_index);
    const prevScenes = state.editorUndoStack[state.editorUndoStack.length - 1];
    const otherScenes = state.scenes.filter((s) => s.project_id !== projectId);

    set({
      scenes: [...otherScenes, ...prevScenes],
      editorUndoStack: state.editorUndoStack.slice(0, -1),
      editorRedoStack: [...state.editorRedoStack, currentProjectScenes],
      autosaveStatus: 'saving',
    });

    await fetch('/api/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, scenes: prevScenes }),
    });
    set({ autosaveStatus: 'saved' });
  },

  redoEditor: async () => {
    const state = get();
    const projectId = state.activeStudioProjectId;
    if (!projectId || state.editorRedoStack.length === 0) return;

    const currentProjectScenes = state.scenes
      .filter((s) => s.project_id === projectId)
      .sort((a, b) => a.order_index - b.order_index);
    const nextScenes = state.editorRedoStack[state.editorRedoStack.length - 1];
    const otherScenes = state.scenes.filter((s) => s.project_id !== projectId);

    set({
      scenes: [...otherScenes, ...nextScenes],
      editorUndoStack: [...state.editorUndoStack, currentProjectScenes],
      editorRedoStack: state.editorRedoStack.slice(0, -1),
      autosaveStatus: 'saving',
    });

    await fetch('/api/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, scenes: nextScenes }),
    });
    set({ autosaveStatus: 'saved' });
  },

  copySelectedLayer: () => {
    const state = get();
    const scene = state.scenes.find((s) => s.id === state.activeSceneId);
    const layer = scene?.layers.find((l) => l.id === state.selectedLayerId);
    if (layer) {
      set({ copiedLayer: JSON.parse(JSON.stringify(layer)) });
      state.showToast(`Copied layer "${layer.name}"`);
    }
  },

  pasteCopiedLayer: async () => {
    const state = get();
    if (!state.activeStudioProjectId || !state.activeSceneId || !state.copiedLayer) return;
    const newId = `lyr-${Date.now().toString(36)}`;
    const pasted: CanvasLayer = {
      ...state.copiedLayer,
      id: newId,
      name: `${state.copiedLayer.name} (Copy)`,
      x: state.copiedLayer.x + 24,
      y: state.copiedLayer.y + 24,
      zIndex: state.copiedLayer.zIndex + 1,
    };
    await state.updateProjectScenesWithHistory(state.activeStudioProjectId, (scenes) =>
      scenes.map((sc) =>
        sc.id === state.activeSceneId ? { ...sc, layers: [...sc.layers, pasted] } : sc
      )
    );
    set({ selectedLayerId: newId });
  },

  setIsPlayingPreview: (playing) => set({ isPlayingPreview: playing }),
  setPlayheadSec: (sec) => set({ playheadSec: sec }),
  setTimelineZoom: (zoom) => set({ timelineZoom: zoom }),
}));

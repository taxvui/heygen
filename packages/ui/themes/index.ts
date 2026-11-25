import { HEYGEN_TOKENS } from '../tokens';

export type HeyGenThemeMode = 'light' | 'dark';

export const HEYGEN_THEMES = {
  light: {
    mode: 'light' as const,
    textTitle: HEYGEN_TOKENS.colors.text.title,
    textBody: HEYGEN_TOKENS.colors.text.body,
    textSupport: HEYGEN_TOKENS.colors.text.support,
    fillGeneral: HEYGEN_TOKENS.colors.surface.general,
    fillBlock: HEYGEN_TOKENS.colors.surface.block,
    fillBackground: HEYGEN_TOKENS.colors.surface.background,
    lineSolid: HEYGEN_TOKENS.colors.border.lineSolid,
    uxPrimarySelect: HEYGEN_TOKENS.colors.interaction.primarySelect,
  },
  dark: {
    mode: 'dark' as const,
    textTitle: 'rgba(255, 255, 255, 0.9)',
    textBody: 'rgba(255, 255, 255, 0.75)',
    textSupport: 'rgba(255, 255, 255, 0.5)',
    fillGeneral: '#16171a',
    fillBlock: '#1f2124',
    fillBackground: '#0d0e0f',
    lineSolid: '#26282c',
    uxPrimarySelect: '#0e3846',
  },
};

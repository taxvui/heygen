import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './packages/ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"TT Norms Pro"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        display: ['"ABC Solar Display"', '"TT Norms Pro"', 'sans-serif'],
      },
      colors: {
        brand: {
          1: '#e6f9ff',
          2: '#c2f1ff',
          3: '#91e6ff',
          4: '#5edaff',
          5: '#2ecfff',
          6: '#00c4ff',
          DEFAULT: '#00c4ff',
          7: '#00a7d9',
          8: '#008bb5',
          9: '#007091',
          10: '#005873',
        },
        hg: {
          title: '#232833',
          body: '#4e5666',
          support: '#687080',
          disable: '#bcc1cc',
          block: '#f7f8fa',
          brandBlock: '#f9feff',
          line: '#e2e3e6',
          lineSolid: '#eaecee',
          hover: '#eaecee',
          select: '#e3f4fa',
          primaryBtn: '#19191a',
          purple: '#c259ff',
          pink: '#ff5993',
          violet: '#7559ff',
          avatarPink: '#f3a6ff',
          agentCyan: '#04d3d6',
          gold: '#ffaa00',
          green: '#00bf8f',
          red: '#e54945',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        pill: '100px',
      },
      boxShadow: {
        elevated: '0px 2px 4px -2px rgba(0, 0, 0, 0.06), 0px 4px 8px -2px rgba(0, 0, 0, 0.1)',
        card: '0px 2px 10px rgba(0, 0, 0, 0.04)',
        modal: '0px 16px 48px rgba(15, 18, 25, 0.18)',
      },
    },
  },
  plugins: [],
};

export default config;

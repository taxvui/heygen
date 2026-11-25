'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'brand' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function HgButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-150 select-none disabled:opacity-50 disabled:cursor-not-allowed';
  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-[#19191a] text-white hover:bg-[#343842] active:bg-[#232833]',
    outline: 'bg-white text-[#232833] border border-[#e2e3e6] hover:bg-[#f7f8fa]',
    ghost: 'bg-transparent text-[#4e5666] hover:bg-[#eaecee] hover:text-[#232833]',
    brand: 'bg-[#00c4ff] text-[#232833] hover:bg-[#2ecfff]',
    glass:
      'bg-white/20 text-white border border-white/45 backdrop-blur-md hover:bg-white/30 shadow-sm',
    danger: 'bg-[#e54945] text-white hover:bg-[#d13b37]',
  };
  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'h-8 px-3.5 text-[12px]',
    md: 'h-9 px-4 text-[13px]',
    lg: 'h-11 px-6 text-[14px]',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function HgUnderlineTabs({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: { id: string; label: string; count?: number }[];
  activeTab: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-7 border-b border-transparent">
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative pb-2.5 text-[15px] font-bold transition-colors ${
              active ? 'text-[#232833]' : 'text-[#687080] hover:text-[#232833]'
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span className="ml-1.5 text-[12px] font-medium text-[#687080]">({tab.count})</span>
            )}
            {active && (
              <span className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-[#00c4ff]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function HgPillSegmented({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full bg-[#f2f3f5] p-1 border border-[#eaecee]">
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
              active
                ? 'bg-white text-[#232833] shadow-sm'
                : 'text-[#687080] hover:text-[#232833]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function HgCategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 px-3.5 rounded-full text-[13px] font-semibold transition-all border ${
        active
          ? 'bg-[#e3f4fa] text-[#232833] border-[#00c4ff]'
          : 'bg-white text-[#232833] border-[#e2e3e6] hover:bg-[#f7f8fa]'
      }`}
    >
      {label}
    </button>
  );
}

export function HgModal({
  open,
  onClose,
  children,
  maxWidth = 'max-w-[410px]',
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1219]/45 backdrop-blur-[4px] p-4"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidth} rounded-[20px] bg-white shadow-[0_16px_48px_rgba(15,18,25,0.18)] border border-[#eaecee] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

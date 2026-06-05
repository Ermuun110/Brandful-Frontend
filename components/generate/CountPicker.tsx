"use client";

const MIN = 1;
const MAX = 8;

interface CountPickerProps {
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
}

export function CountPicker({ value, onChange, disabled }: CountPickerProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
        Number of Images
      </label>
      <div className="flex items-center rounded-xl overflow-hidden border border-white/[0.08] bg-zinc-900/60">
        <button
          onClick={() => onChange(Math.max(MIN, value - 1))}
          disabled={disabled || value <= MIN}
          className="px-4 py-2.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-base font-light border-r border-white/[0.06]"
          aria-label="Decrease"
        >
          −
        </button>
        <div className="flex-1 flex items-center justify-center gap-1 py-2.5">
          <span className="text-sm font-semibold text-zinc-100 tabular-nums">{value}</span>
          <span className="text-xs text-zinc-600">/ {MAX}</span>
        </div>
        <button
          onClick={() => onChange(Math.min(MAX, value + 1))}
          disabled={disabled || value >= MAX}
          className="px-4 py-2.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-base font-light border-l border-white/[0.06]"
          aria-label="Increase"
        >
          +
        </button>
      </div>
    </div>
  );
}

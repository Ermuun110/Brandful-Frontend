"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { AspectRatio } from "@/lib/types";

interface AspectRatioOption {
  value: AspectRatio;
  label: string;
  w: number;
  h: number;
  description: string;
}

const OPTIONS: AspectRatioOption[] = [
  { value: "1:1",  label: "Square",    w: 1,  h: 1,  description: "Instagram, profile pics" },
  { value: "16:9", label: "Landscape", w: 16, h: 9,  description: "YouTube, presentations" },
  { value: "9:16", label: "Portrait",  w: 9,  h: 16, description: "Stories, Reels, TikTok" },
  { value: "4:3",  label: "Classic",   w: 4,  h: 3,  description: "Print, editorial" },
  { value: "3:2",  label: "Photo",     w: 3,  h: 2,  description: "DSLR standard, banners" },
];

function RatioShape({ w, h, active }: { w: number; h: number; active: boolean }) {
  const maxW = 32;
  const maxH = 26;
  const scale = Math.min(maxW / w, maxH / h);
  const width  = Math.round(w * scale);
  const height = Math.round(h * scale);
  return (
    <div className="flex items-center justify-center w-9 h-7">
      <div
        style={{ width, height }}
        className={`rounded-sm border transition-colors duration-150 ${
          active ? "border-violet-500 bg-violet-500/25" : "border-zinc-600 bg-zinc-800"
        }`}
      />
    </div>
  );
}

interface AspectRatioPickerProps {
  value: AspectRatio;
  onChange: (v: AspectRatio) => void;
  disabled?: boolean;
}

export function AspectRatioPicker({ value, onChange, disabled }: AspectRatioPickerProps) {
  const [open, setOpen] = useState(false);
  const selected = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];

  const handleSelect = (opt: AspectRatioOption) => {
    onChange(opt.value);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
        Aspect Ratio
      </label>

      <div className="flex flex-col rounded-xl border overflow-hidden transition-colors duration-200"
        style={{
          borderColor: open ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.08)",
          boxShadow: open ? "0 0 0 1px rgba(124,58,237,0.2)" : "none",
        }}
      >
        {/* Trigger button */}
        <button
          onClick={() => setOpen((p) => !p)}
          disabled={disabled}
          className={`w-full flex items-center justify-between gap-3 px-3.5 py-3 transition-colors duration-200 cursor-pointer disabled:opacity-40 ${
            open ? "bg-zinc-900" : "bg-zinc-900/60 hover:bg-zinc-900"
          }`}
        >
          <div className="flex items-center gap-3">
            <RatioShape w={selected.w} h={selected.h} active />
            <div className="text-left">
              <p className="text-sm font-medium text-zinc-200 leading-none">{selected.value}</p>
              <p className="text-xs text-zinc-500 mt-1 leading-none">{selected.label}</p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Inline expand — CSS grid trick for smooth open/close */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: open ? "1fr" : "0fr",
            transition: "grid-template-rows 260ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="overflow-hidden">
            <div className="border-t border-white/[0.06] bg-zinc-950">
              {OPTIONS.map((opt, i) => {
                const active = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors duration-100 cursor-pointer text-left ${
                      active
                        ? "bg-violet-600/12 text-zinc-100"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                    } ${i !== 0 ? "border-t border-white/[0.05]" : ""}`}
                  >
                    <RatioShape w={opt.w} h={opt.h} active={active} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium leading-none">{opt.value}</span>
                        <span className={`text-xs leading-none ${active ? "text-zinc-400" : "text-zinc-600"}`}>
                          {opt.label}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 leading-none ${active ? "text-zinc-500" : "text-zinc-700"}`}>
                        {opt.description}
                      </p>
                    </div>
                    {active && <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

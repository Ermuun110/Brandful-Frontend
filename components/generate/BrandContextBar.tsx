"use client";

import { ShieldCheck, Palette, BookOpen, Zap } from "lucide-react";

const BRAND_ITEMS = [
  {
    icon: Palette,
    label: "Midnight Cobalt",
    sub: "Primary palette",
    color: "text-blue-400",
  },
  {
    icon: BookOpen,
    label: "Confident & Clean",
    sub: "Tone of voice",
    color: "text-orange-400",
  },
  {
    icon: ShieldCheck,
    label: "12 guidelines",
    sub: "Do's & don'ts active",
    color: "text-emerald-400",
  },
  {
    icon: Zap,
    label: "House style",
    sub: "Typography rules loaded",
    color: "text-amber-400",
  },
];

export function BrandContextBar() {
  return (
    <div className="flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          Brand Context
        </span>
      </div>

      {/* Brand name */}
      <div className="px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.06]">
        <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-0.5">Active brand</p>
        <p className="text-sm font-semibold text-zinc-100">Acme Corporation</p>
      </div>

      {/* 2×2 grid of brand items */}
      <div className="grid grid-cols-2 gap-2">
        {BRAND_ITEMS.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-1.5 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.05]"
          >
            <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
            <div>
              <p className="text-xs font-medium text-zinc-300 leading-tight">{item.label}</p>
              <p className="text-[11px] text-zinc-600 leading-tight mt-0.5">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

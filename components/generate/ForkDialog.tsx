"use client";

import { useEffect, useRef, useState } from "react";
import { GitBranch, Layers, X } from "lucide-react";

interface ForkDialogProps {
  open: boolean;
  onConfirm: (name: string) => void;
  onCancel: () => void;
  mode?: "fork" | "new";
  defaultName?: string;
}

const CONFIG = {
  fork: {
    icon: <GitBranch className="w-4 h-4 text-violet-400" />,
    title: "Fork conversation",
    subtitle: "Explore a new direction in parallel",
    body: "Forking copies your current prompt, references, and results into a new session. Both branches evolve independently.",
    label: "Branch name",
    placeholder: "e.g. Warmer tones experiment",
    fallback: "Branch",
    confirm: "Fork session",
  },
  new: {
    icon: <Layers className="w-4 h-4 text-zinc-400" />,
    title: "New session",
    subtitle: "Start a fresh generation",
    body: "A new session starts with a blank slate. Your existing sessions stay intact and you can switch between them anytime.",
    label: "Session name",
    placeholder: "e.g. Summer campaign",
    fallback: "",
    confirm: "Create session",
  },
};

export function ForkDialog({ open, onConfirm, onCancel, mode = "fork", defaultName = "" }: ForkDialogProps) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const cfg = CONFIG[mode];

  useEffect(() => {
    if (open) {
      setName(defaultName);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open, defaultName]);

  if (!open) return null;

  const handleConfirm = () => {
    const val = name.trim() || defaultName || cfg.fallback;
    if (!val) return;
    onConfirm(val);
    setName("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl border border-white/[0.10] bg-zinc-950 p-6 scale-in shadow-2xl">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-lg text-zinc-600 hover:text-zinc-400 hover:bg-white/5 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center">
            {cfg.icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">{cfg.title}</h3>
            <p className="text-xs text-zinc-500">{cfg.subtitle}</p>
          </div>
        </div>

        <div className="rounded-xl bg-zinc-900/60 border border-white/[0.06] p-3 mb-4">
          <p className="text-[11px] text-zinc-500 leading-relaxed">{cfg.body}</p>
        </div>

        <div className="mb-4">
          <label className="text-xs text-zinc-500 block mb-1.5">{cfg.label}</label>
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirm();
              if (e.key === "Escape") onCancel();
            }}
            placeholder={cfg.placeholder}
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/[0.07] text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-white/[0.07] text-xs text-zinc-400 hover:text-zinc-300 hover:bg-white/[0.03] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={mode === "new" && !name.trim()}
            className="flex-1 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium text-white transition-all cursor-pointer"
          >
            {cfg.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}

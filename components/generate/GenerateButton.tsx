"use client";

import { Wand2, Loader2 } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
}

export function GenerateButton({ onClick, loading, disabled }: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        w-full flex items-center justify-center gap-2.5 h-11 rounded-xl font-semibold text-sm
        transition-all duration-200 cursor-pointer
        ${loading || disabled
          ? "bg-orange-900/40 text-orange-400/60 cursor-not-allowed"
          : "bg-orange-500 hover:bg-orange-400 text-white shadow-[0_4px_24px_rgba(249,115,22,0.35)] hover:shadow-[0_4px_32px_rgba(249,115,22,0.5)] active:scale-[0.98]"
        }
      `}
      style={
        !loading && !disabled
          ? { backgroundImage: "linear-gradient(135deg, #f97316 0%, #ea580c 60%, #c2410c 100%)" }
          : undefined
      }
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating…</span>
        </>
      ) : (
        <>
          <Wand2 className="w-4 h-4" />
          <span>Generate Images</span>
        </>
      )}
    </button>
  );
}

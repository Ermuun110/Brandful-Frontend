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
          ? "bg-violet-800/40 text-violet-400/60 cursor-not-allowed"
          : "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_4px_24px_rgba(124,58,237,0.35)] hover:shadow-[0_4px_32px_rgba(124,58,237,0.5)] active:scale-[0.98]"
        }
      `}
      style={
        !loading && !disabled
          ? { backgroundImage: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)" }
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

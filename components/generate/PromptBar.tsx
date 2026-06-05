"use client";

import { useRef, useState } from "react";
import { Wand2, X, Loader2 } from "lucide-react";

interface PromptBarProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

const MAX_CHARS = 600;

const AUTO_PROMPTS = [
  "A minimalist product shot against a deep charcoal background, soft directional lighting, premium studio feel, on-brand color accents",
  "Lifestyle photography of a person using the product outdoors, golden hour light, warm tones, authentic and confident mood",
  "Bold editorial composition, high contrast black and white with a single color pop, typographic energy, magazine quality",
  "Close-up texture shot of the product materials, macro lens style, clean and considered framing, premium craftsmanship",
  "Campaign hero image with the product centered, negative space composition, clean background, brand palette colors",
];

let promptIndex = 0;

export function PromptBar({ value, onChange, disabled }: PromptBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const [filling, setFilling] = useState(false);

  const remaining = MAX_CHARS - value.length;
  const overLimit = remaining < 0;

  const handleAutoFill = async () => {
    if (filling || disabled) return;
    setFilling(true);

    const prompt = AUTO_PROMPTS[promptIndex % AUTO_PROMPTS.length];
    promptIndex++;

    // Typewriter effect
    onChange("");
    await new Promise((r) => setTimeout(r, 120));

    for (let i = 0; i <= prompt.length; i++) {
      onChange(prompt.slice(0, i));
      await new Promise((r) => setTimeout(r, 12));
    }

    setFilling(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          Prompt
        </label>
        <span className={`text-[11px] tabular-nums ${overLimit ? "text-red-400" : "text-zinc-600"}`}>
          {remaining}
        </span>
      </div>

      <div
        className={`relative rounded-xl transition-all duration-200 ${
          focused
            ? "ring-1 ring-violet-400/60 shadow-[0_0_16px_rgba(124,58,237,0.15)]"
            : "ring-1 ring-white/[0.1]"
        }`}
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled || filling}
          placeholder="Describe the image you want to create…"
          rows={5}
          maxLength={MAX_CHARS + 20}
          className="w-full resize-none bg-transparent px-4 pt-4 pb-12 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none leading-relaxed disabled:opacity-50"
        />

        {/* Bottom toolbar inside the box */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2.5 border-t border-white/[0.05]">
          <button
            onClick={handleAutoFill}
            disabled={disabled || filling}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-violet-300 hover:bg-violet-500/10 border border-white/[0.06] hover:border-violet-500/30 transition-all duration-150 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            {filling ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Wand2 className="w-3.5 h-3.5" />
            )}
            {filling ? "Writing…" : "Auto-fill"}
          </button>

          {value && !filling && (
            <button
              onClick={() => onChange("")}
              className="p-1 rounded-md text-zinc-700 hover:text-zinc-400 hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Clear prompt"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {value && !filling && (
        <p className="text-[11px] text-zinc-700">
          Edit freely — this is your starting point.
        </p>
      )}
    </div>
  );
}

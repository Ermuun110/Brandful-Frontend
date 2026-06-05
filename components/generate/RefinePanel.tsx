"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Send, GitBranch, Loader2, Copy, RotateCcw, ArrowLeft, Maximize2, ChevronDown } from "lucide-react";
import { ChatMessage, GeneratedImage, getComplianceColor, getComplianceTier } from "@/lib/types";

const ASPECT_RATIO_CLASS: Record<string, string> = {
  "1:1": "aspect-square",
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16]",
  "4:3": "aspect-[4/3]",
  "3:2": "aspect-[3/2]",
};

const TIER_LABELS: Record<string, string> = {
  excellent: "Excellent match",
  good: "On-brand",
  moderate: "Moderate",
  poor: "Off-brand",
};

function ScoreBlock({ image }: { image: GeneratedImage }) {
  const [open, setOpen] = useState(false);
  const colors = getComplianceColor(image.complianceScore);
  const tier = getComplianceTier(image.complianceScore);
  const label = TIER_LABELS[tier];
  const bd = image.complianceBreakdown;

  return (
    <div className="mt-3 select-none">
      {/* Score row */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-bold tabular-nums leading-none ${colors.text}`}>
            {image.complianceScore}
          </span>
          <span className="text-sm text-gray-400 leading-none">/100</span>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
          {label}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-all duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Breakdown */}
      {open && (
        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
          {(
            [
              ["Color", bd.colorPalette],
              ["Type", bd.typography],
              ["Tone", bd.tone],
              ["Comp", bd.composition],
            ] as [string, number][]
          ).map(([key, val]) => {
            const c = getComplianceColor(val);
            return (
              <div key={key} className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-400">{key}</span>
                <span className={`text-[11px] font-semibold tabular-nums ${c.text}`}>{val}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function RefinePanelSkeleton({ aspectRatio }: { aspectRatio: string }) {
  const aspectClass = ASPECT_RATIO_CLASS[aspectRatio] ?? "aspect-square";
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gray-200 animate-pulse" />
          <div className="w-20 h-3 rounded-full bg-gray-200 animate-pulse" />
        </div>
        <div className="w-16 h-7 rounded-lg bg-gray-200 animate-pulse" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-[860px] mx-auto px-6 py-6 flex flex-col gap-1">
          {/* Image */}
          <div className="py-3">
            <div className="rounded-xl overflow-hidden border border-gray-200" style={{ maxWidth: 200 }}>
              <div className={`w-full ${aspectClass} bg-gray-100 animate-pulse`} />
            </div>
            {/* Score */}
            <div className="mt-3 flex items-center gap-3">
              <div className="w-12 h-8 rounded bg-gray-200 animate-pulse" />
              <div className="w-24 h-6 rounded-full bg-gray-200 animate-pulse" />
            </div>
          </div>

          {/* AI message */}
          <div className="py-3 flex flex-col gap-2">
            <div className="h-3.5 w-3/4 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-3.5 w-1/2 rounded-full bg-gray-200 animate-pulse" />
          </div>

          {/* Spinner */}
          <div className="flex items-center gap-2 py-2">
            <Loader2 className="w-3.5 h-3.5 text-gray-400 animate-spin" />
            <span className="text-sm text-gray-400">Generating…</span>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-gray-200 px-6 py-4">
        <div className="max-w-[860px] mx-auto flex gap-3 items-end">
          <div className="flex-1 h-11 rounded-xl bg-gray-100 animate-pulse" />
          <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

interface RefinePanelProps {
  selectedImage: GeneratedImage | null;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onFork: () => void;
  onClose: () => void;
  onZoom?: () => void;
  loading: boolean;
}

export function RefinePanel({
  selectedImage,
  messages,
  onSendMessage,
  onFork,
  onClose,
  onZoom,
  loading,
}: RefinePanelProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    onSendMessage(text);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content).catch(() => {});
  };

  if (!selectedImage) return null;

  const aspectClass = ASPECT_RATIO_CLASS[selectedImage.aspectRatio] ?? "aspect-square";

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
            aria-label="Back to results"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <p className="text-xs font-medium text-gray-500">Refine image</p>
        </div>
        <button
          onClick={onFork}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-all cursor-pointer"
        >
          <GitBranch className="w-3.5 h-3.5" />
          Fork
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-[860px] mx-auto px-6 py-6 flex flex-col gap-1">

          {/* AI image message — always left-aligned */}
          <div className="group py-3 w-full">
            <div
              className="relative overflow-hidden rounded-xl border border-gray-200 cursor-pointer"
              style={{ maxWidth: 200 }}
              onClick={onZoom}
            >
              <div className={`relative w-full ${aspectClass}`}>
                <Image
                  src={selectedImage.url}
                  alt="Generated"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="200px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <Maximize2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 drop-shadow transition-opacity" />
                </div>
              </div>
            </div>
            <ScoreBlock image={selectedImage} />
          </div>

          {/* Thread messages */}
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.role === "assistant" ? (
                <div className="group relative py-3 w-full">
                  <p className="text-base leading-relaxed text-gray-800">
                    {msg.content}
                  </p>
                  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(msg.content)}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer">
                      <RotateCcw className="w-3 h-3" />
                      Retry
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end py-1.5">
                  <div
                    className="text-base leading-relaxed px-4 py-2.5 text-white"
                    style={{
                      maxWidth: "70%",
                      background: "#061535",
                      borderRadius: "18px 18px 4px 18px",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="py-3 w-full">
              <div className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-gray-400 animate-spin" />
                <span className="text-sm text-gray-400">Generating…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-gray-200 px-6 py-4">
        <div className="max-w-[860px] mx-auto">
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Describe what to change…"
              rows={1}
              disabled={loading}
              className="flex-1 resize-none rounded-xl px-4 py-3 text-base text-gray-800 placeholder:text-gray-400 bg-gray-50 border border-gray-200 focus:border-violet-400 focus:outline-none transition-colors leading-relaxed disabled:opacity-50"
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="shrink-0 w-10 h-10 rounded-xl bg-[#061535] hover:bg-[#0a2050] disabled:bg-gray-100 disabled:text-gray-400 text-white flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}

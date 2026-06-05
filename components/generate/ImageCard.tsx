"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, MessageSquarePlus, CheckCircle2, ChevronDown, ChevronUp, Expand } from "lucide-react";
import { GeneratedImage, AspectRatio, getComplianceColor } from "@/lib/types";
import { ComplianceBadge } from "./ComplianceBadge";

const AR_CSS: Record<AspectRatio, string> = {
  "1:1":  "1 / 1",
  "16:9": "16 / 9",
  "9:16": "9 / 16",
  "4:3":  "4 / 3",
  "3:2":  "3 / 2",
};

interface ImageCardProps {
  image: GeneratedImage;
  index: number;
  aspectRatio: AspectRatio;
  onRefine: (image: GeneratedImage) => void;
  onZoom: (image: GeneratedImage) => void;
}

export function ImageCard({ image, index, aspectRatio, onRefine, onZoom }: ImageCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const breakdown = [
    { label: "Colors", score: image.complianceBreakdown.colorPalette },
    { label: "Typography", score: image.complianceBreakdown.typography },
    { label: "Tone", score: image.complianceBreakdown.tone },
    { label: "Composition", score: image.complianceBreakdown.composition },
  ];

  const barColor =
    image.complianceScore >= 85
      ? "bg-emerald-500"
      : image.complianceScore >= 65
      ? "bg-amber-500"
      : image.complianceScore >= 45
      ? "bg-orange-500"
      : "bg-red-500";

  return (
    <div
      className="fade-up group flex flex-col rounded-xl overflow-hidden border border-white/[0.07] bg-zinc-900 hover:border-white/[0.14] transition-all duration-200"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Image — aspect ratio driven by selection, not hardcoded */}
      <div
        className="relative overflow-hidden cursor-zoom-in"
        style={{ aspectRatio: AR_CSS[aspectRatio] }}
        onClick={() => onZoom(image)}
      >
        <Image
          src={image.url}
          alt={`Generated image ${index + 1}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 1024px) 33vw, 25vw"
          unoptimized
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute bottom-2 left-2 right-2 flex gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); onRefine(image); }}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-orange-500/90 hover:bg-orange-400 text-white text-[11px] font-medium transition-colors cursor-pointer"
            >
              <MessageSquarePlus className="w-3 h-3" />
              Refine
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Download"
            >
              <Download className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Index badge */}
        <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <span className="text-[10px] font-semibold text-white">{index + 1}</span>
        </div>

        {/* Zoom hint */}
        <div className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/40 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <Expand className="w-3 h-3" />
        </div>
      </div>

      {/* Score footer */}
      <div className="px-2.5 pt-2 pb-2.5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <ComplianceBadge score={image.complianceScore} size="sm" showLabel={false} />
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="flex items-center gap-0.5 text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
          >
            {showBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        <div className="h-0.5 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${image.complianceScore}%` }}
          />
        </div>

        {showBreakdown && (
          <div className="pt-0.5 flex flex-col gap-1 scale-in">
            {breakdown.map((item) => {
              const c = getComplianceColor(item.score);
              return (
                <div key={item.label} className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-zinc-600">{item.label}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-12 h-0.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div className={`h-full rounded-full ${c.dot}`} style={{ width: `${item.score}%` }} />
                    </div>
                    <span className={`text-[10px] font-medium tabular-nums ${c.text}`}>{item.score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {image.complianceScore >= 85 && !showBreakdown && (
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] text-emerald-600 font-medium">Ready to use</span>
          </div>
        )}
      </div>
    </div>
  );
}

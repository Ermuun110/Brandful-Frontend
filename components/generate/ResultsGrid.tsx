"use client";

import { GeneratedImage, AspectRatio } from "@/lib/types";
import { ImageCard } from "./ImageCard";
import { Wand2, Sparkles } from "lucide-react";

interface ResultsGridProps {
  images: GeneratedImage[];
  count: number;
  aspectRatio: AspectRatio;
  loading: boolean;
  onRefine: (image: GeneratedImage) => void;
  onZoom: (image: GeneratedImage) => void;
}

function gridCols(n: number, ar: AspectRatio): string {
  // Portrait: images are tall — fewer cols keeps them visible, not slivers
  if (ar === "9:16") {
    if (n === 1) return "grid-cols-1";
    if (n <= 3) return "grid-cols-3";
    if (n <= 6) return "grid-cols-3";
    return "grid-cols-4";
  }
  // Landscape: images are wide — fewer cols keeps them legible
  if (ar === "16:9") {
    if (n === 1) return "grid-cols-1";
    if (n <= 4) return "grid-cols-2";
    if (n <= 6) return "grid-cols-3";
    return "grid-cols-4";
  }
  // Square, 4:3, 3:2
  if (n === 1) return "grid-cols-1";
  if (n === 2) return "grid-cols-2";
  if (n === 3) return "grid-cols-3";
  if (n === 4) return "grid-cols-2";
  if (n <= 6) return "grid-cols-3";
  return "grid-cols-4";
}

function SkeletonCard({ aspectRatio }: { aspectRatio: AspectRatio }) {
  const arMap: Record<AspectRatio, string> = {
    "1:1": "1 / 1",
    "16:9": "16 / 9",
    "9:16": "9 / 16",
    "4:3": "4 / 3",
    "3:2": "3 / 2",
  };
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.05]">
      <div className="shimmer" style={{ aspectRatio: arMap[aspectRatio] }} />
      <div className="p-2.5 flex flex-col gap-1.5">
        <div className="h-4 w-20 rounded-full shimmer" />
        <div className="h-1 rounded-full shimmer" />
      </div>
    </div>
  );
}

export function ResultsGrid({ images, count, aspectRatio, loading, onRefine, onZoom }: ResultsGridProps) {
  if (!loading && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-5 text-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "#061535" }}>
            <Wand2 className="w-7 h-7 text-white/40" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500/20 border border-orange-400/30 flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-orange-400" />
          </div>
        </div>
        <div>
          <p className="text-base font-semibold text-gray-500">No images yet</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            Write a prompt on the left, pick references, and hit Generate
          </p>
        </div>
        <div className="flex flex-col gap-1.5 text-left">
          {["Add a clear prompt describing your scene", "Select brand references to anchor the style", "Choose an aspect ratio for your output"].map((tip) => (
            <div key={tip} className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
              {tip}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cols = gridCols(count, aspectRatio);
  const singleCentered = count === 1;

  return (
    <div
      className={`grid gap-3 ${cols}`}
      style={singleCentered ? { maxWidth: 360 } : undefined}
    >
      {loading
        ? Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} aspectRatio={aspectRatio} />
          ))
        : images.map((img, i) => (
            <ImageCard
              key={img.id}
              image={img}
              index={i}
              aspectRatio={aspectRatio}
              onRefine={onRefine}
              onZoom={onZoom}
            />
          ))}
    </div>
  );
}

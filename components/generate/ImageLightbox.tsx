"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GeneratedImage } from "@/lib/types";

interface ImageLightboxProps {
  images: GeneratedImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function ImageLightbox({ images, index, onClose, onNavigate }: ImageLightboxProps) {
  const image = images[index];
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onNavigate(index - 1);
      if (e.key === "ArrowRight" && hasNext) onNavigate(index + 1);
    },
    [onClose, onNavigate, index, hasPrev, hasNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ animation: "fadeIn 0.18s ease-out" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/88 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Nav + image row */}
      <div className="relative z-10 flex items-center gap-3" style={{ maxWidth: "90vw" }}>
        <button
          onClick={() => hasPrev && onNavigate(index - 1)}
          disabled={!hasPrev}
          className="p-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] text-white border border-white/[0.1] transition-all duration-150 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shrink-0"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Image */}
        <div
          className="relative rounded-2xl overflow-hidden border border-white/[0.12] shadow-2xl"
          style={{
            width: "min(72vw, 72vh)",
            height: "min(72vw, 72vh)",
            animation: "lightboxZoom 0.24s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <Image
            src={image.url}
            alt={`Generated image ${index + 1}`}
            fill
            className="object-cover"
            sizes="72vw"
            unoptimized
            priority
          />

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-12 pb-4 px-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 tabular-nums">
                {index + 1} / {images.length}
              </span>
              <span
                className={`text-sm font-bold tabular-nums ${
                  image.complianceScore >= 85
                    ? "text-emerald-400"
                    : image.complianceScore >= 65
                    ? "text-amber-400"
                    : "text-red-400"
                }`}
              >
                {image.complianceScore}
                <span className="text-[11px] font-normal text-zinc-500 ml-0.5">/100</span>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => hasNext && onNavigate(index + 1)}
          disabled={!hasNext}
          className="p-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] text-white border border-white/[0.1] transition-all duration-150 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shrink-0"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={`rounded-full transition-all duration-200 cursor-pointer ${
                i === index
                  ? "w-4 h-1.5 bg-orange-400"
                  : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 p-2 rounded-full bg-white/[0.08] hover:bg-white/[0.16] text-white border border-white/[0.1] transition-all cursor-pointer"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

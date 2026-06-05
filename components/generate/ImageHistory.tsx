"use client";

import Image from "next/image";
import { Images } from "lucide-react";
import { GeneratedImage } from "@/lib/types";
import { getComplianceColor } from "@/lib/types";
import { SessionData } from "@/app/generate/types";

interface HistoryEntry {
  image: GeneratedImage;
  sessionId: string;
  sessionName: string;
}

interface ImageHistoryProps {
  sessions: SessionData[];
  activeSessionId: string;
  onSelect: (sessionId: string, image: GeneratedImage) => void;
}

export function ImageHistory({ sessions, activeSessionId, onSelect }: ImageHistoryProps) {
  const entries: HistoryEntry[] = sessions
    .flatMap((s) =>
      s.results.map((img) => ({
        image: img,
        sessionId: s.id,
        sessionName: s.name,
      }))
    )
    .reverse();

  return (
    <aside className="w-[220px] shrink-0 flex flex-col border-l border-gray-200 overflow-hidden bg-white">
      {/* Header */}
      <div className="shrink-0 px-4 pt-5 pb-3 flex items-center gap-2">
        <Images className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Generated</span>
        {entries.length > 0 && (
          <span className="ml-auto text-[10px] text-gray-400 tabular-nums">{entries.length}</span>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Images className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Images appear<br />after generation
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {entries.map((entry) => {
              const colors = getComplianceColor(entry.image.complianceScore);
              const isFromActive = entry.sessionId === activeSessionId;
              return (
                <button
                  key={`${entry.sessionId}-${entry.image.id}`}
                  onClick={() => onSelect(entry.sessionId, entry.image)}
                  className={`w-full flex items-center gap-2.5 p-1.5 rounded-xl text-left transition-all cursor-pointer group ${
                    isFromActive
                      ? "bg-gray-100 hover:bg-gray-150"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                    <Image
                      src={entry.image.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="40px"
                      unoptimized
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[11px] text-gray-500 truncate leading-none">{entry.sessionName}</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className={`text-sm font-bold tabular-nums leading-none ${colors.text}`}>
                        {entry.image.complianceScore}
                      </span>
                      <span className="text-[10px] text-gray-400 leading-none">/100</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}

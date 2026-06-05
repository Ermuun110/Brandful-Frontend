"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Layers, Settings, Bell } from "lucide-react";

import { ChatMessage, GeneratedImage } from "@/lib/types";
import { MOCK_GENERATED_IMAGES, MOCK_CHAT_MESSAGES, MOCK_REFERENCE_IMAGES } from "@/lib/mock-data";
import { SessionData, makeSession } from "@/app/generate/types";
import { PromptBar } from "@/components/generate/PromptBar";
import { ReferencePanel } from "@/components/generate/ReferencePanel";
import { AspectRatioPicker } from "@/components/generate/AspectRatioPicker";
import { GenerateButton } from "@/components/generate/GenerateButton";
import { ResultsGrid } from "@/components/generate/ResultsGrid";
import { RefinePanel, RefinePanelSkeleton } from "@/components/generate/RefinePanel";
import { ForkDialog } from "@/components/generate/ForkDialog";
import { BrandContextBar } from "@/components/generate/BrandContextBar";
import { ImageLightbox } from "@/components/generate/ImageLightbox";
import { SessionTree } from "@/components/generate/SessionTree";
import { ImageHistory } from "@/components/generate/ImageHistory";
import { Separator } from "@/components/ui/separator";

let mainCount = 1;

export default function GeneratePage() {
  const [sessions, setSessions] = useState<SessionData[]>([
    makeSession({ id: "main", name: "Main" }),
  ]);
  const [activeId, setActiveId] = useState("main");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxImages, setLightboxImages] = useState<GeneratedImage[]>([]);
  const [forkDialogOpen, setForkDialogOpen] = useState(false);
  const [suggestedForkName, setSuggestedForkName] = useState("");
  const [newSessionDialogOpen, setNewSessionDialogOpen] = useState(false);
  const [newlyForkedId, setNewlyForkedId] = useState<string | null>(null);

  const active = useMemo(() => sessions.find((s) => s.id === activeId)!, [sessions, activeId]);

  const patchActive = useCallback(
    (patch: Partial<SessionData>) => {
      setSessions((prev) => prev.map((s) => (s.id === activeId ? { ...s, ...patch } : s)));
    },
    [activeId]
  );

  const handleGenerate = useCallback(async () => {
    if (!active.prompt.trim()) {
      toast.error("Write a prompt first");
      return;
    }
    patchActive({ generating: true, selectedImage: null, messages: [], results: [] });
    await new Promise((r) => setTimeout(r, 2800));
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeId
          ? { ...s, generating: false, results: MOCK_GENERATED_IMAGES.slice(0, 1), messages: MOCK_CHAT_MESSAGES, selectedImage: MOCK_GENERATED_IMAGES[0] }
          : s
      )
    );
    toast.success("Image generated");
  }, [active.prompt, activeId, patchActive]);

  const handleRefine = useCallback(
    (image: GeneratedImage) => patchActive({ selectedImage: image }),
    [patchActive]
  );

  const handleZoom = useCallback(
    (image: GeneratedImage) => {
      const idx = active.results.findIndex((r) => r.id === image.id);
      if (idx !== -1) {
        setLightboxImages(active.results);
        setLightboxIndex(idx);
      }
    },
    [active.results]
  );

  const handleHistorySelect = useCallback(
    (sessionId: string, image: GeneratedImage) => {
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) return;
      const idx = session.results.findIndex((r) => r.id === image.id);
      if (idx !== -1) {
        setLightboxImages(session.results);
        setLightboxIndex(idx);
      }
    },
    [sessions]
  );

  const handleSendMessage = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date(),
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeId ? { ...s, messages: [...s.messages, userMsg], refineLoading: true } : s
        )
      );
      await new Promise((r) => setTimeout(r, 1800));
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: `Got it. Regenerating with "${text.toLowerCase()}" applied to your brand context. New images coming.`,
        timestamp: new Date(),
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? { ...s, messages: [...s.messages, assistantMsg], refineLoading: false }
            : s
        )
      );
      toast.success("Refining images…");
    },
    [activeId]
  );

  const handleForkConfirm = useCallback(
    (name: string) => {
      const newId = `session-${Date.now()}`;
      const forked = makeSession({
        id: newId,
        name,
        parentSessionId: activeId,
        prompt: active.prompt,
        references: active.references,
        aspectRatio: active.aspectRatio,
        results: active.results,
        messages: active.messages,
        selectedImage: active.selectedImage,
      });
      setSessions((prev) => [...prev, forked]);
      setActiveId(newId);
      setNewlyForkedId(newId);
      setTimeout(() => setNewlyForkedId(null), 1600);
      setForkDialogOpen(false);
      toast.success(`Forked: "${name}"`);
    },
    [activeId, active]
  );

  const handleRename = useCallback((id: string, name: string) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
  }, []);

  const handleNewSession = useCallback(() => {
    setNewSessionDialogOpen(true);
  }, []);

  const handleNewSessionConfirm = useCallback((name: string) => {
    mainCount++;
    const newId = `main-${Date.now()}`;
    const newSession = makeSession({ id: newId, name });
    setSessions((prev) => [...prev, newSession]);
    setActiveId(newId);
    setNewSessionDialogOpen(false);
  }, []);

  const avgScore = active.results.length
    ? Math.round(active.results.reduce((s, i) => s + i.complianceScore, 0) / active.results.length)
    : null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#09090b]">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-6 h-14 border-b border-white/[0.06] bg-[#0a0a0d]">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-zinc-100 tracking-tight">Brandful</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors cursor-pointer" aria-label="Notifications">
            <Bell className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors cursor-pointer" aria-label="Settings">
            <Settings className="w-4 h-4" />
          </button>
          <div className="ml-1 w-7 h-7 rounded-full bg-violet-700 flex items-center justify-center">
            <span className="text-[14px] font-bold text-white">A</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left sidebar */}
        <aside
          className="w-[340px] shrink-0 flex flex-col border-r border-white/[0.06] overflow-y-auto"
          style={{ background: "#0c0c0f" }}
        >
          <div className="flex flex-col gap-5 p-4 pb-8">

            {/* Session tree */}
            <SessionTree
              sessions={sessions}
              activeId={activeId}
              newlyForkedId={newlyForkedId}
              onSelect={setActiveId}
              onNewSession={handleNewSession}
              onRename={handleRename}
            />

            <Separator className="opacity-[0.06]" />

            {/* Controls */}
            <BrandContextBar />
            <Separator className="opacity-[0.06]" />
            <PromptBar
              value={active.prompt}
              onChange={(v) => patchActive({ prompt: v })}
              disabled={active.generating}
            />
            <Separator className="opacity-[0.06]" />
            <ReferencePanel
              items={active.references}
              libraryImages={MOCK_REFERENCE_IMAGES}
              onChange={(v) => patchActive({ references: v })}
              disabled={active.generating}
            />
            <Separator className="opacity-[0.06]" />
            <AspectRatioPicker
              value={active.aspectRatio}
              onChange={(v) => patchActive({ aspectRatio: v })}
              disabled={active.generating}
            />
            <Separator className="opacity-[0.06]" />
            <div className="flex flex-col gap-2">
              <GenerateButton
                onClick={handleGenerate}
                loading={active.generating}
                disabled={!active.prompt.trim()}
              />
              {!active.prompt.trim() && !active.generating && (
                <p className="text-xs text-zinc-700 text-center">Add a prompt to generate</p>
              )}
            </div>
          </div>
        </aside>

        {/* Center */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {active.generating ? (
            <RefinePanelSkeleton aspectRatio={active.aspectRatio} />
          ) : active.selectedImage ? (
            <RefinePanel
              selectedImage={active.selectedImage}
              messages={active.messages}
              onSendMessage={handleSendMessage}
              onFork={() => {
                const siblingCount = sessions.filter((s) => s.parentSessionId === activeId).length;
                setSuggestedForkName(`Fork ${siblingCount + 1}`);
                setForkDialogOpen(true);
              }}
              onClose={() => patchActive({ selectedImage: null })}
              onZoom={() => {
                const idx = active.results.findIndex((r) => r.id === active.selectedImage?.id);
                if (idx !== -1) {
                  setLightboxImages(active.results);
                  setLightboxIndex(idx);
                }
              }}
              loading={active.refineLoading}
            />
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="sticky top-0 z-10 flex items-end justify-between px-8 pt-7 pb-5 bg-[#09090b]">
                <div>
                  <h1 className="text-xl font-bold text-zinc-100 tracking-tight leading-none">
                    {active.name}
                  </h1>
                  <p className="text-sm text-zinc-500 mt-1.5">
                    {active.results.length > 0
                      ? `${active.results.length} images — scored against your brand guidelines`
                      : "Results appear here after generation"}
                  </p>
                </div>
                {avgScore !== null && (
                  <div className="flex items-baseline gap-1.5 pb-0.5">
                    <span className="text-xs text-zinc-600">avg</span>
                    <span
                      className={`text-2xl font-bold tabular-nums ${
                        avgScore >= 85 ? "text-emerald-400" : avgScore >= 65 ? "text-amber-400" : "text-red-400"
                      }`}
                    >
                      {avgScore}
                    </span>
                    <span className="text-xs text-zinc-600">/100</span>
                  </div>
                )}
              </div>
              <div className="px-8 pb-8 flex flex-col items-center">
                <div className="w-full max-w-lg">
                  <ResultsGrid
                    images={active.results}
                    count={1}
                    aspectRatio={active.aspectRatio}
                    loading={active.generating}
                    onRefine={handleRefine}
                    onZoom={handleZoom}
                  />
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right: image history */}
        <ImageHistory
          sessions={sessions}
          activeSessionId={activeId}
          onSelect={handleHistorySelect}
        />
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && lightboxImages.length > 0 && (
        <ImageLightbox
          images={lightboxImages}
          index={lightboxIndex}
          onClose={() => { setLightboxIndex(null); setLightboxImages([]); }}
          onNavigate={setLightboxIndex}
        />
      )}

      <ForkDialog
        open={forkDialogOpen}
        onConfirm={handleForkConfirm}
        onCancel={() => setForkDialogOpen(false)}
        defaultName={suggestedForkName}
      />
      <ForkDialog
        mode="new"
        open={newSessionDialogOpen}
        onConfirm={handleNewSessionConfirm}
        onCancel={() => setNewSessionDialogOpen(false)}
      />
    </div>
  );
}

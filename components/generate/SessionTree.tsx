"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronRight, GitBranch, Plus, Layers, Pencil } from "lucide-react";
import { SessionData } from "@/app/generate/types";

interface SessionTreeProps {
  sessions: SessionData[];
  activeId: string;
  newlyForkedId: string | null;
  onSelect: (id: string) => void;
  onNewSession: () => void;
  onRename: (id: string, name: string) => void;
}

function getChildren(sessions: SessionData[], parentId: string): SessionData[] {
  return sessions.filter((s) => s.parentSessionId === parentId);
}

function getRoots(sessions: SessionData[]): SessionData[] {
  return sessions.filter((s) => s.parentSessionId === null);
}

function ForkRow({
  session,
  depth,
  isActive,
  isNew,
  childCount,
  onSelect,
}: {
  session: SessionData;
  depth: number;
  isActive: boolean;
  isNew: boolean;
  childCount: number;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all cursor-pointer group ${isNew ? "tab-new" : ""} ${
        isActive
          ? "bg-orange-500/[0.12] text-zinc-100"
          : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex items-center gap-1.5 shrink-0">
        {Array.from({ length: Math.min(depth, 2) }).map((_, i) => (
          <GitBranch
            key={i}
            className={`w-3 h-3 shrink-0 ${
              isActive
                ? depth >= 2 ? "text-orange-300" : "text-orange-400"
                : "text-zinc-600 group-hover:text-orange-400"
            }`}
            style={i > 0 ? { marginLeft: "-6px" } : undefined}
          />
        ))}
      </div>
      <span className="text-xs font-medium truncate flex-1">{session.name}</span>
      {childCount > 0 && (
        <span className="ml-auto text-[10px] text-orange-400/60 shrink-0 tabular-nums">{childCount}</span>
      )}
    </button>
  );
}

function renderForkChildren(
  sessions: SessionData[],
  parentId: string,
  depth: number,
  activeId: string,
  newlyForkedId: string | null,
  onSelect: (id: string) => void,
): React.ReactNode {
  const children = getChildren(sessions, parentId);
  if (!children.length) return null;

  return (
    <div className="relative ml-3 border-l border-white/[0.08] flex flex-col gap-0.5 pt-0.5 pb-0.5">
      {children.map((child) => {
        const childCount = getChildren(sessions, child.id).length;
        return (
          <div key={child.id} className="relative pl-3">
            {/* horizontal connector */}
            <div className="absolute left-0 top-[13px] w-3 h-px bg-white/[0.08]" />
            <ForkRow
              session={child}
              depth={depth}
              isActive={activeId === child.id}
              isNew={child.id === newlyForkedId}
              childCount={childCount}
              onSelect={() => onSelect(child.id)}
            />
            {renderForkChildren(sessions, child.id, depth + 1, activeId, newlyForkedId, onSelect)}
          </div>
        );
      })}
    </div>
  );
}

export function SessionTree({ sessions, activeId, newlyForkedId, onSelect, onNewSession, onRename }: SessionTreeProps) {
  const roots = getRoots(sessions);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const r of roots) map[r.id] = true;
    return map;
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId) inputRef.current?.select();
  }, [editingId]);

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditValue(currentName);
  };

  const commitEdit = () => {
    if (editingId) {
      const trimmed = editValue.trim();
      if (trimmed) onRename(editingId, trimmed);
    }
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col gap-0.5">
      {/* Header */}
      <div className="flex items-center justify-between px-2 mb-1">
        <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Sessions</span>
        <button
          onClick={onNewSession}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] transition-all cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          New
        </button>
      </div>

      {roots.map((root) => {
        const children = getChildren(sessions, root.id);
        const isExpanded = expanded[root.id] ?? true;
        const isRootActive = activeId === root.id;
        const isEditing = editingId === root.id;

        return (
          <div key={root.id}>
            {/* Root row */}
            <div
              onClick={() => !isEditing && onSelect(root.id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all cursor-pointer group/row ${
                  isRootActive
                    ? "bg-white/[0.07] text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}
              >
                {children.length > 0 && (
                  <ChevronRight
                    onClick={(e) => { e.stopPropagation(); toggle(root.id); }}
                    className={`w-3 h-3 shrink-0 text-zinc-600 hover:text-zinc-400 transition-transform duration-200 cursor-pointer ${isExpanded ? "rotate-90" : ""}`}
                  />
                )}
                <Layers className={`w-3 h-3 shrink-0 ${isRootActive ? "text-zinc-300" : "text-zinc-600"}`} />

                {isEditing ? (
                  <input
                    ref={inputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); commitEdit(); }
                      if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-transparent text-xs font-semibold text-zinc-100 outline-none border-b border-orange-500/60 pb-px min-w-0"
                  />
                ) : (
                  <>
                    <span className="text-xs font-semibold truncate flex-1">{root.name}</span>
                    {children.length > 0 && (
                      <span className="text-[10px] text-orange-400/60 tabular-nums shrink-0">{children.length}</span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); startEdit(root.id, root.name); }}
                      className="opacity-0 group-hover/row:opacity-100 p-0.5 rounded text-zinc-600 hover:text-zinc-300 transition-all cursor-pointer shrink-0"
                      aria-label="Rename session"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  </>
                )}
            </div>

            {/* Children */}
            {isExpanded && children.length > 0 && (
              <div className="mt-0.5 ml-5">
                {renderForkChildren(sessions, root.id, 1, activeId, newlyForkedId, onSelect)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

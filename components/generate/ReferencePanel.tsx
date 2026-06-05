"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImagePlus, X, Expand, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { ReferenceImage } from "@/lib/types";

/* ── Library image lightbox ── */
function LibraryLightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: ReferenceImage[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const image = images[index];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ animation: "fadeIn 0.18s ease-out" }}
    >
      <div className="absolute inset-0 bg-black/88 backdrop-blur-xl" onClick={onClose} />
      <div className="relative z-10 flex items-center gap-3">
        <button
          onClick={() => index > 0 && onNavigate(index - 1)}
          disabled={index === 0}
          className="p-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] text-white border border-white/[0.1] transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          className="relative rounded-2xl overflow-hidden border border-white/[0.12] shadow-2xl"
          style={{
            width: "min(65vw, 65vh)",
            height: "min(65vw, 65vh)",
            animation: "lightboxZoom 0.24s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <Image src={image.url} alt={image.name} fill className="object-cover" sizes="65vw" unoptimized priority />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-10 pb-4 px-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-200 truncate">{image.name}</span>
              {image.rating && (
                <span className="flex items-center gap-1 text-xs text-amber-400 font-medium shrink-0">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {image.rating}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => index < images.length - 1 && onNavigate(index + 1)}
          disabled={index === images.length - 1}
          className="p-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] text-white border border-white/[0.1] transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed shrink-0"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={`rounded-full transition-all duration-200 cursor-pointer ${i === index ? "w-4 h-1.5 bg-orange-400" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                }`}
            />
          ))}
        </div>
      )}

      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 p-2 rounded-full bg-white/[0.08] hover:bg-white/[0.16] text-white border border-white/[0.1] transition-all cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ── Library image card ── */
function LibraryCard({
  image,
  onSelect,
  onPreview,
}: {
  image: ReferenceImage;
  onSelect: () => void;
  onPreview: () => void;
}) {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-white/[0.07] bg-white/[0.04] hover:border-orange-500/30 transition-all duration-200 group">
      {/* Thumbnail */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image.url}
          alt={image.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="160px"
          unoptimized
        />
        {/* Zoom button */}
        <button
          onClick={(e) => { e.stopPropagation(); onPreview(); }}
          className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer backdrop-blur-sm"
          aria-label="Preview image"
        >
          <Expand className="w-3 h-3" />
        </button>
        {/* Rating badge */}
        {image.rating && (
          <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-semibold text-amber-400">{image.rating}</span>
          </div>
        )}
      </div>

      {/* Info + action */}
      <div className="px-2.5 pt-2 pb-2.5 flex flex-col gap-2">
        <p className="text-xs font-medium text-zinc-300 leading-tight truncate">{image.name}</p>
        <button
          onClick={onSelect}
          className="w-full py-1.5 rounded-lg text-[11px] font-semibold bg-orange-500/20 hover:bg-orange-500 text-orange-300 hover:text-white border border-orange-500/30 hover:border-transparent transition-all duration-150 cursor-pointer"
        >
          Select
        </button>
      </div>
    </div>
  );
}

/* ── Sortable selected item ── */
function SortableItem({ image, rank, onRemove }: { image: ReferenceImage; rank: number; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const rankColors = ["bg-violet-500", "bg-indigo-500", "bg-blue-500", "bg-zinc-600", "bg-zinc-700", "bg-zinc-800"];
  const rankColor = rankColors[rank - 1] ?? rankColors[rankColors.length - 1];

  return (
    <div ref={setNodeRef} style={style} className="relative group rounded-xl overflow-hidden">
      <div className="relative aspect-square w-full">
        <Image src={image.url} alt={image.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="120px" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        <div className={`absolute top-1.5 left-1.5 w-5 h-5 rounded-full ${rankColor} flex items-center justify-center text-[10px] font-bold text-white shadow-lg z-10`}>
          {rank}
        </div>

        <button
          {...attributes}
          {...listeners}
          className="absolute top-1.5 right-8 p-0.5 rounded text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onRemove(image.id)}
          className="absolute top-1.5 right-1.5 p-0.5 rounded text-white/60 hover:text-white bg-black/40 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer"
          aria-label={`Remove ${image.name}`}
        >
          <X className="w-3 h-3" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 px-1.5 pb-1.5 z-10">
          <p className="text-[10px] text-white/80 leading-tight truncate">{image.name}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Main panel ── */
interface ReferencePanelProps {
  items: ReferenceImage[];
  libraryImages: ReferenceImage[];
  onChange: (items: ReferenceImage[]) => void;
  disabled?: boolean;
}

export function ReferencePanel({ items, libraryImages, onChange, disabled }: ReferencePanelProps) {
  const [showLibrary, setShowLibrary] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      onChange(arrayMove(items, oldIndex, newIndex));
    }
  }, [items, onChange]);

  const handleRemove = useCallback(
    (id: string) => onChange(items.filter((i) => i.id !== id)),
    [items, onChange]
  );

  const availableToAdd = libraryImages.filter((img) => !items.some((i) => i.id === img.id));

  const addImage = (img: ReferenceImage) => {
    onChange([...items, img]);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
            Reference Images
          </label>
          <p className="text-[11px] text-zinc-600 mt-0.5">Drag to upload new reference image, or select from existing images</p>
        </div>
        <button
          onClick={() => setShowLibrary((p) => !p)}
          disabled={disabled || availableToAdd.length === 0}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${showLibrary
              ? "bg-orange-500/20 text-orange-300 border-orange-500/40"
              : "bg-white/[0.06] text-zinc-300 border-white/[0.08] hover:border-orange-500/40 hover:text-orange-300 hover:bg-orange-500/10"
            }`}
        >
          <ImagePlus className="w-3.5 h-3.5" />
          {showLibrary ? "Close" : "Select"}
        </button>
      </div>

      {/* Library card grid — inline expand */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: showLibrary && availableToAdd.length > 0 ? "1fr" : "0fr",
          transition: "grid-template-rows 260ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="overflow-hidden">
          <div className="pt-1">
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="text-[11px] text-zinc-500 font-medium">Brand library</span>
              <span className="text-[10px] text-zinc-700">— highest rated first</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {availableToAdd.map((img, i) => (
                <LibraryCard
                  key={img.id}
                  image={img}
                  onSelect={() => addImage(img)}
                  onPreview={() => setPreviewIndex(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="rounded-xl border border-dashed border-white/[0.1] bg-white/[0.04] py-8 flex flex-col items-center gap-2 text-center">
          <ImagePlus className="w-6 h-6 text-white/20" />
          <p className="text-xs text-zinc-500">No references selected</p>
          <p className="text-[11px] text-zinc-600">System will use your brand&apos;s top-rated images</p>
        </div>
      )}

      {/* Sortable selected grid */}
      {items.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 gap-2">
              {items.map((img, idx) => (
                <SortableItem key={img.id} image={img} rank={idx + 1} onRemove={handleRemove} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {items.length > 0 && (
        <p className="text-[11px] text-zinc-700 text-center">
          Influence fades down the ranking — rank 1 is strongest
        </p>
      )}

      {/* Library lightbox */}
      {previewIndex !== null && (
        <LibraryLightbox
          images={availableToAdd}
          index={previewIndex}
          onClose={() => setPreviewIndex(null)}
          onNavigate={setPreviewIndex}
        />
      )}
    </div>
  );
}

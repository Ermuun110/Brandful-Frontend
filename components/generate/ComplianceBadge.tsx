"use client";

import { getComplianceColor, getComplianceTier } from "@/lib/types";

interface ComplianceBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const TIER_LABELS: Record<string, string> = {
  excellent: "Excellent",
  good: "On-brand",
  moderate: "Moderate",
  poor: "Off-brand",
};

export function ComplianceBadge({ score, size = "md", showLabel = true }: ComplianceBadgeProps) {
  const colors = getComplianceColor(score);
  const tier = getComplianceTier(score);
  const label = TIER_LABELS[tier];

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5 gap-1",
    md: "text-[11px] px-2 py-1 gap-1.5",
    lg: "text-xs px-2.5 py-1 gap-1.5",
  };

  const dotSize = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-1.5 h-1.5",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium tabular-nums ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses[size]}`}
    >
      <span className="font-semibold">{score}<span className="opacity-50 font-normal">/100</span></span>
      {showLabel && <span className="opacity-75">— {label}</span>}
    </span>
  );
}

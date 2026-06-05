export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:2";

export interface ReferenceImage {
  id: string;
  url: string;
  name: string;
  rating?: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: AspectRatio;
  complianceScore: number;
  complianceBreakdown: {
    colorPalette: number;
    typography: number;
    tone: number;
    composition: number;
  };
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface GenerationSession {
  id: string;
  prompt: string;
  referenceImages: ReferenceImage[];
  aspectRatio: AspectRatio;
  results: GeneratedImage[];
  messages: ChatMessage[];
  parentSessionId?: string;
  createdAt: Date;
}

export type ComplianceTier = "excellent" | "good" | "moderate" | "poor";

export function getComplianceTier(score: number): ComplianceTier {
  if (score >= 85) return "excellent";
  if (score >= 65) return "good";
  if (score >= 45) return "moderate";
  return "poor";
}

export function getComplianceColor(score: number) {
  if (score >= 85) return { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-400" };
  if (score >= 65) return { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30", dot: "bg-amber-400" };
  if (score >= 45) return { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30", dot: "bg-orange-400" };
  return { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30", dot: "bg-red-400" };
}

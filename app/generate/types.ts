import { AspectRatio, ChatMessage, GeneratedImage, ReferenceImage } from "@/lib/types";

export interface SessionData {
  id: string;
  name: string;
  parentSessionId: string | null;
  prompt: string;
  references: ReferenceImage[];
  aspectRatio: AspectRatio;
  results: GeneratedImage[];
  messages: ChatMessage[];
  selectedImage: GeneratedImage | null;
  generating: boolean;
  refineLoading: boolean;
}

export function makeSession(overrides: Partial<SessionData> & { id: string; name: string }): SessionData {
  return {
    parentSessionId: null,
    prompt: "",
    references: [],
    aspectRatio: "1:1",
    results: [],
    messages: [],
    selectedImage: null,
    generating: false,
    refineLoading: false,
    ...overrides,
  };
}

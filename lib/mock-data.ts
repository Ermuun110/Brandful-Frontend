import { ReferenceImage, GeneratedImage, ChatMessage } from "./types";

export const MOCK_REFERENCE_IMAGES: ReferenceImage[] = [
  { id: "ref-1", url: "https://images.unsplash.com/photo-1616004655123-818cbd4b3143?w=300&h=300&fit=crop", name: "Campaign — Spring 24", rating: 94 },
  { id: "ref-2", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop", name: "Hero — Dark Series", rating: 88 },
  { id: "ref-3", url: "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=300&h=300&fit=crop", name: "Product Lifestyle", rating: 82 },
  { id: "ref-4", url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop", name: "Minimal Editorial", rating: 79 },
  { id: "ref-5", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop", name: "Abstract Brand", rating: 75 },
  { id: "ref-6", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop", name: "Texture Layer", rating: 71 },
];

export const MOCK_GENERATED_IMAGES: GeneratedImage[] = [
  {
    id: "gen-1",
    url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=512&h=512&fit=crop",
    prompt: "Premium minimalist product shot, dark background",
    aspectRatio: "1:1",
    complianceScore: 91,
    complianceBreakdown: { colorPalette: 95, typography: 90, tone: 88, composition: 92 },
    createdAt: new Date(),
  },
  {
    id: "gen-2",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=512&h=512&fit=crop",
    prompt: "Premium minimalist product shot, dark background",
    aspectRatio: "1:1",
    complianceScore: 73,
    complianceBreakdown: { colorPalette: 78, typography: 70, tone: 75, composition: 68 },
    createdAt: new Date(),
  },
  {
    id: "gen-3",
    url: "https://images.unsplash.com/photo-1616004655123-818cbd4b3143?w=512&h=512&fit=crop",
    prompt: "Premium minimalist product shot, dark background",
    aspectRatio: "1:1",
    complianceScore: 88,
    complianceBreakdown: { colorPalette: 90, typography: 85, tone: 92, composition: 85 },
    createdAt: new Date(),
  },
  {
    id: "gen-4",
    url: "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=512&h=512&fit=crop",
    prompt: "Premium minimalist product shot, dark background",
    aspectRatio: "1:1",
    complianceScore: 42,
    complianceBreakdown: { colorPalette: 38, typography: 45, tone: 48, composition: 36 },
    createdAt: new Date(),
  },
  {
    id: "gen-5",
    url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=512&h=512&fit=crop",
    prompt: "Premium minimalist product shot, dark background",
    aspectRatio: "1:1",
    complianceScore: 79,
    complianceBreakdown: { colorPalette: 82, typography: 76, tone: 80, composition: 77 },
    createdAt: new Date(),
  },
  {
    id: "gen-6",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=512&h=512&fit=crop",
    prompt: "Premium minimalist product shot, dark background",
    aspectRatio: "1:1",
    complianceScore: 65,
    complianceBreakdown: { colorPalette: 68, typography: 60, tone: 70, composition: 62 },
    createdAt: new Date(),
  },
  {
    id: "gen-7",
    url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=512&h=512&fit=crop",
    prompt: "Premium minimalist product shot, dark background",
    aspectRatio: "1:1",
    complianceScore: 84,
    complianceBreakdown: { colorPalette: 87, typography: 82, tone: 85, composition: 82 },
    createdAt: new Date(),
  },
  {
    id: "gen-8",
    url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0729?w=512&h=512&fit=crop",
    prompt: "Premium minimalist product shot, dark background",
    aspectRatio: "1:1",
    complianceScore: 57,
    complianceBreakdown: { colorPalette: 55, typography: 58, tone: 60, composition: 54 },
    createdAt: new Date(),
  },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    content: "I've generated images based on your prompt and brand guidelines. The top result scores highest — it matches your primary color palette and compositional style closely. Want me to refine the lighting or adjust the saturation?",
    timestamp: new Date(),
  },
];

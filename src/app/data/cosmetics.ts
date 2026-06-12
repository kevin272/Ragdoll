export type CosmeticType = "body" | "impact" | "trail" | "world";

export interface UnlockRequirement {
  type: "stars" | "crashes" | "bumperHits" | "combo";
  amount: number;
}

export interface CosmeticItem {
  id: string;
  name: string;
  type: CosmeticType;
  req?: UnlockRequirement;
  color?: string; // used for body / particles
  colors?: { bgBase: string; bgDark: string; geometry: string; accent: string }; // used for world themes
}

export const BODIES: CosmeticItem[] = [
  { id: "body_default", name: "Default Charcoal", type: "body", color: "#4A4744" },
  { id: "body_rust", name: "Rust", type: "body", color: "#8B4513" },
  { id: "body_ink", name: "Ink", type: "body", color: "#111111" },
  { id: "body_marble", name: "Marble", type: "body", color: "#E8E8E8" },
  { id: "body_blueprint", name: "Blueprint", type: "body", color: "#2E5B88" },
  { id: "body_forest", name: "Forest", type: "body", color: "#2E4A2E" },
  { id: "body_crimson", name: "Crimson", type: "body", color: "#800000" },
  { id: "body_gold", name: "Gold", type: "body", color: "#FFD700" },
  { id: "body_wood", name: "Wooden Dummy", type: "body", color: "#D2B48C", req: { type: "stars", amount: 3 } },
  { id: "body_stone", name: "Stone Golem", type: "body", color: "#708090", req: { type: "combo", amount: 100 } },
  { id: "body_rubber", name: "Rubber Dummy", type: "body", color: "#FF69B4", req: { type: "bumperHits", amount: 50 } },
  { id: "body_ghost", name: "Ghost", type: "body", color: "rgba(200, 200, 200, 0.4)", req: { type: "crashes", amount: 500 } },
  { id: "body_galaxy", name: "Galaxy", type: "body", color: "#4B0082", req: { type: "crashes", amount: 1000 } },
];

export const IMPACTS: CosmeticItem[] = [
  { id: "impact_none", name: "None", type: "impact" },
  { id: "impact_dust", name: "Dust Cloud", type: "impact", color: "#888888" },
  { id: "impact_splinter", name: "Splinters", type: "impact", color: "#D2B48C", req: { type: "crashes", amount: 100 } },
  { id: "impact_rock", name: "Rock Burst", type: "impact", color: "#708090", req: { type: "stars", amount: 20 } },
  { id: "impact_sparks", name: "Sparks", type: "impact", color: "#FFA500", req: { type: "bumperHits", amount: 100 } },
  { id: "impact_neon", name: "Neon Explosion", type: "impact", color: "#00FFFF", req: { type: "combo", amount: 50 } },
];

export const TRAILS: CosmeticItem[] = [
  { id: "trail_none", name: "None", type: "trail" },
  { id: "trail_dust", name: "Dust Path", type: "trail", color: "rgba(100,100,100,0.5)" },
  { id: "trail_smoke", name: "Smoke", type: "trail", color: "rgba(50,50,50,0.8)", req: { type: "stars", amount: 15 } },
  { id: "trail_sparks", name: "Sparks", type: "trail", color: "rgba(255,165,0,0.8)", req: { type: "bumperHits", amount: 200 } },
  { id: "trail_rainbow", name: "Rainbow", type: "trail", color: "rainbow", req: { type: "crashes", amount: 2000 } },
];

export const WORLDS: CosmeticItem[] = [
  { id: "world_sketchbook", name: "Sketchbook", type: "world", colors: { bgBase: "#D7D4CF", bgDark: "#C7C3BD", geometry: "#2E2C2A", accent: "#B85C45" } },
  { id: "world_construction", name: "Construction Site", type: "world", req: { type: "stars", amount: 10 }, colors: { bgBase: "#E0C890", bgDark: "#C4A250", geometry: "#404040", accent: "#FF8C00" } },
  { id: "world_toyroom", name: "Toy Room", type: "world", req: { type: "stars", amount: 20 }, colors: { bgBase: "#87CEEB", bgDark: "#5CADDB", geometry: "#FF4500", accent: "#32CD32" } },
  { id: "world_castle", name: "Medieval Castle", type: "world", req: { type: "stars", amount: 35 }, colors: { bgBase: "#4A4A4A", bgDark: "#303030", geometry: "#8B4513", accent: "#B22222" } },
  { id: "world_scifi", name: "Sci-Fi Lab", type: "world", req: { type: "stars", amount: 50 }, colors: { bgBase: "#0F1626", bgDark: "#0B101D", geometry: "#AB987A", accent: "#FF533D" } },
  { id: "world_cyberpunk", name: "Cyberpunk", type: "world", req: { type: "stars", amount: 70 }, colors: { bgBase: "#000B18", bgDark: "#000810", geometry: "#00FF41", accent: "#FF00FF" } },
  { id: "world_temple", name: "Ancient Temple", type: "world", req: { type: "stars", amount: 90 }, colors: { bgBase: "#556B2F", bgDark: "#3B4D20", geometry: "#DAA520", accent: "#FFD700" } },
  { id: "world_space", name: "Space Station", type: "world", req: { type: "stars", amount: 120 }, colors: { bgBase: "#000000", bgDark: "#111111", geometry: "#FFFFFF", accent: "#00BFFF" } },
  { id: "world_dreamscape", name: "Dreamscape", type: "world", req: { type: "stars", amount: 150 }, colors: { bgBase: "#FFB6C1", bgDark: "#FF69B4", geometry: "#BA55D3", accent: "#FF1493" } },
  { id: "world_void", name: "The Void", type: "world", req: { type: "stars", amount: 200 }, colors: { bgBase: "#000000", bgDark: "#000000", geometry: "#FFFFFF", accent: "#FFFFFF" } },
];

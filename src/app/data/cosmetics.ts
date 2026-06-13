export type CosmeticType = "body" | "accent" | "trail" | "impact";

export interface UnlockRequirement {
  type: "stars";
  amount: number;
}

export interface CosmeticItem {
  id: string;
  name: string;
  type: CosmeticType;
  req?: UnlockRequirement;
  color?: string; // used for body / particles / accents
}

export const BODIES: CosmeticItem[] = [
  { id: "skin_charcoal", name: "Charcoal (Default)", type: "body", color: "#4A4744" },
  { id: "skin_ash", name: "Ash", type: "body", color: "#7A7570", req: { type: "stars", amount: 3 } },
  { id: "skin_ink", name: "Ink", type: "body", color: "#262422", req: { type: "stars", amount: 18 } },
  { id: "skin_driftwood", name: "Driftwood", type: "body", color: "#8A7B6A", req: { type: "stars", amount: 26 } },
];

export const ACCENTS: CosmeticItem[] = [
  { id: "accent_rust", name: "Rust (Default)", type: "accent", color: "#B85C45" },
  { id: "accent_sage", name: "Sage", type: "accent", color: "#7A9B7E", req: { type: "stars", amount: 6 } },
  { id: "accent_ochre", name: "Ochre", type: "accent", color: "#C9A24B", req: { type: "stars", amount: 15 } },
  { id: "accent_slate", name: "Slate", type: "accent", color: "#6B7B94", req: { type: "stars", amount: 22 } },
];

export const TRAILS: CosmeticItem[] = [
  { id: "trail_none", name: "None", type: "trail" },
  { id: "trail_smoke", name: "Smoke", type: "trail", color: "rgba(100,100,100,0.5)", req: { type: "stars", amount: 10 } },
  { id: "trail_spark", name: "Spark", type: "trail", color: "accent", req: { type: "stars", amount: 30 } }, // "accent" will be mapped at runtime
];

export const IMPACTS: CosmeticItem[] = [
  { id: "impact_debris", name: "Debris (Default)", type: "impact", color: "#4A4744" },
  { id: "impact_dust", name: "Dust Puff", type: "impact", color: "#7A7570", req: { type: "stars", amount: 22 } },
  { id: "impact_starburst", name: "Starburst", type: "impact", color: "accent", req: { type: "stars", amount: 30 } }, // "accent" mapped at runtime
];

export function getUnlockedCosmetics(totalStars: number): string[] {
  const unlocks: string[] = [];
  [...BODIES, ...ACCENTS, ...TRAILS, ...IMPACTS].forEach(item => {
    if (!item.req || totalStars >= item.req.amount) {
      unlocks.push(item.id);
    }
  });
  return unlocks;
}

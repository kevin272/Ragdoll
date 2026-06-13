"use client";

export interface TumbledownProfile {
  version: 1;
  levelStars: Record<string, number>;
  totalStars: number;
  unlockedCosmetics: string[];
  loadout: {
    bodySkin: string;
    accent: string;
    trail: string;
    impact: string;
  };
}

const PROFILE_KEY = "tumbledown_profile";

export function loadProfile(): TumbledownProfile {
  if (typeof window === "undefined") return createDefaultProfile();
  
  const raw = localStorage.getItem(PROFILE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.version === 1) {
        return parsed;
      }
    } catch (e) {}
  }

  // Migration from old keys
  const profile = createDefaultProfile();
  
  try {
    const rawProg = localStorage.getItem("tumbledown_progress");
    if (rawProg) {
      const prog = JSON.parse(rawProg) as { courseId: string; stars: number }[];
      prog.forEach(p => {
        profile.levelStars[p.courseId] = p.stars;
      });
      profile.totalStars = prog.reduce((sum, p) => sum + (p.stars || 0), 0);
    }
  } catch (e) {}

  saveProfile(profile);
  return profile;
}

export function saveProfile(profile: TumbledownProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function createDefaultProfile(): TumbledownProfile {
  return {
    version: 1,
    levelStars: {},
    totalStars: 0,
    unlockedCosmetics: ["skin_charcoal", "accent_rust", "trail_none", "impact_debris"],
    loadout: {
      bodySkin: "skin_charcoal",
      accent: "accent_rust",
      trail: "trail_none",
      impact: "impact_debris"
    }
  };
}

export function saveCourseStars(courseId: string, stars: number) {
  const profile = loadProfile();
  const currentStars = profile.levelStars[courseId] || 0;
  if (stars > currentStars) {
    profile.levelStars[courseId] = stars;
    // Recompute total
    profile.totalStars = Object.values(profile.levelStars).reduce((sum, s) => sum + s, 0);
    saveProfile(profile);
  }
  return profile;
}

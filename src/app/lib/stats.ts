"use client";

const STATS_KEY = "tumbledown_stats";

export interface GlobalStats {
  totalStars: number;
  totalCrashes: number;
  totalBumperHits: number;
  maxCombo: number;
}

const defaultStats: GlobalStats = {
  totalStars: 0,
  totalCrashes: 0,
  totalBumperHits: 0,
  maxCombo: 0,
};

export function loadStats(): GlobalStats {
  if (typeof window === "undefined") return defaultStats;
  const raw = localStorage.getItem(STATS_KEY);
  if (!raw) return defaultStats;
  try {
    return { ...defaultStats, ...JSON.parse(raw) };
  } catch (e) {
    return defaultStats;
  }
}

function saveStats(stats: GlobalStats) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export const statsManager = {
  incrementCrash: () => {
    const stats = loadStats();
    stats.totalCrashes += 1;
    saveStats(stats);
  },
  incrementBumperHit: () => {
    const stats = loadStats();
    stats.totalBumperHits += 1;
    saveStats(stats);
  },
  updateMaxCombo: (combo: number) => {
    const stats = loadStats();
    if (combo > stats.maxCombo) {
      stats.maxCombo = combo;
      saveStats(stats);
    }
  },
  get: () => {
    const stats = loadStats();
    if (typeof window !== "undefined") {
      try {
        const rawProg = localStorage.getItem("tumbledown_progress");
        if (rawProg) {
          const prog = JSON.parse(rawProg) as { stars: number }[];
          stats.totalStars = prog.reduce((sum, p) => sum + (p.stars || 0), 0);
        }
      } catch (e) {}
    }
    return stats;
  },
};

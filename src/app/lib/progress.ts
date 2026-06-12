"use client";

const PROGRESS_KEY = "tumbledown_progress";

export interface CourseProgress {
  courseId: string;
  highScore: number;
  stars: number; // 0-3
}

export function loadProgress(): CourseProgress[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(PROGRESS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveProgress(courseId: string, score: number, stars: number) {
  if (typeof window === "undefined") return;
  const progress = loadProgress();
  const existing = progress.find(p => p.courseId === courseId);
  
  if (existing) {
    if (score > existing.highScore) existing.highScore = score;
    if (stars > existing.stars) existing.stars = stars;
  } else {
    progress.push({ courseId, highScore: score, stars });
  }
  
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function getStars(courseId: string): number {
  const progress = loadProgress();
  const existing = progress.find(p => p.courseId === courseId);
  return existing ? existing.stars : 0;
}

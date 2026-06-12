"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { courses } from "../data/courses";
import { loadProgress, CourseProgress } from "../lib/progress";
import { useSettings } from "../lib/SettingsContext";
import { Star } from "lucide-react";

export default function MainMenu() {
  const [progress, setProgress] = useState<Record<string, CourseProgress>>({});
  const { devMode } = useSettings();

  useEffect(() => {
    const loaded = loadProgress();
    const map: Record<string, CourseProgress> = {};
    for (const p of loaded) map[p.courseId] = p;
    setProgress(map);
  }, []);

  return (
    <main className="page-wrapper" style={{ 
      backgroundColor: "var(--color-bg-base)",
      fontFamily: "var(--font-geist-sans)"
    }}>
      <div style={{ width: "100%", maxWidth: "1000px" }}>
        <header style={{ marginBottom: "40px", textAlign: "center", position: "relative" }}>
          <Link href="/">
            <button style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", padding: "10px 20px", fontSize: "1.2rem", color: "var(--color-geometry)", background: "var(--color-bg-light)", border: "none", borderRadius: "8px", cursor: "pointer" }}>
              ← Back
            </button>
          </Link>
          <h1 style={{ 
            fontSize: "4rem", 
            fontFamily: "var(--font-display)", 
            color: "var(--color-geometry)",
            marginBottom: "10px"
          }}>
            Tumbledown
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--color-ragdoll)" }}>
            Fling the ragdoll. Cause chaos. Score points.
          </p>
        </header>

        <div className="grid-responsive">
          {courses.map((course, index) => {
            const courseProg = progress[course.id];
            const stars = courseProg?.stars || 0;
            const highScore = courseProg?.highScore || 0;

            const isUnlocked = devMode || index === 0 || !!progress[courses[index - 1].id];

            return (
              <div 
                key={course.id} 
                style={{
                  backgroundColor: "var(--color-bg-light)",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                  border: `2px solid ${isUnlocked ? "transparent" : "var(--color-bg-dark)"}`,
                  opacity: isUnlocked ? 1 : 0.6,
                  transition: "transform 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div style={{ marginBottom: "15px" }}>
                  <h2 style={{ 
                    fontFamily: "var(--font-display)", 
                    fontSize: "2rem",
                    color: "var(--color-geometry)",
                    marginBottom: "5px"
                  }}>
                    {index + 1}. {course.name}
                  </h2>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[1, 2, 3].map((starIdx) => (
                      <Star 
                        key={starIdx} 
                        size={20} 
                        fill={starIdx <= stars ? "var(--color-accent)" : "transparent"} 
                        color={starIdx <= stars ? "var(--color-accent)" : "var(--color-bg-dark)"}
                      />
                    ))}
                  </div>
                </div>
                
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div style={{ fontFamily: "var(--font-score)", fontSize: "0.9rem", color: "var(--color-ragdoll)" }}>
                    Best: {highScore}
                  </div>
                  
                  {isUnlocked ? (
                    <Link href={`/play/${course.id}`}>
                      <button className="primary" style={{ padding: "6px 16px", fontSize: "1rem" }}>
                        Play
                      </button>
                    </Link>
                  ) : (
                    <button disabled style={{ 
                      padding: "6px 16px", fontSize: "1rem", 
                      backgroundColor: "var(--color-bg-dark)", color: "var(--color-bg-light)",
                      cursor: "not-allowed" 
                    }}>
                      Locked
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

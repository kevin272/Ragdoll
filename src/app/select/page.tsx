"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProfile, TumbledownProfile } from "../lib/profile";
import { useSettings } from "../lib/SettingsContext";
import { Star } from "lucide-react";

interface ManifestCourse {
  id: string;
  name: string;
  tier: string;
  file: string;
}

interface Manifest {
  courses: ManifestCourse[];
}

export default function MainMenu() {
  const [profile, setProfile] = useState<TumbledownProfile | null>(null);
  const [courses, setCourses] = useState<ManifestCourse[]>([]);
  const { devMode } = useSettings();

  useEffect(() => {
    setProfile(loadProfile());
    fetch("/data/courses/manifest.json")
      .then(res => res.json())
      .then((data: Manifest) => setCourses(data.courses));
  }, []);

  if (!profile || courses.length === 0) return null;

  const coreCourses = courses.filter(c => c.tier === "core");
  const expertCourses = courses.filter(c => c.tier === "expert");

  const renderGrid = (list: ManifestCourse[], offsetIndex: number) => (
    <div className="grid-responsive">
      {list.map((course, index) => {
        const globalIndex = offsetIndex + index;
        const stars = profile.levelStars[course.id] || 0;
        
        // Unlocked if devMode, or it's the first level, or the previous level has > 0 stars
        let isUnlocked = devMode || globalIndex === 0;
        if (!isUnlocked && globalIndex > 0) {
          const prevCourse = courses[globalIndex - 1];
          if (profile.levelStars[prevCourse.id] && profile.levelStars[prevCourse.id] > 0) {
            isUnlocked = true;
          }
        }

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
                {globalIndex + 1}. {course.name}
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
              <div></div>
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
  );

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
            Total Stars: <strong>{profile.totalStars}</strong>
          </p>
        </header>

        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "2rem", color: "var(--color-geometry)", marginBottom: "20px" }}>Core Tier</h2>
          {renderGrid(coreCourses, 0)}
        </div>

        <div>
          <h2 style={{ fontSize: "2rem", color: "var(--color-geometry)", marginBottom: "20px" }}>Expert Tier</h2>
          {renderGrid(expertCourses, coreCourses.length)}
        </div>
      </div>
    </main>
  );
}

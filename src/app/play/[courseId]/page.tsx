"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GameCanvas from "../../components/GameCanvas";
import { CourseData } from "../../game/course";

export default function PlayRoute({ params }: { params: Promise<{ courseId: string }> }) {
  const router = useRouter();
  const { courseId } = use(params);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [nextCourseId, setNextCourseId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!courseId) {
      router.replace("/");
      return;
    }

    fetch("/data/courses/manifest.json")
      .then(res => res.json())
      .then(manifest => {
        const found = manifest.courses.find((c: any) => c.id === courseId);
        if (found) {
          const idx = manifest.courses.findIndex((c: any) => c.id === courseId);
          if (idx >= 0 && idx < manifest.courses.length - 1) {
            setNextCourseId(manifest.courses[idx + 1].id);
          }
          return fetch(`/data/courses/${found.file}`);
        }
        throw new Error("Course not found in manifest");
      })
      .then(res => res.json())
      .then(data => setCourse(data))
      .catch(() => router.replace("/"));
  }, [courseId, router]);

  if (!course) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "var(--color-bg-base)", color: "var(--color-geometry)", fontFamily: "var(--font-display)", fontSize: "2rem" }}>Loading Course...</div>;

  return (
    <main style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <GameCanvas course={course} nextCourseId={nextCourseId} />
    </main>
  );
}

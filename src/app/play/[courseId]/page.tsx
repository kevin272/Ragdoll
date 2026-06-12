"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import GameCanvas from "../../components/GameCanvas";

export default function PlayRoute({ params }: { params: Promise<{ courseId: string }> }) {
  const router = useRouter();
  const { courseId } = use(params);

  useEffect(() => {
    // Basic validation, if no courseId redirect to home
    if (!courseId) {
      router.replace("/");
    }
  }, [courseId, router]);

  if (!courseId) return null;

  return (
    <main style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <GameCanvas courseId={courseId} />
    </main>
  );
}

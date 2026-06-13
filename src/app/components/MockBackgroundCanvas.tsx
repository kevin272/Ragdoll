"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";
import { createRagdoll } from "../game/ragdoll";
import { CourseData, buildCourse } from "../game/course";

const COLORS = {
  bgBase: "#D7D4CF",
  bgLight: "#E4E1DC",
  bgDark: "#C7C3BD",
  geometry: "#2E2C2A",
  ragdoll: "#4A4744",
  accent: "#B85C45",
};

const dummyCourse: CourseData = {
  id: "dummy",
  name: "Dummy",
  launchPoint: { x: 200, y: 300 },
  cameraBounds: { minX: 0, maxX: 2000 },
  starThresholds: { oneStar: 0, twoStar: 0, threeStar: 0 },
  objects: [
    { id: "floor1", type: "platform", x: 1000, y: 800, w: 2000, h: 100 },
    { id: "b1", type: "bumper", x: 600, y: 600, radius: 40, points: 100 },
    { id: "b2", type: "bumper", x: 1000, y: 500, radius: 40, points: 100 },
    { id: "b3", type: "bumper", x: 1400, y: 600, radius: 40, points: 100 }
  ]
};

export default function MockBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const engine = Matter.Engine.create();
    engine.gravity.y = 1.5;

    const course = dummyCourse;
    const courseComposite = buildCourse(course);
    
    let ragdoll = createRagdoll({ x: course.launchPoint.x, y: course.launchPoint.y - 100 });
    Matter.Composite.add(engine.world, [courseComposite, ragdoll]);

    const camera = { x: course.launchPoint.x, y: course.launchPoint.y };

    let settleTimer = 0;
    let lastTime = performance.now();
    const fixedDelta = 1000 / 60;
    let accumulator = 0;
    let animationFrameId: number;

    const respawnAndLaunch = () => {
      Matter.Composite.remove(engine.world, ragdoll);
      ragdoll = createRagdoll({ x: course.launchPoint.x, y: course.launchPoint.y - 100 });
      Matter.Composite.add(engine.world, ragdoll);
      
      const torso = ragdoll.bodies.find(b => b.label === "torso");
      if (torso) {
        // Apply random chaotic force
        const forceX = 0.15 + Math.random() * 0.2;
        const forceY = -0.25 - Math.random() * 0.2;
        Matter.Body.applyForce(torso, torso.position, { x: forceX, y: forceY });
      }
    };

    // Initial launch after 1 sec
    setTimeout(respawnAndLaunch, 1000);

    const tick = (time: number) => {
      const frameTime = time - lastTime;
      lastTime = time;
      accumulator += Math.min(frameTime, 250);

      const torso = ragdoll.bodies.find(b => b.label === "torso");

      while (accumulator >= fixedDelta) {
        Matter.Engine.update(engine, fixedDelta);
        accumulator -= fixedDelta;

        // Spinners and Platforms
        const allBodies = Matter.Composite.allBodies(engine.world);
        for (const body of allBodies) {
          if (body.label.startsWith("spinner_")) {
            const speed = parseFloat(body.label.split("_")[2]);
            Matter.Body.setAngularVelocity(body, speed);
          }
        }

        if (torso) {
          // Camera Follow
          camera.x += (torso.position.x - camera.x) * 0.1;
          camera.y += (torso.position.y - camera.y) * 0.1;

          // Auto respawn logic
          if (torso.position.y > 2000) {
            respawnAndLaunch();
          } else if (torso.speed < 0.5) {
            settleTimer += fixedDelta;
            if (settleTimer > 2000) {
              respawnAndLaunch();
              settleTimer = 0;
            }
          } else {
            settleTimer = 0;
          }
        }
      }

      // Render
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.fillStyle = COLORS.bgBase;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2 - camera.x, canvas.height / 2 - camera.y);

      const bodies = Matter.Composite.allBodies(engine.world);
      
      // Draw grid
      ctx.strokeStyle = COLORS.bgDark;
      ctx.lineWidth = 1;
      const startX = Math.floor((camera.x - canvas.width) / 100) * 100;
      const endX = startX + canvas.width * 2;
      const startY = Math.floor((camera.y - canvas.height) / 100) * 100;
      const endY = startY + canvas.height * 2;
      ctx.beginPath();
      for (let x = startX; x < endX; x += 100) { ctx.moveTo(x, startY); ctx.lineTo(x, endY); }
      for (let y = startY; y < endY; y += 100) { ctx.moveTo(startX, y); ctx.lineTo(endX, y); }
      ctx.stroke();

      for (const body of bodies) {
        if (body.isSensor && !body.label.startsWith("bonusTarget_") && !body.label.startsWith("finishFlag")) continue;

        ctx.beginPath();
        const vertices = body.vertices;
        ctx.moveTo(vertices[0].x, vertices[0].y);
        for (let j = 1; j < vertices.length; j++) {
          ctx.lineTo(vertices[j].x, vertices[j].y);
        }
        ctx.lineTo(vertices[0].x, vertices[0].y);
        
        if (body.label.startsWith("finishFlag")) {
           ctx.fillStyle = "transparent";
        } else if (body.label.startsWith("bonusTarget_")) {
          ctx.fillStyle = COLORS.accent;
        } else if (body.label.startsWith("head") || body.label.startsWith("torso") || body.label.startsWith("limb")) {
          ctx.fillStyle = COLORS.ragdoll;
        } else {
          ctx.fillStyle = COLORS.geometry;
        }
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = COLORS.bgBase;
        ctx.stroke();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      Matter.Engine.clear(engine);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />;
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Matter from "matter-js";
import { createRagdoll } from "../game/ragdoll";
import { CourseData, CourseObject, buildCourse } from "../game/course";
import { useLoadout } from "../lib/LoadoutContext";
import { useSettings } from "../lib/SettingsContext";
import { BODIES, ACCENTS, TRAILS, IMPACTS, getUnlockedCosmetics } from "../data/cosmetics";
import { saveCourseStars, loadProfile, saveProfile } from "../lib/profile";
import { loadSkinPattern } from "../lib/patterns";

const COLORS = {
  bgBase: "#D7D4CF",
  bgLight: "#E4E1DC",
  bgDark: "#C7C3BD",
  geometry: "#2E2C2A",
  ragdoll: "#4A4744",
  accent: "#B85C45",
};

export default function GameCanvas({ course, nextCourseId }: { course: CourseData, nextCourseId?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { sfxVolume } = useSettings();
  const { loadout } = useLoadout();
  
  // Base colors without "world" theme
  const activeColors = { bgBase: "#D7D4CF", bgLight: "#E4E1DC", bgDark: "#C7C3BD", geometry: "#2E2C2A", accent: "#B85C45", ragdoll: "#4A4744" };
  const activeBody = BODIES.find(b => b.id === loadout.bodySkin) || BODIES[0];
  const activeAccent = ACCENTS.find(a => a.id === loadout.accent) || ACCENTS[0];
  const activeTrail = TRAILS.find(t => t.id === loadout.trail) || TRAILS[0];
  const activeImpact = IMPACTS.find(i => i.id === loadout.impact) || IMPACTS[0];

  const sfxRefs = useRef<HTMLAudioElement[]>([]);
  const flagImageRef = useRef<HTMLImageElement | null>(null);
  const spikesImageRef = useRef<HTMLImageElement | null>(null);
  const patternRef = useRef<string | CanvasPattern>(activeBody.color || activeColors.ragdoll);

  const engineRef = useRef<Matter.Engine | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  const playImpactSound = (intensity: number, type: "thud" | "spike" = "thud") => {
    if (!audioCtxRef.current || sfxVolume === 0) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    // intensity from 0 to 1
    const vol = Math.min(intensity, 1) * sfxVolume;
    
    if (type === "spike") {
      // Metallic slice / squish
      const sliceOsc = ctx.createOscillator();
      const sliceGain = ctx.createGain();
      sliceOsc.type = "triangle";
      sliceOsc.frequency.setValueAtTime(1200, ctx.currentTime);
      sliceOsc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
      sliceGain.gain.setValueAtTime(vol, ctx.currentTime);
      sliceGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      sliceOsc.connect(sliceGain);
      sliceGain.connect(ctx.destination);
      sliceOsc.start();
      sliceOsc.stop(ctx.currentTime + 0.3);

      // Wet Squish (filtered noise)
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for(let i=0; i<bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.setValueAtTime(800, ctx.currentTime);
      noiseFilter.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(vol * 0.8, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start();
      return;
    }
    
    // Thud / Snap
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(150 + intensity * 200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (0.1 + intensity * 0.2));
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
    
    // Crunch (White noise burst) for harder impacts
    if (intensity > 0.3) {
       const bufferSize = ctx.sampleRate * 0.1;
       const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
       const data = buffer.getChannelData(0);
       for(let i=0; i<bufferSize; i++) data[i] = Math.random() * 2 - 1;
       
       const noise = ctx.createBufferSource();
       noise.buffer = buffer;
       
       const noiseFilter = ctx.createBiquadFilter();
       noiseFilter.type = "bandpass";
       noiseFilter.frequency.value = 1000 + intensity * 2000;
       
       const noiseGain = ctx.createGain();
       noiseGain.gain.setValueAtTime(vol * 0.5, ctx.currentTime);
       noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
       
       noise.connect(noiseFilter);
       noiseFilter.connect(noiseGain);
       noiseGain.connect(ctx.destination);
       
       noise.start();
    }
  };
  
  useEffect(() => {
    const img = new Image();
    img.src = "/flag.svg";
    img.onload = () => { flagImageRef.current = img; };

    const spikesImg = new Image();
    spikesImg.src = "/spikes.svg";
    spikesImg.onload = () => { spikesImageRef.current = spikesImg; };
    
    // Preload SFX (Using Wilhelm scream with dynamic pitch shifts for variety)
    if (typeof window !== "undefined") {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      sfxRefs.current = [
        new Audio("/scream1.ogg"),
        new Audio("/scream1.ogg"),
        new Audio("/scream1.ogg")
      ];
    }
  }, []);
  
  const [showResults, setShowResults] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [starsEarned, setStarsEarned] = useState(0);
  const [unlockToast, setUnlockToast] = useState<string | null>(null);
  
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);

  const togglePause = () => {
    if (gameStateRef.current === "results") return;
    setIsPaused(prev => {
      isPausedRef.current = !prev;
      return !prev;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        togglePause();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Game state refs (mutated in tick)
  const gameStateRef = useRef<"aim" | "flight" | "settle" | "results" | "dead">("aim");
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragCurrentRef = useRef<{ x: number; y: number } | null>(null);
  const cameraRef = useRef({ x: course.launchPoint.x, y: course.launchPoint.y });
  const ragdollRef = useRef<Matter.Composite | null>(null);
  const launchPointRef = useRef({ ...course.launchPoint });
  
  // Scoring refs
  const distanceRef = useRef(0);
  const flipsRef = useRef(0);
  const bonusRef = useRef(0);
  const comboRef = useRef(1);
  const lastImpactRef = useRef(0);
  const flipAngleRef = useRef(0);
  const lastTorsoAngleRef = useRef(0);
  const lastParticleSpawnRef = useRef(0);

  // Particles
  const trailParticlesRef = useRef<{x: number, y: number, life: number}[]>([]);
  const impactParticlesRef = useRef<{body: Matter.Body, createdAt: number}[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load skin pattern
    loadSkinPattern(activeBody.id, activeBody.color || activeColors.ragdoll, ctx).then(pattern => {
      patternRef.current = pattern;
    });

    const engine = Matter.Engine.create();
    engine.gravity.y = 1.5;
    engineRef.current = engine;

    // Load course
    const courseComposite = buildCourse(course);
    const ragdoll = createRagdoll({ x: course.launchPoint.x, y: course.launchPoint.y - 100 });
    ragdollRef.current = ragdoll;

    const spikePit = Matter.Bodies.rectangle(course.launchPoint.x, 2000, 10000, 100, {
      isStatic: true,
      label: "spikes"
    });

    Matter.Composite.add(engine.world, [courseComposite, ragdoll, spikePit]);

    Matter.Events.on(engine, "collisionStart", (event) => {
      let impacted = false;
      let maxImpactIntensity = 0;
      const impactPositions: {x: number, y: number}[] = [];

      for (const pair of event.pairs) {
        const { bodyA, bodyB } = pair;
        
        // Bumper Logic
        if (bodyA.label.startsWith("bumper_") || bodyB.label.startsWith("bumper_")) {
          const bumper = bodyA.label.startsWith("bumper_") ? bodyA : bodyB;
          const force = parseFloat(bumper.label.split("_")[2] || "0.05");
          const torso = ragdollRef.current?.bodies.find((b) => b.label === "torso");
          if (torso) {
            Matter.Body.applyForce(torso, torso.position, {
              x: (torso.position.x - bumper.position.x) * force,
              y: (torso.position.y - bumper.position.y) * force,
            });
          }
        }
        
        // Bonus Target Logic
        if (bodyA.label.startsWith("bonusTarget_") || bodyB.label.startsWith("bonusTarget_")) {
          const target = bodyA.label.startsWith("bonusTarget_") ? bodyA : bodyB;
          const points = parseInt(target.label.split("_")[2] || "500");
          bonusRef.current += points * comboRef.current;
          Matter.Composite.remove(engine.world, target);
        }
        // Finish Flag Logic
        else if (bodyA.label.startsWith("finishFlag_") || bodyB.label.startsWith("finishFlag_")) {
          const other = bodyA.label.startsWith("finishFlag_") ? bodyB : bodyA;
          if (!other.isStatic && gameStateRef.current !== "results") {
            triggerResults(false);
          }
        }
        // Impact Combo Logic
        else if (
          !bodyA.isSensor && !bodyB.isSensor &&
          (bodyA.label.includes("torso") || bodyB.label.includes("torso") || bodyA.label.includes("head") || bodyB.label.includes("head")) &&
          (bodyA.isStatic || bodyB.isStatic)
        ) {
          impacted = true;
          const dynamicBody = bodyA.isStatic ? bodyB : bodyA;
          const intensity = Math.min((dynamicBody.speed || 0) / 20, 1.0);
          maxImpactIntensity = Math.max(maxImpactIntensity, intensity);
          
          const now = Date.now();
          if (gameStateRef.current === "flight" && dynamicBody.speed > 2 && now - lastParticleSpawnRef.current > 100) {
            impactPositions.push({ x: dynamicBody.position.x, y: dynamicBody.position.y });
            lastParticleSpawnRef.current = now;
          }
        }
        
        // Spike Pit Logic
        if (bodyA.label === "spikes" || bodyB.label === "spikes" || bodyA.label.startsWith("spikeObstacle_") || bodyB.label.startsWith("spikeObstacle_")) {
          const rBody = (bodyA.label === "spikes" || bodyA.label.startsWith("spikeObstacle_")) ? bodyB : bodyA;
          if (rBody.label.includes("head") || rBody.label.includes("torso")) {
            if (gameStateRef.current !== "results" && gameStateRef.current !== "dead") {
              gameStateRef.current = "dead";
              playImpactSound(1.0, "spike");
              
              const support = pair.collision.supports[0];
              const pinPoint = support ? { x: support.x, y: support.y } : { x: rBody.position.x, y: rBody.position.y };
              const pin = Matter.Constraint.create({
                bodyB: rBody,
                pointB: { x: pinPoint.x - rBody.position.x, y: pinPoint.y - rBody.position.y },
                pointA: { x: pinPoint.x, y: pinPoint.y },
                stiffness: 1,
                length: 0,
                render: { visible: false }
              });
              if (engineRef.current) Matter.Composite.add(engineRef.current.world, pin);
              
              const bloodParticles: Matter.Body[] = [];
              for(let i = 0; i < 40; i++) {
                const p = Matter.Bodies.circle(rBody.position.x, rBody.position.y, 2 + Math.random() * 5, {
                  restitution: 0.2, friction: 0.9, density: 0.001, label: "particle_blood",
                  collisionFilter: { 
                    category: 0x0004,
                    mask: 0x0001
                  }
                });
                Matter.Body.setVelocity(p, {
                  x: (Math.random() - 0.5) * 30,
                  y: (Math.random() - 0.5) * 20 - 5
                });
                bloodParticles.push(p);
                impactParticlesRef.current.push({ body: p, createdAt: Date.now() });
              }
              if (engineRef.current) Matter.Composite.add(engineRef.current.world, bloodParticles);
              
              setTimeout(() => {
                triggerResults(true);
              }, 1500);
            }
          }
        }
      }
      
      if (impacted) {
        const now = Date.now();
        if (maxImpactIntensity > 0.1 && now - lastImpactRef.current > 100) {
          playImpactSound(maxImpactIntensity);
        }
        
        if (now - lastImpactRef.current < 800) {
          comboRef.current = comboRef.current + 1;
        } else {
          comboRef.current = 1;
        }
        lastImpactRef.current = now;
      }

      // Spawn physical impact particles on the ground
      if (impactPositions.length > 0 && activeImpact.id !== "impact_none" && engineRef.current) {
        const newParticles: Matter.Body[] = [];
        for (const pos of impactPositions) {
          let spawned = 0;
          const numParticles = activeImpact.id === "impact_dust" ? 8 : (activeImpact.id === "impact_starburst" ? 15 : 5);
          while (spawned < numParticles) {
            const pSize = activeImpact.id === "impact_dust" ? (Math.random() * 8 + 4) : (Math.random() * 4 + 2);
            const pBody = Matter.Bodies.circle(pos.x, pos.y, pSize, {
              restitution: activeImpact.id === "impact_dust" ? 0.1 : 0.8,
              friction: 0.1,
              density: 0.001,
              collisionFilter: {
                category: 0x0004,
                mask: 0x0001
              },
              label: `particle_impact_${activeImpact.id}`
            });
            const speed = activeImpact.id === "impact_starburst" ? (Math.random() * 8 + 4) : (Math.random() * 5 + 2);
            const angle = Math.random() * Math.PI * 2;
            Matter.Body.setVelocity(pBody, {
              x: Math.cos(angle) * speed,
              y: Math.sin(angle) * speed
            });
            newParticles.push(pBody);
            impactParticlesRef.current.push({ body: pBody, createdAt: Date.now() });
            spawned++;
          }
        }
        Matter.Composite.add(engineRef.current.world, newParticles);
      }
    });

    let settleTimer = 0;
    let lastTime = performance.now();
    const fixedDelta = 1000 / 60;
    let accumulator = 0;
    let animationFrameId: number;

    const tick = (time: number) => {
      const frameTime = time - lastTime;
      lastTime = time;
      accumulator += Math.min(frameTime, 250);

      const torso = ragdoll.bodies.find(b => b.label === "torso");

      if (!isPausedRef.current) {
        // Physics Step
        while (accumulator >= fixedDelta) {
          Matter.Engine.update(engine, fixedDelta);
          accumulator -= fixedDelta;

        // Custom Obstacle Logic
        const allBodies = Matter.Composite.allBodies(engine.world);
        for (const body of allBodies) {
          if (body.label.startsWith("spinner_")) {
            const speed = parseFloat(body.label.split("_")[2]);
            Matter.Body.setAngularVelocity(body, speed);
          } else if (body.label.startsWith("movingPlatform_")) {
            const parts = body.label.split("_");
            const startX = parseFloat(parts[2]);
            const startY = parseFloat(parts[3]);
            const endX = parseFloat(parts[4]);
            const endY = parseFloat(parts[5]);
            const speed = parseFloat(parts[6]);
            
            const dist = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            const dur = dist / speed;
            const t = (performance.now() / 1000) * speed; 
            const phase = (Math.sin(t) + 1) / 2; // 0 to 1 to 0
            
            const newX = startX + (endX - startX) * phase;
            const newY = startY + (endY - startY) * phase;
            Matter.Body.setPosition(body, { x: newX, y: newY });
          }
        }

        if (torso) {
          // Distance
          distanceRef.current = Math.max(0, Math.floor(torso.position.x - launchPointRef.current.x));

          // Flips
          let delta = torso.angle - lastTorsoAngleRef.current;
          if (delta > Math.PI) delta -= 2 * Math.PI;
          if (delta < -Math.PI) delta += 2 * Math.PI;
          flipAngleRef.current += delta;
          lastTorsoAngleRef.current = torso.angle;

          if (Math.abs(flipAngleRef.current) > 2 * Math.PI) {
            flipsRef.current += 1;
            flipAngleRef.current = 0;
          }

          // Camera Follow
          cameraRef.current.x += (torso.position.x - cameraRef.current.x) * 0.1;
          cameraRef.current.y += (torso.position.y - cameraRef.current.y) * 0.1;

          // Trail spawn
          if (activeTrail.id !== "trail_none" && torso.speed > 2) {
            trailParticlesRef.current.push({ x: torso.position.x, y: torso.position.y, life: 1.0 });
          }

          // Handle physical particle lifecycle
          const now = Date.now();
          impactParticlesRef.current = impactParticlesRef.current.filter(p => {
            if (now - p.createdAt > 1500) {
              Matter.Composite.remove(engine.world, p.body);
              return false;
            }
            return true;
          });

          // Win/Fail Conditions
          if (torso.position.y > 2100 && gameStateRef.current !== "results" && gameStateRef.current !== "dead") {
            triggerResults(true);
          } else if (gameStateRef.current === "flight" || gameStateRef.current === "settle") {
            if (torso.speed < 0.5) {
              settleTimer += fixedDelta;
              if (settleTimer > 1000 && gameStateRef.current === "flight") {
                gameStateRef.current = "aim";
                settleTimer = 0;
              }
            } else {
              settleTimer = 0;
            }
          }
        }
        }
      } else {
        accumulator = 0; // Prevent physics catch-up jump when unpausing
      }

      // Render
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const scale = canvas.width < 768 ? Math.max(0.4, canvas.width / 768) : 1.0;

      ctx.fillStyle = activeColors.bgBase;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-cameraRef.current.x, -cameraRef.current.y);

      // Draw grid
      ctx.strokeStyle = activeColors.bgDark;
      ctx.lineWidth = 1;

      // Draw Trails
      if (activeTrail.id !== "trail_none") {
        ctx.beginPath();
        for (let i = 0; i < trailParticlesRef.current.length; i++) {
          const p = trailParticlesRef.current[i];
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
          
          p.x += (Math.random() - 0.5) * 2;
          p.y -= 0.5; // slight upward drift
          p.life -= 0.03;
        }
        ctx.lineWidth = 6;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        if (activeTrail.color === "rainbow") {
          ctx.strokeStyle = `hsl(${(Date.now() / 10) % 360}, 100%, 50%)`;
        } else if (activeTrail.color === "accent") {
          ctx.strokeStyle = activeAccent.color || "#B85C45";
        } else {
          ctx.strokeStyle = activeTrail.color || "#ffffff";
        }
        ctx.stroke();
        trailParticlesRef.current = trailParticlesRef.current.filter(p => p.life > 0);
      }

      // Aim Line
      if (gameStateRef.current === "aim" && dragStartRef.current && dragCurrentRef.current && torso) {
        const dx = dragStartRef.current.x - dragCurrentRef.current.x;
        const dy = dragStartRef.current.y - dragCurrentRef.current.y;
        
        ctx.beginPath();
        ctx.setLineDash([10, 10]);
        ctx.moveTo(torso.position.x, torso.position.y);
        ctx.lineTo(torso.position.x + dx * 2, torso.position.y + dy * 2);
        ctx.strokeStyle = activeColors.accent;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Bodies
      const allBodies = Matter.Composite.allBodies(engine.world);
      for (const body of allBodies) {
        ctx.beginPath();
        const vertices = body.vertices;
        if (body.label.startsWith("finishFlag") && flagImageRef.current) {
          ctx.translate(vertices[0].x, vertices[0].y);
          ctx.drawImage(flagImageRef.current, 0, -40, 40, 40);
          ctx.translate(-vertices[0].x, -vertices[0].y);
        } else if (body.label.startsWith("particle_impact") || body.label.startsWith("particle_blood")) {
          const isBlood = body.label.startsWith("particle_blood");
          const isDust = body.label === "particle_impact_impact_dust";
          const isStarburst = body.label === "particle_impact_impact_starburst";
          
          let pColor = activeImpact.color || "#4A4744";
          if (pColor === "accent") pColor = activeAccent.color || "#B85C45";
          
          ctx.fillStyle = isBlood ? "#8B0000" : pColor;
          const pData = impactParticlesRef.current.find(p => p.body === body);
          const life = pData ? Math.max(0, 1 - (Date.now() - pData.createdAt) / 1500) : 1;
          
          ctx.globalAlpha = isDust ? life * 0.5 : life;
          
          ctx.beginPath();
          if (isStarburst) {
            // Draw a small star
            const spikes = 4;
            const outer = (body.circleRadius || 4) * life * 1.5;
            const inner = outer / 2;
            let rot = Math.PI / 2 * 3;
            const step = Math.PI / spikes;
            ctx.moveTo(body.position.x, body.position.y - outer);
            for (let i = 0; i < spikes; i++) {
              ctx.lineTo(body.position.x + Math.cos(rot) * outer, body.position.y + Math.sin(rot) * outer); rot += step;
              ctx.lineTo(body.position.x + Math.cos(rot) * inner, body.position.y + Math.sin(rot) * inner); rot += step;
            }
            ctx.lineTo(body.position.x, body.position.y - outer);
          } else {
            ctx.arc(body.position.x, body.position.y, (body.circleRadius || 4) * life, 0, 2 * Math.PI);
          }
          ctx.fill();
          ctx.globalAlpha = 1.0;
          continue;
        } else if (body.label === "spikes" || body.label.startsWith("spikeObstacle_")) {
          if (spikesImageRef.current) {
            const pattern = ctx.createPattern(spikesImageRef.current, "repeat");
            if (pattern) {
              ctx.save();
              ctx.translate(vertices[0].x, vertices[0].y);
              ctx.fillStyle = pattern;
              const width = Math.sqrt(Math.pow(vertices[1].x - vertices[0].x, 2) + Math.pow(vertices[1].y - vertices[0].y, 2));
              const angle = Math.atan2(vertices[1].y - vertices[0].y, vertices[1].x - vertices[0].x);
              ctx.rotate(angle);
              ctx.fillRect(0, -40, width, 40);
              ctx.restore();
            }
          }
          ctx.fillStyle = "var(--color-geometry)";
          ctx.beginPath();
          ctx.moveTo(vertices[0].x, vertices[0].y);
          for (let j = 1; j < vertices.length; j++) ctx.lineTo(vertices[j].x, vertices[j].y);
          ctx.closePath();
          ctx.fill();
          continue;
        } else if (body.label.startsWith("finishFlag")) {
           ctx.fillStyle = "transparent";
        } else if (body.label.startsWith("bonusTarget_")) {
          ctx.fillStyle = activeColors.accent;
        } else if (body.label.startsWith("head") || body.label.startsWith("torso") || body.label.startsWith("limb")) {
          ctx.fillStyle = patternRef.current;
        } else {
          ctx.fillStyle = activeColors.geometry;
        }
        ctx.moveTo(vertices[0].x, vertices[0].y);
        for (let j = 1; j < vertices.length; j++) {
          ctx.lineTo(vertices[j].x, vertices[j].y);
        }
        ctx.lineTo(vertices[0].x, vertices[0].y);
        ctx.closePath();
        ctx.fill();
      }

      // Draw Accent Joints
      if (ragdollRef.current) {
        ctx.fillStyle = activeAccent.color || "#B85C45";
        for (const body of ragdollRef.current.bodies) {
          ctx.beginPath();
          ctx.arc(body.position.x, body.position.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      ctx.restore();

      // Update HUD
      if (hudRef.current && gameStateRef.current !== "results") {
        if (window.innerWidth < 768) {
          hudRef.current.innerHTML = `Dist: ${distanceRef.current} | Flips: ${flipsRef.current}<br/>Bonus: ${bonusRef.current} | Combo: x${comboRef.current}`;
        } else {
          hudRef.current.innerHTML = `Distance: ${distanceRef.current} | Flips: ${flipsRef.current} | Bonus: ${bonusRef.current} | Combo: x${comboRef.current}`;
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    // Interaction
    const handlePointerDown = (e: PointerEvent) => {
      if (gameStateRef.current !== "aim" || isPausedRef.current) return;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      dragCurrentRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (gameStateRef.current !== "aim" || !dragStartRef.current || isPausedRef.current) return;
      dragCurrentRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (gameStateRef.current !== "aim" || !dragStartRef.current || isPausedRef.current) return;
      
      const scale = window.innerWidth < 768 ? Math.max(0.4, window.innerWidth / 768) : 1.0;
      
      const dx = (dragStartRef.current.x - e.clientX) / scale;
      const dy = (dragStartRef.current.y - e.clientY) / scale;
      
      const maxForce = 0.5;
      const forceScale = 0.002;
      let forceX = dx * forceScale;
      let forceY = dy * forceScale;
      
      const mag = Math.sqrt(forceX * forceX + forceY * forceY);
      if (mag > maxForce) {
        forceX = (forceX / mag) * maxForce;
        forceY = (forceY / mag) * maxForce;
      }

      const torso = ragdollRef.current?.bodies.find(b => b.label === "torso");
      if (torso) {
        Matter.Body.applyForce(torso, torso.position, { x: forceX, y: forceY });
        gameStateRef.current = "flight";
        
        // Play launch scream!
        if (sfxRefs.current.length > 0) {
          const sfx = sfxRefs.current[0];
          sfx.currentTime = 0;
          sfx.volume = sfxVolume;
          sfx.playbackRate = 0.7 + Math.random() * 0.8; // Random pitch for launch!
          sfx.play().catch(() => {});
        }
      }

      dragStartRef.current = null;
      dragCurrentRef.current = null;
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    // Trigger Results Helper
    const triggerResults = (failed: boolean) => {
      if (!course) return;
      gameStateRef.current = "results";
      setHasFailed(failed);
      
      const totalScore = distanceRef.current + bonusRef.current;
      setFinalScore(totalScore);
      
      let stars = 0;
      if (!failed) {
        if (totalScore >= course.starThresholds.threeStar) stars = 3;
        else if (totalScore >= course.starThresholds.twoStar) stars = 2;
        else if (totalScore >= course.starThresholds.oneStar) stars = 1;
      }
      setStarsEarned(stars);
      setShowResults(true);

      if (!failed && stars > 0) {
        const oldUnlockedCount = loadProfile().unlockedCosmetics.length;
        saveCourseStars(course.id, stars);
        const newTotal = loadProfile().totalStars;
        
        const newUnlocked = getUnlockedCosmetics(newTotal);
        if (newUnlocked.length > oldUnlockedCount) {
          const profile = loadProfile();
          profile.unlockedCosmetics = newUnlocked;
          saveProfile(profile);
          
          // Find the newly unlocked item name
          const allItems = [...BODIES, ...ACCENTS, ...TRAILS, ...IMPACTS];
          const newestId = newUnlocked[newUnlocked.length - 1];
          const newestItem = allItems.find(i => i.id === newestId);
          if (newestItem) {
            setUnlockToast(`New unlock: ${newestItem.name}!`);
          }
        }
      }
    };

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      cancelAnimationFrame(animationFrameId);
      Matter.Engine.clear(engine);
    };
  }, [course]);

  const resetGame = () => {
    window.location.reload();
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div  
        ref={hudRef}
        style={{
          position: "absolute", top: 10, left: 10,
          color: activeColors.geometry, fontFamily: "var(--font-geist-mono)",
          fontSize: "clamp(14px, 4vw, 24px)",
          pointerEvents: "none", zIndex: 10,
          textShadow: "0px 2px 4px rgba(0,0,0,0.3)"
        }}
      ></div>

      <button 
        onClick={togglePause}
        style={{
          position: "absolute", top: 20, right: 20, zIndex: 10,
          background: activeColors.geometry, color: activeColors.bgLight, border: "none",
          padding: "10px 15px", borderRadius: "8px", fontSize: "1.5rem", cursor: "pointer",
          fontFamily: "var(--font-geist-sans)"
        }}
      >
        ||
      </button>

      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%", touchAction: "none" }} />
      
      {isPaused && !showResults && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 30
        }}>
          <div style={{
            background: activeColors.geometry, color: activeColors.bgLight,
            padding: "40px", borderRadius: "8px", textAlign: "center",
            width: "300px"
          }}>
            <h2 style={{ fontSize: "3rem", marginBottom: "30px", fontFamily: "var(--font-display)" }}>Paused</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <button className="primary" onClick={togglePause} style={{ padding: "12px", fontSize: "1.5rem" }}>Resume</button>
              <button onClick={() => router.push("/settings")} style={{ padding: "12px", fontSize: "1.5rem", color: activeColors.geometry }}>Settings</button>
              <button onClick={() => router.push("/")} style={{ padding: "12px", fontSize: "1.5rem", color: activeColors.geometry }}>Main Menu</button>
            </div>
          </div>
        </div>
      )}

      {showResults && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.8)",
          zIndex: 20
        }}>
          <div style={{
            background: activeColors.bgLight, color: activeColors.geometry,
            padding: "40px", borderRadius: "16px", textAlign: "center",
            width: "400px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
          }}>
            <h2 style={{ fontSize: "4rem", marginBottom: "10px", fontFamily: "var(--font-display)" }}>
              {hasFailed ? "Failed" : "Clear!"}
            </h2>

            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "30px" }}>
              {[1, 2, 3].map(s => (
                <span key={s} style={{ fontSize: "3rem", color: s <= starsEarned ? COLORS.accent : COLORS.bgDark }}>★</span>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => router.push("/")} style={{ padding: "12px 24px", fontSize: "1.5rem" }}>
                Menu
              </button>
              <button className="primary" onClick={resetGame} style={{ padding: "12px 24px", fontSize: "1.5rem" }}>
                Retry
              </button>
              {!hasFailed && nextCourseId && (
                <button className="primary" onClick={() => router.push(`/play/${nextCourseId}`)} style={{ padding: "12px 24px", fontSize: "1.5rem" }}>
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {unlockToast && (
        <div style={{
          position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)",
          background: "var(--color-accent)", color: "#fff", padding: "15px 30px",
          borderRadius: "8px", zIndex: 100, fontFamily: "var(--font-display)", fontSize: "1.5rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)", animation: "slideDown 0.5s ease-out"
        }}>
          {unlockToast}
        </div>
      )}
    </div>
  );
}

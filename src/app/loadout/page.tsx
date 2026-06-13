"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLoadout } from "../lib/LoadoutContext";
import { useSettings } from "../lib/SettingsContext";
import { BODIES, ACCENTS, TRAILS, IMPACTS, CosmeticItem, CosmeticType, getUnlockedCosmetics } from "../data/cosmetics";
import { loadProfile, TumbledownProfile } from "../lib/profile";

export default function LoadoutMenu() {
  const { loadout, setLoadout } = useLoadout();
  const { devMode, setDevMode } = useSettings();
  const [profile, setProfile] = useState<TumbledownProfile | null>(null);

  // Canvas ref for the preview
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  // Simple static preview render
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    // Draw background
    ctx.fillStyle = "#D7D4CF"; // Notebook base
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = "#C7C3BD";
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
    }

    // Resolve colors
    const bodyItem = BODIES.find(b => b.id === loadout.bodySkin);
    const accentItem = ACCENTS.find(a => a.id === loadout.accent);
    const bodyColor = bodyItem?.color || "#4A4744";
    const accentColor = accentItem?.color || "#B85C45";

    // Draw a frozen ragdoll pose
    ctx.save();
    ctx.translate(width / 2, height / 2 + 20);

    // Torso
    ctx.fillStyle = bodyColor;
    ctx.fillRect(-20, -40, 40, 80);
    // Head
    ctx.beginPath(); ctx.arc(0, -60, 20, 0, Math.PI * 2); ctx.fill();
    // Arms
    ctx.fillRect(-45, -35, 20, 60);
    ctx.fillRect(25, -35, 20, 60);
    // Legs
    ctx.fillRect(-20, 45, 15, 60);
    ctx.fillRect(5, 45, 15, 60);

    // Accent joints
    ctx.fillStyle = accentColor;
    const drawJoint = (x: number, y: number) => {
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
    };
    drawJoint(0, -40); // Neck
    drawJoint(-25, -30); // L Shoulder
    drawJoint(25, -30); // R Shoulder
    drawJoint(-12, 40); // L Hip
    drawJoint(12, 40); // R Hip

    ctx.restore();

  }, [loadout]);

  if (!profile) return null;

  const unlocked = getUnlockedCosmetics(devMode ? 999 : profile.totalStars);

  const isUnlocked = (id: string) => devMode || unlocked.includes(id);

  const renderColumn = (title: string, items: CosmeticItem[], currentId: string, slot: "bodySkin" | "accent" | "trail" | "impact") => (
    <div style={{ flex: 1, minWidth: "250px", display: "flex", flexDirection: "column", gap: "10px" }}>
      <h3 style={{ fontSize: "1.5rem", color: "var(--color-geometry)", borderBottom: "2px solid var(--color-bg-dark)", paddingBottom: "10px" }}>
        {title}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto", maxHeight: "400px", paddingRight: "10px" }}>
        {items.map(item => {
          const hasUnlocked = isUnlocked(item.id);
          const selected = currentId === item.id;
          return (
            <div 
              key={item.id}
              onClick={() => hasUnlocked && setLoadout(slot, item.id)}
              style={{
                background: selected ? "var(--color-accent)" : (hasUnlocked ? "var(--color-bg-light)" : "var(--color-geometry)"),
                color: selected ? "#fff" : (hasUnlocked ? "var(--color-geometry)" : "var(--color-ragdoll)"),
                padding: "15px",
                borderRadius: "8px",
                cursor: hasUnlocked ? "pointer" : "not-allowed",
                opacity: hasUnlocked ? 1 : 0.4,
                border: selected ? "2px solid #fff" : "2px solid transparent",
                display: "flex",
                flexDirection: "column",
                gap: "5px"
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{item.name}</div>
              <div style={{ fontSize: "0.85rem" }}>
                {hasUnlocked ? (selected ? "Equipped" : "Available") : `Unlocks at ${item.req?.amount} ★`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <main className="page-wrapper" style={{ 
      backgroundColor: "var(--color-bg-base)",
      fontFamily: "var(--font-geist-sans)"
    }}>
      <div className="responsive-card" style={{ maxWidth: "1200px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "3rem", fontFamily: "var(--font-display)", color: "var(--color-geometry)", margin: 0 }}>
              Loadout
            </h1>
          </div>
          <div style={{ textAlign: "right", color: "var(--color-geometry)" }}>
            <div style={{ fontSize: "1.2rem" }}>Total Stars: <strong>{profile.totalStars}</strong></div>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "30px", marginBottom: "30px" }}>
          {/* Static Preview Canvas */}
          <div style={{ width: "100%", maxWidth: "300px", margin: "0 auto", borderRadius: "12px", overflow: "hidden", border: "4px solid var(--color-bg-dark)", backgroundColor: "#fff" }}>
            <canvas ref={canvasRef} width={300} height={300} style={{ display: "block" }} />
          </div>

          <div style={{ flex: 1, display: "flex", gap: "20px", overflowX: "auto", paddingBottom: "20px" }}>
            {renderColumn("Body Skin", BODIES, loadout.bodySkin, "bodySkin")}
            {renderColumn("Accent", ACCENTS, loadout.accent, "accent")}
            {renderColumn("Trail Effect", TRAILS, loadout.trail, "trail")}
            {renderColumn("Impact Effect", IMPACTS, loadout.impact, "impact")}
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/" style={{ flex: 1 }}>
            <button style={{ width: "100%", padding: "15px", fontSize: "1.5rem" }}>
              Back to Menu
            </button>
          </Link>
          <button 
            onClick={() => setDevMode(!devMode)}
            style={{ padding: "15px", fontSize: "1rem", background: "var(--color-bg-dark)", color: "var(--color-bg-light)", border: "none", borderRadius: "8px", cursor: "pointer" }}
          >
            {devMode ? "Disable Dev Mode" : "Dev Mode (Unlock All)"}
          </button>
        </div>
      </div>
    </main>
  );
}

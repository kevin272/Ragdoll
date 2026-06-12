"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLoadout } from "../lib/LoadoutContext";
import { useSettings } from "../lib/SettingsContext";
import { statsManager, GlobalStats } from "../lib/stats";
import { BODIES, IMPACTS, TRAILS, WORLDS, CosmeticItem, CosmeticType } from "../data/cosmetics";

export default function LoadoutMenu() {
  const { bodyId, impactId, trailId, worldId, setLoadout } = useLoadout();
  const { devMode, setDevMode } = useSettings();
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [activeTab, setActiveTab] = useState<CosmeticType>("body");

  useEffect(() => {
    setStats(statsManager.get());
  }, []);

  const isUnlocked = (item: CosmeticItem) => {
    if (devMode) return true;
    if (!item.req || !stats) return true;
    switch (item.req.type) {
      case "stars": return stats.totalStars >= item.req.amount;
      case "crashes": return stats.totalCrashes >= item.req.amount;
      case "bumperHits": return stats.totalBumperHits >= item.req.amount;
      case "combo": return stats.maxCombo >= item.req.amount;
      default: return false;
    }
  };

  const getReqText = (item: CosmeticItem) => {
    if (devMode) return "Unlocked (Dev Mode)";
    if (!item.req) return "Unlocked";
    switch (item.req.type) {
      case "stars": return `Requires ${item.req.amount} Stars`;
      case "crashes": return `Requires ${item.req.amount} Crashes`;
      case "bumperHits": return `Requires ${item.req.amount} Bumper Hits`;
      case "combo": return `Requires ${item.req.amount}x Combo`;
      default: return "";
    }
  };

  const renderTab = (type: CosmeticType, title: string, items: CosmeticItem[], currentId: string) => {
    return (
      <div style={{ display: activeTab === type ? "block" : "none", width: "100%" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>{title}</h2>
        <div className="grid-responsive">
          {items.map(item => {
            const unlocked = isUnlocked(item);
            const selected = currentId === item.id;
            return (
              <div 
                key={item.id}
                onClick={() => unlocked && setLoadout(type === "world" ? "worldId" : type === "body" ? "bodyId" : type === "trail" ? "trailId" : "impactId", item.id)}
                style={{
                  background: selected ? "var(--color-accent)" : (unlocked ? "var(--color-bg-dark)" : "var(--color-geometry)"),
                  color: selected ? "#fff" : (unlocked ? "var(--color-geometry)" : "var(--color-ragdoll)"),
                  padding: "15px",
                  borderRadius: "8px",
                  cursor: unlocked ? "pointer" : "not-allowed",
                  opacity: unlocked ? 1 : 0.5,
                  border: selected ? "2px solid #fff" : "2px solid transparent",
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{item.name}</div>
                <div style={{ fontSize: "0.9rem", marginTop: "5px" }}>
                  {unlocked ? (selected ? "Equipped" : "Available") : getReqText(item)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!stats) return null;

  return (
    <main className="page-wrapper" style={{ 
      backgroundColor: "var(--color-bg-base)",
      fontFamily: "var(--font-geist-sans)"
    }}>
      <div className="responsive-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "3rem", fontFamily: "var(--font-display)", color: "var(--color-geometry)", margin: 0 }}>
              Loadout
            </h1>
            <button 
              onClick={() => {
                setDevMode(true);
                alert("Mock Purchase Successful! All items unlocked.");
              }}
              style={{
                background: "var(--color-accent)", color: "#fff", border: "none", 
                padding: "8px 12px", borderRadius: "6px", cursor: "pointer", 
                marginTop: "10px", fontWeight: "bold"
              }}
            >
              Unlock All - $4.99
            </button>
          </div>
          <div style={{ textAlign: "right", color: "var(--color-geometry)" }}>
            <div>Stars: <strong>{stats.totalStars}</strong> | Crashes: <strong>{stats.totalCrashes}</strong></div>
            <div>Bumper Hits: <strong>{stats.totalBumperHits}</strong> | Max Combo: <strong>{stats.maxCombo}x</strong></div>
          </div>
        </div>

        <div className="loadout-layout">
          {/* Sidebar Tabs */}
          <div className="loadout-sidebar">
            {["body", "impact", "trail", "world"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as CosmeticType)}
                style={{
                  padding: "10px",
                  fontSize: "1.2rem",
                  background: activeTab === tab ? "var(--color-geometry)" : "var(--color-bg-base)",
                  color: activeTab === tab ? "var(--color-bg-light)" : "var(--color-geometry)",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  textTransform: "capitalize"
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="loadout-content">
            {renderTab("body", "Character Body", BODIES, bodyId)}
            {renderTab("impact", "Impact Effects", IMPACTS, impactId)}
            {renderTab("trail", "Flight Trails", TRAILS, trailId)}
            {renderTab("world", "World Themes", WORLDS, worldId)}
          </div>
        </div>

        <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
          <Link href="/" style={{ flex: 1 }}>
            <button style={{ width: "100%", padding: "15px", fontSize: "1.5rem" }}>
              Back to Menu
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}

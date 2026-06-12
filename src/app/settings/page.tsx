"use client";

import Link from "next/link";
import { useSettings } from "../lib/SettingsContext";

export default function SettingsMenu() {
  const { bgmVolume, sfxVolume, devMode, setBgmVolume, setSfxVolume, setDevMode } = useSettings();

  return (
    <main style={{ 
      minHeight: "100vh", 
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      backgroundColor: "var(--color-bg-base)",
      fontFamily: "var(--font-geist-sans)"
    }}>
      <div style={{
        background: "var(--color-geometry)",
        color: "var(--color-bg-light)",
        padding: "40px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
      }}>
        <h1 style={{ 
          fontSize: "3rem", 
          fontFamily: "var(--font-display)", 
          marginBottom: "30px",
          textAlign: "center"
        }}>
          Settings
        </h1>
        
        <div style={{ marginBottom: "30px" }}>
          <label style={{ display: "block", fontSize: "1.2rem", marginBottom: "10px" }}>
            Music Volume: {Math.round(bgmVolume * 100)}%
          </label>
          <input 
            type="range" 
            min="0" max="1" step="0.05"
            value={bgmVolume}
            onChange={(e) => setBgmVolume(parseFloat(e.target.value))}
            style={{ width: "100%", cursor: "pointer" }}
          />
        </div>
        
        <div style={{ marginBottom: "40px" }}>
          <label style={{ display: "block", fontSize: "1.2rem", marginBottom: "10px" }}>
            SFX Volume: {Math.round(sfxVolume * 100)}%
          </label>
          <input 
            type="range" 
            min="0" max="1" step="0.05"
            value={sfxVolume}
            onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
            style={{ width: "100%", cursor: "pointer" }}
          />
        </div>

        <div style={{ marginBottom: "40px", display: "flex", alignItems: "center", gap: "10px" }}>
          <input 
            type="checkbox" 
            id="devMode"
            checked={devMode}
            onChange={(e) => setDevMode(e.target.checked)}
            style={{ width: "20px", height: "20px", cursor: "pointer" }}
          />
          <label htmlFor="devMode" style={{ fontSize: "1.2rem", cursor: "pointer" }}>
            Developer Mode (Unlock all levels)
          </label>
        </div>

        <Link href="/">
          <button style={{ width: "100%", padding: "12px", fontSize: "1.2rem", color: "var(--color-geometry)" }}>
            Back to Menu
          </button>
        </Link>
      </div>
    </main>
  );
}

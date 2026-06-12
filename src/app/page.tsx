"use client";

import Link from "next/link";
import MockBackgroundCanvas from "./components/MockBackgroundCanvas";

export default function MainMenu() {
  return (
    <main style={{ 
      minHeight: "100vh", 
      position: "relative",
      backgroundColor: "var(--color-bg-base)",
      fontFamily: "var(--font-geist-sans)",
      overflow: "hidden"
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <MockBackgroundCanvas />
      </div>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        zIndex: 10,
        pointerEvents: "none"
      }}>
        <div style={{ 
          background: "rgba(215, 212, 207, 0.7)", 
          padding: "60px", 
          borderRadius: "16px",
          display: "flex", flexDirection: "column", alignItems: "center",
          backdropFilter: "blur(4px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          pointerEvents: "auto"
        }}>
          <h1 style={{ 
            fontSize: "6rem", 
            fontFamily: "var(--font-display)", 
            color: "var(--color-geometry)",
            marginBottom: "10px",
            textShadow: "2px 2px 0px rgba(255,255,255,0.5)"
          }}>
            Tumbledown
          </h1>
          <p style={{ fontSize: "1.5rem", color: "var(--color-ragdoll)", marginBottom: "50px", fontWeight: "bold" }}>
            Fling the ragdoll. Cause chaos.
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "300px" }}>
            <Link href="/select" style={{ width: "100%" }}>
              <button className="primary" style={{ width: "100%", padding: "15px", fontSize: "1.5rem" }}>
                Play
              </button>
            </Link>
            <Link href="/loadout" style={{ width: "100%" }}>
              <button style={{ width: "100%", padding: "15px", fontSize: "1.5rem" }}>
                Loadout
              </button>
            </Link>
            <Link href="/settings" style={{ width: "100%" }}>
              <button style={{ width: "100%", padding: "15px", fontSize: "1.5rem" }}>
                Settings
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

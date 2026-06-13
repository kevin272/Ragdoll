"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { loadProfile, saveProfile, TumbledownProfile } from "./profile";

interface LoadoutContextType {
  loadout: TumbledownProfile["loadout"];
  setLoadout: (key: keyof TumbledownProfile["loadout"], val: string) => void;
  unlockedCosmetics: string[];
}

const defaultLoadoutContext: LoadoutContextType = {
  loadout: {
    bodySkin: "skin_charcoal",
    accent: "accent_rust",
    trail: "trail_none",
    impact: "impact_debris"
  },
  setLoadout: () => {},
  unlockedCosmetics: ["skin_charcoal", "accent_rust", "trail_none", "impact_debris"]
};

const LoadoutContext = createContext<LoadoutContextType>(defaultLoadoutContext);

export function LoadoutProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<TumbledownProfile | null>(null);

  useEffect(() => {
    setProfileState(loadProfile());
  }, []);

  const setLoadout = (key: keyof TumbledownProfile["loadout"], val: string) => {
    setProfileState(prev => {
      if (!prev) return prev;
      const next = { ...prev, loadout: { ...prev.loadout, [key]: val } };
      saveProfile(next);
      return next;
    });
  };

  if (!profile) return null;

  return (
    <LoadoutContext.Provider value={{ loadout: profile.loadout, setLoadout, unlockedCosmetics: profile.unlockedCosmetics }}>
      {children}
    </LoadoutContext.Provider>
  );
}

export function useLoadout() {
  return useContext(LoadoutContext);
}

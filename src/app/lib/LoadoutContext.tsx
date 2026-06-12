"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Loadout {
  bodyId: string;
  impactId: string;
  trailId: string;
  worldId: string;
  setLoadout: (key: "bodyId" | "impactId" | "trailId" | "worldId", val: string) => void;
}

const defaultLoadout: Loadout = {
  bodyId: "body_default",
  impactId: "impact_dust",
  trailId: "trail_none",
  worldId: "world_sketchbook",
  setLoadout: () => {},
};

const LoadoutContext = createContext<Loadout>(defaultLoadout);

export function LoadoutProvider({ children }: { children: React.ReactNode }) {
  const [loadout, setLoadoutState] = useState<Omit<Loadout, "setLoadout">>({
    bodyId: defaultLoadout.bodyId,
    impactId: defaultLoadout.impactId,
    trailId: defaultLoadout.trailId,
    worldId: defaultLoadout.worldId,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tumbledown_loadout");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLoadoutState({
          bodyId: parsed.bodyId || defaultLoadout.bodyId,
          impactId: parsed.impactId || defaultLoadout.impactId,
          trailId: parsed.trailId || defaultLoadout.trailId,
          worldId: parsed.worldId || defaultLoadout.worldId,
        });
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  const setLoadout = (key: keyof Omit<Loadout, "setLoadout">, val: string) => {
    setLoadoutState(prev => {
      const next = { ...prev, [key]: val };
      localStorage.setItem("tumbledown_loadout", JSON.stringify(next));
      return next;
    });
  };

  return (
    <LoadoutContext.Provider value={{ ...loadout, setLoadout }}>
      {isLoaded && children}
    </LoadoutContext.Provider>
  );
}

export function useLoadout() {
  return useContext(LoadoutContext);
}

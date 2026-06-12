"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Settings {
  bgmVolume: number;
  sfxVolume: number;
  devMode: boolean;
  setBgmVolume: (val: number) => void;
  setSfxVolume: (val: number) => void;
  setDevMode: (val: boolean) => void;
}

const defaultSettings: Settings = {
  bgmVolume: 0.3,
  sfxVolume: 0.8,
  devMode: false,
  setBgmVolume: () => {},
  setSfxVolume: () => {},
  setDevMode: () => {},
};

const SettingsContext = createContext<Settings>(defaultSettings);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [bgmVolume, setBgmVolumeState] = useState(defaultSettings.bgmVolume);
  const [sfxVolume, setSfxVolumeState] = useState(defaultSettings.sfxVolume);
  const [devMode, setDevModeState] = useState(defaultSettings.devMode);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tumbledown_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.bgmVolume === "number") setBgmVolumeState(parsed.bgmVolume);
        if (typeof parsed.sfxVolume === "number") setSfxVolumeState(parsed.sfxVolume);
        if (typeof parsed.devMode === "boolean") setDevModeState(parsed.devMode);
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  const setBgmVolume = (val: number) => {
    setBgmVolumeState(val);
    localStorage.setItem("tumbledown_settings", JSON.stringify({ bgmVolume: val, sfxVolume, devMode }));
  };

  const setSfxVolume = (val: number) => {
    setSfxVolumeState(val);
    localStorage.setItem("tumbledown_settings", JSON.stringify({ bgmVolume, sfxVolume: val, devMode }));
  };

  const setDevMode = (val: boolean) => {
    setDevModeState(val);
    localStorage.setItem("tumbledown_settings", JSON.stringify({ bgmVolume, sfxVolume, devMode: val }));
  };

  return (
    <SettingsContext.Provider value={{ bgmVolume, sfxVolume, devMode, setBgmVolume, setSfxVolume, setDevMode }}>
      {isLoaded && children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

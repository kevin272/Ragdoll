"use client";

import { useEffect, useRef } from "react";
import { SettingsProvider, useSettings } from "../lib/SettingsContext";
import { LoadoutProvider } from "../lib/LoadoutContext";

function BGMPlayer() {
  const { bgmVolume } = useSettings();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = bgmVolume;
    }
  }, [bgmVolume]);

  useEffect(() => {
    // Attempt autoplay on mount and on first user interaction
    const playAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    };
    
    document.addEventListener("pointerdown", playAudio, { once: true });
    return () => document.removeEventListener("pointerdown", playAudio);
  }, []);

  return <audio ref={audioRef} src="/bgm.mp3" loop preload="auto" />;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <LoadoutProvider>
        <BGMPlayer />
        {children}
      </LoadoutProvider>
    </SettingsProvider>
  );
}

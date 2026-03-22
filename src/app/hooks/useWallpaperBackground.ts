import { useEffect, useState } from "react";
import { convertFileSrc } from "@tauri-apps/api/core";
import type { Settings } from "../../pomodoro/types";

type Wp = Pick<Settings, "wallpaperPath" | "wallpaperUrl">;

export function useWallpaperBackground(settings: Wp): string | null {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const { wallpaperPath, wallpaperUrl } = settings;
    if (wallpaperUrl) {
      setSrc(wallpaperUrl);
      return;
    }
    if (wallpaperPath) {
      try {
        setSrc(convertFileSrc(wallpaperPath));
      } catch {
        setSrc(null);
      }
    } else {
      setSrc(null);
    }
  }, [settings.wallpaperPath, settings.wallpaperUrl]);

  return src;
}

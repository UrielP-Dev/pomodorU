import { useCallback, useEffect, useState } from "react";

export function useFullscreen(): {
  fullscreen: boolean;
  toggleFullscreen: () => Promise<void>;
} {
  const [fullscreen, setFullscreen] = useState(false);

  const syncFromWindow = useCallback(async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      const fs = await getCurrentWindow().isFullscreen();
      setFullscreen(fs);
    } catch {
      setFullscreen(!!document.fullscreenElement);
    }
  }, []);

  useEffect(() => {
    void syncFromWindow();
    const onVis = () => void syncFromWindow();
    window.addEventListener("focus", onVis);
    document.addEventListener("fullscreenchange", onVis);
    return () => {
      window.removeEventListener("focus", onVis);
      document.removeEventListener("fullscreenchange", onVis);
    };
  }, [syncFromWindow]);

  const toggleFullscreen = useCallback(async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      const w = getCurrentWindow();
      const next = !(await w.isFullscreen());
      await w.setFullscreen(next);
      setFullscreen(next);
    } catch {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      } catch {
        /* noop */
      }
      setFullscreen(!!document.fullscreenElement);
    }
  }, []);

  return { fullscreen, toggleFullscreen };
}

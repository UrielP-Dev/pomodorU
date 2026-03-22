import { useEffect } from "react";
import { setAmbient, stopAmbient } from "../../lib/audio";
import type { Settings } from "../../pomodoro/types";

export function useAmbientSync(settings: Settings, running: boolean): void {
  useEffect(() => {
    const shouldPlay =
      settings.ambientEnabled &&
      settings.ambientPreset !== "off" &&
      running;

    if (!shouldPlay) {
      stopAmbient();
      return;
    }

    setAmbient(settings.ambientPreset, true, settings.volume);
    return () => {
      stopAmbient();
    };
  }, [
    settings.ambientPreset,
    settings.ambientEnabled,
    settings.volume,
    running,
  ]);
}

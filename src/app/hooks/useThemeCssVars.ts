import { useEffect } from "react";
import type { Settings } from "../../pomodoro/types";

type T = Pick<Settings, "theme" | "customAccent" | "customSurface">;

export function useThemeCssVars(settings: T): void {
  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.style.setProperty(
      "--accent",
      settings.customAccent,
    );
    document.documentElement.style.setProperty(
      "--surface-custom",
      settings.customSurface,
    );
  }, [settings.theme, settings.customAccent, settings.customSurface]);
}

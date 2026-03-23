import { useState } from "react";
import "../App.css";
import { usePomodoro } from "../pomodoro";
import { useAmbientSync } from "./hooks/useAmbientSync";
import { useFullscreen } from "./hooks/useFullscreen";
import { useThemeCssVars } from "./hooks/useThemeCssVars";
import { useWallpaperBackground } from "./hooks/useWallpaperBackground";
import { pickImageWallpaperPath } from "./wallpaperDialog";
import { AppHeader } from "./layout/AppHeader";
import { AppTabBar } from "./layout/AppTabBar";
import type { AppTab } from "./navigation";
import { TimerHomeView } from "./views/TimerHomeView";
import { HistoryPanel } from "../components/HistoryPanel";
import { SettingsPanel } from "../components/SettingsPanel";
import { StatsPanel } from "../components/StatsPanel";
import { TasksPanel } from "../components/TasksPanel";

export default function App() {
  const pom = usePomodoro();
  const [tab, setTab] = useState<AppTab>("timer");
  const wallpaperSrc = useWallpaperBackground(pom.settings);
  const { fullscreen, toggleFullscreen } = useFullscreen();

  useAmbientSync(pom.settings, pom.running);
  useThemeCssVars(pom.settings);

  async function pickWallpaper(): Promise<void> {
    const path = await pickImageWallpaperPath();
    if (path) {
      pom.applySettingsPatch({ wallpaperPath: path, wallpaperUrl: null });
    }
  }

  function clearWallpaper(): void {
    pom.applySettingsPatch({ wallpaperPath: null, wallpaperUrl: null });
  }

  return (
    <div
      className="app-root"
      style={
        wallpaperSrc
          ? {
              backgroundImage: `linear-gradient(125deg,rgba(255,182,200,0.45),rgba(255,240,250,0.55),rgba(200,180,255,0.4)),url(${wallpaperSrc})`,
            }
          : undefined
      }
    >
      <div className={`app-frame ${fullscreen ? "is-fullscreen" : ""}`}>
        <AppHeader
          fullscreen={fullscreen}
          onToggleFullscreen={toggleFullscreen}
        />

        <AppTabBar tab={tab} onTabChange={setTab} />

        <main className="app-main">
          <div key={tab} className="tab-panel">
            {tab === "timer" ? (
              <TimerHomeView
                pom={pom}
                onOpenSettings={() => setTab("settings")}
                onOpenStats={() => setTab("stats")}
              />
            ) : null}
            {tab === "tasks" ? (
              <TasksPanel
                tasks={pom.tasks}
                tasksReady={pom.tasksReady}
                taskLogVersion={pom.taskLogVersion}
                activeTaskId={pom.activeTaskId}
                onSelectTask={pom.setActiveTaskId}
                onAdd={(title) => void pom.addTask(title)}
                onToggle={pom.toggleTaskDone}
                onRemove={pom.removeTask}
                onClearDone={pom.clearDoneTasks}
              />
            ) : null}
            {tab === "history" ? <HistoryPanel history={pom.history} /> : null}
            {tab === "stats" ? (
              <StatsPanel
                history={pom.history}
                totalWorkSessionsCompleted={pom.totalWorkSessionsCompleted}
              />
            ) : null}
            {tab === "settings" ? (
              <SettingsPanel
                settings={pom.settings}
                onChange={pom.applySettingsPatch}
                onPickWallpaper={pickWallpaper}
                onClearWallpaper={clearWallpaper}
              />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

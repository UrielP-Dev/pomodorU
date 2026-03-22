import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import type { SessionMode, SessionRecord, Settings, Task } from "./types";
import { appendHistory, loadState, patchSettings, saveState } from "./storage";
import { playAlert, resumeAudioIfNeeded } from "../lib/audio";
import { durationSecondsForMode } from "./durations";

function modeLabel(mode: SessionMode): string {
  switch (mode) {
    case "work":
      return "Enfoque";
    case "shortBreak":
      return "Descanso corto";
    case "longBreak":
      return "Descanso largo";
    default:
      return "";
  }
}

async function notifyIfEnabled(
  settings: Settings,
  title: string,
  body: string,
): Promise<void> {
  if (!settings.notificationsEnabled) return;
  try {
    let granted = await isPermissionGranted();
    if (!granted) {
      const p = await requestPermission();
      granted = p === "granted";
    }
    if (!granted) return;
    await sendNotification({ title, body });
  } catch {
    /* fuera de Tauri o permisos denegados */
  }
}

export function usePomodoro() {
  const initial = useMemo(() => loadState(), []);
  const [settings, setSettings] = useState<Settings>(initial.settings);
  const [tasks, setTasks] = useState<Task[]>(initial.tasks);
  const [history, setHistory] = useState<SessionRecord[]>(initial.history);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(
    initial.activeTaskId,
  );
  const [totalWorkSessionsCompleted, setTotalWorkSessionsCompleted] = useState(
    initial.totalWorkSessionsCompleted,
  );

  const [mode, setMode] = useState<SessionMode>("work");
  const [secondsLeft, setSecondsLeft] = useState(
    () => initial.settings.workMinutes * 60,
  );
  const [running, setRunning] = useState(false);

  const completingRef = useRef(false);
  const skipElapsedRef = useRef<number | null>(null);

  useEffect(() => {
    saveState({
      settings,
      tasks,
      history,
      activeTaskId,
      totalWorkSessionsCompleted,
    });
  }, [settings, tasks, history, activeTaskId, totalWorkSessionsCompleted]);

  const activeTask = useMemo(
    () => tasks.find((t) => t.id === activeTaskId) ?? null,
    [tasks, activeTaskId],
  );

  const applySettingsPatch = useCallback(
    (patch: Partial<Settings>) => {
      setSettings((prev) => {
        const next = patchSettings(prev, patch);
        if (!running) {
          const minsChanged =
            (patch.workMinutes !== undefined &&
              patch.workMinutes !== prev.workMinutes) ||
            (patch.shortBreakMinutes !== undefined &&
              patch.shortBreakMinutes !== prev.shortBreakMinutes) ||
            (patch.longBreakMinutes !== undefined &&
              patch.longBreakMinutes !== prev.longBreakMinutes);
          if (minsChanged) {
            setSecondsLeft(durationSecondsForMode(mode, next));
          }
        }
        return next;
      });
    },
    [mode, running],
  );

  const addTask = useCallback((title: string) => {
    const t: Task = {
      id: crypto.randomUUID(),
      title: title.trim() || "Sin título",
      done: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [t, ...prev]);
    return t.id;
  }, []);

  const toggleTaskDone = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setActiveTaskId((cur) => (cur === id ? null : cur));
  }, []);

  const clearDoneTasks = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.done));
  }, []);

  const recordSession = useCallback(
    (endedMode: SessionMode, durationSeconds: number) => {
      const entry: SessionRecord = {
        id: crypto.randomUUID(),
        endedAt: new Date().toISOString(),
        taskId: endedMode === "work" ? activeTaskId : null,
        taskTitle:
          endedMode === "work" && activeTask ? activeTask.title : null,
        durationSeconds,
        mode: endedMode,
      };
      setHistory((h) => appendHistory(h, entry));
    },
    [activeTask, activeTaskId],
  );

  const handleSessionComplete = useCallback(async () => {
    if (completingRef.current) return;
    completingRef.current = true;
    try {
      const s = settings;
      const endedMode = mode;
      const full = durationSecondsForMode(endedMode, s);
      const spent =
        skipElapsedRef.current !== null
          ? skipElapsedRef.current
          : full;
      skipElapsedRef.current = null;

      recordSession(endedMode, Math.max(1, Math.round(spent)));

      if (s.alertSoundEnabled) {
        playAlert(s.volume);
      }

      if (endedMode === "work") {
        const nextCount = totalWorkSessionsCompleted + 1;
        setTotalWorkSessionsCompleted(nextCount);
        const nextIsLong = nextCount > 0 && nextCount % 4 === 0;
        const nextMode: SessionMode = nextIsLong ? "longBreak" : "shortBreak";
        const nextSec = durationSecondsForMode(nextMode, s);
        setMode(nextMode);
        setSecondsLeft(nextSec);
        await notifyIfEnabled(
          s,
          "PomodorU",
          nextIsLong
            ? "¡Cuatro pomodoros! Toca un descanso largo."
            : "Descanso corto. ¡Respira!",
        );
      } else {
        setMode("work");
        setSecondsLeft(durationSecondsForMode("work", s));
        await notifyIfEnabled(
          s,
          "PomodorU",
          "De vuelta al enfoque. ¡Ganbare!",
        );
      }

      setRunning(true);
    } finally {
      completingRef.current = false;
    }
  }, [
    mode,
    recordSession,
    settings,
    totalWorkSessionsCompleted,
  ]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!running || secondsLeft > 0) return;
    void handleSessionComplete();
  }, [running, secondsLeft, handleSessionComplete]);

  const start = useCallback(async () => {
    await resumeAudioIfNeeded();
    if (secondsLeft <= 0) {
      setSecondsLeft(durationSecondsForMode(mode, settings));
    }
    setRunning(true);
    if (mode === "work") {
      await notifyIfEnabled(
        settings,
        "PomodorU — Enfoque",
        activeTask
          ? `Sesión iniciada: ${activeTask.title}`
          : "Sesión de enfoque iniciada.",
      );
    }
  }, [activeTask, mode, secondsLeft, settings]);

  const pause = useCallback(() => {
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    setRunning(false);
    skipElapsedRef.current = null;
    setMode("work");
    setSecondsLeft(settings.workMinutes * 60);
  }, [settings.workMinutes]);

  const skipPhase = useCallback(() => {
    const full = durationSecondsForMode(mode, settings);
    setSecondsLeft((prev) => {
      const elapsed = full - prev;
      skipElapsedRef.current = Math.max(1, elapsed);
      return 0;
    });
    setRunning(true);
  }, [mode, settings]);

  return {
    settings,
    applySettingsPatch,
    tasks,
    addTask,
    toggleTaskDone,
    removeTask,
    clearDoneTasks,
    history,
    activeTaskId,
    setActiveTaskId,
    activeTask,
    mode,
    modeLabel: modeLabel(mode),
    secondsLeft,
    running,
    totalWorkSessionsCompleted,
    start,
    pause,
    reset,
    skipPhase,
  };
}

export type PomodoroState = ReturnType<typeof usePomodoro>;

import type { CSSProperties } from "react";
import type { SessionMode } from "../pomodoro/types";
import {
  IconHeart,
  IconPause,
  IconPlay,
  IconReset,
  IconSkip,
  IconSparkle,
} from "../ui/icons";

type Props = {
  mode: SessionMode;
  modeLabel: string;
  secondsLeft: number;
  totalSeconds: number;
  running: boolean;
  activeTaskTitle: string | null;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
};

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const modeClass: Record<SessionMode, string> = {
  work: "mode-work",
  shortBreak: "mode-short",
  longBreak: "mode-long",
};

export function TimerPanel({
  mode,
  modeLabel,
  secondsLeft,
  totalSeconds,
  running,
  activeTaskTitle,
  onStart,
  onPause,
  onReset,
  onSkip,
}: Props) {
  const progress =
    totalSeconds > 0 ? Math.min(1, (totalSeconds - secondsLeft) / totalSeconds) : 0;
  const deg = progress * 360;

  return (
    <section className="panel timer-panel kawaii-timer">
      <div className="timer-deco" aria-hidden>
        <span className="deco-sparkle deco-1">
          <IconSparkle />
        </span>
        <span className="deco-sparkle deco-2">
          <IconSparkle />
        </span>
        <span className="deco-heart">
          <IconHeart />
        </span>
      </div>

      <p className="timer-kawaii-msg">
        {mode === "work"
          ? "¡Tú puedes! ✿"
          : mode === "shortBreak"
            ? "Momento suave para ti ♡"
            : "Descanso largo merecido ☆"}
      </p>

      <div
        className={`timer-ring-wrap ${modeClass[mode]} ${running ? "is-active" : ""}`}
      >
        <div
          className="timer-ring"
          style={
            {
              "--progress": `${deg}deg`,
            } as CSSProperties
          }
        />
        <div className="timer-center">
          <p className="timer-mode">{modeLabel}</p>
          <p className="timer-digits">{formatTime(secondsLeft)}</p>
          {activeTaskTitle && mode === "work" ? (
            <p className="timer-task" title={activeTaskTitle}>
              <IconHeart className="icon-inline timer-task-icon" />
              {activeTaskTitle}
            </p>
          ) : (
            <p className="timer-task muted">Elige una tarea al lado →</p>
          )}
        </div>
      </div>

      <div className="timer-actions timer-actions-kawaii">
        {!running ? (
          <button type="button" className="btn btn-kawaii primary" onClick={onStart}>
            <IconPlay className="btn-ico" /> Iniciar
          </button>
        ) : (
          <button type="button" className="btn btn-kawaii" onClick={onPause}>
            <IconPause className="btn-ico" /> Pausar
          </button>
        )}
        <button type="button" className="btn btn-kawaii ghost" onClick={onReset}>
          <IconReset className="btn-ico" /> Reiniciar
        </button>
        <button type="button" className="btn btn-kawaii ghost" onClick={onSkip}>
          <IconSkip className="btn-ico" /> Saltar
        </button>
      </div>
    </section>
  );
}

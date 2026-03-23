import {
  durationSecondsForMode,
  type PomodoroState,
} from "../../pomodoro";
import { HomeQuickUtils } from "../../components/HomeQuickUtils";
import { TimerPanel } from "../../components/TimerPanel";

type Props = {
  pom: PomodoroState;
  onOpenSettings: () => void;
  onOpenStats: () => void;
};

export function TimerHomeView({
  pom,
  onOpenSettings,
  onOpenStats,
}: Props) {
  const totalSeconds = durationSecondsForMode(pom.mode, pom.settings);

  return (
    <div className="timer-home-layout">
      <div className="timer-home-main">
        <TimerPanel
          mode={pom.mode}
          modeLabel={pom.modeLabel}
          secondsLeft={pom.secondsLeft}
          totalSeconds={totalSeconds}
          running={pom.running}
          activeTaskTitle={pom.activeTask?.title ?? null}
          onStart={() => void pom.start()}
          onPause={pom.pause}
          onReset={pom.reset}
          onSkip={pom.skipPhase}
        />
      </div>
      <HomeQuickUtils
        settings={pom.settings}
        onChange={pom.applySettingsPatch}
        history={pom.history}
        running={pom.running}
        tasks={pom.tasks}
        tasksReady={pom.tasksReady}
        activeTaskId={pom.activeTaskId}
        onSelectTask={pom.setActiveTaskId}
        onQuickAddTask={async (title) => {
          const id = await pom.addTask(title);
          pom.setActiveTaskId(id);
        }}
        totalWorkSessionsCompleted={pom.totalWorkSessionsCompleted}
        onOpenSettings={onOpenSettings}
        onOpenStats={onOpenStats}
      />
    </div>
  );
}

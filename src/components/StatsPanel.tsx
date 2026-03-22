import { useMemo } from "react";
import type { SessionRecord } from "../pomodoro/types";

type Props = {
  history: SessionRecord[];
  totalWorkSessionsCompleted: number;
};

export function StatsPanel({ history, totalWorkSessionsCompleted }: Props) {
  const stats = useMemo(() => {
    const workSessions = history.filter((h) => h.mode === "work");
    const totalFocusSec = workSessions.reduce((a, h) => a + h.durationSeconds, 0);
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeek = workSessions.filter(
      (h) => new Date(h.endedAt) >= weekAgo,
    );
    const weekMinutes = Math.round(
      thisWeek.reduce((a, h) => a + h.durationSeconds, 0) / 60,
    );
    return {
      count: workSessions.length,
      totalMinutes: Math.round(totalFocusSec / 60),
      weekCount: thisWeek.length,
      weekMinutes,
    };
  }, [history]);

  return (
    <section className="panel stats-panel">
      <h2 className="panel-title">Estadísticas</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Pomodoros (historial)</span>
          <span className="stat-value">{stats.count}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Contador total (ciclos largos)</span>
          <span className="stat-value">{totalWorkSessionsCompleted}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Tiempo enfocado total</span>
          <span className="stat-value">{stats.totalMinutes} min</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Esta semana</span>
          <span className="stat-value">
            {stats.weekCount} sesiones · {stats.weekMinutes} min
          </span>
        </div>
      </div>
    </section>
  );
}

type Props = {
  fullscreen: boolean;
  onToggleFullscreen: () => Promise<void>;
};

export function AppHeader({ fullscreen, onToggleFullscreen }: Props) {
  return (
    <header className="app-header app-header-kawaii">
      <div className="app-header-inner">
        <div className="app-header-badge" aria-hidden>
          ✿
        </div>
        <div className="app-header-text">
          <h1 className="app-title">
            Pomodor<span className="app-title-accent">U</span>
          </h1>
          <p className="app-tagline">
            Modo kawaii ON — temporizador completo, pasteles y buen enfoque.
          </p>
        </div>
        <div className="app-header-actions">
          <button
            type="button"
            className={`btn btn-kawaii ghost btn-fullscreen ${fullscreen ? "active" : ""}`}
            onClick={() => void onToggleFullscreen()}
            title={
              fullscreen
                ? "Salir de pantalla completa (Esc)"
                : "Pantalla completa"
            }
            aria-pressed={fullscreen}
          >
            <span className="fullscreen-ico" aria-hidden>
              {fullscreen ? "⊡" : "⛶"}
            </span>
            <span className="fullscreen-label">
              {fullscreen ? "Restaurar" : "Pantalla completa"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

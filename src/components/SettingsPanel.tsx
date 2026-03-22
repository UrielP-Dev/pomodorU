import type { AmbientPreset, Settings, ThemeMode } from "../pomodoro/types";

type Props = {
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
  onPickWallpaper: () => Promise<void>;
  onClearWallpaper: () => void;
};

const themes: { id: ThemeMode; label: string }[] = [
  { id: "kawaii", label: "Kawaii" },
  { id: "light", label: "Claro" },
  { id: "dark", label: "Oscuro" },
  { id: "custom", label: "Personalizado" },
];

const ambients: { id: AmbientPreset; label: string }[] = [
  { id: "off", label: "Apagado" },
  { id: "rain", label: "Lluvia (sintético)" },
  { id: "cafe", label: "Cafetería" },
  { id: "forest", label: "Bosque" },
];

export function SettingsPanel({
  settings,
  onChange,
  onPickWallpaper,
  onClearWallpaper,
}: Props) {
  return (
    <section className="panel settings-panel">
      <h2 className="panel-title">Ajustes</h2>

      <fieldset className="fieldset">
        <legend>Duraciones (minutos)</legend>
        <label>
          Trabajo
          <input
            type="number"
            min={1}
            max={180}
            value={settings.workMinutes}
            onChange={(e) =>
              onChange({ workMinutes: Number(e.target.value) || 1 })
            }
          />
        </label>
        <label>
          Descanso corto
          <input
            type="number"
            min={1}
            max={60}
            value={settings.shortBreakMinutes}
            onChange={(e) =>
              onChange({ shortBreakMinutes: Number(e.target.value) || 1 })
            }
          />
        </label>
        <label>
          Descanso largo
          <input
            type="number"
            min={1}
            max={120}
            value={settings.longBreakMinutes}
            onChange={(e) =>
              onChange({ longBreakMinutes: Number(e.target.value) || 1 })
            }
          />
        </label>
      </fieldset>

      <fieldset className="fieldset">
        <legend>Tema visual</legend>
        <div className="chip-row">
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`chip ${settings.theme === t.id ? "active" : ""}`}
              onClick={() => onChange({ theme: t.id })}
            >
              {t.label}
            </button>
          ))}
        </div>
        {settings.theme === "custom" ? (
          <div className="custom-theme-row">
            <label>
              Acento
              <input
                type="color"
                value={settings.customAccent}
                onChange={(e) => onChange({ customAccent: e.target.value })}
              />
            </label>
            <label>
              Fondo
              <input
                type="color"
                value={settings.customSurface}
                onChange={(e) => onChange({ customSurface: e.target.value })}
              />
            </label>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="fieldset">
        <legend>Fondo / wallpaper</legend>
        <p className="panel-hint">
          Elige una imagen local o pega una URL. Se guarda en este dispositivo.
        </p>
        <div className="wallpaper-row">
          <button type="button" className="btn" onClick={() => void onPickWallpaper()}>
            Elegir imagen…
          </button>
          <button type="button" className="btn ghost" onClick={onClearWallpaper}>
            Quitar fondo
          </button>
        </div>
        <label className="url-field">
          URL de imagen (opcional)
          <input
            type="url"
            placeholder="https://…"
            value={settings.wallpaperUrl ?? ""}
            onChange={(e) =>
              onChange({
                wallpaperUrl: e.target.value.trim() || null,
              })
            }
          />
        </label>
      </fieldset>

      <fieldset className="fieldset">
        <legend>Sonido y avisos</legend>
        <label className="check">
          <input
            type="checkbox"
            checked={settings.notificationsEnabled}
            onChange={(e) =>
              onChange({ notificationsEnabled: e.target.checked })
            }
          />
          Notificaciones de escritorio
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={settings.alertSoundEnabled}
            onChange={(e) => onChange({ alertSoundEnabled: e.target.checked })}
          />
          Pitido al terminar una fase
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={settings.ambientEnabled}
            onChange={(e) => onChange({ ambientEnabled: e.target.checked })}
          />
          Sonido ambiental
        </label>
        <p className="panel-hint ambient-hint">
          El ambiente solo suena con el temporizador en marcha; al pulsar
          «Pausar» también se silencia.
        </p>
        <label>
          Ambiente
          <select
            value={settings.ambientPreset}
            onChange={(e) =>
              onChange({ ambientPreset: e.target.value as AmbientPreset })
            }
          >
            {ambients.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Volumen
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.volume}
            onChange={(e) =>
              onChange({ volume: Number(e.target.value) })
            }
          />
        </label>
      </fieldset>
    </section>
  );
}

use tauri_plugin_sql::{Builder, Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            Builder::default()
                .add_migrations(
                    "sqlite:pomodoru.db",
                    vec![Migration {
                        version: 1,
                        description: "tasks_and_task_log",
                        sql: include_str!("../migrations/001_init.sql"),
                        kind: MigrationKind::Up,
                    }],
                )
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

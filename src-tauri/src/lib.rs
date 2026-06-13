// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

/// Example command — replace or extend with your own.
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        // SQLite plugin — add migrations here as your schema grows.
        // Remove this plugin if you don't need a local database.
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations(
                    "sqlite:app.db",
                    vec![
                        tauri_plugin_sql::Migration {
                            version: 1,
                            description: "initial schema",
                            sql: "
                                CREATE TABLE IF NOT EXISTS settings (
                                    key   TEXT PRIMARY KEY,
                                    value TEXT NOT NULL
                                );
                            ",
                            kind: tauri_plugin_sql::MigrationKind::Up,
                        },
                    ],
                )
                .build(),
        )
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


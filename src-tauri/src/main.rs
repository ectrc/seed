#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, WindowEvent, regex::Regex};
use window_shadows::set_shadow;
use std::path::PathBuf;
use sha2::Digest;

mod carter;

#[tauri::command]
async fn hash(i: String) -> Result<String, String> {
  let i = std::path::PathBuf::from(i);
  if !i.exists() {
    return Err("File does not exist".to_string());
  }

  let bytes = std::fs::read(i).unwrap();
  let hash = sha2::Sha256::digest(bytes.as_slice());
  return Ok(format!("{:x}", hash));
}

#[tauri::command]
async fn exists(i: &str) -> Result<bool, String> {
  Ok(std::path::Path::new(i).exists())
}

#[tauri::command]
async fn experience(i: String, c: &str) -> Result<bool, String> {
  let path = PathBuf::from(i);
  carter::kill();

  let mut dll_path = path.clone();
  dll_path.push("Engine\\Binaries\\ThirdParty\\NVIDIA\\NVaftermath\\Win64\\GFSDK_Aftermath_Lib.x64.dll");
  while dll_path.exists() {
    if std::fs::remove_file(dll_path.clone()).is_ok() {
      break;
    }

    std::thread::sleep(std::time::Duration::from_millis(100));
  }

  let lam = carter::download("https://cdn.snows.rocks", "snow_public.dll", dll_path.clone().to_str().unwrap()).await;
  if lam.is_err() {
    eprintln!("Could not download the file");
    return Err("Could not download the file".to_string());
  }

  match carter::launch(path.to_str().unwrap(), &format!("-AUTH_PASSWORD={}", c)).await {
    Ok(_) => Ok(true),
    Err(err) => {
      eprintln!("Error: {:?}", err);
      Err("Could not launch the game".to_string())
    },
  }
}

fn main() {
  tauri_plugin_deep_link::prepare("rocks.snow");
  tauri::Builder::default()
    .setup(|app| {
      let window = app.get_window("main").unwrap();
      set_shadow(&window, true).expect("Unsupported platform!");

      window.on_window_event(|event| match event {
        WindowEvent::Resized(..) => std::thread::sleep(std::time::Duration::from_millis(1)),
        _ => {}
      });

      tauri_plugin_deep_link::register("snow", move |request| {
        let re = Regex::new(r"snow://auth:([^/]+)").unwrap();
        if let Err(err) = window.set_focus() {
          eprintln!("Could not set focus on main window: {:?}", err);
        }

        if let Some(captures) = re.captures(request.as_str()) {
          if let Some(result) = captures.get(1) {
            window
              .eval(&format!("window.location.hash = 'auth:{}'", result.as_str()))
              .unwrap();
          }
        }
      }).unwrap();

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![hash, exists, experience])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

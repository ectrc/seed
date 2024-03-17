#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{regex::Regex, AppHandle, Manager, Window, WindowEvent};
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
async fn experience(i: String, c: &str, local: bool, app: AppHandle) -> Result<bool, String> {
  carter::kill();
  carter::launch_launcher(app).await?;
  let path = PathBuf::from(i);

  let mut dll_path = path.clone();
  dll_path.push("Engine\\Binaries\\ThirdParty\\NVIDIA\\NVaftermath\\Win64\\GFSDK_Aftermath_Lib.x64.dll");
  while dll_path.exists() {
    if std::fs::remove_file(dll_path.clone()).is_ok() {
      break;
    }

    std::thread::sleep(std::time::Duration::from_millis(100));
  }

  let file = if local { "snow_local.dll" } else { "snow_public.dll" };
  let lam = carter::download("https://cdn.snows.rocks", file, dll_path.clone().to_str().unwrap()).await;
  if lam.is_err() {
    return Err("Could not download the file".to_string());
  }

  match carter::launch_game(path.to_str().unwrap(), &format!("-AUTH_LOGIN= -AUTH_PASSWORD={} -AUTH_TYPE=exchangecode", c)).await {
    Ok(_) => Ok(true),
    Err(_) => {
      Err("Could not launch the game".to_string())
    },
  }
}

#[tauri::command]
async fn offline(i: String, username: &str, app: AppHandle) -> Result<bool, String> {
  carter::launch_launcher(app).await?;
  let path = PathBuf::from(i);

  match carter::launch_game(path.to_str().unwrap(), &format!("-AUTH_LOGIN={}@retrac.site -AUTH_PASSWORD=snowsOnTop -AUTH_TYPE=epic", username)).await {
    Ok(_) => Ok(true),
    Err(_) => {
      Err("Could not launch the game".to_string())
    },
  }
}

#[tauri::command]
async fn kill() {
  carter::kill();
}

fn lam(window: Window) {
  std::thread::spawn(move || {
    loop {
      window.emit("fortnite_process_id", carter::search()).unwrap();
    }
  });
}

fn main() {
  tauri_plugin_deep_link::prepare("rocks.snow");
  tauri::Builder::default()
    .setup(|app| {
      let window = app.get_window("main").unwrap();
      lam(window.clone());
      set_shadow(&window, true).expect("Unsupported platform!");

      tauri_plugin_deep_link::register("snow", move |request| {
        let re = Regex::new(r"snow://auth:([^/]+)").unwrap();
        if  window.set_focus().is_err() {
          return;
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
    .on_window_event(move |event| match event.event() {
      WindowEvent::Destroyed => {
        carter::kill();
      }
      WindowEvent::Resized(..) => std::thread::sleep(std::time::Duration::from_millis(1)),
      _ => {}
    })
    .invoke_handler(tauri::generate_handler![hash, exists, experience, kill, offline])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

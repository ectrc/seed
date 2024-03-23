use sysinfo::System;
use std::io::Write;
use std::os::windows::process::CommandExt;
use tauri::AppHandle;
use futures_util::StreamExt;

const CREATE_NO_WINDOW: u32 = 0x08000000;

pub fn kill() {
  let mut system = System::new_all();
  system.refresh_all();

  let processes = vec![
    "EpicGamesLauncher.exe",
    "FortniteLauncher.exe",
    "FortniteClient-Win64-Shipping_EAC.exe",
    "FortniteClient-Win64-Shipping.exe",
    "EasyAntiCheat_EOS.exe",
    "EpicWebHelper.exe",
  ];

  for process in processes.iter() {
    let cmd = std::process::Command::new("cmd")
      .creation_flags(CREATE_NO_WINDOW)
      .args(&["/C", "taskkill /F /IM", process])
      .spawn();

    if cmd.is_err() {
      return
    }
  }

  std::thread::sleep(std::time::Duration::from_secs(1));  
}

pub fn search() -> u32 {
  let mut pid = 0;
  unsafe {
    let tl = tasklist::Tasklist::new();

    for task in tl {
      if task.get_pname() == "FortniteClient-Win64-Shipping.exe" {
        pid = task.get_pid();
        break;
      }
    }
  }

  pid
}

async fn downloader(
  client: reqwest::Client,
  url: &str,
  path: &str,
) -> Result<(), String> {
  let response: reqwest::Response = client.get(url).send().await.or(Err("carrerr".to_string()))?;
  if !response.status().is_success() {
    return Err("carrerr".to_string());
  }

  let mut file = std::fs::File::create(path).or(Err(format!("Failed to create file '{}'", path)))?;
  let mut stream = response.bytes_stream();

  while let Some(chunk) = stream.next().await {
    let chunk = chunk.unwrap();
    file.write_all(&chunk).or(Err(format!("Failed to write to file '{}'", path)))?;
  }

  Ok(())
}

pub async fn download(
  url: &str,
  file: &str,
  path: &str,
) -> Result<bool, String> {
  let client = reqwest::Client::new();
  let file_url = format!("{}/{}", url, file);

  if let Err(err) = downloader(client.clone(), &file_url, path).await {
    return Err(err);
  } else {
    return Ok(true);
  }
}

pub async fn launch_launcher(app: AppHandle) -> Result<bool, String> {
  let resource_path = app.path_resolver()
    .resolve_resource("resource/FortniteLauncher.exe")
    .expect("failed to resolve resource");

  println!("Launching Fortnite Launcher {}", resource_path.to_str().unwrap());

  let cmd = std::process::Command::new(resource_path)
    .creation_flags(CREATE_NO_WINDOW)
    // .stdout(Stdio::piped())
    .spawn();

  if cmd.is_err() {
    println!("Failed to launch Fortnite Launcher {}", cmd.unwrap_err().to_string());
    return Err("Failed to launch Fortnite Launcher".to_string());
  }

  Ok(true)
}

pub async fn inject(library_path: String) -> bool {
  let pid = search();
  let res = dll_injector::inject_dll_load_library(pid, &library_path);

  if res.is_err() {
    return false;
  }
  
  true
}

pub async fn launch_game(
  path: &str,
  code: &str,
) -> Result<bool, String> {
  let base = std::path::PathBuf::from(path);
  let fort_args = vec![
    "-epicapp=Fortnite",
    "-epicenv=Prod",
    "-epiclocale=en-us",
    "-epicportal",
    "-nobe",
    "-fromfl=eac",
    "-fltoken=24963ce04b575a5ca65526h0",
    "-caldera=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiYmU5ZGE1YzJmYmVhNDQwN2IyZjQwZWJhYWQ4NTlhZDQiLCJnZW5lcmF0ZWQiOjE2Mzg3MTcyNzgsImNhbGRlcmFHdWlkIjoiMzgxMGI4NjMtMmE2NS00NDU3LTliNTgtNGRhYjNiNDgyYTg2IiwiYWNQcm92aWRlciI6IkVhc3lBbnRpQ2hlYXQiLCJub3RlcyI6IiIsImZhbGxiYWNrIjpmYWxzZX0.VAWQB67RTxhiWOxx7DBjnzDnXyyEnX7OljJm-j2d88G_WgwQ9wrE6lwMEHZHjBd1ISJdUO1UVUqkfLdU5nofBQ",
    "-skippatchcheck",
    "-noeac",
  ];

  let mut binary = base.clone();
  binary.push("FortniteGame\\Binaries\\Win64\\FortniteClient-Win64-Shipping.exe");

  let cmd = std::process::Command::new(binary)
    .creation_flags(CREATE_NO_WINDOW)
    .args(fort_args)
    .args(code.split(" "))
    // .stdout(Stdio::piped())
    .spawn();

  if cmd.is_err() {
    return Err(format!("Failed to launch '{}'", path));
  }

  let mut dll_path = base.clone();
  dll_path.push("Engine\\Binaries\\ThirdParty\\NVIDIA\\NVaftermath\\Win64\\snow_public.dll");

  inject(dll_path.to_str().unwrap().to_string()).await;

  let result = cmd.unwrap().wait();
  if result.is_err() {
    return Err(format!("Failed to launch '{}'", path));
  }

  Ok(true)
}
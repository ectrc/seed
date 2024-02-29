use sysinfo::System;
use std::io::Write;
use std::os::windows::process::CommandExt;
use futures_util::StreamExt;

use winapi::shared::minwindef::FALSE;
use winapi::um::handleapi::CloseHandle;
use winapi::um::processthreadsapi::{OpenThread, SuspendThread};
use winapi::um::winnt::HANDLE;
use winapi::um::winnt::THREAD_SUSPEND_RESUME;
use winapi::um::tlhelp32::{
  CreateToolhelp32Snapshot, Thread32First, Thread32Next, TH32CS_SNAPTHREAD, THREADENTRY32,
};

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
      println!("Error: {:?}", cmd.err());
      return
    }
  }
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

fn suspend(pid: u32) -> (u32, bool) {
  unsafe {
    let mut has_err = false;
    let mut count: u32 = 0;
    let te: &mut THREADENTRY32 = &mut std::mem::zeroed();
    (*te).dwSize = std::mem::size_of::<THREADENTRY32>() as u32;
    let snapshot: HANDLE = CreateToolhelp32Snapshot(TH32CS_SNAPTHREAD, 0);

    if Thread32First(snapshot, te) == 1 {
      loop {
        if pid == (*te).th32OwnerProcessID {
          let tid = (*te).th32ThreadID;
          let thread: HANDLE = OpenThread(THREAD_SUSPEND_RESUME, FALSE, tid);
          has_err |= SuspendThread(thread) as i32 == -1i32;
          CloseHandle(thread);
          count += 1;
        }

        if Thread32Next(snapshot, te) == 0 {
          break;
        }
      }
    }

    CloseHandle(snapshot);

    (count, has_err)
  }
}

pub async fn launch(
  path: &str,
  code: &str,
) -> Result<bool, String> {
  let base = std::path::PathBuf::from(path);

  let mut launcher = base.clone();
  launcher.push("FortniteGame\\Binaries\\Win64\\FortniteLauncher.exe");
  let mut cwd = base.clone();
  cwd.push("FortniteGame\\Binaries\\Win64");

  let cmd = std::process::Command::new(launcher)
    .current_dir(cwd)
    .creation_flags(CREATE_NO_WINDOW)
    .spawn();

  if cmd.is_err() {
    return Err(format!("Failed to launch '{}'", path));
  }

  suspend(cmd.unwrap().id());

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
    "-AUTH_LOGIN=", code,
    "-AUTH_TYPE=exchangecode",
  ];

  let mut binary = base.clone();
  binary.push("FortniteGame\\Binaries\\Win64\\FortniteClient-Win64-Shipping.exe");

  let cmd = std::process::Command::new(binary)
    .creation_flags(CREATE_NO_WINDOW)
    .args(&fort_args)
    .spawn();

  if cmd.is_err() {
    return Err(format!("Failed to launch '{}'", path));
  }

  Ok(true)
}
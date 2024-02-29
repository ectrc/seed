import { invoke } from "@tauri-apps/api";

export const hashFile = async (i: string) => {
  const result = await invoke<string>("hash", { i }).catch(() => null);
  return result;
};

export const fileExists = async (i: string) => {
  const result = await invoke<boolean>("exists", { i }).catch(() => null);
  return result;
};

export const experienceSnow = async (i: string, c: string) => {
  console.log(i, c);
  const result = await invoke<boolean>("experience", { i, c }).catch(
    (s) => s as string
  );
  return result;
};

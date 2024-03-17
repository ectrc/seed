import { invoke } from "@tauri-apps/api";

export const hashFile = async (i: string) => {
  const result = await invoke<string>("hash", { i }).catch(() => null);
  return result;
};

export const fileExists = async (i: string) => {
  const result = await invoke<boolean>("exists", { i }).catch(() => null);
  return result;
};

export const experienceSnow = async (i: string, c: string, local: boolean) => {
  await closeSnow();
  const result = await invoke<boolean>("experience", { i, c, local }).catch(
    (s) => {
      console.error(s);
      return s as string;
    }
  );
  return result;
};

export const experienceSnowDev = async (i: string, username: string) => {
  const result = await invoke<boolean>("offline", { i, username }).catch(
    (s) => {
      console.error(s);
      return s as string;
    }
  );

  return result;
};

export const closeSnow = async () => {
  const result = await invoke<boolean>("kill").catch((s) => s as string);
  return result;
};

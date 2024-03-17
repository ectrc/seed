import { open } from "@tauri-apps/api/dialog";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useLibraryControl } from "src/state/library";
import { fileExists, hashFile } from "src/lib/tauri";
import { LOADING_STATES, useStates } from "src/state/state";

const setLoader = (loading: boolean) =>
  useStates
    .getState()
    .set_state(
      "importing",
      loading ? LOADING_STATES.LOADING : LOADING_STATES.AWAITING_ACTION
    );

export const importBuildFromDialog = async () => {
  setLoader(true);
  const selectedPath = await open({ directory: true, multiple: true });
  if (!selectedPath) return setLoader(false);

  if (Array.isArray(selectedPath)) {
    await importBuild(selectedPath[0]);
    return setLoader(false);
  }

  importBuild(selectedPath).then(() => setLoader(false));
};

const importBuild = async (path: string) => {
  const libraryControl = useLibraryControl.getState();
  const splash = `${path}\\FortniteGame\\Content\\Splash\\Splash.bmp`;
  const binary = `${path}\\FortniteGame\\Binaries\\Win64\\FortniteClient-Win64-Shipping.exe`;

  const hash = await hashFile(binary);
  if (!hash) return;

  const exists = await fileExists(splash);
  if (!exists) return;

  // const version = versionLookup.get(hash);
  // if (!version) return;

  libraryControl.add({
    title: "Imported build",
    description: "Imported build",
    posterPath: convertFileSrc(splash),
    binaryPath: binary,
    binaryHash: hash,
    releaseVersion: 0,
    path,
  });
};

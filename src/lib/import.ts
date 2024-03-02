import { open } from "@tauri-apps/api/dialog";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useLibraryControl } from "src/state/library";
import { fileExists, hashFile } from "src/lib/tauri";
import { LOADING_STATES, useConfigControl } from "src/state/config";

const versionLookup = new Map<string, string>([
  ["7e9ca42b2f4691fe40ab64ed79cd6ae00a3ac0edd2ed909371b00f0e6048202f", "1.7.1"],
  ["fe4737acc30d9efd6abe03f35b932fc608042ce279b0b887027e5fd29e9f6377", "1.8"],
  ["2ebfc206cef496ff0fe9794bfbc1c89f02e09f7a3c2db89434fad05b32af53f6", "1.8"],
  ["4460a0e82d76eba3e64afa2e128819e02930e96d42736a7434819f6b7e55d28b", "1.9.1"],
  ["9731a6b5e1fab894c089849713c371182e357dcbefa7d8d4e71dc19eeb449102", "2.5"],
  ["6e3d13a50cdeaed90f8176eec31442199d66721018105dec4bc1f2cbcff215ef", "3.5"],
  ["6f99fd29fe898e637aeb506e04fc8bb46c4ee6016714b96f96b92e214f106aca", "3.6"],
  ["97643ca38813d29fc643df70dd2e8dd0ea0445357214416158d8fef02fb3c9d1", "4.5"],
  ["ed3216b00f7ae430e9dafbc38f4ee2e6f189886db28c9c53436ee8dde2d33718", "5.41"],
  ["48bdc9500c16798032ab56279107657ed4b5ce3a83448541034b1e96daa2a86c", "6.31"],
  ["15da21fff1444a2390e345b96bb6bfb095ac655bfe888b89c32cb6d292699a8d", "7.40"],
  ["5d3597ecf685590f997f9631bfebff40550cb3be53312019bedfe418799738f0", "8.51"],
  ["8dbca1d00855e48aa5d70ff12272fb4eaebfda915cb18a8d0ac056bdadd24f33", "9.41"],
  ["cd50eaa63bed9b6f6990cfd33f8f6f8c0b688c2f5d13b8c7e0739fcb306aed8e", "11.31"],
  ["78f00934fa00f0c184e6b0a7219048a17066f6bba6a13d4408735928f295cdfe", "12.41"],
  ["f0ea139dd7be93da7a36f5f91bcea9f84f914709e9cc3253726736f8d7b21133", "15.30"],
]);

const setLoader = (loading: boolean) =>
  useConfigControl
    .getState()
    .set_loader(
      "importing",
      loading ? LOADING_STATES.LOADING : LOADING_STATES.AWAITING_ACTION
    );

export const importBuildFromDialog = async () => {
  setLoader(true);
  const selectedPath = await open({ directory: true, multiple: true });
  if (!selectedPath) return setLoader(false);

  if (Array.isArray(selectedPath)) {
    for (const path of selectedPath) {
      await importBuild(path);
    }
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

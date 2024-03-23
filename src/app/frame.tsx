import { useQuery } from "@tanstack/react-query";
import { useStates } from "src/state/state";
import { useConfigControl } from "src/state/config";
import { queryPerson, queryStats } from "src/external/query";
import { Outlet } from "@tanstack/react-router";
import { appWindow } from "@tauri-apps/api/window";
import { AnimatePresence } from "framer-motion";

import { FaSeedling, FaGear, FaBomb } from "react-icons/fa6";
import "src/styles/frame.css";
import Settings from "../pages/settings";
import Offline from "src/pages/offline";

const Frame = () => {
  const config = useConfigControl();

  const [settingsOpen, setSettingsOpen] = useStates((s) => [
    s.settings_page_active,
    s.set_settings_page_active,
  ]);

  const { data: launcherStats, error } = useQuery<LauncherStats>({
    queryKey: ["launcher"],
    queryFn: queryStats,
    initialData: {
      PlayersOnline: 0,
      CurrentBuild: "0.0",
      CurrentSeason: 0,
    },
    throwOnError: false,
    refetchInterval: 10000,
    enabled: !config.use_passwordless,
  });

  const { data: player } = useQuery({
    queryKey: ["player"],
    queryFn: queryPerson,
    enabled: !config.use_passwordless,
  });

  return (
    <div className="tauriFrameContainer">
      <nav data-tauri-drag-region className="tauriFrame">
        <div data-tauri-drag-region className="tauriFrameInner">
          <span data-tauri-drag-region className="tauriFrameIcon">
            <FaSeedling />
          </span>
          <s />
          <button
            data-tauri-drag-region
            onClick={() => appWindow.close()}
            className="tauriFrameAction"
          >
            <FaBomb />
          </button>
          <button
            data-tauri-drag-region
            onClick={() => setSettingsOpen((s) => !s)}
            className="tauriFrameAction"
          >
            <FaGear />
          </button>
        </div>
        {!config.use_passwordless ? (
          <div data-tauri-drag-region className="tauriFrameInformation">
            <span data-tauri-drag-region>
              {!error ? launcherStats.PlayersOnline : 0} Players Online
            </span>
            <s></s>
            <span data-tauri-drag-region>
              <strong data-tauri-drag-region>
                {player ? player.snapshot.DisplayName : ""}
              </strong>
            </span>
          </div>
        ) : (
          <div data-tauri-drag-region className="tauriFrameInformationSmol">
            {/* <s></s> */}
          </div>
        )}
      </nav>
      <div className="tauriFrameContent">
        <AnimatePresence>{settingsOpen && <Settings />}</AnimatePresence>
        {config.use_passwordless ? <Offline /> : <Outlet />}
      </div>
    </div>
  );
};

export default Frame;

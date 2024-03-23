import { useNavigate } from "@tanstack/react-router";
import { useStates } from "src/state/state";
import { useUserControl } from "src/state/user";
import { useConfigControl } from "src/state/config";
import { motion } from "framer-motion";
import { message } from "@tauri-apps/api/dialog";
import { exists } from "@tauri-apps/api/fs";
import { closeSnow, fixSnow } from "src/lib/tauri";
import * as path from "@tauri-apps/api/path";

import {
  FaArrowRightFromBracket,
  FaCapsules,
  FaCircleChevronDown,
} from "react-icons/fa6";
import "src/styles/settings.css";
import Toggle from "src/components/toggle";
import Input from "../components/input";

const Settings = () => {
  const userControl = useUserControl();
  const configControl = useConfigControl();
  const stateControl = useStates();
  const navigate = useNavigate();

  const handleDelete = () => {
    userControl.kill_token();
    navigate({
      to: "/credentials",
    });
    stateControl.set_settings_page_active(false);
  };

  const handleFixLauncher = async () => {
    await closeSnow();
    const installDir = await path.resourceDir();
    const fileExists = await exists(
      await path.join(installDir, "resource", "FortniteLauncher.exe")
    );

    if (fileExists) {
      message("No issues found.", {
        title: "Retrac Repair",
        type: "info",
      });
      return;
    }

    const res = await fixSnow(await path.join(installDir, "resource"));
    if (typeof res === "string") {
      return;
    }

    message("Repaired damages files.", {
      title: "Retrac Repair",
      type: "info",
    });
  };

  return (
    <motion.div
      initial={{ top: "100%" }}
      animate={{ top: 0, opacity: 1 }}
      exit={{ top: "100%" }}
      transition={{
        type: "tween",
      }}
      className="settings"
    >
      <div data-tauri-drag-region className="fakeFrame">
        <button
          onClick={() => stateControl.set_settings_page_active(false)}
          className="fakeFrameAction"
        >
          <FaCircleChevronDown />
        </button>
        <s></s>
        <button onClick={handleFixLauncher} className="fakeFrameAction sml">
          <FaCapsules />
        </button>
        {userControl.access_token && (
          <button onClick={handleDelete} className="fakeFrameAction sml">
            <FaArrowRightFromBracket />
          </button>
        )}
      </div>
      <s />
      <h2>Settings</h2>
      <div className="settingsActions">
        <Toggle
          title="Only One Session"
          description="Prevent multiple sessions from being active at the same time."
          active={configControl.one_session}
          onToggle={(v) => configControl.set_one_session(v)}
        />

        <Toggle
          title="Use Localhost"
          description="Use a local Snow server on port 3000."
          active={configControl.use_localhost}
          onToggle={(v) => configControl.set_use_localhost(v)}
        />

        <Toggle
          title="Passwordless Mode"
          description="Use only a display name to play."
          active={configControl.use_passwordless}
          onToggle={(v) => configControl.set_use_passwordless(v)}
        />

        {configControl.use_passwordless && (
          <Input
            title="Account Details"
            title_description="Passwordless mode must be enabled in the server configuration file."
            description="Username of the account."
            value={configControl.raw_credentials}
            onChange={(v) => configControl.set_raw_credentials(v)}
          />
        )}

        <s />
        {/* {userControl.access_token && (
          <button onClick={handleDelete} className="default red">
            Disconnect Account
          </button>
        )} */}

        <p className="credits">thank you mullvad vpn for ui</p>
      </div>
    </motion.div>
  );
};

export default Settings;

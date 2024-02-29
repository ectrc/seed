import { useUserControl } from "src/state/user";
import { useConfigControl } from "src/state/config";
import { useLibraryControl } from "src/state/library";
import { useNavigate } from "@tanstack/react-router";

import { FaArrowRightFromBracket, FaFolderOpen } from "react-icons/fa6";
import "src/styles/pagePreferences.css";
import DefaultContinue from "src/components/continue";
import { importBuildFromDialog } from "src/lib/import";

const PreferencesPage = () => {
  const config = useConfigControl();
  const library = useLibraryControl();
  const userControl = useUserControl();
  const navigate = useNavigate();

  const disconnect = async () => {
    userControl.kill_token();
    navigate({
      to: "/credentials",
    });
  };

  const handleChangePath = async () => {
    if (currentPath) {
      Object.values(library.entries).forEach((key) => {
        library.remove(key.binaryHash);
      });
    }

    importBuildFromDialog();
  };

  const currentPath = library.getCurrentBinaryPath();
  const currentPathBeautified = library.getBeautifiedPath();

  return (
    <>
      <DefaultContinue customClassName="leave" onClick={disconnect} key="leave">
        <div className="continueContainerInformation">
          <h4 className="continueContainerHeader">
            Disconnect from Local Session
          </h4>
          <span className="continueContainerDescription">
            Remove your local session and disconnect from the Snow server.
          </span>
        </div>
        <div className="continueContainerIcon marginLeft">
          <FaArrowRightFromBracket />
        </div>
      </DefaultContinue>

      <DefaultContinue
        onClick={() => config.toggleDrawerStyle()}
        key="toggle-drawer"
      >
        <div className="continueContainerInformation">
          <h4 className="continueContainerHeader">Toggle Drawer Style</h4>
          <span className="continueContainerDescription">
            Switch between either a compact or more detaield sidebar.
          </span>
        </div>
      </DefaultContinue>

      <DefaultContinue onClick={handleChangePath} key="change build">
        <div className="continueContainerInformation">
          <h4 className="continueContainerHeader">Download Path</h4>
          <span className="continueContainerDescription">
            {currentPath && <code>{currentPathBeautified}</code>}
            {!currentPath &&
              "Select a new path for your Fortnite installation!"}
          </span>
        </div>
        <div className="continueContainerIcon marginLeft">
          <FaFolderOpen />
        </div>
      </DefaultContinue>
    </>
  );
};

export default PreferencesPage;

import { open } from "@tauri-apps/api/shell";
import { useUserControl } from "src/state/user";
import { useLibraryControl } from "src/state/library";
import { experienceSnow } from "src/lib/tauri";
import toast from "react-hot-toast";

import { FaExternalLinkAlt } from "react-icons/fa";
import {
  FaChevronRight,
  FaDiscord,
  FaGamepad,
  FaGithub,
} from "react-icons/fa6";
import DefaultContinue from "src/components/continue";
import client from "src/external/client";
import "src/styles/pagePackages.css";

const PackagesPage = () => {
  const user = useUserControl();
  const library = useLibraryControl();

  const openExternalLink = async (href: string) => {
    await open(href);
  };

  const handleExperience = async () => {
    const exchangeCode = await client.code(user.access_token);
    if (!exchangeCode.ok) return;

    const currentEntry = library.getCurrentEntry();
    if (!currentEntry) return;

    const stringOrBoolean = await experienceSnow(
      currentEntry.path,
      exchangeCode.data
    );

    if (typeof stringOrBoolean === "string") {
      toast.error(stringOrBoolean);
      return;
    }
  };

  return (
    <>
      <DefaultContinue onClick={handleExperience}>
        <div className="continueContainerIcon header">
          <FaGamepad />
        </div>
        <div className="continueContainerInformation">
          <h4 className="continueContainerHeader">
            Experience Snow <span className="seasonText">Season 8</span>
          </h4>
          <span className="continueContainerDescription">
            Earn V-Bucks, collect XP, complete challenges, and more!
          </span>
        </div>
        <div className="continueContainerIcon marginLeft">
          <FaChevronRight />
        </div>
      </DefaultContinue>

      <DefaultContinue
        onClick={() => openExternalLink("https://github.com/ectrc/snow")}
      >
        <div className="continueContainerIcon header">
          <FaGithub />
        </div>
        <div className="continueContainerInformation">
          <h4 className="continueContainerHeader">View the Source</h4>
          <span className="continueContainerDescription">
            All technologies used in Snow are open source on GitHub.
          </span>
        </div>
        <div className="continueContainerIcon marginLeft">
          <FaExternalLinkAlt />
        </div>
      </DefaultContinue>

      <DefaultContinue
        onClick={() =>
          openExternalLink("https://discord.com/invite/kBefMZA4Qp")
        }
      >
        <div className="continueContainerIcon header">
          <FaDiscord />
        </div>
        <div className="continueContainerInformation">
          <h4 className="continueContainerHeader">Join the Community</h4>
          <span className="continueContainerDescription">
            Chat with other players, report bugs, and more!
          </span>
        </div>
        <div className="continueContainerIcon marginLeft">
          <FaExternalLinkAlt />
        </div>
      </DefaultContinue>
    </>
  );
};

export default PackagesPage;

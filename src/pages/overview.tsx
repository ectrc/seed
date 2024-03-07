import { useLibraryControl } from "src/state/library";
import { useUserControl } from "src/state/user";
import { useStates, LOADING_STATES } from "src/state/state";
import { importBuildFromDialog } from "src/lib/import";
import { closeSnow, experienceSnow } from "src/lib/tauri";
import { queryStats } from "src/external/query";
import { useQuery } from "@tanstack/react-query";
import client from "src/external/client";

import { FaGithub } from "react-icons/fa6";
import { open } from "@tauri-apps/api/shell";

const Overview = () => {
  const library = useLibraryControl();
  const currentEntry = library.getCurrentEntry();

  const { data: launcherStats } = useQuery<LauncherStats>({
    queryKey: ["launcher"],
    queryFn: queryStats,
    initialData: {
      PlayersOnline: 0,
      CurrentBuild: "0.0",
      CurrentSeason: 8,
    },
    throwOnError: false,
    refetchInterval: 10000,
  });

  return (
    <>
      <div className="snowOverview">
        <header className="snowOverviewHeader">
          <h4>
            SNOW Season <strong>{launcherStats.CurrentSeason}</strong>
          </h4>
          {/* <p>X marks the spot</p> */}
        </header>

        <section className="snowUpdates">
          <p>latest updates</p>
          <ul>
            <li>
              Level & Battle Pass progression has been pushed to production.
            </li>
            <li>Improvements in MCP actions, so quicker response times!</li>
          </ul>
        </section>
      </div>

      {!currentEntry ? <PathButton /> : <ExperienceSnow />}
    </>
  );
};

const ExperienceSnow = () => {
  const openLink = (href: string) => open(href);

  return (
    <>
      <button
        className="default"
        onClick={() => openLink("https://github.com/ectrc/seed")}
      >
        <FaGithub /> View the source
      </button>
      <PathButton alreadySet />
      <ExperienceButton />
    </>
  );
};

type PathButtonProps = {
  alreadySet?: boolean;
};

const PathButton = ({ alreadySet = false }: PathButtonProps) => {
  const states = useStates((s) => s.states);
  const tag = alreadySet ? "Change" : "Set";

  return (
    <button
      className="default"
      onClick={importBuildFromDialog}
      disabled={states["importing"] !== LOADING_STATES.AWAITING_ACTION}
    >
      {tag} Fortnite Directory
    </button>
  );
};

const ExperienceButton = () => {
  const stateControl = useStates();
  const library = useLibraryControl();
  const token = useUserControl((s) => s.access_token);

  const handleExperience = async () => {
    stateControl.set_state("launching", LOADING_STATES.ATTEMPTING_LOGIN);
    const exchangeCode = await client.code(token);
    if (!exchangeCode.ok)
      return stateControl.set_state(
        "launching",
        LOADING_STATES.AWAITING_ACTION
      );
    stateControl.set_state("launching", LOADING_STATES.FETCHING_BUILD);
    const currentEntry = library.getCurrentEntry();
    if (!currentEntry)
      return stateControl.set_state(
        "launching",
        LOADING_STATES.AWAITING_ACTION
      );
    stateControl.set_state("launching", LOADING_STATES.STARTING_PROCESS);
    const stringOrBoolean = await experienceSnow(
      currentEntry.path,
      exchangeCode.data
    );
    if (typeof stringOrBoolean === "string") {
      return stateControl.set_state("launching", LOADING_STATES.ERROR);
    }
    if (typeof stringOrBoolean === "boolean" && stringOrBoolean) {
      return stateControl.set_state("launching", LOADING_STATES.INGAME);
    }
  };

  const handleClick = () => {
    switch (stateControl.states["launching"]) {
      case LOADING_STATES.INGAME:
        closeSnow();
        break;
      case LOADING_STATES.AWAITING_ACTION:
        handleExperience();
        break;
      default:
        return;
    }

    stateControl.set_state("launching", LOADING_STATES.AWAITING_ACTION);
    closeSnow();
  };

  const disabled =
    stateControl.states["launching"] !== LOADING_STATES.INGAME &&
    stateControl.states["launching"] !== LOADING_STATES.AWAITING_ACTION;

  const titleLookup = {
    [LOADING_STATES.ATTEMPTING_LOGIN]: "Getting Ready",
    [LOADING_STATES.FETCHING_BUILD]: "Processing Build",
    [LOADING_STATES.STARTING_PROCESS]: "Starting Fortnite",
    [LOADING_STATES.INGAME]: "Close Fortnite",
    [LOADING_STATES.AWAITING_ACTION]: "Experience Snow",
  };

  return (
    <button
      className={`default ${
        stateControl.states["launching"] === LOADING_STATES.INGAME
          ? "red"
          : "green"
      }`}
      onClick={handleClick}
      disabled={disabled}
    >
      {titleLookup[stateControl.states["launching"]]}
    </button>
  );
};

export default Overview;

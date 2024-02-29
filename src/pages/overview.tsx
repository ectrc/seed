import { useLibraryControl } from "src/state/library";
import { useUserControl } from "src/state/user";
import { useConfigControl, LOADING_STATES } from "src/state/config";
import { importBuildFromDialog } from "src/lib/import";
import { closeSnow, experienceSnow } from "src/lib/tauri";
import { queryStats } from "src/external/query";
import { useQuery } from "@tanstack/react-query";
import client from "src/external/client";

const Overview = () => {
  const library = useLibraryControl();
  const installPath = library.getCurrentEntry();

  const { data: launcherStats } = useQuery<LauncherStats>({
    queryKey: ["launcher"],
    queryFn: queryStats,
    initialData: {
      PlayersOnline: 0,
      CurrentBuild: "0.0",
      CurrentSeason: 0,
    },
    throwOnError: false,
    refetchInterval: 10000,
  });

  return (
    <>
      <div className="snowOverview">
        <header className="snowOverviewHeader">
          <h4>
            Season <strong>{launcherStats.CurrentSeason}</strong>
          </h4>
          <p>X marks the spot</p>
        </header>
      </div>

      {!installPath ? <PathButton /> : <ExperienceSnow />}
    </>
  );
};

const ExperienceSnow = () => {
  return (
    <>
      <PathButton alreadySet />
      <ExperienceButton />
    </>
  );
};

type PathButtonProps = {
  alreadySet?: boolean;
};

const PathButton = ({ alreadySet = false }: PathButtonProps) => {
  const loaders = useConfigControl((s) => s.loaders);
  const tag = alreadySet ? "Change" : "Set";

  return (
    <button
      className="default"
      onClick={importBuildFromDialog}
      disabled={loaders["importing"] !== LOADING_STATES.AWAITING_ACTION}
    >
      {tag} Fortnite Directory
    </button>
  );
};

const ExperienceButton = () => {
  const config = useConfigControl();
  const library = useLibraryControl();
  const token = useUserControl((s) => s.access_token);

  const handleExperience = async () => {
    config.set_loader("launching", LOADING_STATES.ATTEMPTING_LOGIN);
    const exchangeCode = await client.code(token);
    if (!exchangeCode.ok)
      return config.set_loader("launching", LOADING_STATES.AWAITING_ACTION);
    config.set_loader("launching", LOADING_STATES.FETCHING_BUILD);
    const currentEntry = library.getCurrentEntry();
    if (!currentEntry)
      return config.set_loader("launching", LOADING_STATES.AWAITING_ACTION);
    config.set_loader("launching", LOADING_STATES.STARTING_PROCESS);
    const stringOrBoolean = await experienceSnow(
      currentEntry.path,
      exchangeCode.data
    );
    if (typeof stringOrBoolean === "string") {
      return config.set_loader("launching", LOADING_STATES.ERROR);
    }
    if (typeof stringOrBoolean === "boolean" && stringOrBoolean) {
      return config.set_loader("launching", LOADING_STATES.INGAME);
    }
  };

  const handleClick = () => {
    switch (config.loaders["launching"]) {
      case LOADING_STATES.INGAME:
        closeSnow();
        break;
      case LOADING_STATES.AWAITING_ACTION:
        handleExperience();
        break;
      default:
        return;
    }

    config.set_loader("launching", LOADING_STATES.AWAITING_ACTION);
    closeSnow();
  };

  const disabled =
    config.loaders["launching"] !== LOADING_STATES.INGAME &&
    config.loaders["launching"] !== LOADING_STATES.AWAITING_ACTION;

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
        config.loaders["launching"] === LOADING_STATES.INGAME ? "red" : "green"
      }`}
      onClick={handleClick}
      disabled={disabled}
    >
      {titleLookup[config.loaders["launching"]]}
    </button>
  );
};

export default Overview;

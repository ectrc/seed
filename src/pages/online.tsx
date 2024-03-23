import { useQuery } from "@tanstack/react-query";
import { importBuildFromDialog } from "src/lib/import";
import { queryStats } from "src/external/query";

import PlaySnow from "src/components/play";
import Book from "src/components/book";

const SUFFIX = ["JUMP INTO A GAME OF ", "GO DOMINATE IN ", "GIVE A SHOT AT "];
const PLAYLISTS = ["Arena", "Solos", "Duos", "Squads"];

const CHOSEN_SUFFIX = SUFFIX[Math.floor(Math.random() * SUFFIX.length)];
const CHOSEN_PLAYLIST = PLAYLISTS[Math.floor(Math.random() * PLAYLISTS.length)];

const Online = () => {
  const {
    data: snowDataReal,
    error,
    isFetching,
    isLoading,
  } = useQuery<LauncherStats>({
    queryKey: ["launcher"],
    queryFn: queryStats,
    throwOnError: false,
  });

  const condition = error || isFetching || isLoading;
  const snowData = condition
    ? snowDataReal !== undefined
      ? snowDataReal
      : null
    : snowDataReal;

  return (
    <>
      <div className="snowOverview">
        <div>
          <header className="snowOverviewHeader">
            <h4>
              SNOW SEASON <strong>{snowData?.CurrentSeason || "?"} </strong>
            </h4>
          </header>
          <section className="snowUpdates">
            <p>
              {CHOSEN_SUFFIX}
              <strong>{CHOSEN_PLAYLIST}</strong>
            </p>
          </section>
        </div>

        <Book />
      </div>

      <button className="default" onClick={importBuildFromDialog}>
        Set Fortnite Directory
      </button>
      <PlaySnow />
    </>
  );
};

export default Online;

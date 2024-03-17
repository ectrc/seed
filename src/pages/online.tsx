import { useQuery } from "@tanstack/react-query";
import { importBuildFromDialog } from "src/lib/import";
import { queryStats } from "src/external/query";

import PlaySnow from "src/components/play";
import Book from "src/components/book";

const SUFFIX = ["JUMP INTO A GAME OF ", "GO DOMINATE IN ", "GIVE A SHOT AT "];
const PLAYLISTS = ["Arena", "Solos", "Duos", "Squads"];

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
    refetchInterval: 10000,
  });

  const condition = error || isFetching || isLoading;
  const snowData = condition ? null : snowDataReal;

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
              {SUFFIX[Math.floor(Math.random() * SUFFIX.length)]}
              <strong>
                {PLAYLISTS[Math.floor(Math.random() * PLAYLISTS.length)]}
              </strong>
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

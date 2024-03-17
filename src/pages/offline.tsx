import { useConfigControl } from "src/state/config";
import { importBuildFromDialog } from "src/lib/import";

import PlaySnow from "src/components/play";

const Offline = () => {
  const username = useConfigControl((s) => s.raw_credentials);

  return (
    <div className="snowPage">
      <div className="snowOverview">
        <div>
          <header className="snowOverviewHeader">
            <h4>
              SNOW <strong>UNSECURE MODE</strong>
            </h4>
          </header>
          <section className="snowUpdates">
            {username && (
              <p>
                USING ACCOUNT <strong>{username}</strong>
              </p>
            )}
            {!username && <p>NO DISPLAY NAME PROVIDED</p>}
          </section>
        </div>
      </div>

      <button className="default" onClick={importBuildFromDialog}>
        Set Fortnite Directory
      </button>
      <PlaySnow />
    </div>
  );
};

export default Offline;

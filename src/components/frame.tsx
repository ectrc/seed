import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useStates } from "src/state/state";
import { queryPerson, queryStats } from "src/external/query";

import { HiArrowSmLeft } from "react-icons/hi";
import { FaSeedling, FaCircleUser } from "react-icons/fa6";
import "src/styles/frame.css";

const Frame = () => {
  const fortniteStatus = useStates((s) => s.states["launching"]);
  const className = `tauriFrame ${fortniteStatus}`;

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
  });

  const { data: player } = useQuery({
    queryKey: ["player"],
    queryFn: queryPerson,
  });

  return (
    <div className="tauriFrameContainer">
      <nav data-tauri-drag-region className={className}>
        <div data-tauri-drag-region className="tauriFrameInner">
          <span data-tauri-drag-region className="tauriFrameIcon">
            <FaSeedling />
          </span>
          <s />
          <MainLink playerExists={!!player} />
        </div>
        <div data-tauri-drag-region className="tauriFrameInformation">
          <span data-tauri-drag-region>
            {!error ? launcherStats.PlayersOnline : 0} Players Online
          </span>
          <s></s>
          <span data-tauri-drag-region>
            <strong data-tauri-drag-region>
              {player ? player.DisplayName : ""}
            </strong>
          </span>
        </div>
      </nav>
      <div className="tauriFrameContent">
        <Outlet />
      </div>
    </div>
  );
};

type MainLinkProps = {
  playerExists: boolean;
};

const MainLink = (props: MainLinkProps) => {
  const router = useRouterState();
  if (!props.playerExists) return null;
  if (router.location.pathname === "/snow/account") {
    return <HomeLink />;
  }

  return <AccountLink />;
};

const AccountLink = () => {
  return (
    <Link to="/snow/account">
      <button className="tauriFrameAction">
        <FaCircleUser />
      </button>
    </Link>
  );
};

const HomeLink = () => {
  return (
    <Link to="/snow">
      <button className="tauriFrameAction">
        <HiArrowSmLeft />
      </button>
    </Link>
  );
};

export default Frame;

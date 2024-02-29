import { useQuery } from "@tanstack/react-query";
import { queryPerson } from "src/external/query";

import { FaDiscord } from "react-icons/fa6";
import "src/styles/pageConnections.css";

const ConnectionsPage = () => {
  const {
    data: player,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["player"],
    queryFn: queryPerson,
  });
  if (error || !player || isLoading) return null;

  return (
    <>
      <div className="continueContainer">
        <div className="connectionsUserArea">
          {player.Discord.Avatar && (
            <div
              className="connectionsUserAreaIcon"
              style={{
                backgroundImage: `url(https://cdn.discordapp.com/avatars/${player.Discord.ID}/${player.Discord.Avatar}.webp?size=128)`,
              }}
            />
          )}
          <div className="connectionsUserInformation">
            <h3 className="connectionsUserInformationName">
              {player.Discord.Username}
            </h3>
            <p className="connectionsUserInformationText">
              {player.Discord.ID}
            </p>
          </div>
        </div>
        <div className="continueContainerIcon marginLeft">
          <FaDiscord />
        </div>
      </div>
    </>
  );
};

export default ConnectionsPage;

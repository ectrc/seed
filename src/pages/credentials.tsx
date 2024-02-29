import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { open } from "@tauri-apps/api/shell";
import client from "src/external/client";

import "src/styles/pageCredentials.css";
import { useUserControl } from "src/state/user";

const CredentialsPage = () => {
  const navigate = useNavigate();
  const userControl = useUserControl();

  const handleContinue = async () => {
    const discord = await client.discord();
    if (!discord.ok) return console.error(discord.error);
    await open(discord.data);
  };

  const handleHashChange = async () => {
    const code = window.location.hash.slice(1);
    if (!code.startsWith("auth:")) return;

    const token = code.split(":")[1];
    const player = await client.player(token);
    if (!player.ok) return console.error(player.error);

    userControl.new_token(token);
    window.location.hash = "";
    navigate({
      to: "/snow",
    });
  };

  useEffect(() => {
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div className="credentialsPage">
      <div className="noAccountModal">
        <header className="noAccountModalHeader">
          <h1 className="noAccountModalTitle">Snow</h1>
          <p className="noAccountModalText">
            Authenticate yourself via Discord to gain access to in-game
            services.
          </p>
        </header>

        <div className="noAccountModalContent">
          <button className="noAccountModalButton" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default CredentialsPage;

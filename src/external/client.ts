import axios from "axios";
import { discord } from "./discord";
import { code, okay, player } from "./person";
import { stats } from "./launcher";

export const axiosClient = axios.create({
  baseURL: "https://snows.rocks",
});

export const endpoints = {
  GET_DISCORD_ENDPOINT: "/snow/discord",
  GET_PLAYER_ENDPOINT: "/snow/player",
  GET_PLAYER_OKAY_ENDPOINT: "/snow/player/okay",
  POST_PLAYER_CODE_ENDPOINT: "/snow/player/code",
  GET_LAUNCHER_STATS: "/snow/launcher",
};

export default { discord, player, okay, code, stats };

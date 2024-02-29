import axios from "axios";
import { discord } from "./discord";
import { code, okay, player } from "./person";

export const axiosClient = axios.create({
  baseURL: "https://snows.rocks",
});

export const endpoints = {
  GET_DISCORD_ENDPOINT: "/snow/discord",
  GET_PLAYER_ENDPOINT: "/snow/player",
  GET_PLAYER_OKAY_ENDPOINT: "/snow/player/okay",
  POST_PLAYER_CODE_ENDPOINT: "/snow/player/code",
};

export default { discord, player, okay, code };

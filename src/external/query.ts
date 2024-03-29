import { useUserControl } from "src/state/user";
import client from "./client";

export const queryPerson = async (): Promise<PersonResponse> => {
  const token = useUserControl.getState().access_token;
  const response = await client.player(token);
  if (response.ok) return response.data;

  throw new Error(response.error);
};

export const queryStats = async (): Promise<LauncherStats> => {
  const token = useUserControl.getState().access_token;
  const response = await client.stats(token);
  if (response.ok) return response.data;

  throw new Error(response.error);
};

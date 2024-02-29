import { useUserControl } from "src/state/user";
import client from "./client";

export const queryPerson = async (): Promise<Person> => {
  const token = useUserControl.getState().access_token;
  const response = await client.player(token);
  if (response.ok) return response.data;

  throw new Error(response.error);
};

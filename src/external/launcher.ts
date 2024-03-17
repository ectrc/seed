import { AxiosError } from "axios";
import { axiosClient, endpoints } from "./client";

export const stats = async (
  t: string
): Promise<SnowResponse<LauncherStats>> => {
  const response = await axiosClient()
    .get<LauncherStats>(endpoints.GET_LAUNCHER_STATS, {
      headers: {
        Authorization: t,
      },
    })
    .catch((e: AxiosError<ErrorResponse>) => {
      return e;
    });

  if (response instanceof AxiosError) {
    return {
      ok: false,
      error: response.message,
    };
  }

  return {
    ok: true,
    data: response.data,
  };
};

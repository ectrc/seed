import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ConfigState = {
  loaders: Record<string, string>;
  set_loader: (id: string, active: string) => void;
};

export const LOADING_STATES = {
  LOADING: "loading",
  ALREADY_ACTIVE: "already_active",
  ERROR: "not_ok",
  AWAITING_ACTION: "ok",

  ATTEMPTING_LOGIN: "attempting_login",
  FETCHING_BUILD: "fetching_build",
  STARTING_PROCESS: "starting_process",
  INGAME: "in_game",
};

export const useConfigControl = create<ConfigState>()(
  persist(
    (set) => ({
      loaders: {
        importing: LOADING_STATES.AWAITING_ACTION,
        launching: LOADING_STATES.AWAITING_ACTION,
      } as Record<string, string>,
      set_loader: (loader, active) => {
        set((state) => ({
          loaders: {
            ...state.loaders,
            [loader]: active,
          },
        }));
      },
    }),
    {
      name: "config.control",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

import { create } from "zustand";

type StateState = {
  states: Record<string, string>;
  set_state: (id: string, active: string) => void;
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

export const useStates = create<StateState>((set) => ({
  states: {
    importing: LOADING_STATES.AWAITING_ACTION,
    launching: LOADING_STATES.AWAITING_ACTION,
  } as Record<string, string>,
  set_state: (loader, active) => {
    set((state) => ({
      states: {
        ...state.states,
        [loader]: active,
      },
    }));
  },
}));

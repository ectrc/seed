import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ConfigState = {
  one_session: boolean;
  set_one_session: (one_session: boolean) => void;
  use_passwordless: boolean;
  set_use_passwordless: (dev: boolean) => void;
  raw_credentials: string;
  set_raw_credentials: (username: string) => void;
  use_localhost: boolean;
  set_use_localhost: (dev: boolean) => void;
};

export const useConfigControl = create<ConfigState>()(
  persist(
    (set) => ({
      one_session: true,
      set_one_session: (one_session: boolean) => set({ one_session }),
      use_passwordless: false,
      set_use_passwordless: (dev: boolean) => set({ use_passwordless: dev }),
      raw_credentials: "",
      set_raw_credentials: (raw_credentials: string) =>
        set({ raw_credentials }),
      use_localhost: false,
      set_use_localhost: (dev: boolean) => set({ use_localhost: dev }),
    }),
    {
      name: "config.control",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

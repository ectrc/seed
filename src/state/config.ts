import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ConfigState = {};

export const useConfigControl = create<ConfigState>()(
  persist(() => ({}), {
    name: "config.control",
    storage: createJSONStorage(() => localStorage),
  })
);

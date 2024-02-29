import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ConfigState = {
  drawerStyle: 0 | 1;
  toggleDrawerStyle: () => void;
};

export const useConfigControl = create<ConfigState>()(
  persist(
    (set) => ({
      drawerStyle: 0,
      toggleDrawerStyle: () =>
        set((state) => ({
          drawerStyle: state.drawerStyle === 0 ? 1 : 0,
        })),
    }),
    {
      name: "config.control",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

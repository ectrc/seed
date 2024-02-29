import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type LibraryState = {
  entries: Record<string, LibraryEntry>;
  add: (entry: LibraryEntry) => void;
  remove: (id: string) => void;
  getCurrentBinaryPath: () => string | null;
  getBeautifiedPath: () => string | null;
  getCurrentEntry: () => LibraryEntry | null;
};

export const useLibraryControl = create<LibraryState>()(
  persist(
    (set) => ({
      entries: {},
      add: (entry) =>
        set((state) => ({
          entries: {
            ...state.entries,
            [entry.binaryHash]: entry,
          },
        })),
      remove: (id) =>
        set((state) => {
          const { [id]: _, ...rest } = state.entries;
          return { entries: rest };
        }),
      getCurrentBinaryPath: () => {
        const he = Object.values(
          useLibraryControl.getState().entries
        )[0] as LibraryEntry;
        if (!he) return null;

        return he.binaryPath;
      },
      getBeautifiedPath: () => {
        const path = useLibraryControl.getState().getCurrentBinaryPath();
        if (!path) return null;

        const split = path.split("\\") as string[];
        if (split.indexOf("FortniteGame") === -1) return null;

        const index = split.indexOf("FortniteGame");
        return split.slice(0, index + 1).join("\\");
      },
      getCurrentEntry: () => {
        const he = Object.values(
          useLibraryControl.getState().entries
        )[0] as LibraryEntry;
        if (!he) return null;

        return he;
      },
    }),
    {
      name: "library.control",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

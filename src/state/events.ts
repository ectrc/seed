import { create } from "zustand";

type EVENTS = {
  fortnite_process_id: (pid: number) => void;
};

type FunctionFromEvent<T> = T extends (arg: infer U) => void
  ? (pid: U) => void
  : never;

type EventsState = {
  actions: Map<keyof EVENTS, Array<FunctionFromEvent<EVENTS[keyof EVENTS]>>>;
  subscribe: <T extends keyof EVENTS>(
    event: T,
    callback: FunctionFromEvent<EVENTS[T]>
  ) => void;
  unsubscribe: <T extends keyof EVENTS>(
    event: T,
    callback: FunctionFromEvent<EVENTS[T]>
  ) => void;
};

export const useEvents = create<EventsState>((set, get) => ({
  actions: new Map(),
  subscribe: (event, callback) => {
    const existingActions = get().actions;
    if (!existingActions) return;

    const existing = existingActions.get(event);
    if (!existing) existingActions.set(event, [callback]);
    if (existing) {
      existing.push(callback);
      existingActions.set(event, existing);
    }

    set({ actions: existingActions });
  },
  unsubscribe: (event, callback) => {
    const existingActions = get().actions;
    if (!existingActions) return;

    const existing = existingActions.get(event);
    if (!existing) return;

    const newActions = existing.filter((cb) => cb !== callback);
    existingActions.set(event, newActions);

    set({ actions: existingActions });
  },
}));

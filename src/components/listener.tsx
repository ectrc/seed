import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";
import { useEvents } from "src/state/events";

const TauriListener = () => {
  const manager = useEvents();

  useEffect(() => {
    const returnListener = listen<number>("fortnite_process_id", (s) => {
      manager.actions
        .get("fortnite_process_id")
        ?.forEach((cb) => cb(s.payload));
    });

    return () => {
      returnListener.then();
    };
  }, []);

  return null;
};

export default TauriListener;

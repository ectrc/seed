import { useEffect } from "react";
import { LOADING_STATES, useConfigControl } from "src/state/config";

import { RouterProvider } from "@tanstack/react-router";
import router from "src/app/router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export const queryClient = new QueryClient();

import "src/styles/app.css";
import "src/styles/defaults.css";

const App = () => {
  const handleContextMenu = (e: Event) => e.preventDefault();
  const config = useConfigControl();

  useEffect(() => {
    window.addEventListener("contextmenu", handleContextMenu);
    config.set_loader("launcher", LOADING_STATES.AWAITING_ACTION);

    return () => window.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;

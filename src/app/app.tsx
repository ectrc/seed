import { useEffect } from "react";
import TauriListener from "src/components/listener";

import { RouterProvider } from "@tanstack/react-router";
import router from "src/app/router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export const queryClient = new QueryClient();

import "src/styles/app.css";
import "src/styles/defaults.css";

const App = () => {
  const preventDefault = (e: Event) => e.preventDefault();

  useEffect(() => {
    window.addEventListener("contextmenu", preventDefault);
    return () => window.removeEventListener("contextmenu", preventDefault);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TauriListener />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;

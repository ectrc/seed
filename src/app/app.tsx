import { useEffect } from "react";
import { RouterProvider } from "@tanstack/react-router";
import router from "src/app/router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export const queryClient = new QueryClient();

import TauriFrame from "src/components/frame";
import { Toaster } from "react-hot-toast";

import "src/styles/app.css";
import "src/styles/default.css";

const App = () => {
  const handleContextMenu = (e: Event) => e.preventDefault();

  useEffect(() => {
    window.addEventListener("contextmenu", handleContextMenu);
    return () => window.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TauriFrame>
        <Toaster
          toastOptions={{
            className: "snowToast",
          }}
        />
        <RouterProvider router={router} />
      </TauriFrame>
    </QueryClientProvider>
  );
};

export default App;

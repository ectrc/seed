import {
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { useUserControl } from "src/state/user";
import client from "src/external/client";

import MovingBlobs from "src/components/blobs";
import SnowPage from "src/pages/snow";
import ConnectionsPage from "src/pages/connections";
import CredentialsPage from "src/pages/credentials";
import PreferencesPage from "src/pages/preferences";
import PackagesPage from "src/pages/packages";

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: () => <Navigate to="/credentials" />,
});

export const credentialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/credentials",
  component: () => (
    <>
      <MovingBlobs />
      <CredentialsPage />
    </>
  ),
  beforeLoad: () => {
    const token = useUserControl.getState().access_token;
    if (!token) return;

    throw redirect({
      to: "/snow",
    });
  },
});

export const snowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/snow",
  component: SnowPage,
  beforeLoad: async () => {
    const token = useUserControl.getState().access_token;
    const response = await client.okay(token);
    if (response.ok) return;
    useUserControl.getState().kill_token();
    throw redirect({
      to: "/credentials",
    });
  },
});

export const snowIndexRoute = createRoute({
  getParentRoute: () => snowRoute,
  path: "/",
  component: () => <Navigate to="/snow/packages" />,
});

export const snowLibraryRoute = createRoute({
  getParentRoute: () => snowRoute,
  path: "/packages",
  component: PackagesPage,
});

export const snowSettingsRoute = createRoute({
  getParentRoute: () => snowRoute,
  path: "/preferences",
  component: PreferencesPage,
});

export const snowConnectionsRoute = createRoute({
  getParentRoute: () => snowRoute,
  path: "/connections",
  component: ConnectionsPage,
});

const tree = rootRoute.addChildren([
  credentialsRoute,
  snowRoute.addChildren([
    snowIndexRoute,
    snowLibraryRoute,
    snowSettingsRoute,
    snowConnectionsRoute,
  ]),
]);

const router = createRouter({
  routeTree: tree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;

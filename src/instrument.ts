import * as Sentry from "@sentry/react";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import React from "react";

const dsn = import.meta.env.VITE_SENTRY_DSN;
const appEnv = import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE;

if (dsn) {
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";
  const traceTargets: (string | RegExp)[] = ["localhost"];
  if (apiBase) traceTargets.push(apiBase);

  Sentry.init({
    dsn,
    environment: appEnv,
    release: import.meta.env.VITE_APP_VERSION,
    integrations: [
      Sentry.reactRouterV7BrowserTracingIntegration({
        useEffect: React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: appEnv === "production" ? 0.2 : 1.0,
    tracePropagationTargets: traceTargets,
    replaysSessionSampleRate: appEnv === "production" ? 0.1 : 0,
    replaysOnErrorSampleRate: appEnv === "production" ? 1.0 : 0,
  });
}

export { Sentry };

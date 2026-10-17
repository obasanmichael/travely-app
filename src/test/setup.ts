import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Auto-cleanup only runs with Vitest globals enabled, which this project doesn't use.
afterEach(cleanup);

// jsdom doesn't implement scrolling.
window.scrollTo = () => undefined;

// jsdom has no matchMedia; tests run with the light system preference.
window.matchMedia =
  window.matchMedia ??
  ((query: string) =>
    ({
      matches: false,
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
      onchange: null,
    }) as MediaQueryList);

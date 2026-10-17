import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Auto-cleanup only runs with Vitest globals enabled, which this project doesn't use.
afterEach(cleanup);

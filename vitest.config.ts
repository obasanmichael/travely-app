import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      css: false,
      // Firebase refuses to initialise without config; tests never reach the network.
      env: {
        VITE_FIREBASE_API_KEY: "test",
        VITE_FIREBASE_AUTH_DOMAIN: "test.firebaseapp.com",
        VITE_FIREBASE_PROJECT_ID: "test",
        VITE_FIREBASE_STORAGE_BUCKET: "test.appspot.com",
        VITE_FIREBASE_MESSAGING_SENDER_ID: "0",
        VITE_FIREBASE_APP_ID: "1:0:web:0",
        VITE_API_BASE_URL: "http://api.test",
      },
    },
  })
);

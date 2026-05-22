import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { app } from "./firebase";

export function initAppCheck(): void {
  const siteKey = import.meta.env.VITE_FIREBASE_APP_CHECK_SITE_KEY;
  const appEnv = import.meta.env.VITE_APP_ENV ?? "development";

  if (!siteKey) {
    if (appEnv === "development") {
      console.info(
        "App Check: no VITE_FIREBASE_APP_CHECK_SITE_KEY — skipped in development"
      );
    }
    return;
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
}

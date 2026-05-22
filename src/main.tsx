import React from "react";
import ReactDOM from "react-dom/client";
import { reactErrorHandler } from "@sentry/react";
import "./instrument";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { initAppCheck } from "./firebase/appCheck";

initAppCheck();

const rootElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootElement, {
  onUncaughtError: reactErrorHandler(),
  onCaughtError: reactErrorHandler(),
  onRecoverableError: reactErrorHandler(),
}).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);

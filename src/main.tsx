import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { reactErrorHandler } from "@sentry/react";
import "./instrument";
import "./index.css";
import App from "./App";
import { initAppCheck } from "./firebase/appCheck";

initAppCheck();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement, {
  onUncaughtError: reactErrorHandler(),
  onCaughtError: reactErrorHandler(),
  onRecoverableError: reactErrorHandler(),
}).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

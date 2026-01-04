import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { setTheme, getTheme } from "./theme";
import "./index.css";

setTheme(getTheme());

// Register PWA service worker
if ("serviceWorker" in navigator) {
  import("virtual:pwa-register").then(({ registerSW }) => {
    registerSW({
      onNeedRefresh() {},
      onOfflineReady() {},
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

import React from "react";
import ReactDOM from "react-dom/client";
import i18next from "i18next";
import App from "./App";
import "./i18n";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(i18next.t("errors.rootNotFound"));
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

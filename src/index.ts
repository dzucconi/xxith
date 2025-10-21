import { App } from "./app";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => App.initialize());
} else {
  App.initialize();
}

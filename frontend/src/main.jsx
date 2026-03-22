import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// "root" matches the <div id="root"> in index.html.
// React takes over that div and renders everything inside it.
// StrictMode runs extra checks in development to catch bugs early — no effect in production.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

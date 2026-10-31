import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/noto-sans-sc/chinese-simplified-400.css";
import "@fontsource/noto-sans-sc/chinese-simplified-700.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./index.css";
import { App } from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("找不到根节点");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

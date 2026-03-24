import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Global Aurora design tokens, resets, and animations
import "./styles/global.css";
// Vite scaffold base styles (width/border layout for #root, etc.)
import "./index.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

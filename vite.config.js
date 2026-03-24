import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Enables clean "@/..." imports, e.g. import { useAurora } from "@/store/AuroraContext"
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

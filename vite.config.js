import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Enables clean "@/..." imports, e.g. import { useAura } from "@/store/AuraContext"
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

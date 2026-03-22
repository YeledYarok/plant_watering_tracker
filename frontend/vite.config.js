import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API calls from the React dev server to the Express backend.
    // When the frontend fetches "/api/plants", Vite forwards it to localhost:3001.
    // This avoids CORS issues in production-like setups and keeps URLs clean.
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});

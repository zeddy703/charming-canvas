import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",        // Listen on all interfaces (useful for tunneling)
    port: 8080,
    /*hmr: {
      // Critical fix for tunnels (ngrok, devtunnels.ms, etc.)
      clientPort: 443,
      // Optional: helps in some cases if you have path issues
      // path: '/hmr',
    },*/
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

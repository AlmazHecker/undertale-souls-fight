import { defineConfig } from "vite";
import { resolve } from "path";

const __dirname = import.meta.dirname;
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});

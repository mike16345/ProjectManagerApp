import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [react(), svgr(), VitePWA()],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
});

import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "build",
    target: "esnext",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "lucide-react@0.487.0": "lucide-react",
      "react-day-picker@8.10.1": "react-day-picker",
      "figma:asset/ed56806be14087baf067ecf545679bc1d0728943.png": path.resolve(
        __dirname,
        "./src/assets/ed56806be14087baf067ecf545679bc1d0728943.png"
      ),
      "react-resizable-panels@2.1.7": "react-resizable-panels",
      "figma:asset/d1f2bcde838ba65eb69cf6f7f36c4b12b1fe69b0.png": path.resolve(
        __dirname,
        "./src/assets/d1f2bcde838ba65eb69cf6f7f36c4b12b1fe69b0.png"
      ),
      "sonner@2.0.3": "sonner",
      "figma:asset/8b4e70a6fa1321de7b7c58f6466d343bd1bc897d.png": path.resolve(
        __dirname,
        "./src/assets/8b4e70a6fa1321de7b7c58f6466d343bd1bc897d.png"
      ),
      "vaul@1.1.2": "vaul",
      "figma:asset/06ffb855404333aea4f5711b4a637df4cbd6ffe6.png": path.resolve(
        __dirname,
        "./src/assets/06ffb855404333aea4f5711b4a637df4cbd6ffe6.png"
      ),
      "recharts@2.15.2": "recharts",
      "cmdk@1.1.1": "cmdk",
      "react-hook-form@7.55.0": "react-hook-form",
      "@radix-ui/react-tooltip@1.1.8": "@radix-ui/react-tooltip",
      "next-themes@0.4.6": "next-themes",
      "@radix-ui/react-toggle-group@1.1.2": "@radix-ui/react-toggle-group",
      "input-otp@1.4.2": "input-otp",
      "@radix-ui/react-switch@1.1.3": "@radix-ui/react-switch",
      "figma:asset/ed0138b8c9de0798045f7a1093d2eef08c89aed1.png": path.resolve(
        __dirname,
        "./src/assets/ed0138b8c9de0798045f7a1093d2eef08c89aed1.png"
      ),
      "@radix-ui/react-slider@1.2.3": "@radix-ui/react-slider",
      "figma:asset/99f9720a2f9fb219164d2f1ee1341e891e661128.png": path.resolve(
        __dirname,
        "./src/assets/99f9720a2f9fb219164d2f1ee1341e891e661128.png"
      ),
      "@radix-ui/react-select@2.1.6": "@radix-ui/react-select",
      "figma:asset/14a6fa02ae183cbb256e0b4da2b46e17d3c07cee.png": path.resolve(
        __dirname,
        "./src/assets/14a6fa02ae183cbb256e0b4da2b46e17d3c07cee.png"
      ),
      "@radix-ui/react-radio-group@1.2.3": "@radix-ui/react-radio-group",
      "embla-carousel-react@8.6.0": "embla-carousel-react",
      "@radix-ui/react-popover@1.1.6": "@radix-ui/react-popover",
      "class-variance-authority@0.7.1": "class-variance-authority",
      "@radix-ui/react-menubar@1.1.6": "@radix-ui/react-menubar",
      "@radix-ui/react-toggle@1.1.2": "@radix-ui/react-toggle",
      "@radix-ui/react-hover-card@1.1.6": "@radix-ui/react-hover-card",
      "@radix-ui/react-tabs@1.1.3": "@radix-ui/react-tabs",
      "@radix-ui/react-dialog@1.1.6": "@radix-ui/react-dialog",
      "@radix-ui/react-slot@1.1.2": "@radix-ui/react-slot",
      "@radix-ui/react-collapsible@1.1.3": "@radix-ui/react-collapsible",
      "@radix-ui/react-separator@1.1.2": "@radix-ui/react-separator",
      "@radix-ui/react-avatar@1.1.3": "@radix-ui/react-avatar",
      "@radix-ui/react-scroll-area@1.2.3": "@radix-ui/react-scroll-area",
      "@radix-ui/react-alert-dialog@1.1.6": "@radix-ui/react-alert-dialog",
      "@radix-ui/react-progress@1.1.2": "@radix-ui/react-progress",
      "@": path.resolve(__dirname, "./src"),
      "@radix-ui/react-navigation-menu@1.2.5":
        "@radix-ui/react-navigation-menu",
      "@radix-ui/react-accordion@1.2.3": "@radix-ui/react-accordion",
      "@radix-ui/react-label@2.1.2": "@radix-ui/react-label",
      "@radix-ui/react-aspect-ratio@1.1.2": "@radix-ui/react-aspect-ratio",
      "@radix-ui/react-dropdown-menu@2.1.6": "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-checkbox@1.1.4": "@radix-ui/react-checkbox",
      "@radix-ui/react-context-menu@2.2.6": "@radix-ui/react-context-menu",
      buffer: "buffer",
      process: "process/browser",
      stream: "stream-browserify",
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  server: {
    open: true,
    port: 3000,
  },
});

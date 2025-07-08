import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "ImageUploader",
      fileName: "image-uploader",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      // Externalize React to avoid bundling it
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  server: {
    // Root the dev server at the project root to access both src/ and example/
    open: "/src/example/index.html",
  },
});

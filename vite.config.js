import path from "path";
import { defineConfig } from "vite";
// import mkcert from "vite-plugin-mkcert"; // 1. You can comment this out
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Configuration for React compiler (Babel plugin)
const ReactCompilerConfig = {
  target: "19", // Target react version
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),

    tailwindcss(), // Integrates Tailwind CSS with Vite
    
    // mkcert(), // 2. COMMENT THIS LINE OUT TO FIX THE ERROR
  ],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"), // Create a shortcut for importing from "src"
    },
  },

  server: {
    host: "0.0.0.0", // Allow access from other devices in the same network
    port: 3000, // Development server port
  },
});
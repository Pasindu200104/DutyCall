// Import the function that builds the Vite configuration.
import { defineConfig } from "vite";
// Import the plugin that lets Vite understand React (JSX) code.
import react from "@vitejs/plugin-react";
// Import the plugin that turns Tailwind CSS classes into real CSS.
import tailwindcss from "@tailwindcss/vite";

// Export the configuration with both plugins switched on.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});

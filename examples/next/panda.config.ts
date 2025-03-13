import { defineConfig } from "@pandacss/dev";

// Import the preset
import presetRadixColors from "../../packages/preset/dist";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Include the preset
  presets: [presetRadixColors()],

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},
  },

  // The output directory for your css system
  outdir: "styled-system",
});

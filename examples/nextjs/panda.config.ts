import { defineConfig } from "@pandacss/dev";
import presetRadixColors from "../../packages/preset/dist";

export default defineConfig({
  presets: [
    presetRadixColors({
      darkMode: true,
      autoP3: true,
      colorScales: ["gray", "blue", "red"],
    }),
    "@pandacss/preset-panda",
  ],

  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},
  },

  // The output directory for your css system
  outdir: "styled-system",
});

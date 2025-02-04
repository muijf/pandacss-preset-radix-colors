import { defineConfig } from "@pandacss/dev";

import radixColorsPreset from "../out";

export default defineConfig({
  eject: true,
  presets: [
    radixColorsPreset({
      darkMode: true,
      autoP3: true,
      colorScales: ["gray", "blue"],
    })
  ]
});

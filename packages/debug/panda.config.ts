import { defineConfig } from "@pandacss/dev";
import presetRadixColors from "pandacss-preset-radix-colors";

export default defineConfig({
  presets: [
    presetRadixColors({
      darkMode: {
        enabled: true,
        condition: ".dark &",
      },
      autoP3: true,
      colorScales: ["gray", "blue.dark", "red.p3.a"],
    }),
  ],
});

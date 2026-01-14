import { defineConfig } from "@pandacss/dev";
import presetRadixColors from "../preset/dist";

export default defineConfig({
  presets: [presetRadixColors()],
});

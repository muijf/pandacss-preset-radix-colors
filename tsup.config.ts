import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  minify: false,
  outDir: "out",
  external: ["@pandacss/dev", "@radix-ui/colors"],
  ...options,
}));

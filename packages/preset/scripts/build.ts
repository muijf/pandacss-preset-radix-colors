import { build, type BunupPlugin } from 'bunup';
import { join } from "path";

// @ts-ignore bad types
import { copy } from 'bunup/plugins';

export function packageJson(path: string = "package.json"): BunupPlugin {
  return {
    name: "packageJson",
    hooks: {
      onBuildDone: async (ctx) => {
        const file = Bun.file(path);

        if (await file.exists()) {
          const json = await file.json();

          const cjsEntry = ctx.files.find(
            (f) => f.kind === "entry-point" && f.format === "cjs" && !f.dts
          );
          const esmEntry = ctx.files.find(
            (f) => f.kind === "entry-point" && f.format === "esm" && !f.dts
          );
          const cjsTypes = ctx.files.find(
            (f) => f.format === "cjs" && f.dts
          );
          const esmTypes = ctx.files.find(
            (f) => f.format === "esm" && f.dts
          );

          const newJson = {
            name: json.name,
            version: json.version,
            description: json.description,
            keywords: json.keywords,
            homepage: json.homepage,
            bugs: json.bugs,
            repository: json.repository,
            license: json.license,
            author: json.author,
            exports: {
              ".": {
                ...(cjsTypes && { types: `./${cjsTypes.pathRelativeToOutdir}` }),
                ...(cjsEntry && { require: `./${cjsEntry.pathRelativeToOutdir}` }),
                ...(esmEntry && {
                  import: {
                    ...(esmTypes && { types: `./${esmTypes.pathRelativeToOutdir}` }),
                    default: `./${esmEntry.pathRelativeToOutdir}`,
                  },
                }),
              },
              "./package.json": "./package.json",
            },
            ...(cjsEntry && { main: `./${cjsEntry.pathRelativeToOutdir}` }),
            ...(esmEntry && { module: `./${esmEntry.pathRelativeToOutdir}` }),
            ...(cjsTypes && { types: `./${cjsTypes.pathRelativeToOutdir}` }),
            peerDependencies: json.peerDependencies,
            publishConfig: json.publishConfig,
          };

          await Bun.write(
            join(ctx.options.outDir, "package.json"),
            JSON.stringify(newJson, null, 2) + "\n"
          );
        }
      },
    }
  };
}

await build({
  entry: ["src/index.ts"],
  outDir: "dist",
  clean: true,
  format: ["cjs", "esm"],
  splitting: true,
  target: "node",
  sourcemap: "external",
  external: ["@radix-ui/colors"],
  plugins: [
    copy(['../../README.md', '../../LICENSE']),
    packageJson()
  ],
});
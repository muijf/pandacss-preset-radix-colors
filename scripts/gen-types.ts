import * as colors from "@radix-ui/colors";
import { writeFile } from 'fs/promises'
import { outdent } from 'outdent'
import path from 'path'

async function genTypes() {
  const colorScales = Object.keys(colors)
    .filter((scale) => !scale.includes("default"))
    .map(x => x.split(/(Dark|P3|A)/)
    .map(x => x.toLowerCase())
    .filter(Boolean)
    .join("."));

  const output = outdent`
    export const radixColorScales = [${colorScales.map((scale) => `"${scale}"`).join(", ")}] as const;

    export type RadixColorScale = (typeof radixColorScales)[number];
    export type RadixColorScales = RadixColorScale[];
  `;

  await writeFile(path.join(process.cwd(), "src/types.ts"), output);
}

genTypes();

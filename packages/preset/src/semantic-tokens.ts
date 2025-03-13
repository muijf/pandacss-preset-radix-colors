import { type Scale, getScales } from "./radix-colors";
import { type RadixColorScale, type RadixColorScales } from "./types";
import { keysToObj, mergeObjs } from "./utils";

// // TODO: Maybe clean up a little bit, it's hard to read.
export function getSemanticTokens(
  darkMode?: boolean,
  autoP3?: boolean,
  colorScales: RadixColorScales = [],
) {
  let scales = getScales(darkMode);

  if (darkMode) scales = scales.concat(getScales(false).filter((x) => !x.dark));

  return mergeObjs(
    {},
    ...scales
      .filter(
        (scale) =>
          colorScales.length === 0 ||
          colorScales.includes(scale.name as RadixColorScale),
      )
      .map((scale) => {
        let lightScale: Scale | undefined = undefined;
        let darkScale: Scale | undefined = undefined;
        let p3Scale: Scale | undefined = undefined;

        if (darkMode && !scale.dark && !scale.tags.includes("light"))
          darkScale = scales.find(
            (x) =>
              x.name === scale.name &&
              x.alpha === scale.alpha &&
              x.p3 === scale.p3 &&
              x.dark,
          );

        if (!darkScale && autoP3 && !scale.p3)
          p3Scale = scales.find(
            (x) =>
              x.name === scale.name &&
              x.alpha === scale.alpha &&
              x.dark === scale.dark &&
              x.p3,
          );

        if (darkScale)
          lightScale = scale.tags.includes("light")
            ? scale
            : scales.find(
                (x) =>
                  x.name === scale.name &&
                  x.alpha === scale.alpha &&
                  x.dark === scale.dark &&
                  x.p3 === scale.p3 &&
                  x.tags.includes("light"),
              );

        return keysToObj(
          scale.tags,
          Object.assign(
            {},
            ...Object.entries(scale.shades).map(([i, color]) => {
              let value: any = color;

              if (darkScale)
                value = {
                  base: `{colors.${lightScale?.path}.${i}}`,
                  _dark: `{colors.${darkScale.path}.${i}}`,
                };

              if (p3Scale)
                value = {
                  base: color,
                  _p3: `{colors.${p3Scale.path}.${i}}`,
                };

              return {
                [i]: {
                  value,
                },
              };
            }),
          ),
        );
      }),
  );
}

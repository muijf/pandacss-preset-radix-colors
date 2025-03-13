import * as colors from "@radix-ui/colors";

// Reserved tags that shouldn't be split.
const SCALE_RESERVED_TAGS = ["P3"];

// Regex that is used to extract tags from a full name.
const SCALE_TAGS_REGEX = new RegExp(
  `(${SCALE_RESERVED_TAGS.join("|")})|(?=[A-Z0-9])`,
  "g",
);

export type Scale = {
  fullName: string;
  tags: string[];
  name: string;
  path: string;
  dark: boolean;
  alpha: boolean;
  p3: boolean;
  shades: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
  };
};

export function getScaleTags(fullName: string) {
  return fullName
    .split(SCALE_TAGS_REGEX)
    .filter(Boolean)
    .map((x) => x.toLowerCase());
}

export function getScalePath(tags: string[]) {
  return tags.join(".");
}

export function isScaleAlpha(tags: string[]) {
  return tags.includes("a");
}

export function isScaleDark(tags: string[]) {
  return tags.includes("dark");
}

export function isScaleP3(tags: string[]) {
  return tags.includes("p3");
}

export function getScaleName(tags: string[]) {
  return tags[0];
}

export function getScaleShades(value: any) {
  return Object.assign(
    {},
    ...Object.values(value).map((shade, i) => ({
      [++i]: shade,
    })),
  );
}

export function getScales(lightPrefix?: boolean): Scale[] {
  return Object.entries(colors).map(([fullName, value]) => {
    const tags = getScaleTags(fullName);
    const dark = isScaleDark(tags);

    // If the scale isn't dark, add light to the 2nd index.
    if (!dark && lightPrefix) tags.splice(1, 0, "light");

    return {
      fullName,
      tags,
      name: getScaleName(tags),
      path: getScalePath(tags),
      dark,
      alpha: isScaleAlpha(tags),
      p3: isScaleP3(tags),
      shades: getScaleShades(value),
    };
  });
}

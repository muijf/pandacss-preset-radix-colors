import * as colors from "@radix-ui/colors";

/**
 * Reserved tag names that should not be split during color scale parsing.
 * These tags are treated as atomic units in color scale names.
 *
 * @internal
 */
const SCALE_RESERVED_TAGS = ["P3"];

/**
 * Regular expression for splitting color scale full names into individual tags.
 * Splits on uppercase letters, numbers, and reserved tags (like P3).
 *
 * @internal
 */
const SCALE_TAGS_REGEX = new RegExp(
  `(${SCALE_RESERVED_TAGS.join("|")})|(?=[A-Z0-9])`,
  "g",
);

/**
 * Represents a parsed Radix color scale with its metadata and color values.
 *
 * @example
 * A scale for "amberdarkp3a1" would be:
 * ```ts
 * {
 *   fullName: "amberdarkp3a1",
 *   tags: ["amber", "dark", "p3", "a"],
 *   name: "amber",
 *   path: "amber.dark.p3.a",
 *   dark: true,
 *   alpha: true,
 *   p3: true,
 *   shades: { 1: "#...", 2: "#...", ..., 12: "#..." }
 * }
 * ```
 */
export type Scale = {
  /** The original full color scale name from @radix-ui/colors */
  fullName: string;

  /** Array of parsed tags from the full name */
  tags: string[];

  /** The base color name (first tag) */
  name: string;

  /** Dot-notation path built from tags (used for token references) */
  path: string;

  /** Whether this is a dark mode variant */
  dark: boolean;

  /** Whether this is an alpha (transparency) variant */
  alpha: boolean;

  /** Whether this is a DCI-P3 color gamut variant */
  p3: boolean;

  /** All 12 color shades for this scale mapped by index (1-12) */
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

/**
 * Extracts tags from a Radix color scale full name.
 *
 * Splits the name on uppercase letters and numbers, respecting reserved tags like "P3".
 * Converts all tags to lowercase for consistent token naming.
 *
 * @example
 * ```ts
 * getScaleTags("amberdarkp3a") // => ["amber", "dark", "p3", "a"]
 * getScaleTags("slateA") // => ["slate", "a"]
 * getScaleTags("blue") // => ["blue"]
 * ```
 *
 * @internal
 */
export function getScaleTags(fullName: string): string[] {
  return fullName
    .split(SCALE_TAGS_REGEX)
    .filter(Boolean)
    .map((x) => x.toLowerCase());
}

/**
 * Builds a dot-notation path from scale tags.
 *
 * @example
 * ```ts
 * getScalePath(["amber", "dark", "p3", "a"]) // => "amber.dark.p3.a"
 * getScalePath(["blue"]) // => "blue"
 * ```
 *
 * @internal
 */
export function getScalePath(tags: string[]): string {
  return tags.join(".");
}

/**
 * Checks if a scale is an alpha (transparency) variant.
 *
 * @internal
 */
export function isScaleAlpha(tags: string[]): boolean {
  return tags.includes("a");
}

/**
 * Checks if a scale is a dark mode variant.
 *
 * @internal
 */
export function isScaleDark(tags: string[]): boolean {
  return tags.includes("dark");
}

/**
 * Checks if a scale is a DCI-P3 color gamut variant.
 *
 * @internal
 */
export function isScaleP3(tags: string[]): boolean {
  return tags.includes("p3");
}

/**
 * Gets the base color name from scale tags (always the first tag).
 *
 * @internal
 */
export function getScaleName(tags: string[]): string {
  return tags[0];
}

/**
 * Extracts the 12 color shades from a Radix color scale object.
 *
 * Maps the color values to their shade indices (1-12), which correspond to
 * the brightness/saturation levels defined by Radix UI.
 *
 * @example
 * ```ts
 * getScaleShades({
 *   0: "#fef3c7",
 *   1: "#fef3c7",
 *   2: "#fde68a",
 *   // ... more shades
 * })
 * // => { 1: "#fef3c7", 2: "#fdef68a", ..., 12: "#78350f" }
 * ```
 *
 * @internal
 */
export function getScaleShades(value: any): Scale["shades"] {
  return Object.assign(
    {},
    ...Object.values(value).map((shade, i) => ({
      [++i]: shade,
    })),
  ) as Scale["shades"];
}

/**
 * Retrieves and parses all available Radix color scales.
 *
 * Each imported color from @radix-ui/colors is parsed into a Scale object
 * containing metadata and all 12 color shades.
 *
 * @param lightPrefix If true, adds a "light" tag to non-dark scales.
 *                    Used internally when dark mode is enabled to create
 *                    light variant tokens.
 * @returns An array of all parsed color scales
 *
 * @example
 * ```ts
 * // Get all scales without light prefix
 * const scales = getScales();
 *
 * // Get all scales with light prefix (for dark mode)
 * const scales = getScales(true);
 * ```
 *
 * @internal
 */
export function getScales(lightPrefix?: boolean): Scale[] {
  return Object.entries(colors).map(([fullName, value]) => {
    const tags = getScaleTags(fullName);
    const dark = isScaleDark(tags);

    // If the scale isn't dark, add "light" tag at position 1 for proper nesting
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

import { type Scale, getScales } from "./radix-colors";
import { type RadixColorScales } from "./types";
import { keysToObj, mergeObjs } from "./utils";

/**
 * Represents the related scales for building a token value.
 * Used internally to find dark, P3, and light scale variants.
 */
interface RelatedScales {
  current: Scale;
  light?: Scale;
  dark?: Scale;
  p3?: Scale;
}

/**
 * Finds the dark scale variant for a given base scale.
 * The dark scale must have the same name, alpha, and p3 settings as the base scale.
 *
 * @param scale The base scale to find the dark variant for
 * @param scales All available scales
 * @returns The dark scale if found, undefined otherwise
 *
 * @internal
 */
export function findDarkScale(
  scale: Scale,
  scales: Scale[],
): Scale | undefined {
  return scales.find(
    (x) =>
      x.name === scale.name &&
      x.alpha === scale.alpha &&
      x.p3 === scale.p3 &&
      x.dark,
  );
}

/**
 * Finds the P3 (DCI-P3) scale variant for a given base scale.
 * The P3 scale must have the same name, alpha, and dark settings as the base scale.
 *
 * @param scale The base scale to find the P3 variant for
 * @param scales All available scales
 * @returns The P3 scale if found, undefined otherwise
 *
 * @internal
 */
export function findP3Scale(scale: Scale, scales: Scale[]): Scale | undefined {
  return scales.find(
    (x) =>
      x.name === scale.name &&
      x.alpha === scale.alpha &&
      x.dark === scale.dark &&
      x.p3,
  );
}

/**
 * Finds the light variant of a scale (when dark mode is enabled).
 * The light scale has a "light" tag and matches the name, alpha, dark, and p3 settings.
 *
 * @param scale The base scale to find the light variant for
 * @param scales All available scales
 * @returns The light scale if found, undefined otherwise
 *
 * @internal
 */
export function findLightScale(
  scale: Scale,
  scales: Scale[],
): Scale | undefined {
  return scales.find(
    (x) =>
      x.name === scale.name &&
      x.alpha === scale.alpha &&
      x.dark === scale.dark &&
      x.p3 === scale.p3 &&
      x.tags.includes("light"),
  );
}

/**
 * Finds all related scales for a given base scale.
 * Searches for dark, P3, and light variants based on the current scale properties.
 *
 * @param scale The base scale to find related variants for
 * @param scales All available scales
 * @param enableDarkMode Whether dark mode is enabled
 * @param enableAutoP3 Whether automatic P3 switching is enabled
 * @returns An object containing the current scale and any found related scales
 *
 * @internal
 */
export function findRelatedScales(
  scale: Scale,
  scales: Scale[],
  enableDarkMode: boolean,
  enableAutoP3: boolean,
): RelatedScales {
  const result: RelatedScales = { current: scale };

  // Find dark scale if dark mode is enabled and this is not a dark scale
  if (enableDarkMode && !scale.dark && !scale.tags.includes("light")) {
    result.dark = findDarkScale(scale, scales);
  }

  // Find P3 scale if autoP3 is enabled and this is not a P3 scale
  // Only if we didn't find a dark scale (dark mode takes precedence)
  if (!result.dark && enableAutoP3 && !scale.p3) {
    result.p3 = findP3Scale(scale, scales);
  }

  // Find light scale if we found a dark scale
  if (result.dark) {
    result.light = scale.tags.includes("light")
      ? scale
      : findLightScale(scale, scales);
  }

  return result;
}

/**
 * Builds a token value for a specific shade of a color.
 * Creates either a simple value or a conditional value structure based on available variants.
 *
 * @param shade The shade value (the actual CSS color)
 * @param shadeIndex The shade index (1-12)
 * @param relatedScales The related scales (dark, P3, light variants) for this color
 * @returns The token value (either a string or an object with conditional variants)
 *
 * @internal
 *
 * @example
 * // Simple color without variants
 * buildTokenValue("#0000ff", 1, { current: blueScale }) => "#0000ff"
 *
 * // Color with dark mode support
 * buildTokenValue("#e0e6ff", 1, { current: blueScale, dark: blueDarkScale, light: blueLightScale })
 * // => { base: "{colors.blue.light.1}", _dark: "{colors.blue.dark.1}" }
 *
 * // Color with P3 variant
 * buildTokenValue("#0000ff", 1, { current: blueScale, p3: blueP3Scale })
 * // => { base: "#0000ff", _p3: "{colors.blue.p3.1}" }
 */
export function buildTokenValue(
  shade: string,
  shadeIndex: string | number,
  relatedScales: RelatedScales,
): any {
  // If there's a dark scale, create conditional dark/light values
  if (relatedScales.dark) {
    return {
      base: `{colors.${relatedScales.light?.path}.${shadeIndex}}`,
      _dark: `{colors.${relatedScales.dark.path}.${shadeIndex}}`,
    };
  }

  // If there's a P3 scale, create conditional P3 value
  if (relatedScales.p3) {
    return {
      base: shade,
      _p3: `{colors.${relatedScales.p3.path}.${shadeIndex}}`,
    };
  }

  // No variants, return the simple shade value
  return shade;
}

/**
 * Generates semantic tokens for all Radix colors based on configuration options.
 *
 * This function creates a nested token structure where colors are organized by their variants.
 * For example, a blue color might create tokens like:
 * - `colors.blue.1` through `colors.blue.12`
 * - `colors.blue.dark.1` through `colors.blue.dark.12` (when dark mode is enabled)
 * - `colors.blue.dark.p3.1` (when P3 variant exists)
 *
 * @param darkMode Whether dark mode support should be enabled
 * @param autoP3 Whether automatic P3 color gamut switching should be enabled
 * @param colorScales Optional array of color scale names to include. If empty or not provided, all scales are included.
 * @returns A nested object of semantic token definitions for use in PandaCSS
 *
 * @example
 * ```ts
 * // Get all color tokens with dark mode enabled
 * const tokens = getSemanticTokens(true, false, []);
 *
 * // Get only gray and blue with P3 support
 * const tokens = getSemanticTokens(false, true, ["gray", "blue"]);
 * ```
 *
 * @internal
 */
export function getSemanticTokens(
  darkMode?: boolean,
  autoP3?: boolean,
  colorScales: RadixColorScales = [],
): Record<string, any> {
  // Get all available scales, including light variants if dark mode is enabled
  let scales = getScales(darkMode);

  // When dark mode is enabled, also include the light variants of base colors
  // These are used to create the _dark conditional values
  if (darkMode) {
    scales = scales.concat(getScales(false).filter((x) => !x.dark));
  }

  // Filter scales by requested color scales
  const filteredScales = scales.filter((scale) =>
    shouldIncludeScale(scale, colorScales),
  );

  // Generate tokens for each filtered scale
  return mergeObjs(
    {},
    ...filteredScales.map((scale) =>
      generateScaleTokens(scale, filteredScales, darkMode, autoP3),
    ),
  );
}

/**
 * Determines whether a scale should be included based on the colorScales filter.
 *
 * If colorScales is empty or not provided, all scales are included.
 * Otherwise, only scales whose path matches or starts with one of the provided
 * colorScale paths are included. This allows filtering by any level of specificity.
 *
 * @param scale The scale to check
 * @param colorScales The list of color scale paths to include (e.g., "amber", "blue.dark", "gray.p3")
 * @returns True if the scale should be included, false otherwise
 *
 * @example
 * ```ts
 * // Scale with path "amber.dark.p3" would be included by:
 * shouldIncludeScale(scale, ["amber"]) // ✓ matches prefix "amber"
 * shouldIncludeScale(scale, ["amber.dark"]) // ✓ matches prefix "amber.dark"
 * shouldIncludeScale(scale, ["amber.dark.p3"]) // ✓ exact match
 * shouldIncludeScale(scale, ["amber.dark.p3.a"]) // ✓ exact match
 * shouldIncludeScale(scale, ["blue"]) // ✗ no match
 * ```
 *
 * @internal
 */
function shouldIncludeScale(
  scale: Scale,
  colorScales: RadixColorScales,
): boolean {
  // If no filter is specified, include all scales
  if (colorScales.length === 0) {
    return true;
  }

  // Include the scale if its path matches or starts with any provided colorScale path
  // Use startsWith with a dot check to avoid "amber" matching "amberA"
  return colorScales.some((colorScale) => {
    // Exact match or prefix match (with dot boundary)
    return scale.path === colorScale || scale.path.startsWith(colorScale + ".");
  });
}

/**
 * Generates semantic token definitions for a single color scale.
 *
 * Creates tokens for each shade (1-12) of the color, with appropriate variants
 * (dark, P3) if applicable based on the configuration and available scales.
 *
 * @param scale The color scale to generate tokens for
 * @param allScales All available scales (used to find related variants)
 * @param enableDarkMode Whether dark mode is enabled
 * @param enableAutoP3 Whether auto P3 is enabled
 * @returns A nested object representing the token structure for this scale
 *
 * @internal
 */
function generateScaleTokens(
  scale: Scale,
  allScales: Scale[],
  enableDarkMode: boolean = false,
  enableAutoP3: boolean = false,
): Record<string, any> {
  // Find related scale variants (dark, light, P3)
  const relatedScales = findRelatedScales(
    scale,
    allScales,
    enableDarkMode,
    enableAutoP3,
  );

  // Generate token entries for each shade (1-12)
  const shadeTokens = Object.entries(scale.shades).map(
    ([shadeIndex, color]) => {
      const tokenValue = buildTokenValue(color, shadeIndex, relatedScales);

      return {
        [shadeIndex]: {
          value: tokenValue,
        },
      };
    },
  );

  // Merge all shade tokens into a single object and convert to nested structure
  const mergedShades = mergeObjs({}, ...shadeTokens);

  return keysToObj(scale.tags, mergedShades);
}

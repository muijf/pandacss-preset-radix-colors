import { definePreset } from "@pandacss/dev";
import type { Preset, Conditions } from "@pandacss/types";
import { getSemanticTokens } from "./semantic-tokens";
import { getScales } from "./radix-colors";
import {
  type DarkModeConfig,
  type PresetOptions,
  type RadixColorScales,
} from "./types";
import { name } from "../package.json";

const DEFAULT_DARK_MODE_CONDITION = ".dark &";

/**
 * Represents normalized dark mode configuration.
 *
 * @internal
 */
interface NormalizedDarkModeConfig {
  enabled: boolean;
  condition?: string;
}

/**
 * Generates PandaCSS condition definitions for dark mode and P3 color gamut support.
 *
 * Conditions are CSS selectors or media queries that PandaCSS uses to create
 * conditional style modifiers (e.g., `_dark`, `_p3`).
 *
 * @param darkModeCondition Optional CSS condition for dark mode (e.g., `.dark &`).
 *                          If provided, enables the `_dark` modifier in style objects.
 * @returns An object of condition definitions for PandaCSS to extend
 *
 * @example
 * ```ts
 * // With dark mode enabled
 * getConditions(".dark &")
 * // => { dark: ".dark &", p3: "@media (color-gamut: p3)" }
 *
 * // Without dark mode
 * getConditions()
 * // => { p3: "@media (color-gamut: p3)" }
 * ```
 *
 * @internal
 */
function getConditions(darkModeCondition?: string): Conditions {
  const conditions: Conditions = {};

  // Add dark mode condition if provided
  if (darkModeCondition) {
    conditions["dark"] = darkModeCondition;
  }

  // Always add P3 color gamut condition for wide color support
  conditions["p3"] = "@media (color-gamut: p3)";

  return conditions;
}

/**
 * Normalizes dark mode configuration into a consistent format.
 *
 * Handles the following input formats:
 * - `false` or `undefined` → disabled
 * - `true` → enabled with default condition
 * - `{ condition: "..." }` → enabled with custom condition
 * - `{ condition: "...", enabled: false }` → disabled (takes precedence)
 *
 * @param darkModeOption The dark mode option from PresetOptions
 * @returns Normalized dark mode configuration
 *
 * @internal
 */
function normalizeDarkMode(
  darkModeOption?: boolean | DarkModeConfig,
): NormalizedDarkModeConfig {
  // Not provided or false → disabled
  if (!darkModeOption) {
    return { enabled: false };
  }

  // Simple boolean true → enabled with default condition
  if (typeof darkModeOption === "boolean") {
    return { enabled: true, condition: DEFAULT_DARK_MODE_CONDITION };
  }

  // Object configuration → use provided settings
  const enabled = darkModeOption.enabled ?? true;
  return {
    enabled,
    condition: darkModeOption.condition,
  };
}

/**
 * Validates the colorScales option to ensure at least some scales will be matched.
 *
 * This is a soft validation that warns if provided color scale paths don't match
 * any actual color scales. It allows path prefixes at any level (e.g., "amber",
 * "amber.dark", "amber.dark.p3") and checks if they would match any available scales.
 *
 * @param colorScales The color scale paths to validate
 *
 * @internal
 */
function validateColorScales(colorScales?: RadixColorScales): void {
  if (!colorScales || colorScales.length === 0) {
    return;
  }

  // Get all actual scale paths from the radix colors
  const scales = getScales();

  // Check each provided colorScale to see if it would match any actual scales
  const unmatchedScales = colorScales.filter((colorScale) => {
    // A colorScale matches if:
    // 1. It exactly matches a scale path, OR
    // 2. It's a prefix of any scale path (with dot boundary)
    const isValidPrefix = scales.some(
      (scale) =>
        scale.path === colorScale || scale.path.startsWith(colorScale + "."),
    );
    return !isValidPrefix;
  });

  if (unmatchedScales.length > 0) {
    console.warn(
      `[pandacss-preset-radix-colors] Color scale paths don't match any available scales: ${unmatchedScales.join(", ")}. ` +
        `Valid examples: "amber", "blue.dark", "gray.p3", "red.dark.a". ` +
        `Available base colors: ${Array.from(new Set(scales.map((s) => s.name))).join(", ")}.`,
    );
  }
}

/**
 * Creates a PandaCSS preset with Radix Colors integration.
 *
 * This preset brings all Radix UI colors into PandaCSS with support for:
 * - Dark mode with automatic light/dark variants
 * - DCI-P3 wide color gamut support
 * - Filtered color scales to reduce bundle size
 * - Customizable dark mode conditions
 *
 * @param options Configuration options for the preset
 * @returns A PandaCSS preset definition
 *
 * @example
 * ```ts
 * import { defineConfig } from "@pandacss/dev";
 * import radixColorsPreset from "pandacss-preset-radix-colors";
 *
 * export default defineConfig({
 *   presets: [
 *     radixColorsPreset({
 *       darkMode: true,
 *       autoP3: true,
 *       colorScales: ["gray", "blue", "red"],
 *     }),
 *     "@pandacss/preset-panda",
 *   ],
 * });
 * ```
 */
export function createPreset(options?: PresetOptions): Preset {
  // Normalize and validate options
  const darkModeConfig = normalizeDarkMode(options?.darkMode);
  validateColorScales(options?.colorScales);

  return definePreset({
    name,
    conditions: {
      extend: getConditions(
        darkModeConfig.enabled ? darkModeConfig.condition : undefined,
      ),
    },
    theme: {
      extend: {
        semanticTokens: {
          colors: getSemanticTokens(
            darkModeConfig.enabled,
            options?.autoP3,
            options?.colorScales,
          ),
        },
      },
    },
  });
}

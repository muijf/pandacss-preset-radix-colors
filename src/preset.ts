import { definePreset } from "@pandacss/dev";
import type { Preset } from "@pandacss/types";
import { getSemanticTokens } from "./semantic-tokens";
import { getConditions } from "./conditions";
import { RadixColorScales } from "./types";

const DEFAULT_AUTO_P3 = false;
const DEFAULT_DARK_MODE_CONDITION = ".dark &";
const DEFAULT_DARK_MODE = false;
const DEFAULT_COLOR_SCALES = [];
const DEFAULT_NAME = "radix-colors";

/**
 * Options for the preset.
 */
export interface PresetOptions {
  /**
   * The name of the preset.
   * @default "radix-colors"
   */
  name?: string;
  /**
   * Enable dark mode. If `true`, dark mode will
   * be enabled using the default condition.
   */
  darkMode?:
    | boolean
    | {
        /**
         * The condition used to conditionally style
         * when dark mode is enabled.
         *
         * You can then use `_dark` modifier inside of
         * your style objects.
         *
         * @default `.dark &`
         */
        condition: string;
      };
  /**
   * Automatically choose to use the DCI-P3 variant
   * of a color if available when the color gamut
   * is supported using the p3 condition
   * (`@media (color-gamut: p3)`)
   */
  autoP3?: boolean;
  /**
   * Specify Radix color scales to include. All sets are included by default.
   * @example `colorScales: ["gray", "blue"]`
   */
  colorScales?: RadixColorScales;
}

/**
 * Create a new preset using the provided options.
 *
 * @param options The preset options
 * @returns The preset
 */
export function createPreset(options?: PresetOptions): Preset {
  const name = options?.name ?? DEFAULT_NAME;

  const darkMode = options?.darkMode ?? DEFAULT_DARK_MODE;
  const isDarkMode = typeof darkMode === "boolean" ? darkMode : darkMode.condition !== undefined;

  const darkModeCondition = isDarkMode
    ? typeof darkMode === "object"
      ? darkMode.condition
      : DEFAULT_DARK_MODE_CONDITION
    : undefined;

  const autoP3 = options?.autoP3 ?? DEFAULT_AUTO_P3;
  
  const colorScales = options?.colorScales ?? DEFAULT_COLOR_SCALES;

  return definePreset({
    name,
    conditions: {
      extend: getConditions(darkModeCondition, autoP3),
    },
    theme: {
      extend: {
        semanticTokens: {
          colors: getSemanticTokens(
            colorScales,
            isDarkMode,
            autoP3,
          ),
        },
      },
    },
  });
}

import { definePreset } from "@pandacss/dev";
import type { Preset } from "@pandacss/types";
import { getSemanticTokens } from "./semantic-tokens";
import { getConditions } from "./conditions";
import { type RadixColorScales } from "./types";
import { name } from "../package.json";

const DEFAULT_DARK_MODE_CONDITION = ".dark &";

/**
 * Options for the preset.
 */
export interface PresetOptions {
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
  const darkMode = options?.darkMode ?? false;

  // Get the dark mode condition if dark mode is enabled
  const darkModeCondition = darkMode
    ? typeof darkMode === "object"
      ? darkMode.condition
      : DEFAULT_DARK_MODE_CONDITION
    : undefined;

  return definePreset({
    name,
    conditions: {
      extend: getConditions(darkModeCondition),
    },
    theme: {
      extend: {
        semanticTokens: {
          colors: getSemanticTokens(
            !!darkMode,
            options?.autoP3,
            options?.colorScales,
          ),
        },
      },
    },
  });
}

import { Preset } from "@pandacss/types";
import * as colors from "@radix-ui/colors";
/**
* Helper type to transform a color scale name to its path format.
* Splits on "Dark", "P3", and "A", then joins with dots.
*/
type TransformScaleName<T extends string> = T extends `${infer Prefix}Dark${infer Rest}` ? `${Lowercase<Prefix>}.dark${TransformScaleName<Rest>}` : T extends `${infer Prefix}P3${infer Rest}` ? `${Lowercase<Prefix>}.p3${TransformScaleName<Rest>}` : T extends `${infer Prefix}A${infer Rest}` ? `${Lowercase<Prefix>}.a${TransformScaleName<Rest>}` : Lowercase<T>;
/**
* Helper type to extract and transform all color scale keys.
*/
type ColorScaleKeys = { [K in keyof typeof colors as K extends string ? K extends `${string}default${string}` ? never : TransformScaleName<K> : never] : true };
/**
* All available Radix color scales.
* Automatically derived from @radix-ui/colors with full type safety and autocomplete.
*/
declare const radixColorScales: Array<keyof ColorScaleKeys>;
/**
* A single Radix color scale path.
*
* @example "amber", "blue.dark", "gray.p3", "red.dark.a"
*/
type RadixColorScale = (typeof radixColorScales)[number];
/**
* An array of Radix color scale paths for filtering.
*/
type RadixColorScales = RadixColorScale[];
/**
* Configuration for dark mode support.
*/
interface DarkModeConfig {
	/**
	* The CSS condition/selector used to apply dark mode styles.
	* This condition will be used as a modifier in your style objects (e.g., `_dark`).
	*
	* @example `.dark &` - Applies when an ancestor has the `.dark` class
	* @example `[data-theme='dark'] &` - Applies when parent has `data-theme="dark"`
	* @example `@media (prefers-color-scheme: dark) &` - Applies based on system preference
	*
	* @default `.dark &`
	*/
	condition: string;
	/**
	* Whether dark mode is enabled. Set to `false` to disable dark mode functionality.
	* This allows you to easily toggle dark mode on/off programmatically.
	*
	* @default true
	*/
	enabled?: boolean;
}
/**
* Configuration options for the Radix Colors preset.
*/
interface PresetOptions {
	/**
	* Enable dark mode support. Colors will generate both light and dark variants.
	* When enabled, a `light` variant will be automatically added to ensure colors
	* can be kept light even in dark mode contexts.
	*
	* @example
	* ```ts
	* // Use default dark mode condition (.dark &)
	* darkMode: true
	*
	* // Use custom dark mode condition
	* darkMode: { condition: "[data-theme='dark'] &" }
	*
	* // Disable dark mode programmatically
	* darkMode: { condition: ".dark &", enabled: false }
	* ```
	*/
	darkMode?: boolean | DarkModeConfig;
	/**
	* Automatically use DCI-P3 color variants when the user's device supports wide color gamut.
	* This will conditionally apply the P3 color variant using the `_p3` modifier when
	* the browser supports it via `@media (color-gamut: p3)`.
	*
	* When both dark mode and autoP3 are enabled, tokens will intelligently choose
	* the appropriate variant based on both conditions.
	*
	* @default false
	*
	* @example
	* ```ts
	* autoP3: true  // Uses P3 variant when available
	* ```
	*/
	autoP3?: boolean;
	/**
	* Specify which Radix color scales to include in the preset using path-based filtering.
	* This can be used to reduce the generated CSS size by including only the colors you need.
	* All scales are included by default when not specified.
	*
	* You can filter at any level of specificity:
	* - Base colors: "amber", "blue", "gray"
	* - Dark variants: "amber.dark", "blue.dark"
	* - Alpha variants: "gray.a", "slate.dark.a"
	* - P3 variants: "blue.p3", "red.dark.p3"
	* - Specific variants: "amber.dark.p3.a"
	*
	* All variants beneath your specified path will be included automatically.
	* For example, providing "amber.dark" will include "amber.dark", "amber.dark.a",
	* "amber.dark.p3", and "amber.dark.p3.a".
	*
	* @default [] (includes all scales)
	*
	* @example
	* ```ts
	* // Include only gray and blue colors with all their variants
	* colorScales: ["gray", "blue"]
	*
	* // Include only dark variants of amber and blue
	* colorScales: ["amber.dark", "blue.dark"]
	*
	* // Include only P3 colors and dark P3 colors
	* colorScales: ["gray.p3", "blue.dark.p3"]
	*
	* // Mix different specificity levels
	* colorScales: ["gray", "blue.dark", "red.p3"]
	* ```
	*/
	colorScales?: RadixColorScales;
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
* defineConfig({
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
declare function createPreset(options?: PresetOptions): Preset;
export { radixColorScales, createPreset as default, RadixColorScales, RadixColorScale, PresetOptions, DarkModeConfig };

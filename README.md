[![Downloads][npm-shield]][npm-url]
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

# 🐼 PandaCSS preset for Radix Colors

Brings [Radix Colors](https://www.radix-ui.com/colors) to [🐼 PandaCSS](https://panda-css.com/)

## Installation

```bash
npm install --save-dev pandacss-preset-radix-colors @radix-ui/colors
```

**Peer Dependencies:**
- `@pandacss/dev` (>=0.0.1)
- `@radix-ui/colors` (>=0.1.0)

## Usage

Add the preset to your PandaCSS configuration (`panda.config.ts`)

```ts
import { defineConfig } from "@pandacss/dev";

// Import the preset. The name can be anything you want
import radixColorsPreset from "pandacss-preset-radix-colors";

export default defineConfig({
  presets: [
    radixColorsPreset(),
    // Re-add the panda preset if you want to keep
    // the default keyframes, breakpoints, tokens
    // and textStyles provided by PandaCSS
    "@pandacss/preset-panda",
  ],
});
```

### Token Structure

The tokens use a dot-notation path structure based on how Radix color scale names are parsed. Color names are split on every capital letter and number, creating nested token paths.

**Token Path Examples:**
- Base colors: `colors.blue.1`, `colors.blue.2`, ..., `colors.blue.12`
- Alpha variants: `colors.blue.a.1`, `colors.blue.a.2`, ..., `colors.blue.a.12`
- Dark variants: `colors.blue.dark.1`, `colors.blue.dark.2`, ..., `colors.blue.dark.12`
- Dark alpha: `colors.blue.dark.a.1`, `colors.blue.dark.a.2`, ..., `colors.blue.dark.a.12`
- P3 variants: `colors.blue.p3.1`, `colors.blue.p3.2`, ..., `colors.blue.p3.12`
- Dark P3: `colors.blue.dark.p3.1`, `colors.blue.dark.p3.2`, ..., `colors.blue.dark.p3.12`
- Dark P3 alpha: `colors.blue.dark.p3.a.1`, `colors.blue.dark.p3.a.2`, ..., `colors.blue.dark.p3.a.12`
- Light variants (when dark mode enabled): `colors.blue.light.1`, `colors.blue.light.2`, ..., `colors.blue.light.12`

**Shade Range:** All color scales have 12 shades (1-12), where 1 is the lightest and 12 is the darkest.

**Conditional Tokens:** When dark mode or P3 support is enabled, tokens automatically use conditional values:
- With dark mode: `{ base: "{colors.blue.light.1}", _dark: "{colors.blue.dark.1}" }`
- With P3: `{ base: "#color", _p3: "{colors.blue.p3.1}" }`
- Dark mode takes precedence over P3 when both are enabled

## Options

### Dark mode

Enable dark mode support to automatically generate both light and dark color variants. When enabled, colors will automatically switch based on your specified condition.

**Configuration Options:**

1. **Boolean (simple):** Enable with default condition `.dark &`
   ```ts
   radixColorsPreset({
     darkMode: true,
   })
   ```

2. **Object with custom condition:** Use a custom CSS selector or media query
   ```ts
   radixColorsPreset({
     darkMode: {
       condition: "[data-theme='dark'] &", // Data attribute
       // or
       // condition: "@media (prefers-color-scheme: dark) &", // System preference
     },
   })
   ```

3. **Object with enabled flag:** Programmatically disable while keeping condition
   ```ts
   radixColorsPreset({
     darkMode: {
       condition: ".dark &",
       enabled: false, // Disables dark mode functionality
     },
   })
   ```

**Default Condition:** `.dark &` (applies when an ancestor element has the `.dark` class)

**How it works:**
- When dark mode is enabled, base colors like `colors.slate.1` or `colors.slate.a.1` automatically use conditional values that switch to `colors.slate.dark.1` and `colors.slate.dark.a.1` when your condition is met
- A `light` variant (e.g., `colors.slate.light.1`) is automatically added, allowing you to keep colors light even in dark mode contexts
- The `_dark` modifier is added to PandaCSS conditions, which you can use in style objects: `{ bg: "slate.1", _dark: { bg: "slate.dark.1" } }`

[Learn more about PandaCSS conditions here](https://panda-css.com/docs/customization/conditions).

### Color scales

Filter which Radix color scales to include to reduce bundle size. Uses path-based hierarchical filtering - specifying a path includes all variants beneath it.

**Default:** All color scales are included when `colorScales` is not provided or is an empty array.

**Hierarchical Filtering:**
When you specify a color scale path, all variants beneath that path are automatically included:
- `"amber"` → includes `amber`, `amber.dark`, `amber.a`, `amber.dark.a`, `amber.p3`, `amber.dark.p3`, `amber.p3.a`, `amber.dark.p3.a`
- `"amber.dark"` → includes `amber.dark`, `amber.dark.a`, `amber.dark.p3`, `amber.dark.p3.a`
- `"amber.dark.p3"` → includes `amber.dark.p3`, `amber.dark.p3.a`
- `"amber.dark.p3.a"` → includes only `amber.dark.p3.a`

**Examples:**

```ts
// Include only gray and blue with all their variants
radixColorsPreset({
  colorScales: ["gray", "blue"],
})

// Include only dark variants of amber and blue
radixColorsPreset({
  colorScales: ["amber.dark", "blue.dark"],
})

// Include only alpha variants
radixColorsPreset({
  colorScales: ["gray.a", "slate.dark.a"],
})

// Include only P3 colors and dark P3 colors
radixColorsPreset({
  colorScales: ["gray.p3", "blue.dark.p3"],
})

// Mix different specificity levels
radixColorsPreset({
  colorScales: ["gray", "blue.dark", "red.p3"],
})

// Include all scales (default behavior)
radixColorsPreset({
  colorScales: [], // or omit the option entirely
})
```

**Validation:** Invalid color scale paths will trigger console warnings during preset initialization, helping you catch typos or incorrect paths early.

### Auto DCI-P3

Automatically use DCI-P3 wide color gamut variants when the user's device supports it. P3 colors provide a wider range of colors for displays that support the DCI-P3 color space.

**Default:** `false` (P3 variants are not automatically applied)

**How it works:**
- When `autoP3: true`, the preset adds a `p3` condition (`@media (color-gamut: p3)`) to PandaCSS
- Color tokens automatically use P3 variants when the browser supports wide color gamut
- The `_p3` modifier becomes available in your style objects
- P3 condition is always added to conditions, even when `autoP3` is `false` (for manual use)

**Interaction with Dark Mode:**
When both dark mode and autoP3 are enabled, dark mode takes precedence. Tokens will use dark variants first, and P3 variants are only applied when dark mode is not active.

```ts
radixColorsPreset({
  autoP3: true,
})
```

**Example usage in styles:**
```ts
// Automatic P3 switching (when autoP3: true)
{ bg: "blue.5" } // Uses blue.5 normally, blue.p3.5 on P3 displays

// Manual P3 override
{ bg: "blue.5", _p3: { bg: "blue.p3.5" } }
```

## TypeScript Support

The preset is written in TypeScript and provides full type safety and autocomplete support.

### Exported Types

```ts
import type {
  PresetOptions,      // Main configuration interface
  DarkModeConfig,     // Dark mode configuration interface
  RadixColorScale,    // Single color scale path type (e.g., "blue.dark.p3")
  RadixColorScales,   // Array of color scale paths type
} from "pandacss-preset-radix-colors";
```

### Type-Safe Configuration

```ts
import { defineConfig } from "@pandacss/dev";
import radixColorsPreset, { type PresetOptions } from "pandacss-preset-radix-colors";

const options: PresetOptions = {
  darkMode: {
    condition: "[data-theme='dark'] &",
  },
  autoP3: true,
  colorScales: ["gray", "blue"], // TypeScript will autocomplete valid paths
};

export default defineConfig({
  presets: [radixColorsPreset(options), "@pandacss/preset-panda"],
});
```

### Color Scale Autocomplete

Use the `radixColorScales` constant for autocomplete when filtering colors:

```ts
import { radixColorScales } from "pandacss-preset-radix-colors";

// Get all available color scale paths
const allScales = radixColorScales; // Type: readonly RadixColorScale[]

// Use in configuration with full autocomplete
radixColorsPreset({
  colorScales: ["gray", "blue"], // TypeScript knows all valid paths
})
```

## Examples

### Basic Setup

Minimal configuration with all defaults:

```ts
import { defineConfig } from "@pandacss/dev";
import radixColorsPreset from "pandacss-preset-radix-colors";

export default defineConfig({
  presets: [radixColorsPreset(), "@pandacss/preset-panda"],
});
```

### With Dark Mode (Boolean)

Enable dark mode with default condition:

```ts
radixColorsPreset({
  darkMode: true, // Uses default ".dark &" condition
})
```

### With Dark Mode (Custom Condition)

Use a custom condition for dark mode:

```ts
radixColorsPreset({
  darkMode: {
    condition: "[data-theme='dark'] &", // Data attribute
  },
})

// Or use system preference
radixColorsPreset({
  darkMode: {
    condition: "@media (prefers-color-scheme: dark) &",
  },
})
```

### With P3 Support

Enable automatic P3 color gamut switching:

```ts
radixColorsPreset({
  autoP3: true,
})
```

### With Color Filtering (Base Colors)

Include only specific base colors and all their variants:

```ts
radixColorsPreset({
  colorScales: ["gray", "blue"], // Includes all variants of gray and blue
})
```

### With Color Filtering (Specific Variants)

Include only specific color variants:

```ts
radixColorsPreset({
  colorScales: ["amber.dark", "blue.p3"], // Only dark amber and P3 blue variants
})
```

### Combined Options

Use multiple options together:

```ts
radixColorsPreset({
  darkMode: {
    condition: "[data-theme='dark'] &",
  },
  autoP3: true,
  colorScales: ["gray", "blue", "red"],
})
```

### TypeScript Usage

Full TypeScript example with type imports:

```ts
import { defineConfig } from "@pandacss/dev";
import radixColorsPreset, {
  type PresetOptions,
  radixColorScales,
} from "pandacss-preset-radix-colors";

const presetOptions: PresetOptions = {
  darkMode: true,
  autoP3: true,
  colorScales: ["gray", "blue"] as const,
};

export default defineConfig({
  presets: [
    radixColorsPreset(presetOptions),
    "@pandacss/preset-panda",
  ],
});
```

## Development

### Testing

The project uses [Bun](https://bun.sh/) test runner for testing. The test suite covers all the main functionality of the preset.

To run the tests:

```bash
# Run tests once
bun test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage report
bun run test:coverage
```

## Attributions

- [Radix](https://github.com/radix-ui) team for creating the wonderfully crafted colors
- [Chakra](https://github.com/chakra-ui) team for creating [🐼 PandaCSS](https://panda-css.com/)

[contributors-shield]: https://img.shields.io/github/contributors/muijf/pandacss-preset-radix-colors.svg?style=for-the-badge
[contributors-url]: https://github.com/muijf/pandacss-preset-radix-colors/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/muijf/pandacss-preset-radix-colors.svg?style=for-the-badge
[forks-url]: https://github.com/muijf/pandacss-preset-radix-colors/network/members
[stars-shield]: https://img.shields.io/github/stars/muijf/pandacss-preset-radix-colors.svg?style=for-the-badge
[stars-url]: https://github.com/muijf/pandacss-preset-radix-colors/stargazers
[issues-shield]: https://img.shields.io/github/issues/muijf/pandacss-preset-radix-colors.svg?style=for-the-badge
[issues-url]: https://github.com/muijf/pandacss-preset-radix-colors/issues
[license-shield]: https://img.shields.io/github/license/muijf/pandacss-preset-radix-colors.svg?style=for-the-badge
[license-url]: https://github.com/muijf/pandacss-preset-radix-colors/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/company/muijf/
[npm-shield]: https://img.shields.io/npm/dw/pandacss-preset-radix-colors?style=for-the-badge
[npm-url]: https://www.npmjs.com/package/pandacss-preset-radix-colors

<div align="center">

# 🐼 PandaCSS preset for Radix Colors

[![Downloads][npm-shield]][npm-url]
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

**Brings [Radix Colors](https://www.radix-ui.com/colors) to [🐼 PandaCSS](https://panda-css.com/)**

*A PandaCSS preset that integrates all Radix UI colors with support for dark mode, DCI-P3 wide color gamut, and customizable color scale filtering.*

[npm](https://www.npmjs.com/package/pandacss-preset-radix-colors) • [GitHub](https://github.com/muijf/pandacss-preset-radix-colors) • [Issues](https://github.com/muijf/pandacss-preset-radix-colors/issues)

</div>

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
  - [Dark mode](#dark-mode)
  - [Color scales](#color-scales)
  - [Auto DCI-P3](#auto-dci-p3)
- [Examples](#examples)
- [Development](#development)
- [Attributions](#attributions)

## Installation

```bash
npm install --save-dev pandacss-preset-radix-colors @radix-ui/colors
```

> [!NOTE]
> **Peer Dependencies:** This preset requires `@pandacss/dev` (>=0.0.1) and `@radix-ui/colors` (>=0.1.0) to be installed.

## Usage

Add the preset to your PandaCSS configuration (`panda.config.ts`)

```ts
import { defineConfig } from "@pandacss/dev";
import radixColorsPreset from "pandacss-preset-radix-colors";

export default defineConfig({
  presets: [
    radixColorsPreset(),
    "@pandacss/preset-panda", // Re-add to keep default PandaCSS tokens
  ],
});
```

> [!IMPORTANT]
> Don't forget to re-add `@pandacss/preset-panda` to your presets array if you want to keep PandaCSS's default keyframes, breakpoints, tokens, and text styles.

> [!NOTE]
> **Token Structure:** Colors use dot-notation paths (e.g., `colors.blue.1`, `colors.blue.dark.a.1`, `colors.blue.p3.1`). All scales have 12 shades (1-12). When dark mode or P3 is enabled, tokens automatically use conditional values. [Learn more about conditions](https://panda-css.com/docs/customization/conditions).

## Options

### Dark mode

Enable dark mode to automatically switch between light and dark color variants.

```ts
// Boolean: uses default ".dark &" condition
radixColorsPreset({ darkMode: true })

// Custom condition
radixColorsPreset({
  darkMode: {
    condition: "[data-theme='dark'] &", // or "@media (prefers-color-scheme: dark) &"
  },
})

// Disable programmatically
radixColorsPreset({
  darkMode: { condition: ".dark &", enabled: false },
})
```

When enabled, base colors automatically switch to dark variants when the condition is met. A `light` variant is also added to keep colors light in dark contexts.

### Color scales

> [!TIP]
> Filter color scales to reduce bundle size. This is especially useful if you only need a subset of colors.

Uses hierarchical path-based filtering—specifying a path includes all variants beneath it.

```ts
radixColorsPreset({
  colorScales: ["gray", "blue"], // Includes all variants of gray and blue
})

radixColorsPreset({
  colorScales: ["amber.dark", "blue.p3"], // Only dark amber and P3 blue variants
})
```

**Examples:** `"amber"` includes all variants; `"amber.dark"` includes `amber.dark.*`; `"amber.dark.p3"` includes `amber.dark.p3.*`. Omit or use `[]` to include all scales.

> [!WARNING]
> Invalid color scale paths will trigger console warnings during preset initialization. Double-check your paths to avoid typos.

### Auto DCI-P3

Automatically use DCI-P3 wide color gamut variants when supported.

> [!NOTE]
> When both dark mode and autoP3 are enabled, dark mode takes precedence. P3 variants are only applied when dark mode is not active.

```ts
radixColorsPreset({ autoP3: true })
```

The `_p3` modifier becomes available in style objects. P3 condition is always added (even when `autoP3: false`) for manual use.

## Examples

```ts
// Basic setup
radixColorsPreset()

// Combined options
radixColorsPreset({
  darkMode: { condition: "[data-theme='dark'] &" },
  autoP3: true,
  colorScales: ["gray", "blue", "red"],
})
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

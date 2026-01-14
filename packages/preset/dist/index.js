var import_node_module = require("node:module");
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// src/index.ts
var exports_src = {};
__export(exports_src, {
  radixColorScales: () => radixColorScales,
  default: () => createPreset
});
module.exports = __toCommonJS(exports_src);

// src/preset.ts
var import_dev = require("@pandacss/dev");

// src/radix-colors.ts
var colors = __toESM(require("@radix-ui/colors"));
var SCALE_RESERVED_TAGS = ["P3"];
var SCALE_TAGS_REGEX = new RegExp(`(${SCALE_RESERVED_TAGS.join("|")})|(?=[A-Z0-9])`, "g");
function getScaleTags(fullName) {
  return fullName.split(SCALE_TAGS_REGEX).filter(Boolean).map((x) => x.toLowerCase());
}
function getScalePath(tags) {
  return tags.join(".");
}
function isScaleAlpha(tags) {
  return tags.includes("a");
}
function isScaleDark(tags) {
  return tags.includes("dark");
}
function isScaleP3(tags) {
  return tags.includes("p3");
}
function getScaleName(tags) {
  return tags[0];
}
function getScaleShades(value) {
  return Object.assign({}, ...Object.values(value).map((shade, i) => ({
    [++i]: shade
  })));
}
function getScales(lightPrefix) {
  return Object.entries(colors).map(([fullName, value]) => {
    const tags = getScaleTags(fullName);
    const dark = isScaleDark(tags);
    if (!dark && lightPrefix)
      tags.splice(1, 0, "light");
    return {
      fullName,
      tags,
      name: getScaleName(tags),
      path: getScalePath(tags),
      dark,
      alpha: isScaleAlpha(tags),
      p3: isScaleP3(tags),
      shades: getScaleShades(value)
    };
  });
}

// src/utils.ts
function keysToObj(keys, value) {
  if (keys.length === 0)
    return value;
  const key = keys[0];
  const obj = keysToObj(keys.slice(1), value);
  return { [key]: obj };
}
function isObject(value) {
  return value !== null && value !== undefined && typeof value === "object" && !Array.isArray(value);
}
function mergeObjs(target, ...sources) {
  if (!sources.length)
    return target;
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key])
          Object.assign(target, { [key]: {} });
        mergeObjs(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return mergeObjs(target, ...sources);
}

// src/semantic-tokens.ts
function findDarkScale(scale, scales) {
  return scales.find((x) => x.name === scale.name && x.alpha === scale.alpha && x.p3 === scale.p3 && x.dark);
}
function findP3Scale(scale, scales) {
  return scales.find((x) => x.name === scale.name && x.alpha === scale.alpha && x.dark === scale.dark && x.p3);
}
function findLightScale(scale, scales) {
  return scales.find((x) => x.name === scale.name && x.alpha === scale.alpha && x.dark === scale.dark && x.p3 === scale.p3 && x.tags.includes("light"));
}
function findRelatedScales(scale, scales, enableDarkMode, enableAutoP3) {
  const result = { current: scale };
  if (enableDarkMode && !scale.dark && !scale.tags.includes("light")) {
    result.dark = findDarkScale(scale, scales);
  }
  if (!result.dark && enableAutoP3 && !scale.p3) {
    result.p3 = findP3Scale(scale, scales);
  }
  if (result.dark) {
    result.light = scale.tags.includes("light") ? scale : findLightScale(scale, scales);
  }
  return result;
}
function buildTokenValue(shade, shadeIndex, relatedScales) {
  if (relatedScales.dark) {
    return {
      base: `{colors.${relatedScales.light?.path}.${shadeIndex}}`,
      _dark: `{colors.${relatedScales.dark.path}.${shadeIndex}}`
    };
  }
  if (relatedScales.p3) {
    return {
      base: shade,
      _p3: `{colors.${relatedScales.p3.path}.${shadeIndex}}`
    };
  }
  return shade;
}
function getSemanticTokens(darkMode, autoP3, colorScales = []) {
  let scales = getScales(darkMode);
  if (darkMode) {
    scales = scales.concat(getScales(false).filter((x) => !x.dark));
  }
  const filteredScales = scales.filter((scale) => shouldIncludeScale(scale, colorScales));
  return mergeObjs({}, ...filteredScales.map((scale) => generateScaleTokens(scale, filteredScales, darkMode, autoP3)));
}
function shouldIncludeScale(scale, colorScales) {
  if (colorScales.length === 0) {
    return true;
  }
  return colorScales.some((colorScale) => {
    return scale.path === colorScale || scale.path.startsWith(colorScale + ".");
  });
}
function generateScaleTokens(scale, allScales, enableDarkMode = false, enableAutoP3 = false) {
  const relatedScales = findRelatedScales(scale, allScales, enableDarkMode, enableAutoP3);
  const shadeTokens = Object.entries(scale.shades).map(([shadeIndex, color]) => {
    const tokenValue = buildTokenValue(color, shadeIndex, relatedScales);
    return {
      [shadeIndex]: {
        value: tokenValue
      }
    };
  });
  const mergedShades = mergeObjs({}, ...shadeTokens);
  return keysToObj(scale.tags, mergedShades);
}

// package.json
var name = "pandacss-preset-radix-colors";

// src/preset.ts
var DEFAULT_DARK_MODE_CONDITION = ".dark &";
function getConditions(darkModeCondition) {
  const conditions = {};
  if (darkModeCondition) {
    conditions["dark"] = darkModeCondition;
  }
  conditions["p3"] = "@media (color-gamut: p3)";
  return conditions;
}
function normalizeDarkMode(darkModeOption) {
  if (!darkModeOption) {
    return { enabled: false };
  }
  if (typeof darkModeOption === "boolean") {
    return { enabled: true, condition: DEFAULT_DARK_MODE_CONDITION };
  }
  const enabled = darkModeOption.enabled ?? true;
  return {
    enabled,
    condition: darkModeOption.condition
  };
}
function validateColorScales(colorScales) {
  if (!colorScales || colorScales.length === 0) {
    return;
  }
  const scales = getScales();
  const unmatchedScales = colorScales.filter((colorScale) => {
    const isValidPrefix = scales.some((scale) => scale.path === colorScale || scale.path.startsWith(colorScale + "."));
    return !isValidPrefix;
  });
  if (unmatchedScales.length > 0) {
    console.warn(`[pandacss-preset-radix-colors] Color scale paths don't match any available scales: ${unmatchedScales.join(", ")}. ` + `Valid examples: "amber", "blue.dark", "gray.p3", "red.dark.a". ` + `Available base colors: ${Array.from(new Set(scales.map((s) => s.name))).join(", ")}.`);
  }
}
function createPreset(options) {
  const darkModeConfig = normalizeDarkMode(options?.darkMode);
  validateColorScales(options?.colorScales);
  return import_dev.definePreset({
    name,
    conditions: {
      extend: getConditions(darkModeConfig.enabled ? darkModeConfig.condition : undefined)
    },
    theme: {
      extend: {
        semanticTokens: {
          colors: getSemanticTokens(darkModeConfig.enabled, options?.autoP3, options?.colorScales)
        }
      }
    }
  });
}
// src/types.ts
var colors2 = __toESM(require("@radix-ui/colors"));
function transformScaleName(scale) {
  return scale.split(/(Dark|P3|A)/).map((x) => x.toLowerCase()).filter(Boolean).join(".");
}
var radixColorScales = Object.keys(colors2).filter((scale) => !scale.includes("default")).map(transformScaleName);

//# debugId=8048F96B70C06C8064756E2164756E21

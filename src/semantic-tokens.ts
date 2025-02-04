import * as colors from "@radix-ui/colors";
import { RadixColorScale } from "./types";

function getColors() {
  const t = {
    ...Object.entries(colors)
      .filter(([key]) => !key.includes("default"))
      .map(([key, value]) => {
        const newKey = key.split(/(Dark|P3|A)/)
          .map(x => x.toLowerCase())
          .filter(Boolean)
          .join(".");

        const newValue = { 
          ...Object.values(value).map((x, i) => ({ [i]: x })).flat()
        };

        return { [newKey]: newValue };
      }).flat()
  };

  return t;
}

console.dir(getColors(), { depth: null });

// export function getSemanticTokens(scales: RadixColorScale[], isDarkMode: boolean = false, autoP3: boolean = false) {
//   const result: Record<string, any> = {};

//   let colorEntries = Object.entries(colors);

//   // Filter out default and non-included scales
//   colorEntries = colorEntries.filter(([key]) => !key.includes("default"));

//   for (const [key, value] of colorEntries) {
//     const keys = key.split(/(Dark|P3|A)/).map(x => x.toLowerCase()).filter(Boolean);

//     if(!scales.includes(keys.join(".") as RadixColorScale)) continue;

//     const isDark = keys.includes("dark");
//     if(!isDark && isDarkMode)
//       keys.splice(1, 0, "light");

//     let curr = result;
//     for (let i = 0; i < keys.length; i++) {
//       const k = keys[i];

//       if (i === keys.length - 1) {
//         if (!curr[k]) curr[k] = {};

//         let j = 1;
//         for (const color of Object.values(value)) {
//           let value = {};

//           if(isDarkMode && !isDark)
//             value = { base: color, _dark: `{colors.}` };
//           else 
//             value = color

//           curr[k][j++] = { value }
//         }
//       } else {
//         if (!curr[k]) curr[k] = {};
//         curr = curr[k];
//       }
//     }
//   }
  
//   return result;
// }

import { type Conditions } from "@pandacss/types";

export function getConditions(darkModeCondition?: string): Conditions {
  let result = {};

  if (darkModeCondition) result = { dark: darkModeCondition };

  return {
    ...result,
    p3: "@media (color-gamut: p3)",
  };
}

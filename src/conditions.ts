import { Conditions } from "@pandacss/types";

export function getConditions(darkModeCondition?: string, autoP3?: boolean): Conditions {
  let result: Conditions = {};

  if (darkModeCondition) result = { dark: darkModeCondition };
  if (autoP3) result = { ...result, p3: "@media (color-gamut: p3)" };

  return result;
}

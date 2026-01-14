import { describe, it, expect } from "bun:test";
import {
  findDarkScale,
  findP3Scale,
  findLightScale,
  findRelatedScales,
  buildTokenValue,
} from "../src/semantic-tokens";
import { type Scale } from "../src/radix-colors";

describe("semantic-tokens", () => {
  const createMockScale = (
    name: string,
    overrides: Partial<Scale> = {},
  ): Scale => ({
    fullName: name,
    tags: [name],
    name,
    path: name,
    dark: false,
    alpha: false,
    p3: false,
    shades: {
      1: "#fff0",
      2: "#fff1",
      3: "#fff2",
      4: "#fff3",
      5: "#fff4",
      6: "#fff5",
      7: "#fff6",
      8: "#fff7",
      9: "#fff8",
      10: "#fff9",
      11: "#fffa",
      12: "#fffb",
    },
    ...overrides,
  });

  describe("findDarkScale", () => {
    it("should find a matching dark scale", () => {
      const baseScale = createMockScale("blue");
      const darkScale = createMockScale("blue", {
        fullName: "bluedark",
        tags: ["blue", "dark"],
        path: "blue.dark",
        dark: true,
      });

      const scales = [baseScale, darkScale];
      const result = findDarkScale(baseScale, scales);

      expect(result).toBe(darkScale);
    });

    it("should return undefined if no dark scale exists", () => {
      const baseScale = createMockScale("blue");
      const result = findDarkScale(baseScale, [baseScale]);

      expect(result).toBeUndefined();
    });

    it("should require matching alpha property", () => {
      const baseScale = createMockScale("blue", { alpha: false });
      const darkAlphaScale = createMockScale("blue", {
        fullName: "bluedarka",
        tags: ["blue", "dark", "a"],
        path: "blue.dark.a",
        dark: true,
        alpha: true,
      });

      const result = findDarkScale(baseScale, [darkAlphaScale]);
      expect(result).toBeUndefined();
    });
  });

  describe("findP3Scale", () => {
    it("should find a matching P3 scale", () => {
      const baseScale = createMockScale("blue");
      const p3Scale = createMockScale("blue", {
        fullName: "bluep3",
        tags: ["blue", "p3"],
        path: "blue.p3",
        p3: true,
      });

      const scales = [baseScale, p3Scale];
      const result = findP3Scale(baseScale, scales);

      expect(result).toBe(p3Scale);
    });

    it("should return undefined if no P3 scale exists", () => {
      const baseScale = createMockScale("blue");
      const result = findP3Scale(baseScale, [baseScale]);

      expect(result).toBeUndefined();
    });
  });

  describe("findLightScale", () => {
    it("should find a light variant of a scale", () => {
      const baseScale = createMockScale("blue");
      const lightScale = createMockScale("blue", {
        fullName: "blue",
        tags: ["blue", "light"],
        path: "blue.light",
      });

      const scales = [baseScale, lightScale];
      const result = findLightScale(baseScale, scales);

      expect(result).toBe(lightScale);
    });

    it("should return undefined if no light variant exists", () => {
      const baseScale = createMockScale("blue");
      const result = findLightScale(baseScale, [baseScale]);

      expect(result).toBeUndefined();
    });
  });

  describe("findRelatedScales", () => {
    it("should find dark scale when dark mode is enabled", () => {
      const baseScale = createMockScale("blue");
      const darkScale = createMockScale("blue", {
        fullName: "bluedark",
        tags: ["blue", "dark"],
        path: "blue.dark",
        dark: true,
      });
      const lightScale = createMockScale("blue", {
        tags: ["blue", "light"],
        path: "blue.light",
      });

      const scales = [baseScale, darkScale, lightScale];
      const result = findRelatedScales(baseScale, scales, true, false);

      expect(result.dark).toBe(darkScale);
      expect(result.light).toBe(lightScale);
    });

    it("should find P3 scale when autoP3 is enabled and no dark scale", () => {
      const baseScale = createMockScale("blue");
      const p3Scale = createMockScale("blue", {
        fullName: "bluep3",
        tags: ["blue", "p3"],
        path: "blue.p3",
        p3: true,
      });

      const scales = [baseScale, p3Scale];
      const result = findRelatedScales(baseScale, scales, false, true);

      expect(result.p3).toBe(p3Scale);
      expect(result.dark).toBeUndefined();
    });

    it("should prefer dark scale over P3 scale", () => {
      const baseScale = createMockScale("blue");
      const darkScale = createMockScale("blue", {
        fullName: "bluedark",
        tags: ["blue", "dark"],
        path: "blue.dark",
        dark: true,
      });
      const p3Scale = createMockScale("blue", {
        fullName: "bluep3",
        tags: ["blue", "p3"],
        path: "blue.p3",
        p3: true,
      });

      const scales = [baseScale, darkScale, p3Scale];
      const result = findRelatedScales(baseScale, scales, true, true);

      expect(result.dark).toBe(darkScale);
      expect(result.p3).toBeUndefined();
    });
  });

  describe("buildTokenValue", () => {
    it("should return simple shade value when no variants", () => {
      const baseScale = createMockScale("blue");
      const result = buildTokenValue("#0000ff", 1, { current: baseScale });

      expect(result).toBe("#0000ff");
    });

    it("should build conditional value with dark scale", () => {
      const baseScale = createMockScale("blue");
      const darkScale = createMockScale("blue", {
        fullName: "bluedark",
        tags: ["blue", "dark"],
        path: "blue.dark",
        dark: true,
      });
      const lightScale = createMockScale("blue", {
        tags: ["blue", "light"],
        path: "blue.light",
      });

      const result = buildTokenValue("#e0e6ff", 1, {
        current: baseScale,
        dark: darkScale,
        light: lightScale,
      });

      expect(result).toEqual({
        base: "{colors.blue.light.1}",
        _dark: "{colors.blue.dark.1}",
      });
    });

    it("should build conditional value with P3 scale", () => {
      const baseScale = createMockScale("blue");
      const p3Scale = createMockScale("blue", {
        fullName: "bluep3",
        tags: ["blue", "p3"],
        path: "blue.p3",
        p3: true,
      });

      const result = buildTokenValue("#0000ff", 5, {
        current: baseScale,
        p3: p3Scale,
      });

      expect(result).toEqual({
        base: "#0000ff",
        _p3: "{colors.blue.p3.5}",
      });
    });

    it("should handle numeric shade index", () => {
      const baseScale = createMockScale("blue");
      const result = buildTokenValue("#0000ff", 10, { current: baseScale });

      expect(result).toBe("#0000ff");
    });
  });
});

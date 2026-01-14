import { describe, it, expect } from "bun:test";
import {
  getScaleTags,
  getScalePath,
  getScales,
} from "../src/radix-colors";

describe("radix-colors", () => {
  describe("getScaleTags", () => {
    it("should extract tags from a full color name", () => {
      expect(getScaleTags("amber")).toEqual(["amber"]);
      expect(getScaleTags("amberDark")).toEqual(["amber", "dark"]);
      expect(getScaleTags("amberDarkP3A")).toEqual([
        "amber",
        "dark",
        "p3",
        "a",
      ]);
      expect(getScaleTags("slateA")).toEqual(["slate", "a"]);
    });

    it("should preserve P3 as a single tag", () => {
      expect(getScaleTags("blueP3")).toEqual(["blue", "p3"]);
      expect(getScaleTags("blueDarkP3")).toEqual(["blue", "dark", "p3"]);
      expect(getScaleTags("blueDarkP3A")).toEqual(["blue", "dark", "p3", "a"]);
    });

    it("should convert all tags to lowercase", () => {
      expect(getScaleTags("AmberDark")).toEqual(["amber", "dark"]);
      expect(getScaleTags("BlueP3A")).toEqual(["blue", "p3", "a"]);
    });
  });

  describe("getScalePath", () => {
    it("should join tags with dots", () => {
      expect(getScalePath(["amber"])).toBe("amber");
      expect(getScalePath(["amber", "dark"])).toBe("amber.dark");
      expect(getScalePath(["amber", "dark", "p3", "a"])).toBe(
        "amber.dark.p3.a",
      );
    });
  });

  describe("getScales", () => {
    it("should return an array of scales", () => {
      const scales = getScales();
      expect(Array.isArray(scales)).toBe(true);
      expect(scales.length).toBeGreaterThan(0);
    });

    it("should parse scale metadata correctly", () => {
      const scales = getScales();
      const amberScale = scales.find((s) => s.fullName === "amber");

      expect(amberScale).toBeDefined();
      expect(amberScale!.tags).toEqual(["amber"]);
      expect(amberScale!.name).toBe("amber");
      expect(amberScale!.path).toBe("amber");
      expect(amberScale!.dark).toBe(false);
      expect(amberScale!.alpha).toBe(false);
      expect(amberScale!.p3).toBe(false);
    });

    it("should correctly identify dark scales", () => {
      const scales = getScales();
      const amberDarkScale = scales.find((s) => s.fullName === "amberDark");

      expect(amberDarkScale).toBeDefined();
      expect(amberDarkScale!.dark).toBe(true);
      expect(amberDarkScale!.tags).toContain("dark");
    });

    it("should correctly identify alpha scales", () => {
      const scales = getScales();
      const amberAScale = scales.find((s) => s.fullName === "amberA");

      expect(amberAScale).toBeDefined();
      expect(amberAScale!.alpha).toBe(true);
      expect(amberAScale!.tags).toContain("a");
    });

    it("should add light prefix when enabled", () => {
      const scales = getScales(true);
      const lightScale = scales.find(
        (s) => s.fullName === "amber" && s.tags.includes("light"),
      );

      expect(lightScale).toBeDefined();
      expect(lightScale!.tags).toEqual(["amber", "light"]);
      expect(lightScale!.path).toBe("amber.light");
    });

    it("should have all 12 shades", () => {
      const scales = getScales();
      const amberScale = scales.find((s) => s.fullName === "amber");

      expect(Object.keys(amberScale!.shades).length).toBe(12);
      expect(amberScale!.shades[1]).toBeDefined();
      expect(amberScale!.shades[12]).toBeDefined();
    });
  });
});

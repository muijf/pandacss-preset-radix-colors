import { describe, it, expect } from "bun:test";
import { keysToObj, isObject, mergeObjs } from "../src/utils";

describe("utils", () => {
  describe("keysToObj", () => {
    it("should convert an array of keys to a nested object", () => {
      const keys = ["a", "b", "c"];
      const value = "test";
      const result = keysToObj(keys, value);

      expect(result).toEqual({ a: { b: { c: "test" } } });
    });

    it("should return the value when keys array is empty", () => {
      const keys: string[] = [];
      const value = "test";
      const result = keysToObj(keys, value);

      expect(result).toBe(value);
    });
  });

  describe("isObject", () => {
    it("should return true for objects", () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
    });

    it("should return false for non-objects", () => {
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject([])).toBe(false);
      expect(isObject("string")).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject(true)).toBe(false);
    });
  });

  describe("mergeObjs", () => {
    it("should merge objects deeply", () => {
      const target = { a: 1, b: { c: 2 } };
      const source = { b: { d: 3 }, e: 4 };
      const result = mergeObjs(target, source);

      expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
    });

    it("should handle multiple sources", () => {
      const target = { a: 1 };
      const source1 = { b: 2 };
      const source2 = { c: 3 };
      const result = mergeObjs(target, source1, source2);

      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it("should return target when no sources are provided", () => {
      const target = { a: 1 };
      const result = mergeObjs(target);

      expect(result).toBe(target);
    });

    it("should override primitive values", () => {
      const target = { a: 1 };
      const source = { a: 2 };
      const result = mergeObjs(target, source);

      expect(result).toEqual({ a: 2 });
    });
  });
});

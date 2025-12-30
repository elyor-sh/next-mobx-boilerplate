import { z } from "zod";

import {
  parseQueryParams,
  parseQueryParamsFromUrl,
  parseQueryStringFromUrl,
  stringifyQueryParams,
  ValidatedQueryParams,
} from "@/shared/lib/query-params";

describe("Query Params Utilities", () => {
  describe("parseQueryParams", () => {
    it("should parse query string to object", () => {
      const result = parseQueryParams("foo=bar&baz=qux");

      expect(result).toEqual({ foo: "bar", baz: "qux" });
    });

    it("should handle empty string", () => {
      const result = parseQueryParams("");

      expect(result).toEqual({});
    });

    it("should handle numeric values as strings", () => {
      const result = parseQueryParams("id=123&count=456");

      expect(result).toEqual({ id: "123", count: "456" });
    });

    it("should handle arrays", () => {
      const result = parseQueryParams("tags=a&tags=b&tags=c");

      expect(result).toEqual({ tags: ["a", "b", "c"] });
    });
  });

  describe("stringifyQueryParams", () => {
    it("should stringify object to query string", () => {
      const result = stringifyQueryParams({ foo: "bar", baz: "qux" });

      // URLSearchParams doesn't guarantee order, so check both params exist
      expect(result).toContain("foo=bar");
      expect(result).toContain("baz=qux");
    });

    it("should handle empty object", () => {
      const result = stringifyQueryParams({});

      expect(result).toBe("");
    });

    it("should handle numeric values", () => {
      const result = stringifyQueryParams({ id: 123, count: 456 });

      // URLSearchParams doesn't guarantee order, so check both params exist
      expect(result).toContain("id=123");
      expect(result).toContain("count=456");
    });

    it("should handle arrays", () => {
      const result = stringifyQueryParams({ tags: ["a", "b", "c"] });

      expect(result).toBe("tags=a&tags=b&tags=c");
    });

    it("should skip undefined values", () => {
      const result = stringifyQueryParams({ foo: "bar", baz: undefined });

      expect(result).toBe("foo=bar");
    });
  });

  describe("parseQueryParamsFromUrl", () => {
    it("should parse query params from full URL", () => {
      const result = parseQueryParamsFromUrl(
        "https://example.com/path?foo=bar&baz=qux",
      );

      expect(result).toEqual({ foo: "bar", baz: "qux" });
    });

    it("should handle URL without query params", () => {
      const result = parseQueryParamsFromUrl("https://example.com/path");

      expect(result).toEqual({});
    });
  });

  describe("parseQueryStringFromUrl", () => {
    it("should extract query string from URL", () => {
      const result = parseQueryStringFromUrl(
        "https://example.com/path?foo=bar&baz=qux",
      );

      expect(result).toBe("foo=bar&baz=qux");
    });

    it("should return empty string for URL without query params", () => {
      const result = parseQueryStringFromUrl("https://example.com/path");

      expect(result).toBe("");
    });
  });

  describe("ValidatedQueryParams", () => {
    const schema = z.object({
      id: z.coerce.number().optional(),
      name: z.string().optional(),
    });

    it("should initialize with validated params", () => {
      const setFn = jest.fn();
      const validated = new ValidatedQueryParams(
        { id: "123", name: "test" },
        setFn,
        schema,
      );

      expect(validated.params).toEqual({ id: 123, name: "test" });
      expect(validated.schema).toBe(schema);
    });

    it("should validate and coerce params on initialization", () => {
      const setFn = jest.fn();
      const validated = new ValidatedQueryParams({ id: "456" }, setFn, schema);

      expect(validated.params.id).toBe(456);
      expect(typeof validated.params.id).toBe("number");
    });

    it("should throw on invalid params", () => {
      const setFn = jest.fn();
      const invalidSchema = z.object({
        id: z.number(),
      });

      expect(() => {
        new ValidatedQueryParams({ id: "not-a-number" }, setFn, invalidSchema);
      }).toThrow();
    });

    it("should update params using set method", () => {
      const setFn = jest.fn();
      const validated = new ValidatedQueryParams({ id: "123" }, setFn, schema);

      validated.set({ name: "updated" });

      expect(validated.params).toEqual({ id: 123, name: "updated" });
      expect(setFn).toHaveBeenCalledWith({ name: "updated" });
    });

    it("should merge params when setting", () => {
      const setFn = jest.fn();
      const validated = new ValidatedQueryParams(
        { id: "123", name: "original" },
        setFn,
        schema,
      );

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      validated.set({ id: "456" });

      expect(validated.params).toEqual({ id: 456, name: "original" });
    });

    it("should validate merged params", () => {
      const setFn = jest.fn();
      const strictSchema = z.object({
        id: z.number().min(1).max(100),
      });

      const validated = new ValidatedQueryParams(
        { id: 50 },
        setFn,
        strictSchema,
      );

      expect(() => {
        validated.set({ id: 200 });
      }).toThrow();
    });
  });
});

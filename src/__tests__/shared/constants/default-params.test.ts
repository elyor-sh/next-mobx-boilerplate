import { z } from "zod";

import { defaultListParams } from "@/shared/constants/default-params";

describe("Default List Params", () => {
  it("should export default list params schema", () => {
    expect(defaultListParams).toBeDefined();
    expect(defaultListParams._page).toBeDefined();
    expect(defaultListParams._limit).toBeDefined();
  });

  it("should have default values", () => {
    const schema = z.object(defaultListParams);
    const result = schema.parse({});

    expect(result._page).toBe(0);
    expect(result._limit).toBe(20);
  });

  it("should transform string values to numbers", () => {
    const schema = z.object(defaultListParams);
    const result = schema.parse({ _page: "5", _limit: "50" });

    expect(result._page).toBe(5);
    expect(result._limit).toBe(50);
    expect(typeof result._page).toBe("number");
    expect(typeof result._limit).toBe("number");
  });

  it("should handle invalid string values", () => {
    const schema = z.object(defaultListParams);
    const result = schema.parse({ _page: "invalid", _limit: "bad" });

    expect(result._page).toBe(0);
    expect(result._limit).toBe(20);
  });

  it("should handle numeric values", () => {
    const schema = z.object(defaultListParams);
    const result = schema.parse({ _page: 10, _limit: 100 });

    expect(result._page).toBe(10);
    expect(result._limit).toBe(100);
  });

  it("should be usable in other schemas", () => {
    const customSchema = z.object({
      ...defaultListParams,
      customField: z.string().optional(),
    });

    const result = customSchema.parse({ customField: "test" });

    expect(result).toBeDefined();
    expect(result.customField).toBe("test");
    expect(result._page).toBe(0);
    expect(result._limit).toBe(20);
  });

  it("should handle partial values", () => {
    const schema = z.object(defaultListParams);
    const result1 = schema.parse({ _page: "3" });
    const result2 = schema.parse({ _limit: "30" });

    expect(result1._page).toBe(3);
    expect(result1._limit).toBe(20); // default

    expect(result2._page).toBe(0); // default
    expect(result2._limit).toBe(30);
  });
});

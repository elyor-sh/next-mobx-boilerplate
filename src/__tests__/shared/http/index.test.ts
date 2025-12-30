/**
 * Тесты для HTTP клиента
 * Примечание: Эти тесты демонстрируют как можно тестировать axios instance
 */

import { http } from "@/shared/http";

describe("HTTP Client", () => {
  it("should export http instance", () => {
    expect(http).toBeDefined();
  });

  it("should have get method", () => {
    expect(http.get).toBeDefined();
    expect(typeof http.get).toBe("function");
  });

  it("should have post method", () => {
    expect(http.post).toBeDefined();
    expect(typeof http.post).toBe("function");
  });

  it("should have put method", () => {
    expect(http.put).toBeDefined();
    expect(typeof http.put).toBe("function");
  });

  it("should have delete method", () => {
    expect(http.delete).toBeDefined();
    expect(typeof http.delete).toBe("function");
  });

  it("should have patch method", () => {
    expect(http.patch).toBeDefined();
    expect(typeof http.patch).toBe("function");
  });
});

import { createEffect } from "@/shared/lib/create-effect";

describe("createEffect", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create effect with initial state", () => {
    const effect = createEffect(async () => {
      return "result";
    });

    expect(effect.state.loading).toBe(false);
    expect(effect.state.error).toBe(null);
    expect(effect.state.fulfilled).toBe(false);
  });

  it("should handle successful execution", async () => {
    const mockFn = jest.fn(async () => "success");
    const effect = createEffect(mockFn);

    const result = await effect();

    expect(result).toBe("success");
    expect(effect.state.loading).toBe(false);
    expect(effect.state.error).toBe(null);
    expect(effect.state.fulfilled).toBe(true);
    expect(mockFn).toHaveBeenCalledWith(
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("should set loading state during execution", async () => {
    const effect = createEffect(
      async () =>
        new Promise((resolve) => setTimeout(() => resolve("result"), 50)),
    );

    const promise = effect();

    expect(effect.state.loading).toBe(true);
    expect(effect.state.fulfilled).toBe(false);

    await promise;

    expect(effect.state.loading).toBe(false);
    expect(effect.state.fulfilled).toBe(true);
  });

  it("should handle errors", async () => {
    const error = new Error("Test error");
    const effect = createEffect(async () => {
      throw error;
    });

    await expect(effect()).rejects.toThrow("Test error");

    expect(effect.state.loading).toBe(false);
    expect(effect.state.error).toBe(error);
    expect(effect.state.fulfilled).toBe(false);
  });

  it("should accept parameters", async () => {
    const mockFn = jest.fn(
      async ({ value }: { value: number; signal?: AbortSignal }) => value * 2,
    );
    const effect = createEffect(mockFn);

    const result = await effect({ value: 5 });

    expect(result).toBe(10);
    expect(mockFn).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 5,
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("should abort previous request when called again", async () => {
    let abortedCount = 0;

    const effect = createEffect(async ({ signal }) => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => resolve("result"), 100);

        signal.addEventListener("abort", () => {
          abortedCount++;
          clearTimeout(timeout);
          reject(new Error("Aborted"));
        });
      });
    });

    const firstCall = effect();
    const firstController = effect.abortController;

    const secondCall = effect();

    expect(firstController?.signal.aborted).toBe(true);

    await expect(firstCall).rejects.toThrow();
    await secondCall;

    expect(abortedCount).toBe(1);
  });

  it("should provide abort controller", async () => {
    const effect = createEffect(
      async ({ signal }) =>
        new Promise((resolve, reject) => {
          const timeout = setTimeout(() => resolve("result"), 100);
          signal.addEventListener("abort", () => {
            clearTimeout(timeout);
            reject(new Error("Aborted"));
          });
        }),
    );

    const promise = effect();

    expect(effect.abortController).toBeInstanceOf(AbortController);
    expect(effect.abortController?.signal.aborted).toBe(false);

    effect.abortController?.abort();

    await expect(promise).rejects.toThrow();
  });

  it("should not update state if aborted", async () => {
    const effect = createEffect(
      async ({ signal }) =>
        new Promise((resolve, reject) => {
          const timeout = setTimeout(() => resolve("result"), 50);

          signal.addEventListener("abort", () => {
            clearTimeout(timeout);
            reject(new Error("Aborted"));
          });
        }),
    );

    const promise = effect();

    effect.abortController?.abort();

    await expect(promise).rejects.toThrow();

    // State should not be updated to fulfilled after abort
    expect(effect.state.fulfilled).toBe(false);
  });

  it("should handle multiple parameters", async () => {
    const mockFn = jest.fn(
      async ({ a, b }: { a: number; b: string; signal?: AbortSignal }) =>
        `${a}-${b}`,
    );

    const effect = createEffect(mockFn);

    const result = await effect({ a: 1, b: "test" });

    expect(result).toBe("1-test");
    expect(mockFn).toHaveBeenCalledWith(
      expect.objectContaining({
        a: 1,
        b: "test",
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("should reset error on new execution", async () => {
    const effect = createEffect(
      async ({ shouldFail }: { shouldFail: boolean; signal?: AbortSignal }) => {
        if (shouldFail) throw new Error("Failed");
        return "success";
      },
    );

    await expect(effect({ shouldFail: true })).rejects.toThrow("Failed");
    expect(effect.state.error).toBeTruthy();

    await effect({ shouldFail: false });
    expect(effect.state.error).toBe(null);
    expect(effect.state.fulfilled).toBe(true);
  });
});

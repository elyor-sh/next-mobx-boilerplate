/**
 * Examples of using test helpers
 */

import { createEffect } from "@/shared/lib/create-effect";

import {
  createControllablePromise,
  delay,
  expectCalledWithSignal,
  expectErrorState,
  expectFulfilledState,
  expectIdleState,
  expectLoadingState,
} from "../__helpers__/test-utils";
import { createMockTodo, createMockTodos, mockTodos } from "../__mocks__/data";

describe("Examples: Using Test Helpers", () => {
  describe("Effect State Helpers", () => {
    it("should use expectIdleState helper", () => {
      const effect = createEffect(async () => "result");

      expectIdleState(effect);
    });

    it("should use expectLoadingState helper", async () => {
      const effect = createEffect(
        async () =>
          new Promise((resolve) => setTimeout(() => resolve("result"), 50)),
      );

      const promise = effect();

      expectLoadingState(effect);

      await promise;
    });

    it("should use expectFulfilledState helper", async () => {
      const effect = createEffect(async () => "result");

      await effect();

      expectFulfilledState(effect);
    });

    it("should use expectErrorState helper", async () => {
      const error = new Error("Test error");
      const effect = createEffect(async () => {
        throw error;
      });

      await expect(effect()).rejects.toThrow();

      expectErrorState(effect, error);
    });
  });

  describe("Mock Data Helpers", () => {
    it("should use mockTodos", () => {
      expect(mockTodos).toHaveLength(5);
      expect(mockTodos[0]).toHaveProperty("id");
      expect(mockTodos[0]).toHaveProperty("title");
    });

    it("should use createMockTodo", () => {
      const todo = createMockTodo({
        id: 999,
        title: "Custom Todo",
        completed: true,
      });

      expect(todo.id).toBe(999);
      expect(todo.title).toBe("Custom Todo");
      expect(todo.completed).toBe(true);
    });

    it("should use createMockTodos", () => {
      const todos = createMockTodos(10, 5);

      expect(todos).toHaveLength(10);
      expect(todos[0].userId).toBe(5);
      expect(todos[0].title).toBe("Todo 1");
      expect(todos[9].title).toBe("Todo 10");
    });
  });

  describe("Signal Helpers", () => {
    it("should use expectCalledWithSignal", async () => {
      const mockFn = jest.fn(async ({}: { signal: AbortSignal }) => {
        return "result";
      });

      const effect = createEffect(mockFn);

      await effect();

      expectCalledWithSignal(mockFn);
    });
  });

  describe("Controllable Promise Helper", () => {
    it("should control promise resolution manually", async () => {
      const { promise, resolve } = createControllablePromise<string>();

      let resolved = false;
      promise.then(() => {
        resolved = true;
      });

      // Promise should not be resolved yet
      await delay(10);
      expect(resolved).toBe(false);

      // Resolve manually
      resolve("test");

      await promise;
      expect(resolved).toBe(true);
    });

    it("should control promise rejection manually", async () => {
      const { promise, reject } = createControllablePromise<string>();

      const error = new Error("Test error");
      reject(error);

      await expect(promise).rejects.toThrow("Test error");
    });
  });

  describe("Delay Helper", () => {
    it("should delay execution", async () => {
      const start = Date.now();

      await delay(50);

      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(45); // Small margin of error
    });
  });

  describe("Complex Example: Testing Effect with Helpers", () => {
    it("should test complete effect lifecycle", async () => {
      const mockFn = jest.fn(
        async ({ value }: { value: number; signal: AbortSignal }) => {
          await delay(20);
          return value * 2;
        },
      );

      const effect = createEffect(mockFn);

      // 1. Initial state
      expectIdleState(effect);

      // 2. Start execution
      const promise = effect({ value: 5 });

      // 3. Loading state
      expectLoadingState(effect);

      // 4. Wait for completion
      const result = await promise;

      // 5. Fulfilled state
      expectFulfilledState(effect);

      // 6. Check result
      expect(result).toBe(10);

      // 7. Verify function was called with signal
      expectCalledWithSignal(mockFn);
    });

    it("should test error handling with helpers", async () => {
      const error = new Error("Custom error");
      const mockFn = jest.fn(async () => {
        await delay(10);
        throw error;
      });

      const effect = createEffect(mockFn);

      expectIdleState(effect);

      await expect(effect()).rejects.toThrow("Custom error");

      expectErrorState(effect, error);
    });
  });
});

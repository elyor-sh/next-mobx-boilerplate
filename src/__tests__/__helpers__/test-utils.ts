/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Testing utilities
 */

/**
 * Testing utilities
 */
import { ZodObject } from "zod";

import { ValidatedQueryParams } from "@/shared/lib/query-params";

/**
 * Creates a mock function for setQueryParams
 */
export const createMockSetQueryParams = () => jest.fn();

/**
 * Creates ValidatedQueryParams for tests
 */
export const createMockQueryParams = <T extends ZodObject<any>>(
  initialParams: unknown,
  schema: T,
) => {
  return new ValidatedQueryParams(
    initialParams,
    createMockSetQueryParams(),
    schema,
  );
};

/**
 * Expects that a promise will be rejected with a specific error
 */
export const expectToReject = async (
  promise: Promise<any>,
  errorMessage?: string,
) => {
  try {
    await promise;
    throw new Error("Expected promise to reject, but it resolved");
  } catch (error) {
    if (errorMessage && error instanceof Error) {
      expect(error.message).toContain(errorMessage);
    }
    return error;
  }
};

/**
 * Creates a delay for testing async operations
 */
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Expects that the effect state will be loading
 */
export const expectLoadingState = (effect: any) => {
  expect(effect.state.loading).toBe(true);
  expect(effect.state.fulfilled).toBe(false);
  expect(effect.state.error).toBe(null);
};

/**
 * Expects that the effect state will be fulfilled
 */
export const expectFulfilledState = (effect: any) => {
  expect(effect.state.loading).toBe(false);
  expect(effect.state.fulfilled).toBe(true);
  expect(effect.state.error).toBe(null);
};

/**
 * Expects that the effect state will be error
 */
export const expectErrorState = (effect: any, error?: any) => {
  expect(effect.state.loading).toBe(false);
  expect(effect.state.fulfilled).toBe(false);
  expect(effect.state.error).toBeTruthy();

  if (error) {
    expect(effect.state.error).toBe(error);
  }
};

/**
 * Expects that the effect state will be idle (initial)
 */
export const expectIdleState = (effect: any) => {
  expect(effect.state.loading).toBe(false);
  expect(effect.state.fulfilled).toBe(false);
  expect(effect.state.error).toBe(null);
};

/**
 * Creates a mock AbortController for tests
 */
export const createMockAbortController = () => {
  const controller = new AbortController();
  return controller;
};

/**
 * Checks that the function was called with AbortSignal
 */
export const expectCalledWithSignal = (mockFn: jest.Mock) => {
  expect(mockFn).toHaveBeenCalledWith(
    expect.objectContaining({
      signal: expect.any(AbortSignal),
    }),
  );
};

/**
 * Creates a promise that can be controlled manually
 */
export const createControllablePromise = <T>() => {
  let resolve: (value: T) => void;
  let reject: (error: any) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    promise,
    resolve: resolve!,
    reject: reject!,
  };
};

/**
 * Waits for the next event loop tick
 */
export const nextTick = () => new Promise((resolve) => setImmediate(resolve));

/**
 * Flushes all timers and promises
 */
export const flushPromises = () => new Promise(setImmediate);

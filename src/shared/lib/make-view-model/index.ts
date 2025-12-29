/* eslint-disable @typescript-eslint/no-explicit-any */

import type { CreateObservableOptions } from "mobx/src/internal.ts";

import { type AnnotationsMap, makeAutoObservable } from "mobx";

import { WITH_ASYNC_STATE_MARK } from "@/shared/lib/create-effect";
import { FORM_CONTROLLER } from "@/shared/lib/form-builder";

type MakeObservableOptions = Omit<CreateObservableOptions, "proxy">;

export function makeViewModel<T extends object>(
  instance: T,
  overrides?: AnnotationsMap<T, never>,
  options?: MakeObservableOptions,
): T {
  const localOverrides: Record<string, false> = {
    context: false,
    props: false,
    ...overrides,
  };

  for (const key of Object.getOwnPropertyNames(instance)) {
    const value = (instance as any)[key];

    const isOverride = () => {
      if (
        typeof value === "function" &&
        value.__withAsyncState__ === WITH_ASYNC_STATE_MARK
      ) {
        return true;
      }

      if (value.__formController__ === FORM_CONTROLLER) {
        return true;
      }

      return false;
    };

    if (isOverride()) {
      localOverrides[key] = false;
    }
  }

  const localOptions = {
    autoBind: true,
    ...options,
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return makeAutoObservable(instance, localOverrides as any, localOptions);
}

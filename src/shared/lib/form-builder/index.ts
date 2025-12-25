/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  type Control,
  createFormControl,
  type FieldValues,
  type UseFormProps,
} from "react-hook-form";
import { makeAutoObservable, runInAction } from "mobx";
import {ViewModelConstructor} from "@/shared/lib/create-use-store";

export const FORM_CONTROLLER = "__FORM_CONTROLLER__";

export function createForm<T extends FieldValues>(config: UseFormProps<T>) {
  const control = createFormControl<T>(config);

  return {
    ...control,
    __formController__: FORM_CONTROLLER,
  } as typeof control & {
    __formController__: "__FORM_CONTROLLER__";
  };
}

export class FormState<T extends FieldValues> {
  formState: Control<T>["_formState"];
  private unsubscribe?: () => void;

  constructor(private control: Control<T>) {
    this.formState = control._formState;

    makeAutoObservable(this, {}, { autoBind: true });

    this.unsubscribe = control._subscribe({
      formState: {
        isDirty: true,
        isValid: true,
        isValidating: true,
        errors: true,
        touchedFields: true,
        dirtyFields: true,
      },
      callback: (state) => {
        runInAction(() => {
          this.formState = {
            ...this.control._formState,
            ...state,
          };
        });
      },
    });
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }
  }
}

export const createFormState = <
  C extends ViewModelConstructor<any>,
  T extends FieldValues,
>(
  ctx: C,
  control: Control<T>,
) => {
  if (!ctx.disposers) {
    ctx.disposers = [];
  }

  const formState = new FormState(control);
  ctx.disposers.push(formState.destroy);

  return formState;
};

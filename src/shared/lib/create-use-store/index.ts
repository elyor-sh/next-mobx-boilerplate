"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { autorun, observable, runInAction } from "mobx";
import type { Context } from "react";
import { useContext, useEffect, useRef, useState } from "react";

export interface ViewModelConstructor<TContext> {
  systemFileName?: string;
  props?: Record<string, any>;
  context: TContext;
  beforeMount?: () => void;
  afterMount?: () => void;
  beforeUnmount?: () => void;
  disposers?: Array<() => void>;
}

export function createUseStore<TContext>(
  ctx: Context<TContext | undefined>,
  options?: {
    beforeMount?: (context: TContext, vm?: any) => void;
    afterMount?: (context: TContext, vm?: any) => void;
    beforeUnmount?: (context: TContext, vm?: any) => void;
  },
) {
  function useCtx(): TContext {
    const context = useContext(ctx);
    if (!context) {
      throw new Error("context must be used within a Provider");
    }
    return context;
  }

  function useStore(): { context: TContext };
  function useStore<
    TViewModel extends new (
      context: TContext,
    ) => ViewModelConstructor<TContext>,
  >(ViewModel: TViewModel): { vm: InstanceType<TViewModel>; context: TContext };
  function useStore<
    TViewModel extends new (
      context: TContext,
      p: ConstructorParameters<TViewModel>[1],
    ) => ViewModelConstructor<TContext>,
  >(
    ViewModel: TViewModel,
    props: ConstructorParameters<TViewModel>[1],
    exclude?: Partial<
      Record<keyof ConstructorParameters<TViewModel>[1], false>
    >,
  ): { vm: InstanceType<TViewModel>; context: TContext };
  function useStore(ViewModel?: any, props?: any, exclude?: any) {
    const isFirstRenderRef = useRef(true);
    const context = useCtx();

    useState(() => {
      if (!ViewModel) options?.beforeMount?.(context);
    });

    useEffect(() => {
      if (!ViewModel) options?.afterMount?.(context);

      return () => {
        if (!ViewModel) options?.beforeUnmount?.(context);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!ViewModel) return { context };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [vm] = useState(() => {
      const instance = new ViewModel(context, observable(props || {}, exclude));

      runInAction(() => {
        options?.beforeMount?.(context, instance);
        instance.beforeMount?.();
      });

      return instance;
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (isFirstRenderRef.current) {
        isFirstRenderRef.current = false;
      } else if (props) {
        runInAction(() => {
          vm.props = observable(props || {}, exclude);
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      options?.afterMount?.(context, vm);
      vm.afterMount?.();

      return () => {
        options?.beforeUnmount?.(context, vm);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        vm.disposers?.forEach((disposer) => disposer());

        vm.beforeUnmount?.();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { context, vm };
  }

  return useStore;
}

export function appendAutoRun<C extends ViewModelConstructor<any>>(
  ctx: C,
  ...fns: Array<() => void>
) {
  if (!ctx.disposers) {
    ctx.disposers = [];
  }
  fns.forEach((fn) => {
    const disposer = autorun(fn);
    ctx.disposers?.push(disposer);
  });
}

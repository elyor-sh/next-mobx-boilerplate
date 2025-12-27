"use client";

import {useParams, usePathname, useRouter, useSearchParams} from "next/navigation";
import {
  AppRouterInstance,
  NavigateOptions,
  PrefetchOptions
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {makeAutoObservable} from "mobx";
import {useState} from "react";
import {stringifyQueryParams} from "@/shared/lib/query-params";

export type ParamValue = string | Array<string> | undefined;
export type Params = Record<string, ParamValue>;

type AppRouterProps = {
  params: Params;
  pathname: string;
  queryParams: Record<string, string>;
  router: AppRouterInstance;
};

export class AppRouter {
  params: Params;
  pathname: string;
  queryParams: Record<string, string | number | undefined | null>;
  private router: AppRouterInstance;

  constructor(props: AppRouterProps) {
    this.params = props.params;
    this.pathname = props.pathname;
    this.queryParams = props.queryParams;
    this.router = props.router;

    makeAutoObservable(this, undefined, {autoBind: true});
  }

  setQueryParams(queryParams: Partial<Record<string, string | number | undefined | null>>) {
      const pathname = `${this.pathname}?${stringifyQueryParams(queryParams)}`
      window.history.pushState({}, "", pathname)
      this.queryParams = {...this.queryParams, ...queryParams};
  }

  push(path: string, options?: NavigateOptions) {
    this.router.push(path, options);
  }

  replace(path: string, options?: NavigateOptions) {
    this.router.replace(path, options);
  }

  refresh() {
    this.router.refresh();
  }

  back() {
    this.router.back();
  }

  forward() {
    this.router.forward();
  }

  prefetch(path: string, options?: PrefetchOptions) {
    this.router.prefetch(path, options);
  }
}

export const useInitRouter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = useParams();
  const pathname = usePathname();

  const [appRouter] = useState(() => {
    return new AppRouter({
      params: slug,
      pathname,
      queryParams: Object.fromEntries(searchParams.entries()),
      router,
    });
  });

  // useEffect(() => {
  //   appRouter.setQueryParams(Object.fromEntries(searchParams.entries()));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchParams]);
  //
  // useEffect(() => {
  //   runInAction(() => {
  //     appRouter.pathname = pathname;
  //   })
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pathname]);
  //
  // useEffect(() => {
  //   runInAction(() => {
  //     appRouter.params = slug;
  //   })
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [slug]);

  return appRouter;
};

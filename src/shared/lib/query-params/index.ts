import qs from "query-string";
import {makeAutoObservable} from "mobx";
import {z, ZodObject} from "zod";

export function parseQueryParams<T extends Record<string, unknown>>(
  search: string,
): T {
  return qs.parse(search) as T;
}

export function stringifyQueryParams(params: Record<string, unknown>): string {
  return qs.stringify(params);
}

export function parseQueryParamsFromUrl(url: string) {
  return qs.parseUrl(url).query;
}

export function parseQueryStringFromUrl(url: string) {
  return new URL(url).searchParams.toString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ValidatedQueryParams<S extends ZodObject<any>> {
  params: z.infer<S>

  constructor(
    params: unknown,
    private setQueryParams: (queryParams: Partial<z.infer<S>>) => void,
    public readonly schema: S
  ) {
    this.params = schema.parse(params)
    makeAutoObservable(this, undefined, { autoBind: true })
  }

  set(next: Partial<z.infer<S>>) {
    const merged = { ...this.params, ...next }
    this.params = this.schema.parse(merged)
    this.setQueryParams(next)
  }
}

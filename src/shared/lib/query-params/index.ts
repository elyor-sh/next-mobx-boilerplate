import qs from "query-string";
import {makeAutoObservable} from "mobx";

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


export class ValidatedQueryParams<Q extends object> {
    params: Q

    constructor(params: Q, private setQueryParams: (queryParams: Partial<Q>) => void) {
        this.params = params
        makeAutoObservable(this, undefined, {autoBind: true})
    }

    set (params: Partial<Q>) {
        this.params = {...this.params, ...params};
        this.setQueryParams(params)
    }
}

import qs from "query-string";

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

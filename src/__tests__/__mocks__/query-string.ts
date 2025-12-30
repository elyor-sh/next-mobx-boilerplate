/**
 * Mock for query-string to avoid ES module issues in Jest
 */

export function parse(search: string): Record<string, unknown> {
  const params = new URLSearchParams(search);
  const result: Record<string, unknown> = {};

  params.forEach((value, key) => {
    if (result[key]) {
      // Handle arrays
      if (Array.isArray(result[key])) {
        (result[key] as string[]).push(value);
      } else {
        result[key] = [result[key] as string, value];
      }
    } else {
      result[key] = value;
    }
  });

  return result;
}

export function stringify(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

export function parseUrl(url: string): { query: Record<string, unknown> } {
  const urlObj = new URL(url);
  return {
    query: parse(urlObj.search.slice(1)),
  };
}

const queryString = {
  parse,
  stringify,
  parseUrl,
};

export default queryString;

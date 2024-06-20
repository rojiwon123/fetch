import { IHeaders } from "../type";

/**
 * 단일값만 허용하는 헤더키들
 */
const single_key = new Set<string>([
    "accept",
    "accept-language",
    "accept-patch",
    "accept-ranges",
    "access-control-allow-credentials",
    "access-control-allow-headers",
    "access-control-allow-methods",
    "access-control-allow-origin",
    "access-control-expose-headers",
    "access-control-max-age",
    "access-control-request-headers",
    "access-control-request-method",
    "age",
    "allow",
    "alt-svc",
    "authorization",
    "cache-control",
    "connection",
    "content-disposition",
    "content-encoding",
    "content-language",
    "content-length",
    "content-location",
    "content-range",
    "content-type",
    "cookie",
    "date",
    "etag",
    "expect",
    "expires",
    "forwarded",
    "from",
    "host",
    "if-match",
    "if-modified-since",
    "if-none-match",
    "if-unmodified-since",
    "last-modified",
    "location",
    "origin",
    "pragma",
    "proxy-authenticate",
    "proxy-authorization",
    "public-key-pins",
    "range",
    "referer",
    "retry-after",
    "sec-websocket-accept",
    "sec-websocket-extensions",
    "sec-websocket-key",
    "sec-websocket-protocol",
    "sec-websocket-version",
    "set-cookie",
    "strict-transport-security",
    "tk",
    "trailer",
    "transfer-encoding",
    "upgrade",
    "user-agent",
    "vary",
    "via",
    "warning",
    "www-authenticate",
]);

/**
 * @internal
 */
export const to = (headers?: IHeaders): Headers => {
    const result = new Headers();
    if (headers === undefined) return result;
    Object.entries(headers).forEach(([key, value]) => {
        if (value === undefined) return;
        const values: string[] = Array.isArray(value)
            ? value
            : value.split(",").map((val) => val.trim());
        if (values[0] === undefined) return;
        if (single_key.has(key)) return result.set(key, values[0]);
        values.forEach((item) => result.append(key, item));
    });
    return result;
};

/**
 * @internal
 */
export const from = (headers: Headers): IHeaders => {
    const list: [string, string | string[]][] = [];
    headers.forEach((value, key) => {
        const values = value.split(",").map((val) => val.trim());
        if (values[0] === undefined) return;
        if (single_key.has(key)) list.push([key, values[0]]);
        else
            values.length > 1
                ? list.push([key, values])
                : list.push([key, values[0]]);
    });
    return Object.fromEntries(list);
};

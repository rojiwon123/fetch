import { IncomingHttpHeaders } from "http";

export type IHeaders = IncomingHttpHeaders;

/**
 * key들은 단일값만 허용하는 헤더키들
 */
const BlockListKey: Record<string, true> = {
    accept: true,
    "accept-language": true,
    "accept-patch": true,
    "accept-ranges": true,
    "access-control-allow-credentials": true,
    "access-control-allow-headers": true,
    "access-control-allow-methods": true,
    "access-control-allow-origin": true,
    "access-control-expose-headers": true,
    "access-control-max-age": true,
    "access-control-request-headers": true,
    "access-control-request-method": true,
    age: true,
    allow: true,
    "alt-svc": true,
    authorization: true,
    "cache-control": true,
    connection: true,
    "content-disposition": true,
    "content-encoding": true,
    "content-language": true,
    "content-length": true,
    "content-location": true,
    "content-range": true,
    "content-type": true,
    cookie: true,
    date: true,
    etag: true,
    expect: true,
    expires: true,
    forwarded: true,
    from: true,
    host: true,
    "if-match": true,
    "if-modified-since": true,
    "if-none-match": true,
    "if-unmodified-since": true,
    "last-modified": true,
    location: true,
    origin: true,
    pragma: true,
    "proxy-authenticate": true,
    "proxy-authorization": true,
    "public-key-pins": true,
    range: true,
    referer: true,
    "retry-after": true,
    "sec-websocket-accept": true,
    "sec-websocket-extensions": true,
    "sec-websocket-key": true,
    "sec-websocket-protocol": true,
    "sec-websocket-version": true,
    "set-cookie": true,
    "strict-transport-security": true,
    tk: true,
    trailer: true,
    "transfer-encoding": true,
    upgrade: true,
    "user-agent": true,
    vary: true,
    via: true,
    warning: true,
    "www-authenticate": true,
} as const;
/**
 * 중복값을 허용하는가?
 * -> 중복값은 1, 2, 3, 4 이렇게 나열
 */
const isAllowList = (key: string) => BlockListKey[key] !== true;

/**
 * @internal
 */
export const parseHeaders = (headers: IHeaders | undefined): Headers => {
    const result = new Headers();
    if (typeof headers !== "object" || headers === null) return result;
    Object.entries(headers).forEach(([key, value]) =>
        isAllowList(key)
            ? Array.isArray(value)
                ? value.forEach((item) => result.append(key, item))
                : typeof value === "string"
                  ? result.append(key, value)
                  : null
            : Array.isArray(value) && typeof value[0] === "string"
              ? result.set(key, value[0])
              : typeof value === "string"
                ? result.set(key, value)
                : null,
    );
    return result;
};

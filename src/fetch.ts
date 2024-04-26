import { FetchException } from "./error";
import { IFormData } from "./formdata";
import { parseHeaders } from "./headers";
import { internal_fetch } from "./internal_fetch";
import {
    IBinaryBodyOptions,
    IFormDataBodyOptions,
    IJsonBodyOptions,
    IOptions,
    IQueryOptions,
    ITextBodyOptions,
    IURLEncodedBodyOptions,
} from "./options";
import { IQuery, parseQueryValueList } from "./query";
import { IResponse } from "./response";

const get_url = (url: string): URL => {
    try {
        const _url = new URL(url);
        return _url;
    } catch (error) {
        throw new FetchException("Invalid URL", error);
    }
};

const FetchErrorWrapper = (...errors: unknown[]) => {
    throw new FetchException("Fetch API Error", ...errors);
};

const base =
    ({
        path = (i) => i,
        body = null,
        method,
        format,
    }: {
        path?: (url: URL) => URL;
        body?: string | Uint8Array | Blob | FormData | URLSearchParams | null;
        method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
        format?: string;
    }) =>
    async (options: IOptions): Promise<IResponse> => {
        const url = path(get_url(options.url));
        const headers = parseHeaders(options.headers);
        if (format) headers.set("content-type", format);
        return internal_fetch(url, { headers, method, body }).catch(
            FetchErrorWrapper,
        );
    };

const get = (options: IQueryOptions) =>
    base({
        path(origin) {
            const query = parseQueryValueList(options.query);
            origin.searchParams.forEach(() => {
                query;
            });
            return origin;
        },
        method: "GET",
    })(options);

const _delete = base({ method: "DELETE" });

const json =
    (method: "POST" | "PATCH" | "PUT") =>
    <T extends object | string | number | boolean | null>(
        options: IJsonBodyOptions<T>,
    ) =>
        base({
            body: (options.stringify ?? JSON.stringify)(options.body),
            method,
            format: "application/json; charset=utf-8",
        })(options);

const text =
    (method: "POST" | "PATCH" | "PUT") =>
    <T extends string | Uint8Array | number | bigint | boolean>(
        options: ITextBodyOptions<T>,
    ): Promise<IResponse> =>
        base({
            body: options.body.toString(),
            method,
            format: `${options.format ?? "text/plain"}; charset=utf-8`,
        })(options);

const binary =
    (method: "POST" | "PATCH" | "PUT") =>
    <T extends Blob | Uint8Array>(
        options: IBinaryBodyOptions<T>,
    ): Promise<IResponse> =>
        base({
            body: options.body,
            method,
            format: options.format ?? "application/octet-stream",
        })(options);

const formdata =
    (method: "POST" | "PATCH" | "PUT") =>
    <T extends IFormData>(
        options: IFormDataBodyOptions<T>,
    ): Promise<IResponse> =>
        base({
            body: ((): FormData => {
                const body = new FormData();
                Object.entries(options.body).forEach(([key, value]) => {
                    if (value === undefined) return;
                    if (value instanceof File)
                        return body.set(key, value, value.name);
                    if (value instanceof Blob) return body.set(key, value);
                    if (typeof value === "string") return body.set(key, value);
                    if (Array.isArray(value))
                        value.forEach((item) => {
                            if (item === undefined) return;
                            if (item instanceof File)
                                return body.append(key, item, item.name);
                            if (item instanceof Blob)
                                return body.append(key, item);
                            if (typeof item === "string")
                                return body.append(key, item);
                        });
                });
                return body;
            })(),
            method,
            format: "multipart/form-data; charset=utf-8",
        })(options);

const urlencoded =
    (method: "POST" | "PATCH" | "PUT") =>
    <T extends IQuery | URLSearchParams>(
        options: IURLEncodedBodyOptions<T>,
    ): Promise<IResponse> =>
        base({
            body:
                options.body instanceof URLSearchParams
                    ? options.body
                    : new URLSearchParams(parseQueryValueList(options.body)),
            method,
            format: "application/x-www-form-urlencoded; charset=utf-8",
        })(options);

const fetch_with_body = (method: "POST" | "PATCH" | "PUT") =>
    Object.freeze({
        json: json(method),
        text: text(method),
        binary: binary(method),
        formdata: formdata(method),
        urlencoded: urlencoded(method),
    });

export const method = Object.freeze({
    get,
    delete: _delete,
    post: fetch_with_body("POST"),
    patch: fetch_with_body("PATCH"),
    put: fetch_with_body("PUT"),
});

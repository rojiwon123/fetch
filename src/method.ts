import { FetchError } from "./error";
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

const ErrorSyncWrapper =
    <Args extends unknown[], R>(
        message: FetchError["message"],
        closure: (...args: Args) => R,
    ) =>
    (...args: Args) => {
        try {
            return closure(...args);
        } catch (error) {
            throw new FetchError(message, error);
        }
    };

const ErrorAsyncWrapper =
    <Args extends unknown[], R>(
        message: FetchError["message"],
        closure: (...args: Args) => Promise<R>,
    ) =>
    async (...args: Args) =>
        closure(...args).catch((error) => {
            throw new FetchError(message, error);
        });

const base =
    ({
        path = (url: string): URL => new URL(url),
        body = () => null,
        method,
        content_type,
    }: {
        path?: (url: string) => URL;
        body?: () => BodyInit | null;
        method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
        content_type?: string;
    }) =>
    async (options: IOptions): Promise<IResponse> => {
        const url = ErrorSyncWrapper("Invalid URL", path)(options.url);
        const headers = parseHeaders(options.headers);
        if (content_type !== undefined)
            headers.set("content-type", content_type);
        return ErrorAsyncWrapper("Fetch API Error", internal_fetch)(url, {
            headers,
            method,
            body: ErrorSyncWrapper("Invalid Body", body)(),
        });
    };

const get = (options: IQueryOptions) =>
    base({
        path(origin) {
            const url = new URL(origin);
            parseQueryValueList(options.query).forEach(([key, value]) =>
                url.searchParams.append(key, value),
            );
            return url;
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
            body: () => (options.stringify ?? JSON.stringify)(options.body),
            method,
            content_type: "application/json; charset=utf-8",
        })(options);

const text =
    (method: "POST" | "PATCH" | "PUT") =>
    <T extends string | Uint8Array | number | bigint | boolean>(
        options: ITextBodyOptions<T>,
    ): Promise<IResponse> =>
        base({
            body: () => options.body.toString(),
            method,
            content_type: options.content_type ?? "text/plain; charset=utf-8",
        })(options);

const binary =
    (method: "POST" | "PATCH" | "PUT") =>
    <T extends Blob | Uint8Array>(
        options: IBinaryBodyOptions<T>,
    ): Promise<IResponse> =>
        base({
            body: () => options.body,
            method,
            content_type: options.content_type ?? "application/octet-stream",
        })(options);

const formdata =
    (method: "POST" | "PATCH" | "PUT") =>
    <T extends IFormData>(
        options: IFormDataBodyOptions<T>,
    ): Promise<IResponse> =>
        base({
            body: (): FormData => {
                if (options.body instanceof FormData) return options.body;
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
            },
            method,
            content_type: "multipart/form-data; charset=utf-8",
        })(options);

const urlencoded =
    (method: "POST" | "PATCH" | "PUT") =>
    <T extends IQuery | URLSearchParams>(
        options: IURLEncodedBodyOptions<T>,
    ): Promise<IResponse> =>
        base({
            body: () =>
                options.body instanceof URLSearchParams
                    ? options.body
                    : new URLSearchParams(parseQueryValueList(options.body)),
            method,
            content_type: "application/x-www-form-urlencoded; charset=utf-8",
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

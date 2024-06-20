import { FetchError } from "../error";
import { Header } from "../header";
import { internal_fetch } from "../internal_fetch";
import { Query } from "../query";
import { Response } from "../resposne/internal";
import { IFormData, IOptions, IResponse } from "../type";

const path = (options: IOptions<IOptions.Method>) => {
    const url = new URL(options.url);
    Query.entries(options.query).forEach(([key, value]) =>
        url.searchParams.append(key, value),
    );
    return url;
};

const base =
    ({
        body = () => null,
        content_type,
    }: {
        body?: () => BodyInit | null;
        content_type?: string;
    } = {}) =>
    async (options: IOptions<IOptions.Method>): Promise<IResponse> => {
        const url = FetchError.wrap("Invalid URL", path)(options);
        const headers = Header.to(options.headers);
        if (content_type !== undefined)
            headers.set("content-type", content_type);
        const internal_fetch_response = await FetchError.wrap(
            "Fetch API Error",
            internal_fetch,
        )(url, {
            headers,
            method: options.method,
            body: FetchError.wrap("Invalid Body", body)(),
        });

        return FetchError.wrap(
            "Invalid Response Body",
            Response.parse,
            "fail to parse response body",
        )(internal_fetch_response);
    };

/**
 * http get, delete request
 *
 * @param options options for get or delete method http request
 * @return http response
 */
export const query = (options: IOptions<"GET" | "DELETE">) => base()(options);

/**
 * http post, patch, put request with json request body
 *
 * @param options options for post, patch, put method http request
 * @return http response
 */
export const json = <T extends IOptions.JsonBodyType>(
    options: IOptions.IJsonBody<T>,
) =>
    base({
        body: () => (options.stringify ?? JSON.stringify)(options.body),
        content_type: "application/json; charset=utf-8",
    })(options);

/**
 * http post, patch, put request with text request body
 *
 * @param options options for post, patch, put method http request
 * @return http response
 */
export const text = <T extends IOptions.TextBodyType>(
    options: IOptions.ITextBody<T>,
) =>
    base({
        body: () => options.body.toString(),
        content_type: options.content_type ?? "text/plain; charset=utf-8",
    })(options);

/**
 * http post, patch, put request with binary request body
 *
 * @param options options for post, patch, put method http request
 * @return http response
 */
export const binary = <T extends IOptions.BinaryBodyType>(
    options: IOptions.IBinaryBody<T>,
) =>
    base({
        body: () => options.body,
        content_type: options.content_type ?? "application/octet-stream",
    });

const parseFormData = (body: IFormData): FormData => {
    if (body instanceof FormData) return body;
    const form = new FormData();
    Object.entries(body).forEach(([key, value]) =>
        value === undefined
            ? null
            : value instanceof File
              ? form.set(key, value, value.name)
              : value instanceof Blob
                ? form.set(key, value)
                : typeof value === "string"
                  ? form.set(key, value)
                  : !Array.isArray(value)
                    ? null
                    : value.forEach((item) =>
                          item instanceof File
                              ? form.append(key, item, item.name)
                              : item instanceof Blob
                                ? form.append(key, item)
                                : typeof item === "string"
                                  ? form.append(key, item)
                                  : null,
                      ),
    );
    return form;
};

/**
 * http post, patch, put request with form data request body
 *
 * @param options options for post, patch, put method http request
 * @return http response
 */
export const formdata = <T extends IFormData>(
    options: IOptions.IFormDataBody<T>,
) =>
    base({
        body: () => parseFormData(options.body),
        content_type: "multipart/form-data; charset=utf-8",
    })(options);

/**
 * http post, patch, put request with urlencoded request body
 *
 * @param options options for post, patch, put method http request
 * @return http response
 */
export const urlencoded = <T extends IOptions.URLEncodedBodyType>(
    options: IOptions.IURLEncodedBody<T>,
): Promise<IResponse> =>
    base({
        body: () =>
            options.body instanceof URLSearchParams
                ? options.body
                : new URLSearchParams(Query.entries(options.body)),
        content_type: "application/x-www-form-urlencoded; charset=utf-8",
    })(options);

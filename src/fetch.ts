import { IBody, parseBody } from "./body";
import { FetchError } from "./error";
import { IHeaders, parseHeaders } from "./header";
import { internal_fetch } from "./internal_fetch";
import { IQuery, parseQuery } from "./query";

export interface IResponse {
    status: number;
    headers: IHeaders;
    body: string;
}

export type IOptions = IGetOptions | IPostOptions | IDeleteOptions;

export interface IGetOptions {
    method?: "GET";
    url: string;
    query?: IQuery;
    headers?: IHeaders;
}
export interface IPostOptions {
    method: "POST" | "PATCH" | "PUT";
    url: string;
    body: IBody;
    format?: IBody.Format;
    headers?: IHeaders;
}
export interface IDeleteOptions {
    method: "DELETE";
    url: string;
    body?: IBody;
    format?: IBody.Format;
    headers?: IHeaders;
}

const isGetOptions = (options: IOptions): options is IGetOptions =>
    options.method === undefined || options.method === "GET";

export const fetch = async (options: IOptions): Promise<IResponse> => {
    try {
        const url = new URL(options.url);
        if (isGetOptions(options))
            parseQuery(options.query).forEach(([key, value]) =>
                url.searchParams.append(key, value),
            );
        const init: {
            method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
            headers: Headers;
            body: string | null;
        } = {
            method: options.method ?? "GET",
            headers: parseHeaders(options.headers),
            body: null,
        };
        if (!isGetOptions(options)) {
            if (options.body !== undefined) {
                const format = options.format ?? "json";
                switch (format) {
                    case "json":
                        init.body = parseBody.json(options.body);
                        init.headers.set(
                            "content-type",
                            "application/json; charset=utf-8",
                        );
                        break;
                    case "text":
                        init.body = parseBody.text(options.body);
                        init.headers.set(
                            "content-type",
                            "text/plain; charset=utf-8",
                        );
                        break;
                    case "urlencoded":
                        init.body = parseBody.urlencoded(options.body);
                        init.headers.set(
                            "content-type",
                            "application/x-www-form-urlencoded; charset=utf-8",
                        );
                        break;
                }
            }
        }

        const response = await internal_fetch(url, init);
        const body = await response.text();
        return {
            status: response.status,
            headers: Object.fromEntries(response.headers),
            body,
        };
    } catch (error: unknown) {
        throw new FetchError("fail to fetch", error);
    }
};

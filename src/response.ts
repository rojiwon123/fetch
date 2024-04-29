import { FetchError } from "./error";
import { IHeaders, fromHeaders } from "./headers";

export type IResponse = globalThis.Response;
export interface IFetchResponse<IBody, Status> {
    status: Status;
    headers: IHeaders;
    body: IBody;
}

const base =
    <T, Status>(options: {
        content_type: string;
        parser: (res: IResponse) => Promise<T>;
        validator?: ((input: T) => input is T) | ((input: T) => boolean);
        status?: Status;
    }) =>
    async (res: IResponse): Promise<IFetchResponse<T, Status>> => {
        const headers = fromHeaders(res.headers);
        const cause = {
            url: res.url,
            status: res.status,
            headers,
        };
        if (typeof options.status === "number" && options.status !== res.status)
            throw new FetchError("Invalid Status", options, cause);
        if (!res.headers.get("content-type")?.startsWith(options.content_type))
            throw new FetchError(
                "Invalid Response Body",
                "response body content-type not matched.",
                options,
                cause,
            );
        const body = await FetchError.wrap(
            "Invalid Response Body",
            options.parser,
            "fail to parse response body",
            cause,
        )(res);
        if (options.validator && !options.validator(body))
            throw new FetchError(
                "Invalid Response Body",
                "fail to validate response body",
                cause,
            );

        return {
            body,
            status: res.status as Status,
            headers,
        };
    };

const json = <
    T extends object | string | number | boolean | null,
    Status extends number,
>(
    options: {
        validator?: (input: T) => input is T;
        status?: Status;
    } = {},
) =>
    base({
        status: options.status,
        parser: (res) => res.json(),
        validator: options.validator,
        content_type: "application/json",
    });

const text = <T extends string, Status extends number>(
    options: {
        content_type?: `text/${string}`;
        status?: Status;
        validator?: (input: string) => input is T;
    } = {},
) =>
    base({
        status: options.status,
        parser: (res) => res.text(),
        validator: options.validator,
        content_type: options.content_type ?? "text/plain",
    });

// const urlencoded = () => {};
// const binary = () => {};
// const stream = () => {};

export const response = Object.freeze({
    json,
    text,
});

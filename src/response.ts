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
        status?: Status | Status[];
        content_type: string;
        parse: (res: IResponse) => Promise<unknown>;
        is?: (input: unknown) => input is T;
    }) =>
    async (res: IResponse): Promise<IFetchResponse<T, Status>> => {
        const {
            status,
            content_type,
            parse,
            is = (input): input is T => true,
        } = options;
        const mismatchStatus =
            typeof status === "number" && status !== res.status;
        const excludeStatus =
            Array.isArray(status) &&
            !status.some((status) => status === res.status);
        const failyStatus = status === undefined && res.status >= 400;
        if (mismatchStatus || excludeStatus || failyStatus)
            throw new FetchError("Invalid Status", options);
        if (!res.headers.get("content-type")?.startsWith(content_type))
            throw new FetchError(
                "Invalid Response Body",
                "response body content-type not matched.",
                options,
            );
        const body = await FetchError.wrap(
            "Invalid Response Body",
            parse,
            "fail to parse response body",
        )(res);
        if (!is(body))
            throw new FetchError(
                "Invalid Response Body",
                "fail to validate response body",
            );
        return {
            status: res.status as Status,
            headers: fromHeaders(res.headers),
            body,
        };
    };

const json = <
    T extends object | string | number | boolean | null,
    Status extends number,
>(
    options: {
        status?: Status;
        is?: (input: unknown) => input is T;
    } = {},
) =>
    base({
        status: options.status,
        content_type: "application/json",
        parse: (res) => res.json(),
        is: options.is,
    });

const text = <T extends string, Status extends number>(
    options: {
        status?: Status;
        content_type?: `text/${string}`;
        is?: (input: unknown) => input is T;
    } = {},
) =>
    base({
        status: options.status,
        parse: (res) => res.text(),
        is: options.is,
        content_type: options.content_type ?? "text/plain",
    });

// const urlencoded = () => {};
// const binary = () => {};
// const stream = () => {};

export const response = Object.freeze({
    json,
    text,
});

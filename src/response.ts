import { FetchError } from "./error";
import { IHeaders, fromHeaders } from "./headers";

export type IResponse =
    | IResponse.IBase<"none", null>
    | IResponse.IBase<"json", object | string | number | boolean | null>
    | IResponse.IBase<"text", string>
    | IResponse.IBase<"urlencoded", URLSearchParams>
    | IResponse.IBase<"formdata", FormData>
    | IResponse.IBase<"binary", Blob>
    | IResponse.IBase<"stream", ReadableStream<Uint8Array>>;

export namespace IResponse {
    export type BodyType =
        | "none"
        | "json"
        | "text"
        | "urlencoded"
        | "formdata"
        | "binary"
        | "stream";

    export type IBody =
        | object
        | string
        | number
        | boolean
        | null
        | URLSearchParams
        | ReadableStream<Uint8Array>
        | Blob
        | FormData;

    export interface IBase<Type extends BodyType, Body extends IBody> {
        status: number;
        headers: IHeaders;
        type: Type;
        body: Body;
    }
}

const mapResponse =
    (status: number, headers: IHeaders) =>
    <T extends IResponse["type"], R extends (IResponse & { type: T })["body"]>(
        type: T,
        body: R,
    ): IResponse.IBase<T, R> => ({ status, headers, type, body });

/**
 * @internal
 */
export const parseResponse = async (res: Response): Promise<IResponse> => {
    const status = res.status;
    const headers = fromHeaders(res.headers);
    const content_type = res.headers.get("content-type");
    const content_length = res.headers.get("content-length");
    const map = mapResponse(status, headers);
    if (content_length === null || content_length === "0")
        return map("none", await res.text().then(() => null));

    const stream = () =>
        map(
            "stream",
            res.body ??
                new ReadableStream<Uint8Array>({ start: (con) => con.close() }),
        );
    if (content_type === null) return stream();
    if (content_type.startsWith("application/json"))
        return map("json", await res.json());
    if (content_type.startsWith("text/event-stream")) return stream();
    if (content_type.startsWith("text/")) return map("text", await res.text());
    if (content_type.startsWith("application/x-www-form-urlencoded"))
        return map(
            "urlencoded",
            await res.text().then((text) => new URLSearchParams(text)),
        );
    if (content_type.startsWith("multipart/form-data"))
        return map("formdata", await res.formData());
    if (
        content_type.startsWith("application/octet-stream") ||
        content_type.startsWith("image/") ||
        content_type.startsWith("video/")
    )
        return map("binary", await res.blob());
    return stream();
};

type IBody<T extends IResponse.IBody> = (IResponse & { format: T })["body"];
export const responseBody =
    <T extends IResponse.BodyType, R = IBody<T>>(options: {
        status: number;
        type: T;
        parser?: (input: IBody<T>) => R;
    }) =>
    (res: IResponse): R => {
        if (options.status !== res.status)
            throw new FetchError("Invalid Status", options, res);
        if (options.type !== res.type)
            throw new FetchError("Invalid Response Body", options, res);
        const parser = options.parser ?? ((input) => input as unknown as R);
        return FetchError.wrap(
            "Invalid Response Body",
            parser,
            "fail to parse response body",
            res,
        )(res.body as any);
    };

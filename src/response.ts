import { IHeaders, fromHeaders } from "./headers";

export type IResponse =
    | IDefaultResponse<"none", null>
    | IDefaultResponse<"json", object | string | number | boolean | null>
    | IDefaultResponse<"text", string>
    | IDefaultResponse<"urlencoded", URLSearchParams>
    | IDefaultResponse<"formdata", FormData>
    | IDefaultResponse<"binary", Blob>
    | IDefaultResponse<"stream", ReadableStream<Uint8Array>>;

interface IDefaultResponse<
    IFormat extends
        | "none"
        | "json"
        | "text"
        | "urlencoded"
        | "formdata"
        | "binary"
        | "stream",
    IBody extends
        | object
        | string
        | number
        | boolean
        | null
        | URLSearchParams
        | ReadableStream<Uint8Array>
        | Blob
        | FormData,
> {
    status: number;
    headers: IHeaders;
    format: IFormat;
    body: IBody;
}

const mapResponse =
    (status: number, headers: IHeaders) =>
    <
        T extends IResponse["format"],
        R extends (IResponse & { format: T })["body"],
    >(
        format: T,
        body: R,
    ): IDefaultResponse<T, R> => ({ status, headers, format, body });

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

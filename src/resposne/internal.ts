import { Header } from "../header";
import { IHeaders, IResponse, IResponseBase } from "../type";

/**
 * @internal
 */
export namespace Response {
    const map =
        (status: number, headers: IHeaders) =>
        <
            T extends IResponse["type"],
            R extends (IResponse & { type: T })["body"],
        >(
            type: T,
            body: R,
        ): IResponseBase<T, R> => ({ status, headers, type, body });

    export const parse = async (res: Response): Promise<IResponse> => {
        const status = res.status;
        const headers = Header.from(res.headers);
        const content_type = headers["content-type"];
        const content_length = headers["content-length"];
        const response = map(status, headers);
        const stream = () =>
            response(
                "stream",
                res.body ??
                    new ReadableStream<Uint8Array>({
                        start: (con) => con.close(),
                    }),
            );

        if (content_length === "0") return response("none", null);
        if (content_type === undefined)
            return content_length === null ? response("none", null) : stream();

        if (content_type.startsWith("application/json"))
            return response("json", await res.json());
        if (content_type.startsWith("text/event-stream")) return stream();
        if (content_type.startsWith("text/"))
            return response("text", await res.text());
        if (content_type.startsWith("application/x-www-form-urlencoded"))
            return response(
                "urlencoded",
                await res.text().then((text) => new URLSearchParams(text)),
            );
        if (content_type.startsWith("multipart/form-data"))
            return response("formdata", await res.formData());
        if (
            content_type.startsWith("application/octet-stream") ||
            content_type.startsWith("image/") ||
            content_type.startsWith("video/")
        )
            return response("binary", await res.blob());
        return stream();
    };
}

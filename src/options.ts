import { IFormData } from "./formdata";
import { IHeaders } from "./headers";
import { IQuery } from "./query";

export interface IOptions {
    url: string;
    headers?: IHeaders;
}

export interface IQueryOptions extends IOptions {
    query?: IQuery;
}

export interface IJsonBodyOptions<
    T extends object | string | number | boolean | null | undefined,
> extends IOptions {
    body: T;
    stringify?: (input: T) => string;
}

export interface ITextBodyOptions<
    T extends string | number | bigint | boolean | Uint8Array,
> extends IOptions {
    /**
     * @default text/plain
     */
    format?: `text/${string}`;
    body: T;
}

export interface IBinaryBodyOptions<T extends Blob | Uint8Array>
    extends IOptions {
    /**
     * @default application/octet-stream
     */
    format?: "application/octet-stream" | `video/${string}` | `image/${string}`;
    body: T;
}

export interface IFormDataBodyOptions<T extends IFormData> extends IOptions {
    body: T;
}

export interface IURLEncodedBodyOptions<T extends IQuery | URLSearchParams>
    extends IOptions {
    body: T;
}

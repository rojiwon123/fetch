import { IFormData } from "./formdata";
import { IHeaders } from "./headers";
import { IQuery } from "./query";

export interface IOptions<T extends IOptions.Method> {
    url: string;
    query?: IQuery;
    headers?: IHeaders;
    method: T;
}

export namespace IOptions {
    export type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    export type JsonBodyType =
        | object
        | string
        | number
        | boolean
        | null
        | undefined;
    export type TextBodyType = string | number | bigint | boolean | Uint8Array;
    export type BinaryBodyType = Blob | Uint8Array;
    export type URLEncodedBodyType = IQuery | URLSearchParams;

    export interface IJsonBody<T extends JsonBodyType>
        extends IOptions<"POST" | "PATCH" | "PUT"> {
        body: T;
        stringify?: (input: T) => string;
    }

    export interface ITextBody<T extends TextBodyType>
        extends IOptions<"POST" | "PATCH" | "PUT"> {
        /**
         * @default text/plain
         */
        content_type?: `text/${string}`;
        body: T;
    }

    export interface IBinaryBody<T extends BinaryBodyType>
        extends IOptions<"POST" | "PATCH" | "PUT"> {
        /**
         * @default application/octet-stream
         */
        content_type?: string;
        body: T;
    }

    export interface IFormDataBody<T extends IFormData>
        extends IOptions<"POST" | "PATCH" | "PUT"> {
        body: T;
    }

    export interface IURLEncodedBody<T extends URLEncodedBodyType>
        extends IOptions<"POST" | "PATCH" | "PUT"> {
        body: T;
    }
}

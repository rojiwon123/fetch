import { IHeaders } from "./headers";

export interface IResponseBase<Type extends BodyType, Body extends IBody> {
    status: number;
    headers: IHeaders;
    type: Type;
    body: Body;
}

export type IResponse =
    | IResponseBase<"none", null>
    | IResponseBase<"json", object | string | number | boolean | null>
    | IResponseBase<"text", string>
    | IResponseBase<"urlencoded", URLSearchParams>
    | IResponseBase<"formdata", FormData>
    | IResponseBase<"binary", Blob>
    | IResponseBase<"stream", ReadableStream<Uint8Array>>;

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

import { parseQuery } from "./query";

export type IBody = string | number | bigint | boolean | object;
export namespace IBody {
    export type Format = "json" | "text" | "urlencoded";
}

/**
 * @internal
 */
export namespace parseBody {
    export const json = (body: IBody): string => JSON.stringify(body);
    export const text = (body: IBody): string =>
        body === null ? "" : body.toString();
    export const urlencoded = (body: IBody): string =>
        typeof body !== "object"
            ? ""
            : new URLSearchParams(parseQuery(body)).toString();
}

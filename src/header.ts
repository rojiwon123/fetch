import { IncomingHttpHeaders } from "http";

export type IHeaders = IncomingHttpHeaders;

/**
 * @internal
 */
export const parseHeaders = (input?: IHeaders): Headers => {
    const headers = new Headers();
    for (const [key, value] of Object.entries(input ?? {}))
        if (Array.isArray(value))
            value.forEach((item) => {
                if (typeof item === "string") headers.append(key, item);
            });
        else if (typeof value === "string") headers.append(key, value);
    return headers;
};

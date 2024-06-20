import { IQuery, QueryValue } from "../type";

/**
 * @internal
 */
export const is = (input: unknown): input is QueryValue => {
    if (input === null) return true;
    const type = typeof input;
    if (type === "string") return true;
    if (type === "number") return true;
    if (type === "bigint") return true;
    if (type === "boolean") return true;
    return false;
};

/**
 * @internal
 */
export const entries = (query?: IQuery): [string, string][] => {
    const list: [string, string][] = [];
    if (query === undefined) return list;
    Object.entries(query).forEach(([key, value]) =>
        Array.isArray(value)
            ? value.forEach((item) =>
                  is(item)
                      ? list.push([key, item?.toString() ?? "null"])
                      : null,
              )
            : is(value)
              ? list.push([key, value?.toString() ?? "null"])
              : null,
    );
    return list;
};

export type QueryValue = string | number | bigint | boolean | null;
export type IQuery = Record<string, QueryValue | QueryValue[]>;

const is_query_value = (input: unknown): input is QueryValue => {
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
export const parseQuery = (input?: object): [string, string][] => {
    const query: [string, string][] = [];
    if (typeof input !== "object" || input === null) return query;
    for (const [key, value] of Object.entries(input))
        if (Array.isArray(value)) {
            for (const item of value)
                if (is_query_value(item))
                    query.push([key, item?.toString() ?? "null"]);
        } else if (is_query_value(value))
            query.push([key, value?.toString() ?? "null"]);
    return query;
};

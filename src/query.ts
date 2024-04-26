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
export const parseQueryValueList = (
    query: IQuery | undefined,
): [string, string][] => {
    const list: [string, string][] = [];
    if (typeof query !== "object" || query === null) return list;
    Object.entries(query).forEach(([key, value]) =>
        Array.isArray(value)
            ? value.forEach((item) =>
                  is_query_value(item)
                      ? list.push([key, item?.toString() ?? "null"])
                      : null,
              )
            : is_query_value(value)
              ? list.push([key, value?.toString() ?? "null"])
              : null,
    );
    return list;
};

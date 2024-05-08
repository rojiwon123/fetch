import assert from "node:assert";
import test from "node:test";

import fetch, { IQuery, response } from "../..";
import { fns } from "../util";

const it =
    (host: string) =>
    (
        name: string,
        actual: URLSearchParams | IQuery,
        expected: URLSearchParams | IQuery = actual,
    ) =>
        test.it(name, () =>
            fetch.method.post
                .urlencoded({ url: host + "/body", body: actual })
                .then(response.json({ status: 201 }))
                .then((res) => assert.deepStrictEqual(res.body, expected)),
        );

export const describe_urlencoded = (url: string) =>
    test.describe("urlencoded test", { concurrency: true }, () =>
        fns(it(url))(
            ["str", { str: "str" }],
            ["strs", { str: ["str1", "str2", "str3", "str4"] }],
            ["num", { nums: 1 }, { nums: "1" }],
            ["nums", { nums: [1, 2, 3, 4] }, { nums: ["1", "2", "3", "4"] }],
            ["bool", { bool: true }, { bool: "true" }],
            [
                "bools",
                { bool: [true, true, false] },
                { bool: ["true", "true", "false"] },
            ],
            ["null", { nul: null }, { nul: "null" }],
            [
                "nulls",
                { nul: [null, null, null] },
                { nul: ["null", "null", "null"] },
            ],
            [
                "complex",
                {
                    json: {
                        num: 123,
                    },
                    list: ["str", 12, false, null, undefined],
                    nums: [1, 2, 3, 4],
                    num: 123,
                    str: "1235",
                } as any,
                {
                    list: ["str", "12", "false", "null"],
                    nums: ["1", "2", "3", "4"],
                    num: "123",
                    str: "1235",
                },
            ],
        ),
    );

import assert from "node:assert";
import test from "node:test";

import fetch, { IQuery } from "../..";
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
                .urlencoded({ url: host + "/urlencoded", body: actual })
                .then(async (res) => {
                    assert.strictEqual(res.status, 201);
                    assert.deepStrictEqual(await res.json(), expected);
                }),
        );

export const describe_urlencoded = (url: string) =>
    test.describe("text test", { concurrency: true }, () =>
        fns(it(url))(
            [
                "json body",
                {
                    test: "test",
                    num: 123,
                    bo: false,
                    nums: [1, 2, 3, 4, "5"],
                },
                {
                    test: "test",
                    num: "123",
                    bo: "false",
                    nums: ["1", "2", "3", "4", "5"],
                },
            ],
            [
                "param body",
                (() => {
                    const params = new URLSearchParams();
                    params.append("test", "test");
                    params.append("num", "123");
                    params.append("bo", "false");
                    params.append("nums", "1");
                    params.append("nums", "2");
                    params.append("nums", "3");
                    params.append("nums", "4");
                    params.append("nums", "5");
                    return params;
                })(),
                {
                    test: "test",
                    num: "123",
                    bo: "false",
                    nums: ["1", "2", "3", "4", "5"],
                },
            ],
        ),
    );

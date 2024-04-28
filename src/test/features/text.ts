import assert from "node:assert";
import test from "node:test";

import fetch from "../..";
import { fns } from "../util";

const like_json = JSON.stringify({
    test: "test",
    num: 123,
    bo: false,
    nums: [1, 2, 3, 4, "5"],
});

const it =
    (host: string) =>
    (
        name: string,
        actual: string | number | boolean,
        expected: string | number | boolean = actual,
    ) =>
        test.it(name, () =>
            fetch.method.post
                .text({ url: host + "/text", body: actual })
                .then(async (res) => {
                    assert.strictEqual(res.status, 201);
                    assert.deepStrictEqual(await res.json(), expected);
                }),
        );

export const describe_text = (url: string) =>
    test.describe("text test", { concurrency: true }, () =>
        fns(it(url))(
            [
                "json body",
                like_json,
                '{"test":"test","num":123,"bo":false,"nums":[1,2,3,4,"5"]}',
            ],
            ["text body", "this is test text"],
            ["number body", 123, "123"],
            ["boolean body", true, "true"],
        ),
    );

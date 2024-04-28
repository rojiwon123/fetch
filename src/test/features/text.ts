import assert from "node:assert";
import test from "node:test";

import fetch from "../..";

const like_json = JSON.stringify({
    test: "test",
    num: 123,
    bo: false,
    nums: [1, 2, 3, 4, "5"],
});

const it =
    (name: string, actual: string | number | boolean, expected: string) =>
    (host: string) =>
        test
            .it(name, { concurrency: true }, () =>
                fetch.method.post
                    .text({ url: host + "/text", body: actual })
                    .then(async (res) => {
                        assert.strictEqual(res.status, 201);
                        assert.deepStrictEqual(await res.json(), expected);
                    }),
            )
            .then(() => host);

export const describe_text = (url: string) =>
    test
        .describe("text test", { concurrency: true }, () =>
            it(
                "json body",
                like_json,
                '{"test":"test","num":123,"bo":false,"nums":[1,2,3,4,"5"]}',
            )(url)
                .then(it("text body", "this is test text", "this is test text"))
                .then(it("number body", 123, "123"))
                .then(it("boolean body", true, "true"))
                .then(() => {}),
        )
        .then(() => url);

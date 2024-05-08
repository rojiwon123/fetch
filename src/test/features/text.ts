import assert from "node:assert";
import test from "node:test";

import fetch, { response } from "../..";
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
                .text({ url: host + "/body", body: actual })
                .then(response.json({ status: 201 }))
                .then((res) => assert.deepStrictEqual(res.body, expected)),
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

import assert from "assert";
import test from "node:test";

import fetch, { response } from "../..";
import { fns } from "../util";

const json = {
    test: "test",
    num: 123,
    bo: false,
    nums: [1, 2, 3, 4, "5"],
};

const it =
    (url: string) =>
    (
        name: string,
        actual: object | string | number | boolean | null,
        expected: object | string | number | boolean | null = actual,
    ) =>
        test.it(name, () =>
            fetch.method.post
                .json({ url: url + "/text-response", body: actual })
                .then(response.text({ status: 201 }))
                .then((res) => assert.deepStrictEqual(res.body, expected)),
        );

export const describe_text_response = (url: string) =>
    test.describe("text response test", { concurrency: true }, () =>
        fns(it(url))(
            [
                "json body",
                json,
                '{"test":"test","num":123,"bo":false,"nums":[1,2,3,4,"5"]}',
            ],
            ["text body", "this is test text"],
            ["number body", 123, "123"],
            ["boolean body", true, "true"],
        ),
    );

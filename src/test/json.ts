import assert from "assert";
import test from "node:test";

import fetch from "..";

const json_body = {
    test: "test",
    num: 123,
    bol: true,
    nul: null,
    und: undefined,
    list: [123, "test", null, true, undefined],
    nested: {
        test: "test",
        num: 123,
        bol: true,
        nul: null,
        und: undefined,
        list: [123, "test", null, true, undefined],
    },
} as const;

const it =
    (
        name: string,
        actual: object | string | number | boolean | null,
        expected: object | string | number | boolean | null = actual,
    ) =>
    (host: string) =>
        test
            .it(name, { concurrency: true }, () =>
                fetch.method.post
                    .json({ url: host + "/json", body: actual })
                    .then(async (res) => {
                        assert.strictEqual(res.status, 201);
                        assert.deepStrictEqual(await res.json(), expected);
                    }),
            )
            .then(() => host);

export const describe_json = (url: string) =>
    test
        .describe("json test", { concurrency: true }, () =>
            it("json body", json_body, {
                test: "test",
                num: 123,
                bol: true,
                nul: null,
                // und: undefined -> 필터링
                list: [123, "test", null, true, null], // list에서 item이 없으면 null로 대체
                nested: {
                    test: "test",
                    num: 123,
                    bol: true,
                    nul: null,
                    list: [123, "test", null, true, null],
                },
            })(url)
                .then(it("text body", "atomic test"))
                .then(it("number body", 123))
                .then(it("boolean body", true))
                .then(
                    it(
                        "list body",
                        [123, 2, 3, "4", undefined],
                        [123, 2, 3, "4", null],
                    ),
                )
                .then(it("null body", null))
                .then(it("undefined body", undefined as any, {}))
                .then(() => {}),
        )
        .then(() => url);

import fetch from "@rojiwon123/fetch";
import test from "node:test";

import { assert, fns } from "../util";

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
    (url: string) =>
    (
        name: string,
        actual: object | string | number | boolean | null,
        expected: object | string | number | boolean | null = actual,
    ) =>
        test.it(name, () =>
            fetch.request
                .json({ url: url + "/body", body: actual, method: "POST" })
                .then(
                    fetch.response.match({
                        201: fetch.response.json((i) => i),
                    }),
                )
                .then(assert(expected)),
        );

export const describe_json = (url: string) =>
    test.describe("json test", { concurrency: true }, () =>
        fns(it(url))(
            [
                "json body",
                json_body,
                {
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
                },
            ],
            ["text body", "atomic test"],
            ["number body", 123],
            ["boolean body", true],
            ["list body", [123, 2, 3, "4", undefined], [123, 2, 3, "4", null]],
            ["null body", null],
            ["undefined body", undefined as any, {}],
        ),
    );

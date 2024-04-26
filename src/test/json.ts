import assert from "assert";
import express from "express";

import fetch from "..";

const base = "http://localhost:4000/json";

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

const json = async (
    path: string,
    body: object | string | number | boolean | null,
) =>
    fetch.method.post
        .json({ url: base + path, body })
        .then((res) => assert.strictEqual(res.status, 201));

const json_request_with_json_body = () => json("/json", json_body);

const json_request_with_text_body = () => json("/str", "atomic test");
const json_request_with_number_body = () => json("/num", 123);
const json_request_with_boolean_body = () => json("/bool", true);
const json_request_with_list_body = () =>
    json("/list", [123, 2, 3, "4", undefined]);

const json_request_with_null_body = () => json("/null", null);
const json_request_with_undefined_body = () => json("/und", undefined as any);

export const json_router = express.Router();

export const json_tests: (() => Promise<void>)[] = [
    json_request_with_json_body,
    json_request_with_text_body,
    json_request_with_number_body,
    json_request_with_boolean_body,
    json_request_with_list_body,
    json_request_with_null_body,
    json_request_with_undefined_body,
];

json_router.post("/json", (req, res) => {
    assert.deepStrictEqual(req.body, {
        test: "test",
        num: 123,
        bol: true,
        nul: null,
        list: [123, "test", null, true, null],
        nested: {
            test: "test",
            num: 123,
            bol: true,
            nul: null,
            list: [123, "test", null, true, null],
        },
    });
    res.status(201).end();
});

json_router.post("/str", (req, res) => {
    assert.deepStrictEqual(req.body, "atomic test");
    res.status(201).end();
});

json_router.post("/num", (req, res) => {
    assert.deepStrictEqual(req.body, 123);
    res.status(201).end();
});

json_router.post("/bool", (req, res) => {
    assert.deepStrictEqual(req.body, true);
    res.status(201).end();
});

json_router.post("/list", (req, res) => {
    assert.deepStrictEqual(req.body, [123, 2, 3, "4", null]);
    res.status(201).end();
});

json_router.post("/null", (req, res) => {
    assert.deepStrictEqual(req.body, null);
    res.status(201).end();
});
json_router.post("/und", (req, res) => {
    assert.deepStrictEqual(req.body, {});
    // undefined는 빈 객체로 변환된다. -> 본래 형태가 아님
    // 논리적으로 undefined는 정의되지 않음을 의미하기에 데이터라고 볼 수 없다.
    // 따라서 타입적으로 제외시킨다.
    res.status(201).end();
});

import assert from "assert";
import express from "express";

import fetch, { IResponse } from "..";

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
    body: object,
    validate: (response: IResponse) => Promise<void> | void,
) => fetch.method.post.json({ url: base + path, body }).then(validate);

const json_request_with_json_body = () =>
    json("/json", json_body, (res) => assert.strictEqual(res.status, 201));

const json_request_with_text_body = () =>
    json("/str", "atomic test" as any, (res) => {
        assert.strictEqual(res.status, 400);
        assert.strictEqual(
            res.headers.get("content-type"),
            "text/html; charset=utf-8",
        );
    });
const json_request_with_number_body = () =>
    json("/num", 123 as any, (res) => {
        assert.strictEqual(res.status, 400);
        assert.strictEqual(
            res.headers.get("content-type"),
            "text/html; charset=utf-8",
        );
    });
const json_request_with_boolean_body = () =>
    json("/bool", true as any, (res) => {
        assert.strictEqual(res.status, 400);
        assert.strictEqual(
            res.headers.get("content-type"),
            "text/html; charset=utf-8",
        );
    });
const json_request_with_list_body = () =>
    json("/list", [123, 2, 3, "4", undefined], (res) =>
        assert.strictEqual(res.status, 201),
    );

export const json_router = express.Router();

export const json_tests: (() => Promise<void>)[] = [
    json_request_with_json_body,
    json_request_with_text_body,
    json_request_with_number_body,
    json_request_with_boolean_body,
    json_request_with_list_body,
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

json_router.post("/str", (_, res) => {
    res.status(201).end();
});

json_router.post("/num", (_, res) => {
    res.status(201).end();
});

json_router.post("/bool", (_, res) => {
    res.status(201).end();
});

json_router.post("/list", (req, res) => {
    assert.deepStrictEqual(req.body, [123, 2, 3, "4", null]);
    res.status(201).end();
});

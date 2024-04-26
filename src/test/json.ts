import assert from "assert";
import express from "express";

import fetch from "..";
import { created } from "./util";

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
const json_expected = {
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
} as const;

const json = (path: string, body: object) =>
    fetch.method.post.json({ url: base + path, body });

const json_request_with_json_body = () => created(json("/json", json_body));

const json_request_with_text_body = () =>
    created(json("/str", "atomic test" as any));
const json_request_with_number_body = () => created(json("/num", 123 as any));
const json_request_with_boolean_body = () =>
    created(json("/bool", true as any));
const json_request_with_list_body = () =>
    created(json("/list", [123, 2, 3, "4", undefined]));

export const json_router = express.Router();

export const json_tests = [
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

json_router.post("/str", (req, res) => {
    console.log(req.body);
    assert.deepStrictEqual(req.body, json_expected);
    res.status(201).end();
});

json_router.post("/num", (req, res) => {
    console.log(req.body);
    assert.deepStrictEqual(req.body, json_expected);
    res.status(201).end();
});

json_router.post("/bool", (req, res) => {
    console.log(req.body);
    assert.deepStrictEqual(req.body, json_expected);
    res.status(201).end();
});

json_router.post("/list", (req, res) => {
    assert.deepStrictEqual(req.body, [123, 2, 3, "4", null]);
    res.status(201).end();
});

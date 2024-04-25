import assert from "assert";
import express from "express";

import { fetch } from "../fetch";
import { created } from "./util";

const base = "http://localhost:4000/content-type";

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

const test_json_with_no_content_type = () =>
    created(fetch({ url: base + "/json", method: "POST", body: json_body }));

const test_json_with_json_type = () =>
    created(
        fetch({
            url: base + "/json",
            method: "POST",
            body: json_body,
            format: "json",
        }),
    );

const test_json_with_text_type = () =>
    created(
        fetch({
            url: base + "/text",
            method: "POST",
            body: json_body,
            format: "text",
        }),
    );

const test_json_with_urlencoded_type = () =>
    created(
        fetch({
            url: base + "/urlencoded",
            method: "POST",
            body: json_body,
            format: "urlencoded",
        }),
    );

export const content_type_router = express.Router();
export const content_type_tests = [
    test_json_with_no_content_type,
    test_json_with_json_type,
    test_json_with_text_type,
    test_json_with_urlencoded_type,
];

content_type_router.post("/json", (req, res) => {
    assert.deepStrictEqual(req.body, json_expected);
    res.status(201).end();
});

content_type_router.post("/text", (req, res) => {
    assert.deepStrictEqual(req.body, json_expected.toString());
    res.status(201).end();
});

content_type_router.post("/urlencoded", (req, res) => {
    assert.deepStrictEqual(req.body, {
        test: "test",
        num: "123",
        bol: "true",
        nul: "null",
        list: ["123", "test", "null", "true"],
    });
    // query 형식에 안맞는 값은 모두 삭제합니다.
    // nested object는 지원하지 않습니다.
    res.status(201).end();
});

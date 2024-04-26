import assert from "assert";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import test from "node:test";

import { json_router, json_tests } from "./json";
import { test_fetch } from "./test_fetch";

const app = express();

app.use(cookieParser("abcde"));

app.use(
    // bodyParser.raw(),
    bodyParser.text(),
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),
);

app.get("/", (req, res) => {
    assert.deepStrictEqual(req.body, {});
    res.json(123);
});

app.use("/json", json_router);

const server = app.listen(4000);

const execute = (...fns: (() => Promise<void>)[]) =>
    Promise.all(fns.map((fn) => test(fn.name, fn)));

void execute(test_fetch, ...json_tests).finally(() =>
    server.close((err) => {
        if (err) console.log(err);
    }),
);

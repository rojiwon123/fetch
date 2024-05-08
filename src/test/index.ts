import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import test from "node:test";

import fetch from "..";
import { describe_json } from "./features/json";
import { describe_query } from "./features/query";
import { describe_text } from "./features/text";
import { describe_text_response } from "./features/text_response";
import { describe_urlencoded } from "./features/urlencoded";
import { validateWithoutHeaders } from "./util";

const app = express();

app.use(cookieParser("abcde"));

app.use(
    bodyParser.text(),
    bodyParser.json({ strict: false }),
    bodyParser.urlencoded({ extended: true }),
);

const fromBody = (body: unknown) => JSON.stringify(body);

app.post("/text-response", (req, res) =>
    res
        .setHeader("content-type", "text/plain; charset=utf-8")
        .status(201)
        .send(typeof req.body === "string" ? req.body : fromBody(req.body))
        .end(),
);

app.post("/urlencoded-response", (req, res) =>
    res
        .setHeader(
            "content-type",
            "application/x-www-form-urlencoded; charset=utf-8",
        )
        .status(201)
        .send(fromBody(req.body))
        .end(),
);
app.get("/", (_, res) => res.status(201).end());

app.get("/query", (req, res) =>
    res
        .setHeader("content-type", "application/json; charset=utf-8")
        .status(201)
        .send(fromBody(req.query))
        .end(),
);
app.post("/body", (req, res) =>
    res
        .setHeader("content-type", "application/json; charset=utf-8")
        .status(201)
        .send(fromBody(req.body))
        .end(),
);

const server = app.listen(4000);

const host = "http://localhost:4000";

const start = (url: string) =>
    test.it("test start", { concurrency: true }, () =>
        fetch.method.get({ url }).then(
            validateWithoutHeaders({
                status: 201,
                format: "none",
                body: null,
            }),
        ),
    );

const end = () =>
    server.close((err: unknown) => (err ? console.error(err) : null));

const execute = (...fns: ((url: string) => Promise<void>)[]) =>
    Promise.all(fns.map((fn) => fn(host)));

void execute(
    start,
    describe_json,
    describe_text,
    describe_query,
    describe_urlencoded,
    describe_text_response,
).finally(end);
[describe_text, describe_query, describe_urlencoded, describe_text_response];

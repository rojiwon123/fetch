import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import test from "node:test";

import fetch from "..";
import { describe_json } from "./features/json";
import { describe_query } from "./features/query";
import { describe_text } from "./features/text";
import { describe_urlencoded } from "./features/urlencoded";

const app = express();

app.use(cookieParser("abcde"));

app.use(
    // bodyParser.raw(),
    bodyParser.text(),
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json({ strict: false }),
);

app.get("/", (_, res) => res.end());
app.get("/query", (req, res) => res.status(201).json(req.query));
app.post("/json", (req, res) => res.status(201).json(req.body));
app.post("/text", (req, res) => res.status(201).json(req.body));
app.post("/urlencoded", (req, res) => res.status(201).json(req.body));

const server = app.listen(4000);

const host = "http://localhost:4000";

const start = (url: string) =>
    test.it("test start", { concurrency: true }, () =>
        fetch.method.get({ url }).then(() => {}),
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
).finally(end);

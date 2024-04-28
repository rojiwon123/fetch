import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import test from "node:test";

import fetch from "..";
import { describe_json } from "./features/json";
import { describe_text } from "./features/text";

const app = express();

app.use(cookieParser("abcde"));

app.use(
    // bodyParser.raw(),
    bodyParser.text(),
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json({ strict: false }),
);

app.get("/", (_, res) => res.end());
app.post("/json", (req, res) => res.status(201).json(req.body));
app.post("/text", (req, res) => res.status(201).json(req.body));

const server = app.listen(4000);

const host = "http://localhost:4000";

const start = (url: string) =>
    test
        .it("test start", { concurrency: true }, () =>
            fetch.method.get({ url }).then(() => {}),
        )
        .then(() => url);

const end = () =>
    server.close((err: unknown) => (err ? console.error(err) : null));

void start(host)
    .then(describe_json)
    .then(describe_text)

    .finally(end);

import assert from "node:assert";

import fetch from "..";

export const fns =
    <Args extends unknown[]>(fn: (...args: Args) => Promise<void>) =>
    (...parameters: Args[]) =>
        Promise.all(parameters.map((args) => fn(...args))).then(() => {});

export const validateWithoutHeaders =
    (expected: Omit<fetch.IResponse, "headers">) =>
    (actual: fetch.IResponse) => {
        assert.deepStrictEqual(
            { status: actual.status, format: actual.format, body: actual.body },
            {
                status: expected.status,
                format: expected.format,
                body: expected.body,
            },
        );
    };

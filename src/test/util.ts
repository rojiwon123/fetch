import _assert from "node:assert";

import fetch from "..";

export const fns =
    <Args extends unknown[]>(fn: (...args: Args) => Promise<void>) =>
    (...parameters: Args[]) =>
        Promise.all(parameters.map((args) => fn(...args))).then(() => {});

export const assert =
    (expected: fetch.IResponse.IBody) => (actual: fetch.IResponse.IBody) =>
        _assert.deepStrictEqual(actual, expected);

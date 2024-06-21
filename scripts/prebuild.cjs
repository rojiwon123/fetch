"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");

/**
 * @type {Record<string, string | object>}
 */
const root_package = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf-8"),
);

const README = fs.readFileSync(
    path.resolve(__dirname, "../README.md"),
    "utf-8",
);

const ignores = ["scripts", "devDependencies"];
const entries = Object.entries(root_package).filter(
    ([key]) => !ignores.includes(key),
);

// DELETE Cached
rimraf.rimrafSync(path.resolve(__dirname, "../package"));

// MK DIR
fs.mkdirSync(path.resolve(__dirname, "../package"));

// COPY package.json
fs.writeFileSync(
    path.resolve(__dirname, "../package/package.json"),
    JSON.stringify(Object.fromEntries(entries), null, 2),
    { encoding: "utf-8", flag: "w" },
);

// COPY README.md
fs.writeFileSync(path.resolve(__dirname, "../package/README.md"), README, {
    encoding: "utf-8",
    flag: "w",
});

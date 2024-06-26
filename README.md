# Fetch API

[![npm version](https://img.shields.io/npm/v/@rojiwon123/fetch.svg)](https://www.npmjs.com/package/@rojiwon123/fetch)
[![Downloads](https://img.shields.io/npm/dm/@rojiwon123/fetch.svg?logo=npm)](https://www.npmjs.com/package/@rojiwon123/fetch)
[![Release 🔖](https://github.com/rojiwon123/fetch/actions/workflows/release.yml/badge.svg)](https://github.com/rojiwon123/fetch/actions/workflows/release.yml)

Fetch API wrapped around the original fetch function

## Installation

```sh
npm i @rojiwon123/fetch
```

## Example

```typescript
import fetch from "@rojiwon123/fetch";

void fetch.request
    .query({ url: "http://localhost:3000", method: "GET" })
    .then(fetch.response.match({ 200: fetch.response.none() }))
    .then(console.log); // null

// request headers content-type value is `application/json; charset=utf-8`
void fetch.request
    .json({
        url: "http://localhost:3000",
        body: { test: "test" },
        method: "POST",
    })
    .then(
        fetch.response.match({
            201: fetch.response.json((i) => i), // status 201 case
            _: fetch.response.text((i) => i), // default case
        }),
    )
    .then(console.log); // log response body
```

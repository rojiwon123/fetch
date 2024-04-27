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

void fetch.method
    .get({ url: "http://localhost:3000" })
    .then(async (res) => console.log(res.status, await res.text()));

// request headers content-type value is `application/json; charset=utf-8`
void fetch.method.post
    .json({ url: "http://localhost:3000", body: { test: "test" } })
    .then(async (res) => console.log(res.status, await res.text()));
```

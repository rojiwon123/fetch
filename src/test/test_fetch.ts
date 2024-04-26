import fetch from "..";
import { ok } from "./util";

const base = "http://localhost:4000";

export const test_fetch = () => ok(fetch.method.get({ url: base }));

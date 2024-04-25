import { IResponse } from "../fetch";

export const expect =
    (status: number) => async (response: Promise<IResponse>) => {
        const result = await response;
        if (status !== result.status)
            throw Error("response status is unmatched!");
    };

export const ok = expect(200);
export const created = expect(201);

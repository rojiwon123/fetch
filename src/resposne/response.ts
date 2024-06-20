import { FetchError } from "../error";
import { BodyType, IResponse } from "../type";

type IBodyType<T extends BodyType> = (IResponse & {
    type: T;
})["body"];

interface IMatchOptions {
    [status: number]: (res: IResponse) => unknown;
    _?: (res: IResponse) => unknown;
}

type ReturnType<T> = T extends (...args: any) => infer R ? R : never;

export const match =
    <T extends IMatchOptions>(options: T) =>
    (res: IResponse): ReturnType<T[keyof T]> =>
        (
            options[res.status] ??
            options["_"] ??
            (() => {
                throw new FetchError("Unexpected Resposne", options, res);
            })
        )(res) as ReturnType<T[keyof T]>;

const validate =
    <T extends BodyType>(type: T) =>
    <R>(parser: (input: IBodyType<T>) => R) =>
    (res: IResponse) => {
        if (res.type !== type)
            throw new FetchError(
                "Invalid Response Body",
                "response body is not promise type",
                res,
            );
        return FetchError.wrap(
            "Invalid Response Body",
            parser,
            "fail to parse resposne body",
            res,
        )(res.body as IBodyType<T>);
    };

export const json = validate("json");
export const text = validate("text");
export const urlencoded = validate("urlencoded");
export const formdata = validate("formdata");
export const binary = validate("binary");
export const stream = validate("stream");
export const none = () => validate("none")(() => null);

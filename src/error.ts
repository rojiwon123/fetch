export class FetchError extends Error {
    constructor(
        override readonly message: string,
        cause?: unknown,
    ) {
        if (cause !== undefined) super(message, { cause });
        super(message);
    }

    static throw(message: string) {
        return (err: unknown) => {
            throw new FetchError(message, err);
        };
    }
}

export class FetchException extends Error {
    constructor(
        public override readonly message:
            | "Invalid Body"
            | "Invalid URL"
            | "Fetch API Error",
        ...cause: unknown[]
    ) {
        if (cause.length === 0) super(message);
        else super(message, { cause });
    }
}

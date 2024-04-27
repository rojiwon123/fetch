export class FetchError extends Error {
    constructor(
        public override readonly message:
            | "Invalid Body"
            | "Invalid URL"
            | "Fetch API Error",
        ...causes: unknown[]
    ) {
        super(message);
        if (causes.length > 0) super.cause = causes;
    }
}

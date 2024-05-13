export class FetchError extends Error {
    constructor(
        public override readonly message:
            | "Invalid Body"
            | "Invalid URL"
            | "Invalid Response Body"
            | "Fetch API Error"
            | "Unexpected Resposne",
        ...causes: unknown[]
    ) {
        super(message);
        if (causes.length > 0) super.cause = causes;
    }

    static wrap<Args extends unknown[], R>(
        message: FetchError["message"],
        closure: (...args: Args) => R,
        ...causes: unknown[]
    ) {
        return (...args: Args): R => {
            try {
                const result = closure(...args);
                if (result instanceof Promise)
                    return result.catch((error) => {
                        throw new FetchError(message, error, ...causes);
                    }) as R;
                return result;
            } catch (error) {
                throw new FetchError(message, error, ...causes);
            }
        };
    }
}

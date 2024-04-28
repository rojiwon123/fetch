export const fns =
    <Args extends unknown[]>(fn: (...args: Args) => Promise<void>) =>
    (...parameters: Args[]) =>
        Promise.all(parameters.map((args) => fn(...args))).then(() => {});

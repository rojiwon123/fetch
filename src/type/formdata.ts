export type IFormData =
    | Record<string, string | Blob | File | (string | Blob | File)[]>
    | FormData;

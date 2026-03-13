export type AuthorizationHeader = {
  Authorization?: `Bearer ${string}`;
};

export type GetOptions = {
  method: "GET";
  url: string;
};

export type PostOptions<T> = {
  method: "POST";
  url: string;
  body: T | undefined;
};

export type PutOptions<T> = {
  method: "PUT";
  url: string;
  body: T;
};

export type PatchOptions<T> = {
  method: "PATCH";
  url: string;
  body: T;
};

export type DeleteOptions<T> = {
  method: "DELETE";
  url: string;
  body: T | undefined;
};

export type OptionsType<T> =
  | GetOptions
  | PostOptions<T>
  | PutOptions<T>
  | PatchOptions<T>
  | DeleteOptions<T>;

export type ResponseType<R> =
  | { ok: true; status: number; body: R }
  | {
      ok: false;
      status: number;
      body: { code: number; message: string; description: string };
    };

export const APIResponse = {
  respondWithSuccess: <T>(data: T) => Response.json(data, { status: 200 }),

  respondWithBadRequest: (errors: { path: string; message: string }[]) =>
    Response.json({ errors }, { status: 400 }),

  respondWithUnauthorized: () =>
    Response.json(
      { message: "Token autentikasi tidak valid!" },
      { status: 401 }
    ),

  respondWithForbidden: (message: string) =>
    Response.json({ message }, { status: 403 }),

  respondWithNotFound: (message: string) =>
    Response.json({ message }, { status: 404 }),

  respondWithConflict: (message: string) =>
    Response.json({ message }, { status: 409 }),

  respondWithServerError: (
    message: string = "Terjadi kesalahan tak terduga pada server!"
  ) => Response.json({ message }, { status: 500 }),
};

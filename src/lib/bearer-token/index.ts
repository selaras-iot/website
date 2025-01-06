import { NextRequest } from "next/server";

export const verifyBearerToken = (
  request: NextRequest
): boolean | undefined => {
  // mendapatkan token dari header
  const authorization = request.headers.get("Authorization");

  // validasi jika tidak ada token
  if (!authorization || (authorization && !authorization.startsWith("Bearer")))
    return undefined;

  // memisahkan token dari string
  // format penulisan => Bearer initokennya
  const [_, token] = authorization.split(" ");
  if (!token) return undefined;

  // mendapatkan token statis dari env
  const envToken = process.env.API_BEARER_TOKEN;
  if (!envToken) return undefined;

  return token === envToken;
};

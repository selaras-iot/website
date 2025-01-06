import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/models/api-response";
import { NextRequest } from "next/server";
import { z } from "zod";

interface GETResponse {
  id: string;
  name: string;
}
export async function GET(
  request: NextRequest,
  { params }: { params: { environment_id: string } }
) {
  try {
    const { environment_id: environmentId } = params;

    // validasi request
    const validate = z
      .object({
        environment_id: z
          .string({ required_error: "ID lingkungan tidak boleh kosong!" })
          .min(1, "ID lingkungan tidak boleh kosong!"),
      })
      .safeParse({ environment_id: environmentId });
    if (!validate.success)
      return APIResponse.respondWithBadRequest(
        validate.error.errors.map((it) => ({
          path: it.path[0] as string,
          message: it.message,
        }))
      );

    // validasi bearer token
    if (!verifyBearerToken(request))
      return APIResponse.respondWithUnauthorized();

    const query = database
      .selectFrom("environments as e")
      .select(["e.id", "e.name"])
      .where("e.id", "=", environmentId);
    const result = await query.executeTakeFirst();

    // validasi hasil query
    if (!result)
      return APIResponse.respondWithNotFound(
        "Lingkungan dengan ID tersebut tidak ditemukan!"
      );

    return APIResponse.respondWithSuccess<GETResponse>({ ...result });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}

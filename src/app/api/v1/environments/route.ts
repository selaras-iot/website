import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/models/api-response";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

interface POSTResponse {
  id: string;
  success: boolean;
}
export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const { name } = json;

    const data = z
      .object({
        name: z
          .string({ required_error: "Nama lingkungan tidak boleh kosong!" })
          .min(1, "Nama lingkungan tidak boleh kosong!"),
      })
      .safeParse({ name });

    if (!data.success)
      return APIResponse.respondWithBadRequest(
        data.error.errors.map((it) => ({
          path: it.path[0] as string,
          message: it.message,
        }))
      );

    if (!verifyBearerToken(request))
      return APIResponse.respondWithUnauthorized();

    const query = database
      .insertInto("environments")
      .values({ id: uuidv4(), name } as any)
      .returning("id");
    const result = await query.executeTakeFirstOrThrow();

    return APIResponse.respondWithSuccess<POSTResponse>({
      id: result.id,
      success: true,
    });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}

import { database } from "@/lib/database";
import { APIResponse } from "@/models/api-response";
import { NextRequest } from "next/server";
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

    const query = database
      .insertInto("environments")
      .values({ name } as any)
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

import { database } from "@/lib/database";
import { APIResponse } from "@/models/api-response";
import { sql } from "kysely";
import { NextRequest } from "next/server";
import { z } from "zod";

interface Environment {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface POSTResponse {
  environments: Environment[];
}
export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const { uuids } = json;

    // validasi request dari user
    const validate = z
      .object({
        uuids: z
          .array(z.string(), { required_error: "UUIDs tidak boleh kosong!" })
          .min(1, "UUIDs tidak boleh kosong!"),
      })
      .safeParse({ uuids });
    if (!validate.success)
      return APIResponse.respondWithBadRequest(
        validate.error.errors.map((it) => ({
          path: it.path[0] as string,
          message: it.message,
        }))
      );

    // query ke database
    const query = database
      .selectFrom("environments as e")
      .select(["e.id", "e.name"])
      .select(sql<string>`e."xata.createdAt"`.as("created_at"))
      .select(sql<string>`e."xata.updatedAt"`.as("updated_at"))
      .where("e.id", "in", uuids);
    const result = await query.execute();

    if (result.length === 0)
      return APIResponse.respondWithNotFound("Lingkungan tidak ditemukan!");

    return APIResponse.respondWithSuccess<POSTResponse>({
      environments: result,
    });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}

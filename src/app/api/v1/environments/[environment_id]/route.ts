import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/models/api-response";
import { sql } from "kysely";
import { NextRequest } from "next/server";
import { z } from "zod";

interface Device {
  id: string;
  name: string;
  type: string;
  created_at: string;
  updated_at: string;
}

interface GETResponse {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  devices: Device[];
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
        environmentId: z
          .string({ required_error: "ID lingkungan tidak boleh kosong!" })
          .min(1, "ID lingkungan tidak boleh kosong!"),
      })
      .safeParse({ environmentId });
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
      .innerJoin("devices as d", "d.environment", "e.id")
      .select([
        "e.id as env_id",
        "e.name as env_name",
        "d.id as device_id",
        "d.name as device_name",
        "d.type as device_type",
      ])
      .select(sql<string>`e."xata.createdAt"`.as("env_created_at"))
      .select(sql<string>`e."xata.updatedAt"`.as("env_updated_at"))
      .select(sql<string>`d."xata.createdAt"`.as("device_created_at"))
      .select(sql<string>`d."xata.updatedAt"`.as("device_updated_at"))
      .where("e.id", "=", environmentId);
    const result = await query.execute();

    // validasi id lingkungan
    if (!result || result.length === 0)
      return APIResponse.respondWithNotFound(
        "Lingkungan dengan ID tersebut tidak ditemukan!"
      );

    return APIResponse.respondWithSuccess<GETResponse>({
      id: result[0].env_id,
      name: result[0].env_name,
      created_at: result[0].env_created_at,
      updated_at: result[0].env_updated_at,
      devices: result.map((it) => ({
        id: it.device_id,
        name: it.device_name,
        type: it.device_type,
        created_at: it.device_created_at,
        updated_at: it.device_updated_at,
      })),
    });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}

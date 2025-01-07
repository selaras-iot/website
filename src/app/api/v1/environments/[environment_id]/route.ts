import { verifyBearerToken } from "@/lib/bearer-token";
import { database, xata } from "@/lib/database";
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

    // query untuk mendapatkan lingkungan
    const queryEnv = database
      .selectFrom("environments as e")
      .select(["e.id", "e.name"])
      .select(sql<string>`e."xata.createdAt"`.as("created_at"))
      .select(sql<string>`e."xata.updatedAt"`.as("updated_at"))
      .where("e.id", "=", environmentId);
    const resultEnv = await queryEnv.executeTakeFirst();

    if (!resultEnv)
      return APIResponse.respondWithNotFound(
        "Lingkungan dengan ID tersebut tidak ditemukan!"
      );

    // query untuk mendapatkan daftar devices
    const queryDevices = database
      .selectFrom("devices as d")
      .select(["d.id", "d.name", "d.type"])
      .select(sql<string>`d."xata.createdAt"`.as("created_at"))
      .select(sql<string>`d."xata.updatedAt"`.as("updated_at"))
      .where("d.environment", "=", resultEnv.id as any);
    const resultDevices = await queryDevices.execute();

    return APIResponse.respondWithSuccess<GETResponse>({
      id: resultEnv.id,
      name: resultEnv.name,
      created_at: resultEnv.created_at,
      updated_at: resultEnv.updated_at,
      devices: resultDevices.map((it) => ({
        id: it.id,
        name: it.name,
        type: it.type,
        created_at: it.created_at,
        updated_at: it.updated_at,
      })),
    });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}

interface PATCHResponse {
  success: boolean;
  id: string;
}
export async function PATCH(
  request: NextRequest,
  { params }: { params: { environment_id: string } }
) {
  try {
    const json = await request.json();
    const { name } = json;
    const { environment_id: environmentId } = params;

    // validasi request dari user
    const validate = z
      .object({
        name: z
          .string({ required_error: "Nama lingkungan tidak boleh kosong!" })
          .min(1, "Nama lingkungan tidak boleh kosong!"),
        environmentId: z
          .string({ required_error: "ID lingkungan tidak boleh kosong!" })
          .min(1, "ID lingkungan tidak boleh kosong!"),
      })
      .safeParse({ name, environmentId });
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

    // update data lingkungan
    const query = database
      .updateTable("environments")
      .set({ name })
      .where("id", "=", environmentId)
      .returning("id");
    const result = await query.executeTakeFirstOrThrow();

    return APIResponse.respondWithSuccess<PATCHResponse>({
      success: true,
      id: result.id,
    });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}

interface DELETEResponse {
  success: boolean;
  id: string;
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: { environment_id: string } }
) {
  try {
    const { environment_id: environmentId } = params;

    // validasi request dari user
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

    // mendapatkan daftar devices yang terhubung dengan lingkungan
    const queryDevices = database
      .selectFrom("devices as d")
      .select(["d.id"])
      .where("d.environment", "=", environmentId as any);
    const resultDevices = await queryDevices.execute();
    const mappedDevices = resultDevices.map((it) => ({
      delete: { table: "devices", id: it.id },
    }));

    // hapus data lingkungan
    const result = await xata.transactions.run([
      { delete: { table: "environments", id: environmentId } },
      ...(mappedDevices as any),
    ]);

    if (result.results[0].rows === 0)
      return APIResponse.respondWithNotFound(
        "Lingkungan dengan ID tersebut tidak ditemukan!"
      );

    return APIResponse.respondWithSuccess<DELETEResponse>({
      success: true,
      id: environmentId,
    });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}

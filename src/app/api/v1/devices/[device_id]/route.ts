import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/models/api-response";
import { NextRequest } from "next/server";
import { z } from "zod";

interface PATCHResponse {
  success: boolean;
  id: string;
}
export async function PATCH(
  request: NextRequest,
  { params }: { params: { device_id: string } }
) {
  try {
    const json = await request.json();
    const { name, type } = json;
    const { device_id: deviceId } = params;

    // validasi request dari user
    const validate = z
      .object({
        name: z
          .string({ required_error: "Nama perangkat tidak boleh kosong!" })
          .min(1, "Nama perangkat tidak boleh kosong!"),
        type: z.enum(["led-strip"], {
          required_error: "Jenis perangkat tidak boleh kosong!",
        }),
        deviceId: z
          .string({ required_error: "ID perangkat tidak boleh kosong!" })
          .min(1, "ID perangkat tidak boleh kosong!"),
      })
      .safeParse({ name, type, deviceId });
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

    // update device
    const query = database
      .updateTable("devices")
      .set({ name, type })
      .where("id", "=", deviceId)
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

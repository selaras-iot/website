import { verifyBearerToken } from "@/lib/bearer-token";
import { database } from "@/lib/database";
import { APIResponse } from "@/models/api-response";
import { NextRequest } from "next/server";
import { z } from "zod";

interface POSTResponse {
  need_move_environment: boolean;
  id: string;
  success: boolean;
}
export async function POST(request: NextRequest) {
  try {
    // jika sudah ada device dengan uuid dan environment tertentu, maka kembalikan response untuk meminta konfirmasi ke user terkait pemindahan device ke environment baru.
    // jika sudah ada device dengan uuid dan environment yang sama, maka kembalikan response conflict.
    const json = await request.json();
    const {
      uuid,
      name,
      type,
      environment_id: environmentId,
      move_environment: moveEnvironment,
    } = json;

    // verify request body
    const data = z
      .object({
        uuid: z
          .string({ required_error: "UUID perangkat tidak boleh kosong!" })
          .min(1, "UUID perangkat tidak boleh kosong!"),
        name: z
          .string({ required_error: "Nama perangkat tidak boleh kosong!" })
          .min(1, "Nama perangkat tidak boleh kosong!"),
        type: z.enum(["led-strip"], {
          required_error: "Jenis perangkat tidak boleh kosong!",
        }),
        environment_id: z
          .string({ required_error: "ID lingkungan tidak boleh kosong!" })
          .min(1, "ID lingkungan tidak boleh kosong!"),
        move_environment: z.boolean().optional(),
      })
      .safeParse({
        uuid,
        name,
        type,
        environment_id: environmentId,
        move_environment: moveEnvironment,
      });
    if (!data.success)
      return APIResponse.respondWithBadRequest(
        data.error.errors.map((it) => ({
          path: it.path[0] as string,
          message: it.message,
        }))
      );

    // verify bearer token
    if (!verifyBearerToken(request))
      return APIResponse.respondWithUnauthorized();

    // cek device berdasarkan uuid dan environment id
    const checkQuery = database
      .selectFrom("devices as d")
      .select(["d.id", "d.environment"])
      .where("d.id", "=", uuid);
    const checkResult = await checkQuery.executeTakeFirst();

    if (checkResult) {
      // cek apakah device sudah tertaut pada environment tertentu

      // cek jika environment saat ini === environment baru, maka kembalikan response konflik
      if (checkResult.environment === environmentId) {
        return APIResponse.respondWithConflict(
          "Perangkat sudah ditambahkan ke lingkungan ini sebelumnya!"
        );
      }

      // jika user sudah konfirmasi untuk move env, atau jika env lama perangkat adalah null, maka lakukan update untuk memindah perangkat ke env baru
      if (moveEnvironment || !checkResult.environment) {
        const query = database
          .updateTable("devices")
          .set({ environment: environmentId })
          .where("id", "=", uuid)
          .returning("id");
        const result = await query.executeTakeFirstOrThrow();

        return APIResponse.respondWithSuccess<POSTResponse>({
          need_move_environment: false,
          id: result.id,
          success: true,
        });
      }

      // meminta user untuk mengkonfirmasi pemindahan perangkat ke env baru
      return APIResponse.respondWithSuccess<POSTResponse>({
        need_move_environment: true,
        id: "",
        success: false,
      });
    } else {
      // tambahkan device baru environment tersebut
      const query = database
        .insertInto("devices")
        .values({
          id: uuid,
          name,
          type,
          environment: environmentId,
        } as any)
        .returning("id");
      const result = await query.executeTakeFirstOrThrow();

      return APIResponse.respondWithSuccess<POSTResponse>({
        need_move_environment: false,
        id: result.id,
        success: true,
      });
    }
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}

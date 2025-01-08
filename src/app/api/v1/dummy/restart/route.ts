import { APIResponse } from "@/models/api-response";

interface GETResponse {
  status: string;
}
export async function GET() {
  return APIResponse.respondWithSuccess<GETResponse>({
    status: "ok",
  });
}

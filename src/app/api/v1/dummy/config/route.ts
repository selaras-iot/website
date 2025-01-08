import { APIResponse } from "@/models/api-response";

interface POSTResponse {
  status: string;
}
export async function POST() {
  return APIResponse.respondWithSuccess<POSTResponse>({
    status: "ok",
  });
}

interface GETResponse {
  ssid: string;
  password: string;
  led_count: number;
}
export async function GET() {
  return APIResponse.respondWithSuccess<GETResponse>({
    ssid: "ssid",
    password: "password",
    led_count: 10,
  });
}

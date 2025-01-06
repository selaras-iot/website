import { APIResponse } from "@/models/api-response";
import { NextRequest } from "next/server";

interface Device {
  id: string;
  type: string;
  name: string;
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
export async function GET(request: NextRequest) {
  try {
    return APIResponse.respondWithSuccess<GETResponse>({
      id: "",
      name: "",
      created_at: "",
      updated_at: "",
      devices: [],
    });
  } catch (e) {
    return APIResponse.respondWithServerError();
  }
}

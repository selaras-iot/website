import { devicesPaths } from "@/app/api/v1/devices/docs";
import { environmentByIdPaths } from "@/app/api/v1/environments/[environment_id]/docs";
import { environmentsPaths } from "@/app/api/v1/environments/docs";
import { swaggerComponents } from "./components";
import { swaggerSecuritySchemes } from "./security";

export const swaggerSpec = {
  openapi: "3.1.0",
  info: {
    title: "Selaras Internet of Things API Documentation",
    version: "1.0",
  },
  components: {
    securitySchemes: swaggerSecuritySchemes,
    schemas: swaggerComponents,
  },
  paths: {
    // environments
    ...environmentsPaths,
    ...environmentByIdPaths,

    // devices
    ...devicesPaths,
  },
};

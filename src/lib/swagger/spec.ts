import { environmentsPaths } from "@/app/api/v1/environments/docs";
import { swaggerComponents } from "./components";

export const swaggerSpec = {
  openapi: "3.1.0",
  info: {
    title: "Selaras Internet of Things API Documentation",
    version: "1.0",
  },
  components: {
    // securitySchemes: swaggerSecuritySchemes,
    schemas: swaggerComponents,
  },
  paths: {
    ...environmentsPaths,
  },
};

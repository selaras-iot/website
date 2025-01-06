import { swaggerComponentRefs } from "@/lib/swagger/components";
import { swaggerSecurity } from "@/lib/swagger/security";

export const devicesPaths = {
  "/api/v1/devices": {
    post: {
      tags: ["Devices"],
      security: swaggerSecurity,
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                uuid: { type: "string" },
                name: { type: "string" },
                type: { type: "string" },
                environment_id: { type: "string" },
                move_environment: { type: "boolean" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  need_move_environment: { type: "boolean" },
                  id: { type: "string" },
                  success: { type: "boolean" },
                },
              },
            },
          },
        },
        400: {
          content: {
            "application/json": {
              schema: { $ref: swaggerComponentRefs.BadRequestError },
            },
          },
        },
        401: {
          content: {
            "application/json": {
              schema: { $ref: swaggerComponentRefs.UnauthorizedError },
            },
          },
        },
        409: {
          content: {
            "application/json": {
              schema: { $ref: swaggerComponentRefs.ConflictError },
            },
          },
        },
        500: {
          content: {
            "application/json": {
              schema: { $ref: swaggerComponentRefs.InternalServerError },
            },
          },
        },
      },
    },
  },
};

import { swaggerComponentRefs } from "@/lib/swagger/components";
import { swaggerSecurity } from "@/lib/swagger/security";

export const deviceByIdPaths = {
  "/api/v1/devices/{device_id}": {
    patch: {
      tags: ["Devices"],
      security: swaggerSecurity,
      parameters: [
        {
          name: "device_id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                type: { type: "string" },
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
                  success: { type: "boolean" },
                  id: { type: "string" },
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
        404: {
          content: {
            "application/json": {
              schema: { $ref: swaggerComponentRefs.NotFoundError },
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
    delete: {
      tags: ["Devices"],
      security: swaggerSecurity,
      parameters: [
        {
          name: "device_id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  id: { type: "string" },
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
        404: {
          content: {
            "application/json": {
              schema: { $ref: swaggerComponentRefs.NotFoundError },
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

import { swaggerComponentRefs } from "@/lib/swagger/components";
import { swaggerSecurity } from "@/lib/swagger/security";

export const environmentByIdPaths = {
  "/api/v1/environments/{environment_id}": {
    get: {
      tags: ["Environments"],
      security: swaggerSecurity,
      parameters: [
        {
          name: "environment_id",
          in: "path",
          schema: { type: "string" },
          required: true,
        },
      ],
      responses: {
        200: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  created_at: { type: "string", format: "date" },
                  updated_at: { type: "string", format: "date" },
                  devices: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        type: { type: "string" },
                        created_at: { type: "string", format: "date" },
                        updated_at: { type: "string", format: "date" },
                      },
                    },
                  },
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
    patch: {
      tags: ["Environments"],
      security: swaggerSecurity,
      parameters: [
        {
          name: "environment_id",
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
      tags: ["Environments"],
      security: swaggerSecurity,
      parameters: [
        {
          name: "environment_id",
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

import { swaggerComponentRefs } from "@/lib/swagger/components";

export const detailsEnvironmentsPaths = {
  "/api/v1/environments/details": {
    post: {
      tags: ["Environments"],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                uuids: {
                  type: "array",
                  items: { type: "string" },
                },
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
                  environments: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        created_at: { type: "string" },
                        updated_at: { type: "string" },
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
              schema: {
                $ref: swaggerComponentRefs.BadRequestError,
              },
            },
          },
        },
        404: {
          content: {
            "application/json": {
              schema: {
                $ref: swaggerComponentRefs.NotFoundError,
              },
            },
          },
        },
        500: {
          content: {
            "application/json": {
              schema: {
                $ref: swaggerComponentRefs.InternalServerError,
              },
            },
          },
        },
      },
    },
  },
};

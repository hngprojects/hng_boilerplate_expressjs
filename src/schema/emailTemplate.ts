export const emailTTemplateSchema = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      format: "int64",
      example: 6,
    },
    title: {
      type: "string",
      format: "title",
      example: "Welome",
    },
    description: {
      type: "string",
      format: "details",
      example: "Welcome to our organisation",
    },
    created_at: {
      type: "string",
      format: "date-time",
      example: "2019-10-12T07:20:50.52Z",
    },
    updated_at: {
      type: "string",
      format: "date-time",
      example: "2022-10-12T07:20:50.52Z",
    },
  },
};

export const emailTemplatePaths = {
  "/emailTemplates": {
    get: {
      tags: ["emailTemplates"],
      summary: "Get all email templates",
      responses: {
        "200": {
          description: "The list of email templates",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/EmailTemplates",
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["emailTemplates"],
      summary: "Create a new email template",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/EmailTemplates",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "The email template was successfully created",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/EmailTemplates",
              },
            },
          },
        },
      },
    },
  },
};

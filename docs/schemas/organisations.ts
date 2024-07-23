export const organisationSchema = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      format: "int64",
      example: 6,
    },
    name: {
      type: "string",
      format: "name",
      example: "Test's Organisation",
    },
    description: {
      type: "string",
      format: "description",
      example: "This is an organisation for learning",
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

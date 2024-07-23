export const blogSchema = {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
        example: 6,
      },
      user_id: {
        type: "integer",
        format: "int64",
        example: 14,
      },
      title: {
        type: "string",
        format: "title",
        example: "How To .....",
      },
      content: {
        type: "string",
        format: "content",
        example: "Welcome to our organisation",
      },
      thumbnail: {
        type: "string",
        format: "content",
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
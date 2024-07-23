export const commentSchema = {
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
      blog_id: {
        type: "integer",
        format: "int64",
        example: 14,
      },
      comment: {
        type: "string",
        format: "title",
        example: "How To .....",
      },
      created_at: {
        type: "string",
        format: "date-time",
        example: "2019-10-12T07:20:50.52Z",
      },
    },
  };
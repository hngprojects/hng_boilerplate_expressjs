export const transactionSchema = {
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
        example: 8,
      },
      amount: {
        type: "integer",
        format: "int64",
        example: 50000,
      },
      reference_id: {
        type: "string",
        format: "description",
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
  
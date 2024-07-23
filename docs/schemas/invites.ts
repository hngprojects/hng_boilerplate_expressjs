export const invitesSchema = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      format: "int64",
      example: 6,
    },
    invited_id: {
      type: "string",
      format: "byte",
      example: "U3BlYWtlYXN5IG1ha2VzIHdvcmtpbmcgd2l0aCBBUElzIGZ1biE=",
    },
    invitee_id: {
      type: "integer",
      format: "int64",
      example: 12,
    },
  },
};

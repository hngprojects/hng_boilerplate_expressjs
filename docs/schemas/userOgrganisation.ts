export const userOrganisationSchema = {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int64",
        example: 1,
      },
      user_id: {
        type: "integer",
        format: "int64",
        example: 1,
      },
      org_id: {
        type: "integer",
        format: "int64",
        example: 1,
      },
    },
  };
  
  export const getUserOrganisationById = {
    tags: ["UserOrganisation"],
    summary: "Gets a user organisation by ID",
    description: "Retrieve a specific user organisation by ID",
    operationId: "getUserOrganisationById",
    parameters: [
      {
        name: "id",
        in: "path",
        description: "User Organisation ID",
        required: true,
        schema: {
          type: "integer",
          format: "int64",
        },
      },
    ],
    responses: {
      200: {
        description: "Successful response",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UserOrganisation",
            },
          },
        },
      },
    },
  };
  
  export const createUserOrganisation = {
    tags: ["UserOrganisation"],
    summary: "Creates a new user organisation",
    description: "Create a new user organisation",
    operationId: "createUserOrganisation",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UserOrganisation",
          },
        },
      },
    },
    responses: {
      201: {
        description: "User organisation created successfully",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UserOrganisation",
            },
          },
        },
      },
    },
  };
  
  // Similarly, define update and delete operations
  export const updateUserOrganisation = {
    tags: ["UserOrganisation"],
    summary: "Updates an existing user organisation",
    description: "Update an existing user organisation",
    operationId: "updateUserOrganisation",
    parameters: [
      {
        name: "id",
        in: "path",
        description: "User Organisation ID",
        required: true,
        schema: {
          type: "integer",
          format: "int64",
        },
      },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UserOrganisation",
          },
        },
      },
    },
    responses: {
      200: {
        description: "User organisation updated successfully",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UserOrganisation",
            },
          },
        },
      },
    },
  };
  
  export const deleteUserOrganisation = {
    tags: ["UserOrganisation"],
    summary: "Deletes a user organisation",
    description: "Delete a user organisation",
    operationId: "deleteUserOrganisation",
    parameters: [
      {
        name: "id",
        in: "path",
        description: "User Organisation ID",
        required: true,
        schema: {
          type: "integer",
          format: "int64",
        },
      },
    ],
    responses: {
      204: {
        description: "User organisation deleted successfully",
      },
    },
  };
  
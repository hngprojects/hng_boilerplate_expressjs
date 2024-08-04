import swaggerJsdoc, { SwaggerDefinition } from "swagger-jsdoc";
import { version } from "../../package.json";
import config from ".";

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.1.0",
  info: {
    title: "BoilerPlate Express API with Swagger",
    version: version,
    // description:
    //   "This is a simple CRUD API application made with Express and documented with Swagger",
  },
  servers: [
    {
      url: `http://localhost:${config.port}/`,
      description: "Local server",
    },
    {
      url: "https://staging.api-expressjs.boilerplate.hng.tech/",
      description: "Live server",
    },
  ],
  tags: [
    {
      name: "default",
      description: "A lsit of all default routes",
    },
    {
      name: "Authentication",
      description: "A list of routes for Authentication",
    },
    {
      name: "Squeeze API",
      description: "A list of routes for Squeeze",
    },
    {
      name: "User",
      description: "A list of routes for User",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    "./src/routes/*.ts",
    "./src/controllers/*.ts",
    "./src/services/*.ts",
    "./src/schema/*.ts",
  ], // Adjust these paths
};

const specs = swaggerJsdoc(options);

export default specs;

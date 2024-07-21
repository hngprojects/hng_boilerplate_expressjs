import swaggerJsdoc from "swagger-jsdoc";
import { SwaggerDefinition } from "swagger-jsdoc";

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.1.0",
  info: {
    title: "BoilerPlate Express API with Swagger",
    version: "1.0.0",
    // description:
    //   "This is a simple CRUD API application made with Express and documented with Swagger",
  },
  servers: [
    {
      url: "http://localhost:8000/",
      description: "Local server",
    },
    {
      url: "https://staging.api-expressjs.boilerplate.hng.tech/",
      description: "Live server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts", "./src/services/*.ts"], // Adjust these paths
};

const specs = swaggerJsdoc(options);

export default specs;

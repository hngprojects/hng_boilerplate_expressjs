import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const blogSwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Blog API',
    version: '1.0.0',
    description: 'API for managing blog posts',
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
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const blogOptions = {
  swaggerDefinition: blogSwaggerDefinition,
  apis: ['./src/routes/blog/*.ts'], // Adjust the path according to your file structure
};

const blogSwaggerSpec = swaggerJsdoc(blogOptions);

export { swaggerUi, blogSwaggerSpec };

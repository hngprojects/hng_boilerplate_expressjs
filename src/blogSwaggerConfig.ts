import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'API documentation for blog endpoints',
    },
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'], 
};

const blogSwaggerSpec = swaggerJsdoc(options);
const blogSwaggerUi = swaggerUi()

export { blogSwaggerUi, blogSwaggerSpec };

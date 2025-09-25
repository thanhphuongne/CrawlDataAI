import swaggerJSDoc from 'swagger-jsdoc';
import { API_DOCS_HOST } from '../../config';

const swaggerDefinition = {
  swagger: '2.0', // Indicates Swagger 2.0
  info: {
    title: 'DSS API Docs V1',
    version: '1.0.0',
    description: 'DSS API Docs V1',
  },
  host: API_DOCS_HOST, // Hostname (e.g., localhost:3000)
  basePath: '/v1', // Base path for all API endpoints
  schemes: ['http'], // Supported schemes (e.g., http, https)
  produces: ['application/json'], // Default response content type
  consumes: ['application/json'], // Default request content type
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization', // Name of the header that will carry the Bearer token
      in: 'header', // Pass the token in the header
      description: 'Enter your Bearer token in the format: Bearer <token>',
    },
  },
  security: [
    {
      bearerAuth: [], // Apply Bearer token globally
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    'server/components/**/*.route.js', // Paths to files containing annotations
    'server/components/**/*.model.js',
    'server/api/validatorErrorHandler.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;

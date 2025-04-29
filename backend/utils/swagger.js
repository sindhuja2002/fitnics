import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Fitnics API Documentation',
    version:  '1.0.0',
    description: 'API documentation with Swagger',
    contact: {
      name: 'Sindhuja',
      email: 'sindhuja608209@gmail.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:9000/',
      description: 'Development server',
    },
    {
      url: 'https://backend.fitnics.space/',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"'
      }
    }
  },
  security: [{
    bearerAuth: []
  }],
};

// apis: [
  //   process.env.NODE_ENV === 'production'
  //     ? resolve(__dirname, '../swagger/*.docs.js')
  //     : resolve(__dirname, '../../src/swagger/*.docs.js')
  // ],


  console.log(resolve(__dirname, '../../backend/swagger/*.docs.js'))

const SwaggerOptions = {
  swaggerDefinition,
  apis: [
    process.env.NODE_ENV === 'production'
      ? resolve(__dirname, '../swagger/*.docs.js')
      : resolve(__dirname, '../../backend/swagger/*.docs.js')
  ],
};

export default SwaggerOptions;
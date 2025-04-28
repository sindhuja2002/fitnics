import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerDefinition = {
  info: {
    title: 'Fitnics API Documentation',
    version:  '1.0.0',
    description: 'API documentation with Swagger',
    contact: {
      name: 'Sidhu',
      email: 'sindhuja608209@gmail.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:9000/api/v1',
      description: 'Development server',
    },
    {
      url: 'https://backend.fitnics.space/api/v1',
      description: 'Production server',
    },
  ],
  components: {
    customAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'token',
      description: 'Custom authentication token'
    }
  },
  security: [{
    // bearerAuth: [],
    customAuth: [],
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
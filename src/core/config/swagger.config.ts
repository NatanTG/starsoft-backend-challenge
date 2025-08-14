import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { env } from '@/core/env';

export function createSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('E-commerce Order Management API')
    .setDescription(
      'Complete order management system with Kafka event streaming and Elasticsearch search capabilities',
    )
    .setVersion('1.0.0')
    .addTag(
      'Orders',
      'Order management operations - Create, update, search and manage orders',
    )
    .addTag('Users', 'User management operations')
    .addTag('Auth', 'Authentication and authorization endpoints')
    .addBearerAuth()
    .setContact(
      'Development Team',
      'https://github.com/your-repo',
      env.SWAGGER_CONTACT_EMAIL,
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Development server')
    .addServer('https://api.production.com', 'Production server')
    .build();
}

export const swaggerDocumentOptions: SwaggerDocumentOptions = {
  operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  autoTagControllers: true,
};

export const swaggerCustomOptions: SwaggerCustomOptions = {
  customSiteTitle: 'E-commerce API - Documentation',
  customfavIcon: '/favicon.ico',
  customCss: `
    .swagger-ui .topbar { 
      background-color: #1565c0; 
    }
    .swagger-ui .topbar .download-url-wrapper .select-label {
      color: white;
    }
    .swagger-ui .topbar .download-url-wrapper input[type=text] {
      background-color: #0d47a1;
      border: 1px solid #1976d2;
      color: white;
    }
  `,
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'none',
    defaultModelExpandDepth: 2,
    defaultModelsExpandDepth: 1,
    displayRequestDuration: true,
  },
  explorer: true,
  jsonDocumentUrl: 'api-json',
  yamlDocumentUrl: 'api-yaml',
};

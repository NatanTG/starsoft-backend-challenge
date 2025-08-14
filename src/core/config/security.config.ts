import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import { env } from '../env';

export function configureHelmet(app: INestApplication) {
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      hsts: env.HELMET_HSTS_ENABLED
        ? {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
          }
        : false,
    }),
  );
}

export function configureCors(app: INestApplication) {
  const getCorsOrigins = () => {
    if (env.NODE_ENV === 'production') {
      return env.PRODUCTION_CORS_ORIGINS.split(',');
    }
    return env.CORS_ORIGINS.split(',');
  };

  app.enableCors({
    origin: getCorsOrigins(),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
}

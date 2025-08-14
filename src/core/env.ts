import 'dotenv/config';
import { IsEnum, IsString, validateSync } from 'class-validator';
import { plainToInstance, Transform } from 'class-transformer';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string;

  @Transform(({ value }) => value || '3000')
  @IsString()
  PORT: string = '3000';

  @IsString()
  RESEND_KEY: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  DASHBOARD_URL: string;

  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  CORS_ORIGINS: string;

  @IsString()
  PRODUCTION_CORS_ORIGINS: string;

  @Transform(({ value }) => value === 'true')
  DB_LOGGING: boolean;

  @Transform(({ value }) => value === 'true')
  DB_SYNCHRONIZE: boolean;

  @Transform(({ value }) => value === 'true')
  DB_SSL: boolean;

  @Transform(({ value }) => value === 'true')
  HELMET_HSTS_ENABLED: boolean;

  @IsString()
  KAFKA_BROKERS: string;

  @IsString()
  KAFKA_CLIENT_ID: string;

  @IsString()
  ELASTICSEARCH_NODE: string;

  @Transform(({ value }) => String(value).toLowerCase().trim() === 'true')
  KAFKA_MOCK_MODE: boolean;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_DB: string;

  @IsString()
  GRAFANA_ADMIN_USER: string;

  @IsString()
  GRAFANA_ADMIN_PASSWORD: string;

  @IsString()
  MAIL_FROM_ADDRESS: string;

  @IsString()
  SWAGGER_CONTACT_EMAIL: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    console.error('⚠️ Invalid environment variables', errors);
    throw new Error('Invalid environment variables');
  }
  return validatedConfig;
}

export const env = validate(process.env);

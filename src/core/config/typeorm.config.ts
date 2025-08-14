import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UserEntity } from '../../modules/user/domain/entities/user.entity';
import { OrderEntity } from '../../modules/orders/domain/entities/order.entity';
import { OrderItemEntity } from '../../modules/orders/domain/entities/order-item.entity';
import { env } from '../env';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: env.DATABASE_URL,
  entities: [UserEntity, OrderEntity, OrderItemEntity],
  synchronize: env.DB_SYNCHRONIZE,
  logging: env.DB_LOGGING,
  migrations: [
    env.NODE_ENV === 'production'
      ? 'dist/src/core/migrations/*.js'
      : 'src/core/migrations/*.ts',
  ],
  migrationsTableName: 'typeorm_migrations',
  ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
};

export const dataSource = new DataSource(typeOrmConfig as DataSourceOptions);

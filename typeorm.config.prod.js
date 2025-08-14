const { DataSource } = require('typeorm');
const { UserEntity } = require('./dist/modules/user/domain/entities/user.entity');
const { OrderEntity } = require('./dist/modules/orders/domain/entities/order.entity');  
const { OrderItemEntity } = require('./dist/modules/orders/domain/entities/order-item.entity');

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [UserEntity.UserEntity, OrderEntity.OrderEntity, OrderItemEntity.OrderItemEntity],
  synchronize: false, 
  logging: process.env.DB_LOGGING === 'true',
  migrations: ['dist/core/migrations/*.js'],
  migrationsTableName: 'typeorm_migrations',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

module.exports = { dataSource };
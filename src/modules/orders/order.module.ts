import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './domain/entities/order.entity';
import { OrderItemEntity } from './domain/entities/order-item.entity';
import { OrderRepositoryImpl } from './infrastructure/repositories/implementation/order.repository.impl';

import { CreateOrderService } from './application/services/create-order/create-order.service';
import { FindOrderService } from './application/services/find-order/find-order.service';
import { ListOrdersService } from './application/services/list-orders/list-orders.service';
import { ListUserOrdersService } from './application/services/list-user-orders/list-user-orders.service';
import { UpdateOrderService } from './application/services/update-order/update-order.service';
import { DeleteOrderService } from './application/services/delete-order/delete-order.service';
import { SearchOrdersService } from './application/services/search-orders/search-orders.service';
import { UserModule } from '@/modules/user/user.module';
import { SharedModule } from '@/shared/shared.module';
import { KafkaModule } from '@/shared/services/kafka/kafka.module';
import { ElasticsearchModule } from '@/shared/services/elasticsearch/elasticsearch.module';
import { CreateOrderController } from './presentation/create-order.controller';
import { DeleteOrderController } from './presentation/delete-order.controller';
import { FindOrderController } from './presentation/find-order.controller';
import { ListOrdersController } from './presentation/list-orders.controller';
import { ListUserOrdersController } from './presentation/list-user-orders.controller';
import { SearchOrdersController } from './presentation/search-orders.controller';
import { UpdateOrderController } from './presentation/update-order.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]),
    UserModule,
    SharedModule,
    KafkaModule,
    ElasticsearchModule,
  ],
  controllers: [
    CreateOrderController,
    ListOrdersController,
    ListUserOrdersController,
    SearchOrdersController,
    FindOrderController,
    UpdateOrderController,
    DeleteOrderController,
  ],
  providers: [
    OrderRepositoryImpl,
    CreateOrderService,
    FindOrderService,
    ListOrdersService,
    ListUserOrdersService,
    UpdateOrderService,
    DeleteOrderService,
    SearchOrdersService,
    {
      provide: 'OrderRepository',
      useClass: OrderRepositoryImpl,
    },
  ],
  exports: [
    OrderRepositoryImpl,
    {
      provide: 'OrderRepository',
      useClass: OrderRepositoryImpl,
    },
  ],
})
export class OrderModule {}

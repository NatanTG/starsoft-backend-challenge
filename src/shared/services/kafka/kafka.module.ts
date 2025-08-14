import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { KafkaJSService } from './implementation/kafkajs.service';

@Module({
  providers: [
    {
      provide: 'KafkaService',
      useClass: KafkaJSService,
    },
  ],
  exports: ['KafkaService'],
})
export class KafkaModule {}

import { Module } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';
import { ElasticsearchServiceImpl } from './implementation/elasticsearch.service.impl';

@Module({
  providers: [
    {
      provide: 'ElasticsearchService',
      useClass: ElasticsearchServiceImpl,
    },
  ],
  exports: ['ElasticsearchService'],
})
export class ElasticsearchModule {}

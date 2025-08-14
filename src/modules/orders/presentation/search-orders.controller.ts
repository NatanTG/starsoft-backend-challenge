import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SearchOrdersService } from '@/modules/orders/application/services/search-orders/search-orders.service';
import { SearchOrdersRequestDto } from '@/modules/orders/application/dtos/requests/search-orders-request.dto';
import { SearchOrdersResponseDto } from '@/modules/orders/application/dtos/responses/search-orders-response.dto';
import { InternalServerErrorResponseDto } from '@/shared/dtos/error-response.dto';

@ApiTags('Orders')
@Controller('orders')
export class SearchOrdersController {
  constructor(private readonly searchOrdersService: SearchOrdersService) {}

  @Get('/search')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Search orders with advanced filters',
    description:
      'Search and filter orders using Elasticsearch with various criteria',
  })
  @ApiQuery({ type: SearchOrdersRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Orders found successfully',
    type: SearchOrdersResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
  async searchOrders(@Query() query: SearchOrdersRequestDto) {
   return await this.searchOrdersService.execute(query);
  }
}

export abstract class KafkaService {
  abstract publish(request: KafkaService.PublishRequest): Promise<KafkaService.PublishResponse>;
  abstract subscribe(request: KafkaService.SubscribeRequest): Promise<KafkaService.SubscribeResponse>;
  abstract connect(): Promise<KafkaService.ConnectResponse>;
  abstract disconnect(): Promise<KafkaService.DisconnectResponse>;
}

export namespace KafkaService {
  export type PublishRequest = {
    topic: string;
    message: any;
  };

  export type SubscribeRequest = {
    topic: string;
    callback: (message: any) => Promise<void>;
  };

  export type PublishResponse = void;
  export type SubscribeResponse = void;
  export type ConnectResponse = void;
  export type DisconnectResponse = void;

  export type OrderEventData = {
    id: string;
    userId: string;
    status: string;
    totalAmount: number;
    items: OrderItemEventData[];
    createdAt: string;
    updatedAt: string;
  };

  export type OrderItemEventData = {
    id: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  };

  export const TOPICS = {
    ORDER_CREATED: 'order.created',
    ORDER_UPDATED: 'order.updated',
    USER_CREATED: 'user.created',
  } as const;
}

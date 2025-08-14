# 🏗️ Arquitetura & Infraestrutura

> **Guia técnico completo** sobre a arquitetura, padrões de design e infraestrutura do projeto E-commerce API.

## 📋 Índice

- [🎯 Visão Geral da Arquitetura](#-visão-geral-da-arquitetura)
- [🏛️ Padrões de Design](#️-padrões-de-design)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🗄️ Database Schema](#️-database-schema)
- [🐳 Infraestrutura Docker](#-infraestrutura-docker)
- [🎭 Estratégia de Mock vs Real](#-estratégia-de-mock-vs-real)
- [📊 Monitoramento](#-monitoramento)
- [⚠️ Limitações Atuais](#️-limitações-atuais)
- [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)

---

## 🎯 Visão Geral da Arquitetura

### Arquitetura de Alto Nível

![Architecture Overview](./architecture-diagram.png)

> **Visão geral da arquitetura em três camadas**: Presentation (Controllers), Application (Services) e Infrastructure (Repositories), com integrações para PostgreSQL, Kafka e Elasticsearch.

---

## 🏛️ Padrões de Design

### 1. **Three-Layer Architecture**
Separação clara entre camadas de responsabilidade:
- **Presentation**: Controllers, DTOs, Validação
- **Application**: Services, Use Cases, Business Logic  
- **Infrastructure**: Repositories, Database, External Services

### 2. **Domain-Driven Design (DDD)**
Organização por domínios de negócio:
- **Modules**: auth, users, orders
- **Entities**: User, Order, OrderItem
- **Value Objects**: OrderStatus enum
- **Repositories**: Abstração de acesso a dados

### 3. **Repository Pattern**
Abstração do acesso a dados:
```typescript
// Interface
interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order>;
}

// Implementation
class OrderRepositoryImpl implements OrderRepository {
  // TypeORM implementation
}
```

### 4. **Event-Driven Architecture**
Comunicação assíncrona via eventos:
```typescript
// Event publishing
this.kafkaService.publish('order.created', {
  orderId: order.id,
  userId: order.userId,
  status: order.status
});
```

### 5. **Dependency Injection**
Inversão de controle via NestJS:
```typescript
@Injectable()
class CreateOrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly kafkaService: KafkaService
  ) {}
}
```

---

## 📁 Estrutura do Projeto

```
src/
├── 🔧 core/                    # Configurações centrais e infraestrutura
│   ├── config/                 # Configurações (Kafka, Elasticsearch, Swagger, TypeORM)
│   │   ├── elasticsearch.config.ts
│   │   ├── kafka.config.ts
│   │   ├── security.config.ts
│   │   ├── swagger.config.ts
│   │   └── typeorm.config.ts
│   ├── database/               # Módulo do banco de dados
│   │   └── database.module.ts
│   ├── env.ts                  # Validação de variáveis de ambiente
│   └── migrations/             # Migrações do banco de dados
│       └── 1754880900408-InitialMigrationFixed.ts
│
├── 🏢 modules/                 # Módulos de domínio (Business Logic)
│   ├── 🔐 auth/                # Autenticação e autorização
│   │   ├── domain/             # Entidades e regras de negócio
│   │   ├── application/        # Services e DTOs (camada de aplicação)
│   │   │   ├── dtos/           # Request/Response DTOs
│   │   │   └── services/       # Use Cases (session, forgot-password, etc.)
│   │   ├── infrastructure/     # Repositories e adaptadores (camada de dados)
│   │   └── presentation/       # Controllers e rotas (camada de apresentação)
│   │
│   ├── 📦 orders/              # Domínio de pedidos
│   │   ├── domain/             # Entidades (Order, OrderItem) e enums
│   │   │   ├── entities/       # Order.entity, OrderItem.entity
│   │   │   └── enums/          # OrderStatus.enum
│   │   ├── application/        # Services (CRUD operations) e DTOs
│   │   │   ├── dtos/           # Request/Response DTOs
│   │   │   └── services/       # Use Cases (create, update, list, search)
│   │   ├── infrastructure/     # Order Repository implementação
│   │   │   └── repositories/   # OrderRepositoryImpl
│   │   └── presentation/       # Controllers para API REST
│   │       └── *.controller.ts # CRUD Controllers
│   │
│   └── 👤 user/                # Domínio de usuários
│       ├── domain/             # User entity
│       ├── application/        # User services e DTOs
│       ├── infrastructure/     # User repository
│       └── presentation/       # User controllers
│
└── 🔗 shared/                  # Código compartilhado entre módulos
    ├── controllers/            # Controllers compartilhados (métricas)
    ├── dtos/                   # DTOs compartilhados e de eventos
    ├── guards/                 # Guards de autenticação
    ├── interceptors/           # Interceptadores (logging)
    ├── services/               # Serviços compartilhados
    │   ├── crypt/              # Serviço de criptografia (bcrypt)
    │   ├── elasticsearch/      # Serviço de busca
    │   ├── jwt/                # Serviço de JWT
    │   ├── kafka/              # Serviço de mensageria
    │   ├── logger/             # Logger estruturado
    │   ├── mail/               # Serviço de email (Resend)
    │   └── metrics/            # Métricas (Prometheus)
    └── types/                  # Tipos TypeScript compartilhados
```

### Detalhes dos Módulos

#### 🔐 Auth Module
- **Controllers**: session, refresh-token, forgot-password, reset-password
- **Services**: Lógica de autenticação JWT, reset de senha
- **Features**: Login/logout, refresh token, reset via email

#### 👤 User Module  
- **Controllers**: create-user
- **Services**: CRUD de usuários com validações
- **Features**: Criação de usuários, validação de email único

#### 📦 Orders Module
- **Controllers**: create, list, search, update, delete orders
- **Services**: CRUD completo com eventos Kafka
- **Features**: Pedidos com items, busca avançada, status workflow

---

## 🗄️ Database Schema

### Diagrama Entidade-Relacionamento

![Database Schema](./database-diagram.png)

> **Estrutura do banco de dados**: Relacionamentos entre as entidades User, Order e OrderItem, com suas respectivas propriedades e constraints.

### Principais Entidades

#### 👤 User Entity
- **Primary Key**: `id` (UUID)
- **Campos**: name, email, password (hashed), createdAt, updatedAt
- **Relacionamentos**: 1:N com Orders

#### 📦 Order Entity  
- **Primary Key**: `id` (UUID)
- **Foreign Key**: `userId` → User.id
- **Campos**: status (enum), totalAmount, createdAt, updatedAt
- **Relacionamentos**: N:1 com User, 1:N com OrderItems

#### 📋 OrderItem Entity
- **Primary Key**: `id` (UUID)
- **Foreign Key**: `orderId` → Order.id
- **Campos**: productName, quantity, unitPrice, totalPrice
- **Relacionamentos**: N:1 com Order

### Migrations
- **Auto-generated**: TypeORM migrations baseadas em entities
- **Location**: `src/core/migrations/`
- **Current**: `1754880900408-InitialMigrationFixed.ts`

---

## 🐳 Infraestrutura Docker

### Serviços Configurados

```yaml
# docker-compose.yml
services:
  api:                    # NestJS Application
    port: 3000
    depends_on: postgres, kafka
    
  postgres:               # PostgreSQL Database  
    port: 5432
    image: postgres:15-alpine
    
  zookeeper:              # Kafka Coordination
    port: 2181
    
  kafka:                  # Message Broker
    port: 9092
    depends_on: zookeeper
    
  elasticsearch:          # Search Engine
    port: 9200
    image: elasticsearch:8.11.0
    
  prometheus:             # Metrics Collection
    port: 9090
    
  grafana:                # Monitoring Dashboards
    port: 3001
    depends_on: prometheus
```


### Health Checks

Todos os serviços têm health checks configurados:
- **PostgreSQL**: `pg_isready`
- **Kafka**: Topic listing
- **Elasticsearch**: Cluster health
- **API**: HTTP endpoint `/health`

---

## 🎭 Estratégia de Mock vs Real

### Filosofia da Implementação

O projeto foi desenvolvido com uma **estratégia inteligente de mock** que permite:

1. **Demonstrar arquitetura completa** sem necessidade de infraestrutura complexa
2. **Facilitar desenvolvimento local** com dados consistentes
3. **Manter compatibilidade** com implementação real

### Kafka Mock Strategy

#### Modo Mock (`KAFKA_MOCK_MODE=true`)
```typescript
// MockKafkaService
export class MockKafkaService implements KafkaService {
  async publish(topic: string, message: any): Promise<void> {
    this.logger.log(`[MOCK] Message would be published to topic: ${topic}`);
    this.logger.log(JSON.stringify(message, null, 2));
  }
}
```

**Vantagens:**
- ✅ Logs detalhados mostram exatamente o que seria enviado
- ✅ Não requer conexão real com Kafka
- ✅ Dados consistentes para desenvolvimento

#### Modo Real (`KAFKA_MOCK_MODE=false`)
```typescript
// KafkaJSService (real implementation)
export class KafkaJSService implements KafkaService {
  async publish(topic: string, message: any): Promise<void> {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }]
    });
  }
}
```

### Elasticsearch Mock Strategy

#### Implementação Mock
```typescript
export class MockElasticsearchService implements ElasticsearchService {
  async searchOrders(params: SearchParams): Promise<SearchResult> {
    // Retorna dados mockados realistas
    return {
      data: this.generateMockOrders(params),
      total: 1,
      page: params.page || 1,
      totalPages: 1
    };
  }
}
```

#### Dados Mockados Realistas
- Pedidos com IDs únicos
- Relacionamentos consistentes
- Filtros funcionais
- Paginação simulada

### Alternando Entre Modos

Para usar serviços reais:

```env
# .env
KAFKA_MOCK_MODE=false
ELASTICSEARCH_NODE=http://your-real-elasticsearch:9200
KAFKA_BROKERS=your-kafka-cluster:9092
```

A arquitetura suporta **ambos os modos** sem alteração de código!

---

## 📊 Monitoramento

### Prometheus Metrics

#### HTTP Metrics
- `http_requests_total`: Total de requisições HTTP por método/status
- `http_request_duration_seconds`: Duração das requisições

#### Business Metrics  
- `orders_total`: Total de pedidos por status e ação
- `kafka_messages_total`: Mensagens Kafka por tópico
- `elasticsearch_operations_total`: Operações Elasticsearch

#### System Metrics
- `active_connections`: Conexões ativas
- `nodejs_heap_size_used_bytes`: Uso de memória heap
- `process_cpu_user_seconds_total`: CPU usage

### Grafana Dashboards

#### API Performance Dashboard
- Latência por endpoint
- Taxa de erro (4xx/5xx)
- Throughput (RPS)
- Response time percentiles

#### Business Metrics Dashboard  
- Pedidos criados por hora
- Status distribution
- Eventos Kafka por tópico
- User activity

#### System Health Dashboard
- Memory usage
- CPU utilization  
- Database connections
- Service availability

### Acesso ao Monitoramento

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin123_secure)
- **Metrics Endpoint**: http://localhost:3000/metrics

---

## ⚠️ Limitações Atuais

Este projeto possui algumas limitações técnicas que estão documentadas e priorizadas para implementação:

### 🔧 Débitos Técnicos Principais

- **📊 Grafana Dashboards**: Interface funcional mas sem visualizações configuradas
- **🔍 Elasticsearch**: Usando implementação mock em vez de serviço real
- **📨 Kafka Events**: Rodando em modo mock por padrão
- **🧪 Test Coverage**: 51% atual, meta de 80%+

### 📋 Roadmap

Para uma visão completa dos débitos técnicos, priorização e planos de implementação, consulte: **[🔧 Débitos Técnicos & Roadmap](/docs/TECHNICAL-DEBT.md)**

---

## 🚀 Tecnologias Utilizadas

### Core Framework
```json
{
  "framework": "NestJS 11+",
  "language": "TypeScript 5.7+", 
  "runtime": "Node.js 20+",
  "package_manager": "pnpm 10.7+"
}
```

### Database & ORM
```json
{
  "database": "PostgreSQL 15",
  "orm": "TypeORM 0.3.25",
  "migrations": "Automatic",
  "connection_pooling": "Built-in"
}
```

### Message Broker
```json
{
  "broker": "Apache Kafka (Bitnami)",
  "client": "KafkaJS 2.2.4",
  "coordination": "Apache Zookeeper",
  "topics": ["order.created", "order.updated", "user.created"]
}
```

### Search Engine
```json
{
  "search": "Elasticsearch 8.11.0",
  "client": "@elastic/elasticsearch 8.11.0",
  "features": ["fuzzy_search", "filters", "aggregations"]
}
```

### Security & Auth
```json
{
  "authentication": "JWT (jsonwebtoken 9.0.2)",
  "password_hashing": "bcrypt 6.0.0",
  "security_headers": "Helmet 8.1.0",
  "rate_limiting": "@nestjs/throttler 6.4.0"
}
```

### Monitoring & Observability
```json
{
  "metrics": "Prometheus (prom-client 15.1.3)",
  "dashboards": "Grafana 10.0.0",
  "documentation": "Swagger/OpenAPI",
  "logging": "Structured JSON logs"
}
```

### External Services
```json
{
  "email": "Resend 4.6.0",
  "file_upload": "Multer 2.0.2"
}
```

### Development & Testing
```json
{
  "testing": "Jest 30.0.5 + Supertest 7.0.0",
  "fake_data": "@faker-js/faker 9.9.0",
  "code_quality": "ESLint + Prettier",
  "containerization": "Docker + Docker Compose"
}
```

### Validation & Transformation
```json
{
  "validation": "class-validator 0.14.2",
  "transformation": "class-transformer 0.5.1",
  "env_validation": "Custom Zod-like validation"
}
```

---

<div align="center">

**🔍 Quer entender mais?** 

[⬅️ Onboarding](/docs/ONBOARDING.md) | [🧪 Guia Postman](/docs/POSTMAN-GUIDE.md) | [📡 API Reference](/docs/API-REFERENCE.md)

[📁 Voltar ao README](../README.md)

</div>
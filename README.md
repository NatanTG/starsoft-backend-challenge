# 🛒 E-commerce Order Management API

Sistema completo de gerenciamento de pedidos para e-commerce com arquitetura orientada a eventos (Kafka) e busca avançada (Elasticsearch).

## 🚀 Como Iniciar o Projeto

### 🐳 Início Rápido com Docker (Recomendado)

Para rodar todos os serviços de uma vez:

```bash
# Rebuild todos os containers (sem usar cache)
docker compose build --no-cache

# Subir todos os serviços (PostgreSQL, Kafka, Elasticsearch, API, Grafana, Prometheus)
docker compose up
```

Aguarde todos os containers ficarem prontos e acesse:
- **API**: http://localhost:3000
- **Documentação**: http://localhost:3000/api
- **Grafana**: http://localhost:3001 (admin/admin)

### Pré-requisitos
- **Node.js** 20+ 
- **pnpm** 10.7.0+ (gerenciador de pacotes)
- **Docker & Docker Compose**

### 1. Clone e Configure o Ambiente

```bash
git clone <repo-url>
cd starsoft-backend-challenge

# Copie e configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env conforme necessário
```

### 2. Instale as Dependências

```bash
# Instalar dependências do projeto
pnpm install
```

### 3. Inicie a Infraestrutura com Docker

```bash
# Subir toda a infraestrutura (PostgreSQL, Kafka, Elasticsearch, Prometheus, Grafana)
pnpm run docker:up

# Verificar se todos os containers estão rodando
pnpm run docker:logs

# Para parar os containers
pnpm run docker:down
```

### 4. Execute as Migrações do Banco

```bash
# Executar migrações do banco de dados
pnpm run typeorm:run
```

### 5. Inicie a Aplicação

```bash
# Modo desenvolvimento (com hot reload)
pnpm run dev

# Modo debug
pnpm run debug

# Build e execução em produção
pnpm run build
pnpm run start:prod
```

### 6. Verificar se Tudo Está Funcionando

- **API**: http://localhost:3000
- **Documentação Swagger**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/metrics
- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Elasticsearch**: http://localhost:9200

## 🏗️ Estrutura do Projeto

### Arquitetura: Clean Architecture + Domain-Driven Design

```
src/
├── core/                    # Configurações centrais e infraestrutura
│   ├── config/             # Configurações (Kafka, Elasticsearch, Swagger, TypeORM, etc.)
│   ├── database/           # Módulo do banco de dados
│   ├── env.ts              # Validação de variáveis de ambiente
│   └── migrations/         # Migrações do banco de dados
│
├── modules/                # Módulos de domínio (Business Logic)
│   ├── auth/              # Autenticação e autorização
│   │   ├── domain/        # Entidades e regras de negócio
│   │   ├── application/   # Casos de uso e DTOs
│   │   ├── infrastructure/# Repositories e adaptadores
│   │   └── presentation/  # Controllers e rotas
│   │
│   ├── orders/            # Domínio de pedidos
│   │   ├── domain/        # Entidades (Order, OrderItem) e enums
│   │   ├── application/   # Services (CRUD operations) e DTOs
│   │   ├── infrastructure/# Order Repository implementação
│   │   └── presentation/  # Controllers para API REST
│   │
│   └── user/              # Domínio de usuários
│       ├── domain/        # User entity
│       ├── application/   # User services e DTOs
│       ├── infrastructure/# User repository
│       └── presentation/  # User controllers
│
└── shared/                # Código compartilhado entre módulos
    ├── controllers/       # Controllers compartilhados (métricas)
    ├── dtos/             # DTOs compartilhados e de eventos
    ├── guards/           # Guards de autenticação
    ├── interceptors/     # Interceptadores (logging)
    ├── services/         # Serviços compartilhados
    │   ├── crypt/        # Serviço de criptografia (bcrypt)
    │   ├── elasticsearch/# Serviço de busca
    │   ├── jwt/          # Serviço de JWT
    │   ├── kafka/        # Serviço de mensageria
    │   ├── logger/       # Logger estruturado
    │   ├── mail/         # Serviço de email (Resend)
    │   └── metrics/      # Métricas (Prometheus)
    └── types/            # Tipos TypeScript compartilhados
```

### Padrões de Arquitetura Implementados

- **Clean Architecture**: Separação clara entre camadas
- **Domain-Driven Design (DDD)**: Organização por domínios de negócio
- **Repository Pattern**: Abstração de acesso a dados
- **CQRS**: Separação entre operações de comando e consulta
- **Event-Driven Architecture**: Comunicação assíncrona via Kafka
- **Dependency Injection**: Inversão de controle via NestJS

### Infraestrutura (Docker Compose)

```yaml
Serviços configurados:
├── api (NestJS)           # Aplicação principal na porta 3000
├── postgres               # Banco de dados principal na porta 5432
├── kafka + zookeeper      # Message broker nas portas 9092/2181
├── elasticsearch          # Search engine na porta 9200
├── prometheus             # Métricas na porta 9090
└── grafana               # Dashboards na porta 3001
```

## 🏗️ Diagrama de Arquitetura

![Diagrama de Infraestrutura](./docs/architecture-diagram.png)

*(Proposta de arquitetura futura) Diagrama completo da infraestrutura mostrando a comunicação entre todos os serviços e fluxo de dados da aplicação.*

## 🗄️ Diagrama do Banco de Dados

![Diagrama ER do Banco](./docs/database-diagram.png)

*Diagrama Entidade-Relacionamento do banco de dados mostrando as tabelas, relacionamentos e constraints.*

**Tabelas principais:**
- **users** - Usuários do sistema
- **orders** - Pedidos dos usuários  
- **order_items** - Itens que compõem cada pedido

**Relacionamentos:**
- `users (1) ←→ (N) orders` - Um usuário pode ter vários pedidos
- `orders (1) ←→ (N) order_items` - Um pedido pode ter vários itens

## 📦 Libs e Pacotes Instalados

### Framework e Core
- **@nestjs/core** ^11.0.1 - Framework principal
- **@nestjs/common** ^11.0.1 - Módulos comuns do NestJS
- **@nestjs/platform-express** ^11.0.1 - Plataforma Express
- **typescript** ^5.7.3 - Linguagem principal
- **reflect-metadata** ^0.2.2 - Metadados para decorators

### Banco de Dados
- **@nestjs/typeorm** ^11.0.0 - Integração TypeORM
- **typeorm** ^0.3.25 - ORM principal
- **pg** ^8.16.3 - Driver PostgreSQL

### Autenticação e Segurança
- **jsonwebtoken** ^9.0.2 - JWT tokens
- **bcrypt** ^6.0.0 - Hash de senhas
- **helmet** ^8.1.0 - Segurança HTTP
- **@nestjs/throttler** ^6.4.0 - Rate limiting

### Validação e Transformação
- **class-validator** ^0.14.2 - Validação de DTOs
- **class-transformer** ^0.5.1 - Transformação de objetos

### Mensageria e Busca
- **kafkajs** ^2.2.4 - Cliente Kafka
- **@elastic/elasticsearch** ^8.11.0 - Cliente Elasticsearch

### Monitoramento e Observabilidade
- **prom-client** ^15.1.3 - Métricas Prometheus
- **@nestjs/swagger** ^11.2.0 - Documentação OpenAPI

### Email e Storage
- **resend** ^4.6.0 - Serviço de email
- **@aws-sdk/client-s3** ^3.846.0 - AWS S3 client
- **multer** ^2.0.2 - Upload de arquivos

### Queue e Jobs
- **@nestjs/bull** ^11.0.2 - Queue management
- **bull** ^4.16.5 - Redis-based queues

### Configuração e Ambiente
- **@nestjs/config** ^4.0.2 - Configurações
- **dotenv** ^17.1.0 - Variáveis de ambiente

### Desenvolvimento e Testes
- **jest** ^30.0.5 - Framework de testes
- **@nestjs/testing** ^11.0.1 - Utilitários de teste
- **supertest** ^7.0.0 - Testes de API
- **@faker-js/faker** ^9.9.0 - Dados fake para testes
- **ts-jest** ^29.4.1 - TypeScript para Jest

### Code Quality
- **eslint** ^9.18.0 - Linter
- **prettier** ^3.4.2 - Formatador de código
- **typescript-eslint** ^8.20.0 - ESLint para TypeScript

## 🔌 Serviços Externos Implementados

### 1. PostgreSQL (Banco Principal)
- **Versão**: 15-alpine
- **Porta**: 5432
- **Configuração**: TypeORM com migrations automáticas
- **Funcionalidades**:
  - Armazenamento de orders, users e order_items
  - Relacionamentos entre entidades
  - UUID como chave primária
  - Migrations versionadas

### 2. Apache Kafka (Mensageria)
- **Versão**: Bitnami Kafka 3.5 + Zookeeper 3.9
- **Portas**: 9092 (Kafka), 2181 (Zookeeper)
- **Configuração**: KafkaJS client
- **Eventos Implementados**:
  - `order.created` - Quando pedido é criado
  - `order.updated` - Quando pedido é atualizado
  - `user.created` - Quando usuário é criado
- **Features**:
  - Auto-retry em caso de falha
  - Modo mock para desenvolvimento

### 3. Elasticsearch (Search Engine)
- **Versão**: 8.11.0
- **Porta**: 9200
- **Configuração**: Cliente oficial @elastic/elasticsearch
- **Funcionalidades**:
  - Indexação automática de pedidos
  - Busca fuzzy por produtos
  - Filtros por status, data, usuário
  - Aggregations para métricas

### 4. AWS S3 (Storage)
- **SDK**: @aws-sdk/client-s3 ^3.846.0
- **Funcionalidades**:
  - Upload de arquivos
  - Presigned URLs
  - Configuração via environment variables

### 5. Resend (Email Service)
- **Versão**: ^4.6.0
- **Funcionalidades**:
  - Templates de email para:
    - Reset de senha
    - Confirmação de pedido
    - Notificações de venda
    - Pré-registro
- **Configuração**: Via API key

### 6. Prometheus + Grafana (Monitoramento)
- **Prometheus**: v2.45.0 na porta 9090
- **Grafana**: 10.0.0 na porta 3001
- **Métricas Coletadas**:
  - HTTP requests (duração, status codes)
  - Métricas de negócio (orders por status)
  - Performance da aplicação
  - Health checks de serviços externos

## 🧪 Cobertura de Testes

### Status Atual (Coverage Report)
- **Statements**: 51.16% (569/1112)
- **Branches**: 32.33% (43/133) ⚠️
- **Functions**: 41.31% (69/167)
- **Lines**: 51.42% (506/984)

### Scripts de Teste Disponíveis
```bash
# Executar todos os testes
pnpm test

# Testes com coverage
pnpm run test:cov

# Testes em modo watch
pnpm run test:watch

# Testes com análise de memória
pnpm run test:memory
```

### Arquivos de Teste Identificados
- **Total**: 35 arquivos `.spec.ts`
- **Estrutura**: Cada service/controller tem seu respectivo teste
- **Mocks**: Implementados para todos os serviços externos

### Problemas Identificados nos Testes

#### 🔴 Baixa Cobertura de Branches (32.33%)
**Problema**: Faltam testes para cenários de erro e validações condicionais
**Afetados**:
- Elasticsearch service - cenários de falha de conexão
- Kafka service - retry logic e error handling
- Controllers - validação de parâmetros inválidos

#### 🔴 Cenários de Integração
**Problema**: Poucos testes end-to-end
**Faltando**:
- Fluxo completo de criação de pedido
- Integração Kafka + Elasticsearch
- Cenários de falha de serviços externos

#### 🔴 Edge Cases Não Testados
**Problema**: Validações e casos extremos não cobertos
**Exemplos**:
- Dados malformados nos DTOs
- Timeouts de conexão
- Estados inconsistentes

### Configuração Jest
- **Ambiente**: Node.js com ts-jest
- **Setup**: Mocks globais configurados
- **Otimizações**: Controle de memória e workers limitados
- **Coverage**: HTML e LCOV reports

## 🔄 Pontos de Melhoria Futura

### 1. Testes (Prioridade Alta)
- **Meta**: Aumentar cobertura para >80%
- **Ações**:
  - Adicionar testes de integração E2E
  - Cobrir todos os cenários de erro
  - Implementar testes de carga
  - Testes de contract para APIs

### 2. Performance e Escalabilidade
- **Cache**: Implementar Redis para cache de consultas frequentes
- **Database**: Otimização de queries e índices
- **Connection Pooling**: Configurar pools adequados
- **Lazy Loading**: Implementar carregamento sob demanda

### 3. Segurança Avançada
- **RBAC**: Sistema completo de roles e permissões
- **API Rate Limiting**: Throttling mais granular
- **Input Sanitization**: Sanitização avançada de inputs
- **Security Headers**: Headers de segurança completos
- **Audit Logs**: Logs de auditoria para ações críticas

### 4. Observabilidade Avançada
- **Distributed Tracing**: Implementar Jaeger/Zipkin
- **Custom Metrics**: Métricas de negócio específicas
- **Alerting**: Sistema de alertas automáticos
- **Dashboard**: Dashboards customizados por domínio
- **APM**: Application Performance Monitoring

### 5. CI/CD e DevOps
- **Pipeline**: GitHub Actions/GitLab CI completo
- **Testing**: Testes automáticos em múltiplos ambientes
- **Deployment**: Deploy automático com rollback
- **Infrastructure as Code**: Terraform/CloudFormation
- **Blue-Green Deployment**: Deploy sem downtime

### 6. Arquitetura e Código
- **Microservices**: Separação em microsserviços
- **Event Sourcing**: Implementação completa
- **CQRS**: Separação total entre read/write models
- **Domain Events**: Eventos de domínio mais ricos
- **Saga Pattern**: Transações distribuídas

### 7. Developer Experience
- **Documentation**: GitBook ou similar
- **API Versioning**: Versionamento semântico
- **SDK Generation**: SDKs automáticos para clientes
- **Local Development**: Docker Compose otimizado
- **Hot Reload**: Melhorias na experiência de dev

### 8. Recursos Adicionais
- **Internacionalização**: i18n completo
- **Multi-tenancy**: Suporte a múltiplos tenants
- **Backup Strategy**: Estratégia robusta de backup
- **Disaster Recovery**: Plano de recuperação
- **Compliance**: GDPR, LGPD compliance

## 🛠️ Scripts pnpm Disponíveis

### Desenvolvimento
```bash
pnpm run dev          # Servidor em modo desenvolvimento com hot reload
pnpm run debug        # Modo debug com breakpoints
pnpm run start        # Servidor básico
pnpm run start:prod   # Servidor em modo produção
```

### Build e Deploy
```bash
pnpm run build        # Build da aplicação para produção
pnpm run format       # Formatação automática do código
pnpm run format:check # Verificar formatação
pnpm run lint         # Executar linting e correções automáticas
```

### Docker
```bash
pnpm run docker:build # Build da imagem Docker
pnpm run docker:up    # Subir toda a infraestrutura
pnpm run docker:down  # Parar todos os containers
pnpm run docker:logs  # Visualizar logs dos containers
```

### Banco de Dados (TypeORM)
```bash
pnpm run typeorm:run        # Executar migrations
pnpm run typeorm:run:prod   # Executar migrations em produção
pnpm run typeorm:generate   # Gerar nova migration
pnpm run typeorm:create     # Criar migration vazia
pnpm run typeorm:revert     # Reverter última migration
```

### Testes
```bash
pnpm test              # Executar todos os testes
pnpm run test:watch    # Testes em modo watch
pnpm run test:cov      # Testes com coverage report
pnpm run test:memory   # Testes com análise de uso de memória
```

## 🌟 Funcionalidades Principais

### Requisitos Obrigatórios Implementados

1. **Gerenciamento de Pedidos (CRUD)**
   - ✅ Criar pedidos com itens
   - ✅ Visualizar pedidos (individual e listagem)
   - ✅ Atualizar status de pedidos
   - ✅ Cancelar/deletar pedidos

2. **Comunicação via Kafka**
   - ✅ Evento `order.created` ao criar pedido
   - ✅ Evento `order.updated` ao atualizar pedido
   - ✅ Integração com KafkaJS

3. **Integração com Elasticsearch**
   - ✅ Indexação automática de pedidos
   - ✅ Busca avançada por ID, status, datas, produtos, usuário

4. **Clean Architecture**
   - ✅ Domain/Application/Infrastructure/Presentation
   - ✅ Repository Pattern
   - ✅ Dependency Injection
   - ✅ SOLID Principles

5. **Dockerização**
   - ✅ Ambiente completo via `docker-compose up`
   - ✅ PostgreSQL, Kafka, Zookeeper, Elasticsearch

6. **Testes**
   - ✅ Testes unitários com Jest
   - ✅ Mocks para serviços externos
   - ✅ Coverage de serviços principais

7. **Documentação API**
   - ✅ Swagger UI em `/api`
   - ✅ Documentação completa de endpoints

8. **Logs Estruturados**
   - ✅ Interceptador para logs de requisições
   - ✅ Logger estruturado customizado
   - ✅ Logs de eventos de negócio

### Diferenciais Implementados

1. **Monitoramento com Prometheus + Grafana**
   - ✅ Métricas de HTTP (requests, duration, status codes)
   - ✅ Métricas de negócio (orders por status)
   - ✅ Métricas de integração (Kafka, Elasticsearch)
   - ✅ Dashboard Grafana

2. **Observabilidade Avançada**
   - ✅ Logs estruturados em JSON
   - ✅ Request ID para rastreamento
   - ✅ Métricas de performance

3. **Autenticação Completa**
   - ✅ JWT Authentication
   - ✅ Password reset flow
   - ✅ Session management
   - ✅ Email integration

## 📡 API Endpoints

### Autenticação
- `POST /auth/session` - Login
- `POST /auth/refresh-token` - Renovar token
- `POST /auth/forgot-password` - Solicitar reset de senha
- `POST /auth/reset-password` - Reset de senha

### Usuários
- `POST /users` - Criar usuário

### Pedidos
- `POST /orders` - Criar pedido
- `GET /orders` - Listar todos os pedidos
- `GET /orders/search` - Busca avançada (Elasticsearch)
- `GET /orders/user/:userId` - Pedidos por usuário
- `GET /orders/:id` - Buscar pedido específico
- `PATCH /orders/:id` - Atualizar pedido
- `DELETE /orders/:id` - Deletar pedido

### Monitoramento
- `GET /metrics` - Métricas Prometheus

### Busca Avançada (Elasticsearch)
```http
GET /orders/search?status=PENDING&dateFrom=2023-01-01&productName=iPhone
```

**Parâmetros disponíveis:**
- `orderId`: ID específico do pedido
- `status`: Status do pedido (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- `userId`: ID do usuário
- `dateFrom`/`dateTo`: Intervalo de datas
- `productName`: Busca fuzzy nos nomes dos produtos
- `page`/`limit`: Paginação

## 🔧 Configuração de Ambiente

### Variáveis Obrigatórias (.env)

```env
# Database
DATABASE_URL=postgresql://ecommerce:ecommerce123@localhost:5432/ecommercedb
POSTGRES_USER=ecommerce
POSTGRES_PASSWORD=ecommerce123
POSTGRES_DB=ecommercedb

# Application
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-here

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=ecommerce-api
KAFKA_MOCK_MODE=false

# Elasticsearch
ELASTICSEARCH_NODE=http://localhost:9200

# Email (Resend)
RESEND_KEY=your-resend-api-key-here
MAIL_FROM_ADDRESS=ecommerce@yourdomain.com

# Monitoring
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=your-secure-password
```

## 🚀 Tecnologias Utilizadas

- **Backend**: Node.js + NestJS + TypeScript
- **Banco de Dados**: PostgreSQL + TypeORM
- **Message Broker**: Apache Kafka (Bitnami)
- **Search Engine**: Elasticsearch
- **Monitoramento**: Prometheus + Grafana
- **Documentação**: Swagger/OpenAPI
- **Containerização**: Docker + Docker Compose
- **Testes**: Jest + Supertest
- **Code Quality**: ESLint + Prettier
- **Package Manager**: pnpm

---

**Desenvolvido para o desafio técnico Starsoft** ⭐
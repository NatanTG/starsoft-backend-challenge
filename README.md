# 🛒 E-commerce Order Management API

Sistema completo de gerenciamento de pedidos para e-commerce com arquitetura orientada a eventos (Kafka) e busca avançada (Elasticsearch). Desenvolvido como desafio técnico demonstrando arquitetura modular NestJS, DDD, e integração com serviços externos.

## 🎯 Contexto do Teste Técnico

Este projeto foi desenvolvido como resposta ao **Teste para Desenvolvedor Back-End Node.js/Nest.js** da **Starsoft**, implementando todos os requisitos solicitados:

### Requisitos Implementados ✅

- ✅ **API RESTful** completa para gerenciamento de pedidos (CRUD)
- ✅ **Arquitetura modular NestJS** com três camadas (Controllers, Services, Repositories)
- ✅ **Domain-Driven Design** com organização por módulos de domínio
- ✅ **PostgreSQL + TypeORM** com migrations automáticas
- ✅ **Comunicação via Kafka** com eventos `order.created` e `order.updated`
- ✅ **Elasticsearch** para indexação e busca avançada de pedidos
- ✅ **Docker & Docker Compose** para orquestração completa
- ✅ **Testes unitários** com Jest e cobertura de código
- ✅ **Swagger/OpenAPI** para documentação da API
- ✅ **Logs estruturados** com interceptadores NestJS
- ✅ **Monitoramento avançado** com Prometheus + Grafana (diferencial)

### 🎨 Funcionalidades Principais

- **CRUD completo de pedidos** com relacionamentos complexos
- **Arquitetura orientada a eventos** com Apache Kafka
- **Busca avançada** com Elasticsearch e filtros dinâmicos
- **Monitoramento completo** com Prometheus + Grafana
- **Autenticação JWT** com reset de senha
- **Arquitetura Modular NestJS + DDD** com separação clara de responsabilidades
- **Observabilidade** com logs estruturados e métricas

---

## 🚀 Como Executar o Projeto

### 📋 Pré-requisitos

- **Node.js** 20+
- **pnpm** 10.7.0+ (gerenciador de pacotes)
- **Docker & Docker Compose**

### 🐳 Opção 1: Quick Start com Docker (Recomendado)

**Para executar todo o projeto com um único comando:**

```bash
# Rebuild todos os containers (sem usar cache)
docker compose build --no-cache

# Subir todos os serviços (PostgreSQL, Kafka, Elasticsearch, API, Grafana, Prometheus)
docker compose up
```

**Aguarde todos os containers ficarem prontos e acesse:**
- **🌐 API**: http://localhost:3000
- **📚 Documentação Swagger**: http://localhost:3000/api
- **📊 Grafana**: http://localhost:3001 (admin/admin) - (Faltou configurar)
- **🔍 Prometheus**: http://localhost:9090
- **⚡ Elasticsearch**: http://localhost:9200

### ⚙️ Opção 2: Instalação Detalhada (Desenvolvimento)

#### 1. Clone e Configure o Ambiente

```bash
git clone <repo-url>
cd starsoft-backend-challenge

# Copie e configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env conforme necessário
```

#### 2. Instale as Dependências

```bash
# Instalar dependências do projeto
pnpm install
```

#### 3. Inicie a Infraestrutura com Docker

```bash
# Subir toda a infraestrutura (PostgreSQL, Kafka, Elasticsearch, Prometheus, Grafana)
pnpm run docker:up

# Verificar se todos os containers estão rodando
pnpm run docker:logs

# Para parar os containers
pnpm run docker:down
```

#### 4. Execute as Migrações do Banco

```bash
# Executar migrações do banco de dados
pnpm run typeorm:run
```

#### 5. Inicie a Aplicação

```bash
# Modo desenvolvimento (com hot reload)
pnpm run dev

# Modo debug
pnpm run debug

# Build e execução em produção
pnpm run build
pnpm run start:prod
```

---

## 🧪 Estratégia de Desenvolvimento e Mock

### 💡 Por que Mock?

Como este é um **projeto de teste técnico** e não possui serviços externos reais conectados (Kafka clusters, Elasticsearch em produção), implementei uma **estratégia inteligente de mock** que permite:

1. **Demonstrar a arquitetura completa** sem necessidade de infraestrutura complexa
2. **Simular cenários reais** com dados mockados consistentes  
3. **Facilitar testes e desenvolvimento** local
4. **Manter compatibilidade** com implementação real quando necessário

### 🔧 Como Funciona o Mock

#### **Kafka Mock Strategy**
```env
# No .env ou ambiente
KAFKA_MOCK_MODE=true  # Ativa modo mock
KAFKA_MOCK_MODE=false # Usa Kafka real
```

**Quando `KAFKA_MOCK_MODE=true`:**
- ✅ Simula publicação de eventos com logs detalhados
- ✅ Mostra exatamente o payload que seria enviado ao Kafka
- ✅ Registra tópicos, timestamps e dados completos
- ✅ Não requer conexão real com Kafka

**Exemplo de log no modo mock:**
```
[MOCK] Message would be published to topic: order.created
{
  "messageId": "order-123",
  "messageType": "order.created", 
  "timestamp": "2025-08-14T12:34:56.789Z",
  "payload": {
    "id": "order-123",
    "userId": "user-456",
    "status": "PENDING",
    "totalAmount": 1200.00,
    "items": [...]
  }
}
```

#### **Elasticsearch Mock Strategy**

- **MockElasticsearchService** retorna dados simulados realistas
- **SearchOrders** retorna resultados mockados com paginação
- **Operações de indexação** são simuladas com sucesso
- **Logs confirmam** todas as operações mockadas

**Exemplo de resposta mockada:**
```json
{
  "data": [
    {
      "id": "order-1",
      "userId": "user-123", 
      "status": "pending",
      "totalAmount": 199.99,
      "items": [],
      "createdAt": "2025-08-14T12:34:56.789Z"
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

### 🔄 Alternando Entre Mock e Real

Para usar os serviços reais (em produção):

```env
# .env
KAFKA_MOCK_MODE=false
ELASTICSEARCH_NODE=http://your-real-elasticsearch:9200
KAFKA_BROKERS=your-kafka-cluster:9092
```

A arquitetura foi desenvolvida para suportar **ambos os modos** sem alteração de código!

---

## 🏗️ Arquitetura

### Padrões Implementados

- **Three-Layer Architecture**: Separação clara entre Controllers, Services e Repositories
- **Modular Architecture**: Organização por módulos de domínio (padrão NestJS)
- **Domain-Driven Design (DDD)**: Estrutura baseada em domínios de negócio
- **Repository Pattern**: Abstração de acesso a dados
- **Event-Driven Architecture**: Comunicação assíncrona via Kafka
- **Dependency Injection**: Inversão de controle via NestJS

### Estrutura do Projeto

```
src/
├── core/                    # 🔧 Configurações centrais e infraestrutura
│   ├── config/             # Configurações (Kafka, Elasticsearch, Swagger, TypeORM)
│   ├── database/           # Módulo do banco de dados
│   ├── env.ts              # Validação de variáveis de ambiente
│   └── migrations/         # Migrações do banco de dados
│
├── modules/                # 🏢 Módulos de domínio (Business Logic)
│   ├── auth/              # 🔐 Autenticação e autorização
│   │   ├── domain/        # Entidades e regras de negócio
│   │   ├── application/   # Services e DTOs (camada de aplicação)
│   │   ├── infrastructure/# Repositories e adaptadores (camada de dados)
│   │   └── presentation/  # Controllers e rotas (camada de apresentação)
│   │
│   ├── orders/            # 📦 Domínio de pedidos
│   │   ├── domain/        # Entidades (Order, OrderItem) e enums
│   │   ├── application/   # Services (CRUD operations) e DTOs
│   │   ├── infrastructure/# Order Repository implementação
│   │   └── presentation/  # Controllers para API REST
│   │
│   └── user/              # 👤 Domínio de usuários
│       ├── domain/        # User entity
│       ├── application/   # User services e DTOs
│       ├── infrastructure/# User repository
│       └── presentation/  # User controllers
│
└── shared/                # 🔗 Código compartilhado entre módulos
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

---

## 🔌 Serviços & Integrações

### 1. PostgreSQL (Banco Principal)
- **Versão**: 15-alpine | **Porta**: 5432
- **Status**: ✅ **Totalmente funcional** - conexão real
- **Funcionalidades**: Armazenamento de orders, users e order_items com relacionamentos

### 2. Apache Kafka (Mensageria)
- **Versão**: Bitnami Kafka 3.5 + Zookeeper 3.9 | **Portas**: 9092, 2181
- **Status**: 🎭 **Mockado para desenvolvimento** (configurável)
- **Eventos**: `order.created`, `order.updated`, `user.created`
- **Features**: Auto-retry, logs detalhados, modo mock/real alternável

### 3. Elasticsearch (Search Engine)
- **Versão**: 8.11.0 | **Porta**: 9200
- **Status**: 🎭 **Mockado com dados realistas** 
- **Funcionalidades**: Busca fuzzy, filtros avançados, aggregations simuladas

### 4. Prometheus + Grafana (Monitoramento)
- **Prometheus**: v2.45.0 na porta 9090
- **Grafana**: 10.0.0 na porta 3001 (admin/admin)
- **Status**: ✅ **Totalmente funcional** - métricas reais
- **Métricas**: HTTP requests, métricas de negócio, performance, health checks

### 5. Serviços Externos
- **Resend** (Email): 🎭 Mockado - Templates para reset de senha e notificações
- **AWS S3** (Storage): 🎭 Mockado - Upload de arquivos e presigned URLs

---

## 📡 API Documentation

### Endpoints Principais

#### 🔐 Autenticação
```http
POST /auth/session          # Login
POST /auth/refresh-token    # Renovar token
POST /auth/forgot-password  # Solicitar reset de senha
POST /auth/reset-password   # Reset de senha
```

#### 👤 Usuários
```http
POST /users                 # Criar usuário
```

#### 📦 Pedidos
```http
POST /orders                # Criar pedido
GET /orders                 # Listar todos os pedidos
GET /orders/search          # Busca avançada (Elasticsearch)
GET /orders/user/:userId    # Pedidos por usuário
GET /orders/:id             # Buscar pedido específico
PATCH /orders/:id           # Atualizar pedido
DELETE /orders/:id          # Deletar pedido
```

#### 📊 Monitoramento
```http
GET /metrics                # Métricas Prometheus
```

### Busca Avançada (Elasticsearch)

```http
GET /orders/search?status=PENDING&dateFrom=2023-01-01&productName=iPhone
```

**Parâmetros disponíveis:**
- `orderId`: ID específico do pedido
- `status`: Status do pedido (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`)
- `userId`: ID do usuário
- `dateFrom`/`dateTo`: Intervalo de datas
- `productName`: Busca fuzzy nos nomes dos produtos
- `page`/`limit`: Paginação

**Acesse a documentação completa em**: http://localhost:3000/api

---

## 🧪 Testes

### Status Atual de Cobertura
- **Statements**: 51.16% (569/1112)
- **Branches**: 32.33% (43/133)
- **Functions**: 41.31% (69/167)
- **Lines**: 51.42% (506/984)

### Scripts de Teste

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

### Estratégias de Teste
- **Testes unitários** com Jest e mocks robustos
- **Dados mockados 100%** para simulação realista de serviços externos
- **35 arquivos** `.spec.ts` com cobertura de serviços principais
- **Mocks inteligentes** que simulam comportamentos reais dos serviços

---

## 📊 Monitoramento

### Métricas Disponíveis (Prometheus)

#### HTTP Metrics
- **http_requests_total**: Total de requisições HTTP
- **http_request_duration_seconds**: Duração das requisições

#### Business Metrics  
- **orders_total**: Total de pedidos por status e ação
- **kafka_messages_total**: Mensagens Kafka por tópico e status
- **elasticsearch_operations_total**: Operações Elasticsearch

#### System Metrics
- **active_connections**: Conexões ativas
- Métricas padrão do Node.js (heap, CPU, etc.)

### Dashboards Grafana
- **Performance da API**: Latência, throughput, status codes
- **Métricas de Negócio**: Pedidos por status, eventos Kafka
- **Health Checks**: Status dos serviços externos

**Acesse**: http://localhost:3001 (admin/admin)

---

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

# Kafka Configuration
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=ecommerce-api
KAFKA_MOCK_MODE=true  # 🎯 true = mock, false = real Kafka

# Elasticsearch
ELASTICSEARCH_NODE=http://localhost:9200

# Email (Resend)
RESEND_KEY=your-resend-api-key-here
MAIL_FROM_ADDRESS=ecommerce@yourdomain.com

# Monitoring
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=your-secure-password
```

---

## 🛠️ Scripts de Desenvolvimento

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

---

## 🚀 Tecnologias Utilizadas

### Core
- **Node.js** + **NestJS** + **TypeScript**
- **PostgreSQL** + **TypeORM**
- **Apache Kafka** (Bitnami)
- **Elasticsearch**

### Monitoramento & Observabilidade
- **Prometheus** + **Grafana**
- **Swagger/OpenAPI**
- **Logs estruturados** (JSON)

### Integrações
- **Resend** (Email Service)
- **AWS S3** (File Storage)
- **JWT** (Authentication)
- **bcrypt** (Password Hashing)

### Desenvolvimento
- **Jest** + **Supertest** (Testes)
- **ESLint** + **Prettier** (Code Quality)
- **Docker** + **Docker Compose**
- **pnpm** (Package Manager)

---

## 📋 Bibliotecas e Dependências

<details>
<summary>Ver lista completa de dependências</summary>

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

### Serviços Externos
- **resend** ^4.6.0 - Serviço de email
- **@aws-sdk/client-s3** ^3.846.0 - AWS S3 client
- **multer** ^2.0.2 - Upload de arquivos

### Desenvolvimento e Testes
- **jest** ^30.0.5 - Framework de testes
- **@nestjs/testing** ^11.0.1 - Utilitários de teste
- **supertest** ^7.0.0 - Testes de API
- **@faker-js/faker** ^9.9.0 - Dados fake para testes

</details>

---

**Desenvolvido para o desafio técnico Starsoft** ⭐

### 🎯 Considerações Finais

Este projeto demonstra uma implementação robusta que atende a todos os requisitos do teste técnico, com a inteligência adicional de funcionar tanto com **serviços mockados** (ideal para demonstração e desenvolvimento) quanto com **serviços reais** (produção), simplesmente alternando configurações de ambiente.

A arquitetura modular e os padrões implementados garantem **escalabilidade**, **manutenibilidade** e **testabilidade** do código, seguindo as melhores práticas do ecossistema Node.js/NestJS.
# 📡 API Reference

> **Documentação técnica completa** de todos os endpoints, parâmetros, responses e exemplos da E-commerce API.

## 📋 Índice

- [🔧 Configuração Base](#-configuração-base)
- [🔐 Autenticação](#-autenticação)
- [👤 Users API](#-users-api)
- [📦 Orders API](#-orders-api)
- [🔍 Search API](#-search-api)
- [📊 Monitoring API](#-monitoring-api)
- [❌ Códigos de Erro](#-códigos-de-erro)
- [📝 Schemas](#-schemas)

---

## 🔧 Configuração Base

### Base URL
```
http://localhost:3000
```

### Content-Type
```
Content-Type: application/json
```

### Autenticação
```
Authorization: Bearer <access_token>
```

### Swagger/OpenAPI
```
http://localhost:3000/api
```

---

## 🔐 Autenticação

### Login / Create Session

**Endpoint**: `POST /auth/session`  
**Auth**: Não requerido  
**Description**: Autentica usuário e retorna JWT tokens

#### Request Body
```json
{
  "email": "test@example.com",
  "password": "Senhasegura123"
}
```

#### Response 200
```json
{
  "acessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_string",
  "user": {
    "id": "uuid-v4",
    "email": "test@example.com",
    "name": "Test User",
    "createdAt": "2025-08-14T12:34:56.789Z"
  }
}
```

#### Response 400 - Bad Request
```json
{
  "message": ["email must be a valid email"],
  "error": "Bad Request",
  "statusCode": 400
}
```

#### Response 401 - Unauthorized
```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized", 
  "statusCode": 401
}
```

---

### Refresh Token

**Endpoint**: `POST /auth/refresh-token`  
**Auth**: Não requerido  
**Description**: Renova access token usando refresh token

#### Request Body
```json
{
  "refreshToken": "refresh_token_string"
}
```

#### Response 200
```json
{
  "acessToken": "new_jwt_token_here",
  "refreshToken": "new_refresh_token_here"
}
```

---

### Forgot Password

**Endpoint**: `POST /auth/forgot-password`  
**Auth**: Não requerido  
**Description**: Inicia processo de reset de senha

#### Request Body
```json
{
  "email": "user@example.com"
}
```

#### Response 204 - No Content
```
(Empty body - email sent successfully)
```

---

### Reset Password

**Endpoint**: `POST /auth/reset-password`  
**Auth**: Não requerido  
**Description**: Redefine senha usando token do email

#### Request Body
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NovaSenhaSegura123"
}
```

#### Response 204 - No Content
```
(Empty body - password reset successfully)
```

#### Response 400 - Invalid Token
```json
{
  "message": "Invalid or expired reset token",
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 👤 Users API

### Create User

**Endpoint**: `POST /users`  
**Auth**: Não requerido  
**Description**: Cria novo usuário no sistema

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "MinhaSenh@123"
}
```

#### Validation Rules
- `name`: string, min 2 chars, max 100 chars
- `email`: valid email format, unique
- `password`: min 8 chars, 1 uppercase, 1 number, 1 special char

#### Response 201 - Created
```json
{
  "id": "uuid-v4",
  "name": "John Doe",
  "email": "john@example.com", 
  "createdAt": "2025-08-14T12:34:56.789Z",
  "updatedAt": "2025-08-14T12:34:56.789Z"
}
```

#### Response 409 - Conflict (Email exists)
```json
{
  "message": "Email already registered",
  "error": "Conflict",
  "statusCode": 409
}
```

#### Response 400 - Validation Error
```json
{
  "message": [
    "password must contain at least 1 uppercase letter",
    "password must contain at least 1 number"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 📦 Orders API

### Create Order

**Endpoint**: `POST /orders`  
**Auth**: Bearer Token required  
**Description**: Cria novo pedido para o usuário autenticado

#### Request Body
```json
{
  "items": [
    {
      "productId": "prod-123",
      "productName": "iPhone 15 Pro",
      "quantity": 2,
      "unitPrice": 999.99
    },
    {
      "productId": "prod-456",
      "productName": "AirPods Pro", 
      "quantity": 1,
      "unitPrice": 249.99
    }
  ]
}
```

#### Validation Rules
- `items`: array, min 1 item
- `productId`: string, required
- `productName`: string, required
- `quantity`: number, min 1
- `unitPrice`: number, min 0.01

#### Response 201 - Created
```json
{
  "id": "order-uuid",
  "userId": "user-uuid",
  "status": "PENDING",
  "totalAmount": 2249.97,
  "items": [
    {
      "id": "item-uuid-1",
      "productId": "prod-123",
      "productName": "iPhone 15 Pro",
      "quantity": 2,
      "unitPrice": 999.99,
      "totalPrice": 1999.98
    },
    {
      "id": "item-uuid-2", 
      "productId": "prod-456",
      "productName": "AirPods Pro",
      "quantity": 1,
      "unitPrice": 249.99,
      "totalPrice": 249.99
    }
  ],
  "createdAt": "2025-08-14T12:34:56.789Z",
  "updatedAt": "2025-08-14T12:34:56.789Z"
}
```

---

### List All Orders

**Endpoint**: `GET /orders`  
**Auth**: Bearer Token required  
**Description**: Lista todos os pedidos do sistema com paginação

#### Query Parameters
```
page=1          # Página (default: 1)
limit=10        # Items por página (default: 10, max: 50)
```

#### Response 200
```json
{
  "data": [
    {
      "id": "order-uuid",
      "userId": "user-uuid",
      "status": "PENDING",
      "totalAmount": 1499.98,
      "itemsCount": 3,
      "createdAt": "2025-08-14T12:34:56.789Z",
      "user": {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "total": 25,
  "page": 1,
  "totalPages": 3,
  "hasNext": true,
  "hasPrev": false
}
```

---

### List User Orders

**Endpoint**: `GET /orders/user/{userId}`  
**Auth**: Bearer Token required  
**Description**: Lista pedidos de um usuário específico

#### Path Parameters
- `userId`: string (UUID) - ID do usuário

#### Query Parameters
```
page=1          # Página (default: 1)
limit=10        # Items por página (default: 10)
status=PENDING  # Filtro por status (opcional)
```

#### Response 200
```json
{
  "data": [
    {
      "id": "order-uuid",
      "userId": "user-uuid", 
      "status": "PENDING",
      "totalAmount": 999.99,
      "items": [...],
      "createdAt": "2025-08-14T12:34:56.789Z"
    }
  ],
  "total": 5,
  "page": 1,
  "totalPages": 1
}
```

---

### Get Order by ID

**Endpoint**: `GET /orders/{orderId}`  
**Auth**: Bearer Token required  
**Description**: Busca pedido específico por ID

#### Path Parameters
- `orderId`: string (UUID) - ID do pedido

#### Response 200
```json
{
  "id": "order-uuid",
  "userId": "user-uuid",
  "status": "PROCESSING",
  "totalAmount": 1999.98,
  "items": [
    {
      "id": "item-uuid",
      "productId": "prod-123", 
      "productName": "iPhone 15",
      "quantity": 2,
      "unitPrice": 999.99,
      "totalPrice": 1999.98
    }
  ],
  "user": {
    "id": "user-uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "createdAt": "2025-08-14T12:34:56.789Z",
  "updatedAt": "2025-08-14T13:15:30.123Z"
}
```

#### Response 404 - Not Found
```json
{
  "message": "Order not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

### Update Order

**Endpoint**: `PATCH /orders/{orderId}`  
**Auth**: Bearer Token required  
**Description**: Atualiza status do pedido

#### Path Parameters
- `orderId`: string (UUID) - ID do pedido

#### Request Body
```json
{
  "status": "PROCESSING"
}
```

#### Valid Status Values
- `PENDING` - Pendente
- `PROCESSING` - Processando  
- `SHIPPED` - Enviado
- `DELIVERED` - Entregue
- `CANCELLED` - Cancelado

#### Response 200
```json
{
  "id": "order-uuid",
  "userId": "user-uuid",
  "status": "PROCESSING",
  "totalAmount": 999.99,
  "items": [...],
  "updatedAt": "2025-08-14T13:20:15.456Z"
}
```

#### Response 400 - Invalid Status
```json
{
  "message": ["status must be one of: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED"],
  "error": "Bad Request", 
  "statusCode": 400
}
```

---

### Delete Order

**Endpoint**: `DELETE /orders/{orderId}`  
**Auth**: Bearer Token required  
**Description**: Remove pedido do sistema

#### Path Parameters
- `orderId`: string (UUID) - ID do pedido

#### Response 204 - No Content
```
(Empty body - order deleted successfully)
```

#### Response 404 - Not Found
```json
{
  "message": "Order not found",
  "error": "Not Found", 
  "statusCode": 404
}
```

---

## 🔍 Search API

### Search Orders (Elasticsearch)

**Endpoint**: `GET /orders/search`  
**Auth**: Bearer Token required  
**Description**: Busca avançada de pedidos com filtros múltiplos

#### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `orderId` | string | ID específico do pedido | `order-123` |
| `status` | string | Status do pedido | `PENDING` |
| `userId` | string | ID do usuário | `user-456` |
| `dateFrom` | string | Data início (ISO) | `2025-01-01` |
| `dateTo` | string | Data fim (ISO) | `2025-12-31` |
| `productName` | string | Busca fuzzy no nome do produto | `iPhone` |
| `minAmount` | number | Valor mínimo do pedido | `100` |
| `maxAmount` | number | Valor máximo do pedido | `1000` |
| `page` | number | Página (default: 1) | `1` |
| `limit` | number | Items por página (default: 10) | `20` |

#### Example Requests

##### Busca por status
```
GET /orders/search?status=PENDING
```

##### Busca por produto
```
GET /orders/search?productName=iPhone
```

##### Busca por valor
```
GET /orders/search?minAmount=500&maxAmount=2000
```

##### Busca por data
```
GET /orders/search?dateFrom=2025-08-01&dateTo=2025-08-31
```

##### Busca combinada
```
GET /orders/search?status=PENDING&productName=Air&minAmount=200
```

#### Response 200
```json
{
  "data": [
    {
      "id": "order-1",
      "userId": "user-123",
      "status": "pending",
      "totalAmount": 999.99,
      "items": [
        {
          "productName": "iPhone 15",
          "quantity": 1,
          "unitPrice": 999.99
        }
      ],
      "createdAt": "2025-08-14T12:34:56.789Z"
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1,
  "filters": {
    "status": "PENDING",
    "productName": "iPhone"
  }
}
```

#### Response 400 - Invalid Parameters
```json
{
  "message": ["status must be a valid enum value"],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Search Features

#### Fuzzy Search
- **Product Name**: Busca parcial e tolerante a erros
- Exemplo: `productName=iphone` encontra "iPhone 15 Pro"

#### Date Range
- **Format**: ISO 8601 (YYYY-MM-DD)
- **Timezone**: UTC
- Exemplo: `dateFrom=2025-08-01&dateTo=2025-08-31`

#### Price Range  
- **Currency**: Valor em decimal
- **Precision**: 2 casas decimais
- Exemplo: `minAmount=99.99&maxAmount=1999.99`

#### Status Filter
- **Values**: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- **Case**: Case insensitive
- Exemplo: `status=pending` = `status=PENDING`

---

## 📊 Monitoring API

### Health Check

**Endpoint**: `GET /health`  
**Auth**: Não requerido  
**Description**: Verifica saúde da aplicação

#### Response 200
```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    },
    "kafka": {
      "status": "up" 
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    },
    "kafka": {
      "status": "up"
    }
  }
}
```

---

### Prometheus Metrics

**Endpoint**: `GET /metrics`  
**Auth**: Não requerido  
**Description**: Métricas para Prometheus

#### Response 200 (text/plain)
```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",status_code="200"} 145

# HELP orders_total Total number of orders by status
# TYPE orders_total counter
orders_total{status="PENDING",action="created"} 23
orders_total{status="PROCESSING",action="updated"} 15

# HELP kafka_messages_total Total number of Kafka messages
# TYPE kafka_messages_total counter  
kafka_messages_total{topic="order.created",status="success"} 23
kafka_messages_total{topic="order.updated",status="success"} 15
```

---

## ❌ Códigos de Erro

### HTTP Status Codes

| Status | Description | Quando Ocorre |
|--------|-------------|---------------|
| `200` | OK | Requisição bem sucedida |
| `201` | Created | Resource criado com sucesso |
| `204` | No Content | Operação bem sucedida (sem body) |
| `400` | Bad Request | Dados inválidos ou malformados |
| `401` | Unauthorized | Token ausente, inválido ou expirado |
| `403` | Forbidden | Acesso negado (sem permissão) |
| `404` | Not Found | Resource não encontrado |
| `409` | Conflict | Conflito (ex: email já existe) |
| `422` | Unprocessable Entity | Validação de negócio falhou |
| `429` | Too Many Requests | Rate limit excedido |
| `500` | Internal Server Error | Erro interno do servidor |

### Error Response Format

#### Standard Error Response
```json
{
  "message": "Error description or array of errors",
  "error": "Error Type",
  "statusCode": 400,
  "timestamp": "2025-08-14T12:34:56.789Z",
  "path": "/orders"
}
```

#### Validation Error Response
```json
{
  "message": [
    "email must be a valid email",
    "password must be at least 8 characters long"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Common Error Scenarios

#### Authentication Errors
```json
// Missing token
{
  "message": "Unauthorized",
  "statusCode": 401
}

// Invalid token
{
  "message": "Invalid token", 
  "statusCode": 401
}

// Expired token  
{
  "message": "Token has expired",
  "statusCode": 401
}
```

#### Validation Errors
```json
// Required fields
{
  "message": ["email should not be empty"],
  "error": "Bad Request",
  "statusCode": 400
}

// Invalid format
{
  "message": ["email must be a valid email"],
  "error": "Bad Request", 
  "statusCode": 400
}
```

#### Business Logic Errors
```json
// Email already exists
{
  "message": "Email already registered",
  "error": "Conflict",
  "statusCode": 409
}

// Resource not found
{
  "message": "Order not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## 📝 Schemas

### User Schema
```typescript
interface User {
  id: string;           // UUID v4
  name: string;         // 2-100 chars
  email: string;        // Valid email, unique
  password: string;     // Min 8 chars (hashed)
  createdAt: Date;      // ISO string
  updatedAt: Date;      // ISO string
}
```

### Order Schema
```typescript
interface Order {
  id: string;           // UUID v4
  userId: string;       // Foreign key to User
  status: OrderStatus;  // Enum
  totalAmount: number;  // Decimal 2 places
  items: OrderItem[];   // Array of items
  createdAt: Date;      // ISO string
  updatedAt: Date;      // ISO string
}

enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED', 
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}
```

### OrderItem Schema
```typescript
interface OrderItem {
  id: string;           // UUID v4
  orderId: string;      // Foreign key to Order
  productId: string;    // External product reference
  productName: string;  // Product display name
  quantity: number;     // Min 1
  unitPrice: number;    // Decimal 2 places
  totalPrice: number;   // quantity * unitPrice
}
```

### Authentication Schemas
```typescript
// Login Request
interface LoginRequest {
  email: string;        // Valid email
  password: string;     // Plain text
}

// Login Response
interface LoginResponse {
  acessToken: string;   // JWT token
  refreshToken: string; // Refresh token
  user: User;           // User data
}

// Refresh Request
interface RefreshRequest {
  refreshToken: string; // Valid refresh token
}
```

### Pagination Schema
```typescript
interface PaginatedResponse<T> {
  data: T[];            // Array of items
  total: number;        // Total items count
  page: number;         // Current page
  totalPages: number;   // Total pages
  hasNext: boolean;     // Has next page
  hasPrev: boolean;     // Has previous page
}
```

### Search Parameters Schema
```typescript
interface SearchOrdersParams {
  orderId?: string;     // Specific order ID
  status?: OrderStatus; // Order status filter
  userId?: string;      // User ID filter
  dateFrom?: string;    // ISO date string
  dateTo?: string;      // ISO date string
  productName?: string; // Fuzzy search
  minAmount?: number;   // Minimum amount
  maxAmount?: number;   // Maximum amount
  page?: number;        // Page number (default: 1)
  limit?: number;       // Items per page (default: 10)
}
```

---

<div align="center">

**📚 Documentação Completa da API E-commerce**

**🔍 Quer testar?** Veja o [Guia Postman](/docs/POSTMAN-GUIDE.md) para testes passo-a-passo.

[⬅️ Guia Postman](/docs/POSTMAN-GUIDE.md) | [🏗️ Arquitetura](/docs/ARCHITECTURE.md) | [🚀 Onboarding](/docs/ONBOARDING.md)

[📁 Voltar ao README](../README.md)

</div>
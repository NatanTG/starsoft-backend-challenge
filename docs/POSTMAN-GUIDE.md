# 🧪 Guia Completo de Testes - Postman

> **Jornada passo-a-passo** para testar toda a API E-commerce usando Postman. Do zero ao expert em 15 minutos!

## 📋 Índice

- [🚀 Setup Inicial](#-setup-inicial)
- [👤 Jornada de Teste Completa](#-jornada-de-teste-completa)
- [🔐 Módulo Auth](#-módulo-auth)
- [👥 Módulo User](#-módulo-user)
- [📦 Módulo Orders](#-módulo-orders)
- [🔍 Casos de Teste Específicos](#-casos-de-teste-específicos)
- [❌ Troubleshooting](#-troubleshooting)

---

## 🚀 Setup Inicial

### 1. Pré-requisitos

Certifique-se que o projeto está rodando:

```bash
# Verificar se a API está UP
curl http://localhost:3000

# Ou pelo browser
http://localhost:3000/api  # Swagger
```

**Status esperado**: API respondendo na porta 3000 ✅

### 2. Importar Collection e Environment

#### Importar no Postman:

1. **Collection**: `Teste-Ecommerce.postman_collection.json`
2. **Environment**: `Ecommerce-Development.postman_environment.json`

#### Verificar Environment Variables:

```json
{
  "baseUrl": "http://localhost:3000",
  "userEmail": "test@example.com",
  "userPassword": "Senhasegura123",
  "userName": "Test User"
}
```

### 3. Configurar Environment

1. Selecione o environment `Ecommerce-Development`
2. Verifique se `baseUrl` está `http://localhost:3000`
3. As demais variáveis serão preenchidas automaticamente

---

## 👤 Jornada de Teste Completa

### 🎯 Fluxo Recomendado (Ordem de Execução)

```
1. 👤 Criar Usuário          → Registra novo usuário
2. 🔐 Fazer Login           → Obtém accessToken  
3. 📦 Criar Pedidos         → Testa CRUD orders
4. 🔍 Buscar/Filtrar        → Testa search avançado
5. 🔄 Atualizar Pedidos     → Testa updates
6. 🗑️ Deletar Pedidos       → Testa cleanup
7. 🔐 Testar Auth           → refresh, forgot, reset
```

### ⚡ Quick Test (5 minutos)

Para um teste rápido da API:

1. **Create User** → **Login** → **Create Order** → **List Orders**

---

## 🔐 Módulo Auth

### 🎫 Login (Obrigatório primeiro!)

**Endpoint**: `POST /auth/session`

```json
{
  "email": "{{userEmail}}",
  "password": "{{userPassword}}"  
}
```

**Response Esperado**:
```json
{
  "acessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

**✅ Verificações Automáticas**:
- ✅ Token salvo automaticamente em `{{accessToken}}`
- ✅ Refresh token salvo em `{{refreshToken}}`
- ✅ User ID salvo em `{{userId}}`

---

### 🔄 Refresh Token

**Endpoint**: `POST /auth/refresh-token`

```json
{
  "refreshToken": "{{refreshToken}}"
}
```

**Quando usar**: Token expirado (401 Unauthorized)

---

### 🔒 Forgot Password

**Endpoint**: `POST /auth/forgot-password`

```json
{
  "email": "{{forgotPasswordEmail}}"
}
```

**Resultado**: Email mockado enviado + token salvo para reset

---

### 🆕 Reset Password

**Endpoint**: `POST /auth/reset-password`

```json
{
  "token": "{{resetToken}}",
  "newPassword": "NovaSenha123"
}
```

**Dependência**: Execute `Forgot Password` primeiro

---

## 👥 Módulo User

### ➕ Create User

**Endpoint**: `POST /users`

```json
{
  "name": "{{userName}}",
  "email": "{{userEmail}}",
  "password": "{{userPassword}}"
}
```

**Response**:
```json
{
  "id": "uuid",
  "name": "Test User", 
  "email": "test@example.com",
  "createdAt": "2025-08-14T12:34:56.789Z"
}
```

**⚠️ Importante**: 
- Execute **antes** do Login
- Email deve ser único
- Password: min 8 chars, 1 upper, 1 number

---

## 📦 Módulo Orders

### ➕ Create Order

**Endpoint**: `POST /orders`
**Auth**: Bearer Token obrigatório

```json
{
  "items": [
    {
      "productId": "product-1",
      "productName": "iPhone 15",
      "quantity": 2,
      "unitPrice": 999.99
    },
    {
      "productId": "product-2", 
      "productName": "AirPods Pro",
      "quantity": 1,
      "unitPrice": 249.99
    }
  ]
}
```

**Response**:
```json
{
  "id": "order-uuid",
  "userId": "user-uuid",
  "status": "PENDING",
  "totalAmount": 2249.97,
  "items": [...],
  "createdAt": "2025-08-14T12:34:56.789Z"
}
```

**✅ Verificação**: `orderId` salvo automaticamente

---

### 📋 List All Orders

**Endpoint**: `GET /orders?page=1&limit=10`
**Auth**: Bearer Token

**Query Parameters**:
```
page=1              # Página (default: 1)
limit=10            # Items por página (default: 10)
```

**Response**:
```json
{
  "data": [...],
  "total": 5,
  "page": 1,
  "totalPages": 1
}
```

---

### 🔍 Search Orders (Elasticsearch)

**Endpoint**: `GET /orders/search`
**Auth**: Bearer Token

**Filtros Disponíveis**:
```
status=PENDING           # Status do pedido
dateFrom=2025-01-01      # Data início
dateTo=2025-12-31        # Data fim  
productName=iPhone       # Busca fuzzy nos produtos
minAmount=100           # Valor mínimo
maxAmount=1000          # Valor máximo
page=1                  # Paginação
limit=10
```

**Exemplo de busca**:
```
GET /orders/search?status=PENDING&productName=iPhone&minAmount=500
```

**Response Mockado**:
```json
{
  "data": [
    {
      "id": "order-1",
      "userId": "user-123",
      "status": "pending", 
      "totalAmount": 999.99,
      "items": [...],
      "createdAt": "2025-08-14T12:34:56.789Z"
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

---

### 👤 List User Orders

**Endpoint**: `GET /orders/user/{{userId}}`
**Auth**: Bearer Token

**Response**: Pedidos específicos do usuário logado

---

### 🔍 Get Order by ID

**Endpoint**: `GET /orders/{{orderId}}`
**Auth**: Bearer Token

**Response**: Detalhes completos do pedido específico

---

### ✏️ Update Order

**Endpoint**: `PATCH /orders/{{orderId}}`
**Auth**: Bearer Token

```json
{
  "status": "PROCESSING"
}
```

**Status Válidos**:
- `PENDING`
- `PROCESSING` 
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

---

### 🗑️ Delete Order

**Endpoint**: `DELETE /orders/{{orderId}}`
**Auth**: Bearer Token

**Response**: `204 No Content`

---

## 🔍 Casos de Teste Específicos

### Cenário 1: Fluxo Completo E-commerce

```bash
1. Create User (test@example.com)
2. Login (obtém token)
3. Create Order (iPhone + AirPods)
4. List All Orders (ver criado)
5. Update Order (PENDING → PROCESSING)
6. Search Orders (filtro por status)
7. Get Order by ID (detalhes)
8. Update Order (PROCESSING → SHIPPED)
9. Delete Order (cleanup)
```

### Cenário 2: Busca Avançada

```bash
1. Create múltiplos orders (diferentes produtos/valores)
2. Search por produto: productName=iPhone
3. Search por valor: minAmount=500&maxAmount=1500
4. Search por status: status=PENDING
5. Search combinado: status=PENDING&productName=Air
```

### Cenário 3: Autenticação Completa

```bash
1. Login (obtém tokens)
2. Fazer requisições autenticadas
3. Refresh Token (renovar)
4. Forgot Password (reset flow)
5. Reset Password (nova senha)
6. Login com nova senha
```

### Cenário 4: Casos de Erro

```bash
1. Login sem credenciais → 400 Bad Request
2. Acesso sem token → 401 Unauthorized  
3. Token inválido → 401 Unauthorized
4. Order inexistente → 404 Not Found
5. Create user email duplicado → 409 Conflict
```

---

## ❌ Troubleshooting

### 🚫 Erro 401 Unauthorized

**Problema**: Token não enviado ou inválido

**Solução**:
1. Execute `Login` primeiro
2. Verifique se `{{accessToken}}` está preenchido
3. Token expira em 1 hora → Use `Refresh Token`

### 🚫 Erro 404 Not Found

**Problema**: Resource não encontrado

**Soluções**:
- **Order 404**: Execute `Create Order` primeiro
- **User 404**: Execute `Create User` primeiro  
- **Endpoint 404**: Verifique `{{baseUrl}}` = `http://localhost:3000`

### 🚫 Erro 400 Bad Request

**Problema**: Dados inválidos no request

**Verificar**:
- JSON válido
- Campos obrigatórios preenchidos
- Tipos corretos (string, number)
- Email formato válido

### 🚫 Erro 409 Conflict  

**Problema**: Email já existe

**Solução**: Alterar `userEmail` no environment para email único

### 🚫 Collection não carrega

**Problemas comuns**:
1. **API offline**: `docker compose up`
2. **Porta ocupada**: Verificar se 3000 está livre
3. **Environment errado**: Selecionar `Ecommerce-Development`

### 🔧 Debug Dicas

#### Ver Logs da API:
```bash
docker compose logs -f api
```

#### Verificar Containers:
```bash
docker compose ps
```

#### Reset Completo:
```bash
docker compose down -v
docker compose up
```

#### Verificar Saúde da API:
```bash
curl http://localhost:3000/health
```

---

## 🎯 Variáveis de Environment Explicadas

| Variável | Uso | Preenchido Por |
|----------|-----|----------------|
| `baseUrl` | URL base da API | Manual |
| `accessToken` | JWT para autenticação | Login automático |
| `refreshToken` | Token para refresh | Login automático |
| `resetToken` | Token para reset senha | Forgot Password automático |
| `userId` | ID do usuário logado | Login automático |
| `orderId` | ID do último pedido | Create Order automático |
| `userEmail` | Email para testes | Manual |
| `userPassword` | Senha para testes | Manual |
| `userName` | Nome para testes | Manual |

### 🔄 Variáveis Automáticas

As seguintes variáveis são **preenchidas automaticamente** pelos scripts de teste:

- `accessToken` → Após Login
- `refreshToken` → Após Login  
- `resetToken` → Após Forgot Password
- `userId` → Após Login
- `orderId` → Após Create Order

---

<div align="center">

**🎉 Parabéns!** Agora você domina todos os testes da API E-commerce!

**🤔 Dúvidas?** Consulte a [API Reference](/docs/API-REFERENCE.md) para detalhes técnicos.

[⬅️ Onboarding](/docs/ONBOARDING.md) | [🏗️ Arquitetura](/docs/ARCHITECTURE.md) | [📡 API Reference](/docs/API-REFERENCE.md)

[📁 Voltar ao README](../README.md)

</div>
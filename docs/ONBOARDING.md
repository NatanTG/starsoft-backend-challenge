# 🚀 Onboarding Completo - E-commerce API

> **Bem-vindo ao projeto!** Este é seu guia completo para entender e usar a API de gerenciamento de pedidos e-commerce.

## 📋 Índice

- [🎯 Visão Geral do Projeto](#-visão-geral-do-projeto)
- [⚡ Quick Start (5 minutos)](#-quick-start-5-minutos)
- [🔧 Setup Detalhado](#-setup-detalhado)
- [🏗️ Como o Projeto Funciona](#️-como-o-projeto-funciona)
- [📚 Próximos Passos](#-próximos-passos)
- [❓ FAQ](#-faq)

---

## 🎯 Visão Geral do Projeto

Este projeto é uma **API completa de e-commerce** desenvolvida como desafio técnico da **Starsoft**, implementando:

### ✅ O que foi implementado

- ✅ **API RESTful completa** para gerenciamento de pedidos (CRUD)
- ✅ **Arquitetura modular NestJS** com três camadas (Controllers, Services, Repositories)
- ✅ **Domain-Driven Design** com organização por módulos de domínio
- ✅ **PostgreSQL + TypeORM** com migrations automáticas
- ✅ **Comunicação via Kafka** com eventos `order.created` e `order.updated`
- ✅ **Elasticsearch** para indexação e busca avançada de pedidos
- ✅ **Docker & Docker Compose** para orquestração completa
- ✅ **Testes unitários** com Jest e cobertura de código
- ✅ **Swagger/OpenAPI** para documentação da API
- ✅ **Logs estruturados** com interceptadores NestJS
- ✅ **Monitoramento avançado** com Prometheus + Grafana

### 🎨 Principais Funcionalidades

- **CRUD completo de pedidos** com relacionamentos complexos
- **Arquitetura orientada a eventos** com Apache Kafka
- **Busca avançada** com Elasticsearch e filtros dinâmicos
- **Monitoramento completo** com Prometheus + Grafana
- **Autenticação JWT** com reset de senha
- **Observabilidade** com logs estruturados e métricas

---

## ⚡ Quick Start (5 minutos)

### 1. Requisitos Mínimos
```bash
- Node.js 20+
- pnpm 10.7.0+
- Docker & Docker Compose
```

### 2. Executar o Projeto
```bash
# Clone e configure
git clone <repo-url>
cd starsoft-backend-challenge
cp .env.example .env

# Execute tudo com Docker
docker compose up
```

### 3. Verificar se está funcionando
Aguarde os containers subirem e acesse:
- **🌐 API**: http://localhost:3000
- **📚 Swagger**: http://localhost:3000/api
- **📊 Grafana**: http://localhost:3001 (admin/admin)

### 4. Testar a API
Importe no Postman:
- **Collection**: `Teste-Ecommerce.postman_collection.json`
- **Environment**: `Ecommerce-Development.postman_environment.json`

**Pronto!** 🎉 Seu ambiente está rodando.

---

## 🔧 Setup Detalhado

### Opção 1: Docker (Recomendado)
```bash
# Subir todos os serviços
docker compose up

# Em modo detached (background)
docker compose up -d

# Ver logs
docker compose logs -f api

# Parar tudo
docker compose down
```

### Opção 2: Desenvolvimento Local
```bash
# Instalar dependências
pnpm install

# Subir apenas a infraestrutura
pnpm run docker:up

# Executar migrations
pnpm run typeorm:run

# Rodar em desenvolvimento
pnpm dev
```

### Verificação do Environment

Certifique-se que seu `.env` tem as configurações básicas:

```env
# Database
DATABASE_URL=postgresql://ecommerce:ecommerce123@localhost:5432/ecommercedb
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-here

# Mock Mode (para desenvolvimento)
KAFKA_MOCK_MODE=true
```

---

## 🏗️ Como o Projeto Funciona

### Arquitetura Geral

O projeto segue uma **arquitetura em três camadas** com **Domain-Driven Design**:

```
📦 src/
├── 🔧 core/           # Configurações e infraestrutura
├── 🏢 modules/        # Módulos de negócio (auth, users, orders)
└── 🔗 shared/         # Código compartilhado
```

### Fluxo de uma Requisição

1. **Controller** recebe a requisição HTTP
2. **Service** processa a lógica de negócio
3. **Repository** acessa os dados (PostgreSQL)
4. **Kafka** publica eventos assíncronos
5. **Elasticsearch** indexa para busca
6. **Metrics** coleta métricas para Prometheus

### Módulos Principais

#### 🔐 Auth Module
- Login/logout com JWT
- Refresh token
- Reset de senha via email

#### 👤 User Module  
- CRUD de usuários
- Validações de email único

#### 📦 Orders Module
- CRUD completo de pedidos
- Relacionamento com items
- Estados do pedido (PENDING, PROCESSING, SHIPPED, etc.)
- Busca avançada via Elasticsearch

### Estratégia de Mock vs Real

O projeto funciona com **duas estratégias**:

#### 🎭 Modo Mock (Desenvolvimento)
```env
KAFKA_MOCK_MODE=true
```
- Kafka e Elasticsearch são **simulados**
- Logs mostram exatamente o que seria enviado
- Perfeito para desenvolvimento local

#### ⚡ Modo Real (Produção)
```env
KAFKA_MOCK_MODE=false
```
- Conecta com serviços reais
- Apenas mudança de variável de ambiente

---

## 📚 Próximos Passos

### Para Desenvolvedores

1. **[🏗️ Entenda a Arquitetura](/docs/ARCHITECTURE.md)** - Padrões, estrutura e tecnologias
2. **[🧪 Teste com Postman](/docs/POSTMAN-GUIDE.md)** - Jornada completa passo-a-passo
3. **[📡 Explore a API](/docs/API-REFERENCE.md)** - Todos os endpoints detalhados

### Para Avaliadores Técnicos

1. **Verifique os requisitos** implementados (todos ✅)
2. **Execute os testes** com `pnpm test`
3. **Explore o monitoramento** no Grafana
4. **Analise a arquitetura** nos diagramas e código

### Para Curiosos

1. **Veja os logs estruturados** no console
2. **Teste as métricas** em `/metrics`
3. **Explore o mock strategy** alternando `KAFKA_MOCK_MODE`

---

## ❓ FAQ

### 🔍 Como funciona a busca avançada?
A busca usa Elasticsearch (mockado) com filtros por status, data, produto, etc. Veja exemplos no [Postman Guide](/docs/POSTMAN-GUIDE.md).

### 🐳 Por que alguns serviços são mockados?
Para facilitar desenvolvimento local sem necessidade de infraestrutura complexa. Em produção, basta alterar as variáveis de ambiente.

### 📊 Como ver as métricas?
Acesse http://localhost:9090 (Prometheus) ou http://localhost:3001 (Grafana, admin/admin).

### 🧪 Como rodar os testes?
```bash
pnpm test          # Todos os testes
pnpm run test:cov  # Com coverage
```

### 🚨 Container não sobe?
Verifique se as portas estão livres:
- 3000 (API), 5432 (PostgreSQL), 9092 (Kafka), 9200 (Elasticsearch)

### 📝 Como contribuir?
1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'feat: nova feature'`
4. Push: `git push origin feature/nova-feature`

---

<div align="center">

**🎯 Dúvidas?** Consulte a [documentação completa](/docs/) ou [abra uma issue](../../issues).

[⬅️ Voltar ao README](../README.md) | [➡️ Ver Arquitetura](/docs/ARCHITECTURE.md)

</div>
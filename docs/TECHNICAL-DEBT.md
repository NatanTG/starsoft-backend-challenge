# 🔧 Débitos Técnicos e Roadmap

<p align="center">
<strong>Status atual do projeto, limitações conhecidas e próximos passos para evolução</strong>
<br/>
<em>Documento técnico atualizado em 14 de agosto de 2025</em>
</p>

---

## 📊 Overview Geral do Projeto

### ✅ Componentes Funcionais

| Componente | Status | Descrição |
|------------|--------|-----------|
| **🎯 API NestJS** | ✅ **Funcional** | CRUD completo de pedidos, autenticação JWT, Swagger |
| **🐘 PostgreSQL** | ✅ **Funcional** | Banco principal com TypeORM, migrations, relacionamentos |
| **📈 Prometheus** | ✅ **Funcional** | Coleta de métricas HTTP e business metrics |
| **🔍 Logs Estruturados** | ✅ **Funcional** | Winston com logs JSON para observabilidade |
| **🧪 Testes Unitários** | ✅ **Funcional** | Jest com coverage de 51% (precisa melhorar) |

### ⚠️ Componentes com Limitações

| Componente | Status | Limitação Atual |
|------------|--------|-----------------|
| **📊 Grafana** | ⚠️ **Limitado** | Interface funciona, mas sem dashboards configurados |
| **🔍 Elasticsearch** | ⚠️ **Mockado** | Serviço real instalado, mas usando implementação mock |
| **📨 Apache Kafka** | ⚠️ **Mockado** | Configurado mas rodando em modo mock por padrão |
| **📧 Email (Resend)** | ⚠️ **Não validado** | Service implementado mas não testado em produção |

---

## 🚨 Débitos Técnicos Identificados

### 1. 📊 **Grafana - Dashboards Não Configurados**

**🔍 Problema:**
- Grafana roda perfeitamente na porta 3001 (admin/admin123_secure)
- Interface limpa sem visualizações pré-configuradas
- Estrutura de provisioning existe mas está vazia

**📁 Arquivos Envolvidos:**
```
monitoring/grafana/provisioning/
├── dashboards/default.yml    # Configuração básica
└── datasources/prometheus.yml # Datasource configurado
```

**🎯 Impacto:**
- ❌ Não há visualização das métricas coletadas pelo Prometheus
- ❌ Dificulta monitoramento da performance da API
- ❌ Não aproveita o potencial de observabilidade implementado

### 2. 🔍 **Elasticsearch - Implementação Mockada**

**🔍 Problema:**
- Container Elasticsearch roda na porta 9200
- Service abstraído corretamente, mas usando implementação mock
- Busca avançada retorna dados simulados

**📁 Arquivos Envolvidos:**
```
src/shared/services/elasticsearch/
├── elasticsearch.service.ts           # Interface abstrata
└── implementation/
    ├── elasticsearch.service.impl.ts  # Implementação real
    └── mock/ (implícito no código)    # Dados simulados
```

**🎯 Impacto:**
- ❌ Busca de pedidos não funciona com dados reais
- ❌ Filtros avançados não testados em cenário real
- ❌ Performance de busca não validada

### 3. 📨 **Kafka - Modo Mock Ativo**

**🔍 Problema:**
- Kafka roda corretamente (porta 9092) com Zookeeper
- Configurado com `KAFKA_MOCK_MODE=true` por padrão
- Eventos são logados mas não enviados para brokers reais

**📁 Arquivos Envolvidos:**
```
src/shared/services/kafka/
└── implementation/kafkajs.service.ts  # Lógica mock/real
.env: KAFKA_MOCK_MODE=true
```

**🎯 Impacto:**
- ❌ Arquitetura orientada a eventos não testada
- ❌ `order.created` e `order.updated` só simulados
- ❌ Integração real com consumers não validada

### 4. 🧪 **Cobertura de Testes Insuficiente**

**🔍 Problema:**
- Coverage atual: **51.16%** statements
- Branches: **32.33%** | Functions: **41.31%**
- Faltam testes de integração e E2E

**🎯 Impacto:**
- ❌ Confiabilidade limitada em refatorações
- ❌ Bugs podem passar despercebidos
- ❌ Dificuldade para validar fluxos completos

### 5. 📧 **Email Service Não Validado**

**🔍 Problema:**
- Resend API key configurada no `.env`
- Service implementado para reset de senha
- Não validado com envios reais

**🎯 Impacto:**
- ❌ Reset de senha pode não funcionar
- ❌ Notificações por email não testadas

---

## 🛣️ Roadmap de Implementação

### 🔥 **Prioridade ALTA (Sprint 1)**

#### 1. 📊 Configurar Dashboards Grafana
**⏱️ Estimativa:** 4-6 horas

**📋 Tarefas:**
- [ ] Criar dashboard para métricas da API (latência, throughput, status codes)
- [ ] Dashboard de métricas de negócio (pedidos por status, eventos Kafka)
- [ ] Dashboard de health checks e status de serviços
- [ ] Configurar alertas básicos

**📁 Arquivos a Criar:**
```
monitoring/grafana/provisioning/dashboards/
├── api-performance.json
├── business-metrics.json
└── system-health.json
```

**🔧 Exemplo de configuração:**
```json
{
  "dashboard": {
    "title": "API Performance",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [{"expr": "rate(http_requests_total[5m])"}]
      }
    ]
  }
}
```

#### 2. 🔍 Ativar Elasticsearch Real
**⏱️ Estimativa:** 2-3 horas

**📋 Tarefas:**
- [ ] Conectar service implementation real ao Elasticsearch
- [ ] Testar indexação de pedidos
- [ ] Validar busca avançada com dados reais
- [ ] Implementar fallback em caso de falha

**🔧 Mudanças necessárias:**
```typescript
// No módulo de configuração
providers: [
  {
    provide: 'ElasticsearchService',
    useClass: ElasticsearchServiceImpl, // Trocar de Mock para Impl
  }
]
```

### ⚡ **Prioridade MÉDIA (Sprint 2)**

#### 3. 🧪 Melhorar Cobertura de Testes
**⏱️ Estimativa:** 8-10 horas

**📋 Tarefas:**
- [ ] Testes de integração para todos os controllers
- [ ] Testes E2E para fluxos principais
- [ ] Aumentar coverage para mínimo de 80%
- [ ] Implementar testes de carga

**🎯 Meta:** Coverage > 80% em todas as métricas

#### 4. 📨 Conectar Kafka Real
**⏱️ Estimativa:** 3-4 horas

**📋 Tarefas:**
- [ ] Alterar `KAFKA_MOCK_MODE=false` no environment de produção
- [ ] Testar publicação real de eventos
- [ ] Implementar consumers para demonstração
- [ ] Validar delivery guarantees

### 🔧 **Prioridade BAIXA (Sprint 3)**

#### 5. 📧 Validar Email Service
**⏱️ Estimativa:** 2-3 horas

**📋 Tarefas:**
- [ ] Testar envio real de emails via Resend
- [ ] Implementar templates profissionais
- [ ] Configurar webhook para delivery status
- [ ] Adicionar retry logic

#### 6. 🏗️ Melhorias de Arquitetura
**⏱️ Estimativa:** 6-8 horas

**📋 Tarefas:**
- [ ] Implementar Circuit Breaker para serviços externos
- [ ] Adicionar Redis para cache
- [ ] Implementar rate limiting por usuário
- [ ] Configurar auto-scaling no Docker

---

## 🔄 Como Implementar

### 🛠️ Passo a Passo: Grafana Dashboards

1. **Acessar Grafana**
```bash
# Abrir http://localhost:3001
# Login: admin / admin123_secure
```

2. **Configurar Datasource**
```bash
# Adicionar Prometheus como datasource
URL: http://prometheus:9090
```

3. **Criar Dashboard de API**
```json
{
  "title": "E-commerce API Performance",
  "panels": [
    {
      "title": "Request Rate",
      "targets": [{"expr": "rate(http_requests_total[5m])"}]
    },
    {
      "title": "Response Time",
      "targets": [{"expr": "histogram_quantile(0.95, http_request_duration_seconds)"}]
    }
  ]
}
```

### 🛠️ Passo a Passo: Elasticsearch Real

1. **Verificar conexão**
```bash
curl http://localhost:9200/_cluster/health
```

2. **Alterar provider no módulo**
```typescript
// src/shared/services/elasticsearch/elasticsearch.module.ts
providers: [
  {
    provide: 'ElasticsearchService',
    useClass: ElasticsearchServiceImpl, // Era Mock antes
  }
]
```

3. **Testar indexação**
```bash
# Criar um pedido via API e verificar se indexa
curl -X POST http://localhost:3000/orders -d '...'
curl http://localhost:9200/orders/_search
```

---

## 📈 Métricas de Sucesso

### ✅ Critérios de Aceitação

**Grafana:**
- [ ] 3+ dashboards funcionais
- [ ] Métricas atualizando em tempo real
- [ ] Alertas configurados

**Elasticsearch:**
- [ ] Busca funcionando com dados reais
- [ ] Tempo de resposta < 200ms
- [ ] Índices criados automaticamente

**Kafka:**
- [ ] Eventos publicados com sucesso
- [ ] Consumers processando mensagens
- [ ] Zero message loss

**Testes:**
- [ ] Coverage > 80%
- [ ] Testes E2E passando
- [ ] CI/CD verde

---

## 📞 Suporte

**🔗 Links Úteis:**
- **Grafana**: http://localhost:3001 (admin/admin123_secure)
- **Prometheus**: http://localhost:9090
- **Elasticsearch**: http://localhost:9200
- **API Docs**: http://localhost:3000/api

**📚 Documentação Relacionada:**
- [📖 Architecture Overview](/docs/ARCHITECTURE.md)
- [🚀 Onboarding Guide](/docs/ONBOARDING.md)
- [📡 API Reference](/docs/API-REFERENCE.md)

---

<p align="center">
<em>Este documento é um trabalho vivo e deve ser atualizado conforme a implementação dos débitos técnicos.</em>
</p>
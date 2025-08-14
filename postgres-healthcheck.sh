#!/bin/bash
# PostgreSQL Health Check Script
# Evita os warnings de "invalid length of startup packet"

set -eo pipefail

# Variáveis de ambiente do PostgreSQL
PGHOST="${PGHOST:-localhost}"
PGPORT="${PGPORT:-5432}"
PGUSER="${POSTGRES_USER:-ecommerce}"
PGPASSWORD="${POSTGRES_PASSWORD:-ecommerce123}"
PGDATABASE="${POSTGRES_DB:-ecommercedb}"

export PGHOST PGPORT PGUSER PGPASSWORD PGDATABASE

# Executa uma query simples para verificar se o banco está respondendo
psql -v ON_ERROR_STOP=1 --quiet --no-align --tuples-only -c "SELECT 1;" > /dev/null

echo "PostgreSQL is healthy"
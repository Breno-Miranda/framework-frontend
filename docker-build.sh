#!/bin/bash

# Script para build e deploy da aplicação Docker
# Uso: ./docker-build.sh

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Verifica se o Docker está instalado
if ! command -v docker &> /dev/null; then
    error "Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verifica se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

log "Iniciando build da aplicação..."

# Para containers existentes
log "Parando containers existentes..."
docker-compose down --remove-orphans 2>/dev/null || true

# Remove imagens antigas
log "Removendo imagens antigas..."
docker rmi msoft-site:latest 2>/dev/null || true

# Build da imagem
log "Fazendo build da imagem Docker..."
docker build -t msoft-site:latest .

if [ $? -eq 0 ]; then
    log "Build concluído com sucesso!"
else
    error "Erro no build da imagem Docker"
    exit 1
fi

# Inicia os containers
log "Iniciando aplicação..."
docker-compose up -d

# Verifica se os containers estão rodando
sleep 5
if docker-compose ps | grep -q "Up"; then
    log "Container iniciado com sucesso!"
    
    # Mostra logs
    log "Logs do container:"
    docker-compose logs --tail=20
    
    # Mostra status
    log "Status do container:"
    docker-compose ps
    
    log "Aplicação disponível em: http://localhost:80"
else
    error "Erro ao iniciar container"
    docker-compose logs
    exit 1
fi

log "Deploy concluído com sucesso!"
log "Para ver os logs em tempo real: docker-compose logs -f"
log "Para parar: docker-compose down"
log "Alterações no código serão refletidas automaticamente!" 
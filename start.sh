#!/bin/bash

# Script para iniciar a aplicação com hot-reload
# Uso: ./start.sh

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando aplicação MSoft Site...${NC}"

# Verifica se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Docker não está rodando. Iniciando Docker...${NC}"
    open -a Docker
    echo "Aguardando Docker iniciar..."
    sleep 10
fi

# Para containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down 2>/dev/null || true

# Inicia a aplicação
echo "▶️  Iniciando aplicação..."
docker-compose up -d

# Aguarda um pouco e verifica se está rodando
sleep 3
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Aplicação iniciada com sucesso!${NC}"
    echo -e "${GREEN}🌐 Acesse: http://localhost:80${NC}"
    echo ""
    echo -e "${YELLOW}📝 Comandos úteis:${NC}"
    echo "  • Ver logs: docker-compose logs -f"
    echo "  • Parar: docker-compose down"
    echo "  • Rebuild: ./docker-build.sh"
    echo ""
    echo -e "${YELLOW}🔄 Alterações no código serão refletidas automaticamente!${NC}"
else
    echo "❌ Erro ao iniciar aplicação"
    docker-compose logs
    exit 1
fi 
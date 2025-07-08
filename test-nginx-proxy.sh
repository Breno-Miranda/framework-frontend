#!/bin/bash

echo "=== Teste do Proxy Nginx ==="
echo ""

# Testa se o nginx está rodando
echo "1. Verificando se o nginx está rodando..."
if pgrep -x "nginx" > /dev/null; then
    echo "✅ Nginx está rodando"
else
    echo "❌ Nginx não está rodando"
    echo "Para iniciar o nginx:"
    echo "  sudo nginx"
    exit 1
fi

# Testa a configuração do nginx
echo ""
echo "2. Testando configuração do nginx..."
if nginx -t 2>/dev/null; then
    echo "✅ Configuração do nginx está válida"
else
    echo "❌ Configuração do nginx tem erros"
    echo "Verifique o arquivo nginx.conf"
    exit 1
fi

# Testa se a porta 80 está aberta
echo ""
echo "3. Verificando se a porta 80 está aberta..."
if netstat -tuln | grep ":80 " > /dev/null; then
    echo "✅ Porta 80 está aberta"
else
    echo "❌ Porta 80 não está aberta"
    echo "Verifique se o nginx está configurado para escutar na porta 80"
fi

# Testa o proxy localmente
echo ""
echo "4. Testando proxy localmente..."
LOCAL_URL="http://localhost/api/pages?populate=*&filters[active]=true&filters[token_app]=V1HR8Pj12HC3qsi1WgYQkfO5c8BKH&sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=1"

echo "URL de teste: $LOCAL_URL"

# Faz a requisição
RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/proxy_test_response.json "$LOCAL_URL")
HTTP_CODE="${RESPONSE: -3}"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Proxy funcionando! HTTP Code: $HTTP_CODE"
    echo "Resposta (primeiros 500 caracteres):"
    head -c 500 /tmp/proxy_test_response.json
    echo ""
else
    echo "❌ Proxy não funcionou. HTTP Code: $HTTP_CODE"
    echo "Resposta de erro:"
    cat /tmp/proxy_test_response.json
    echo ""
fi

# Testa a API diretamente
echo ""
echo "5. Testando API diretamente (para comparação)..."
DIRECT_URL="https://cms.mirandasoft.com.br/api/pages?populate=*&filters[active]=true&filters[token_app]=V1HR8Pj12HC3qsi1WgYQkfO5c8BKH&sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=1"

DIRECT_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/direct_test_response.json "$DIRECT_URL")
DIRECT_HTTP_CODE="${DIRECT_RESPONSE: -3}"

if [ "$DIRECT_HTTP_CODE" = "200" ]; then
    echo "✅ API direta funcionando! HTTP Code: $DIRECT_HTTP_CODE"
else
    echo "❌ API direta não funcionou. HTTP Code: $DIRECT_HTTP_CODE"
    echo "Isso pode indicar um problema com o CMS ou com a URL"
fi

# Limpa arquivos temporários
rm -f /tmp/proxy_test_response.json /tmp/direct_test_response.json

echo ""
echo "=== Fim do Teste ==="
echo ""
echo "Se o proxy não estiver funcionando, verifique:"
echo "1. Se o nginx está rodando: sudo systemctl status nginx"
echo "2. Se a configuração está correta: sudo nginx -t"
echo "3. Se o arquivo nginx.conf está no local correto"
echo "4. Se há erros nos logs: sudo tail -f /var/log/nginx/error.log" 
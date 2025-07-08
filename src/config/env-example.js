/**
 * Exemplo de Configuração de Ambiente
 * Este arquivo mostra como configurar diferentes ambientes
 * Copie este arquivo e renomeie para env.js para usar
 */

// Configuração para Desenvolvimento
const developmentConfig = {
  NODE_ENV: 'development',
  API_BASE_URL: 'http://localhost:1337', // Strapi local
  STRAPI_BASE_URL: 'http://localhost:1337',
  USE_PROXY: 'false',
  PROXY_URL: '',
  STRAPI_DEBUG: 'true',
  CORS_ENABLED: 'true',
  API_TIMEOUT: '30000'
};

// Configuração para Produção
const productionConfig = {
  NODE_ENV: 'production',
  API_BASE_URL: 'https://api.seu-dominio.com', // Strapi em produção
  STRAPI_BASE_URL: 'https://api.seu-dominio.com',
  USE_PROXY: 'false',
  PROXY_URL: '',
  STRAPI_DEBUG: 'false',
  CORS_ENABLED: 'true',
  API_TIMEOUT: '30000'
};

// Configuração usando origem atual (recomendado)
const autoConfig = {
  NODE_ENV: 'development',
  API_BASE_URL: window.location.origin, // Usa a origem atual automaticamente
  STRAPI_BASE_URL: window.location.origin,
  USE_PROXY: 'false',
  PROXY_URL: '',
  STRAPI_DEBUG: 'true',
  CORS_ENABLED: 'true',
  API_TIMEOUT: '30000'
};

// Configuração com proxy (para desenvolvimento)
const proxyConfig = {
  NODE_ENV: 'development',
  API_BASE_URL: 'http://localhost:3000', // Seu servidor local
  STRAPI_BASE_URL: 'http://localhost:1337', // Strapi
  USE_PROXY: 'true',
  PROXY_URL: 'http://localhost:3000',
  STRAPI_DEBUG: 'true',
  CORS_ENABLED: 'true',
  API_TIMEOUT: '30000'
};

// Escolha a configuração baseada no ambiente
let config;

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  // Desenvolvimento local
  config = developmentConfig;
} else if (window.location.protocol === 'https:') {
  // Produção (HTTPS)
  config = productionConfig;
} else {
  // Configuração automática (recomendado)
  config = autoConfig;
}

// Aplica a configuração
Object.entries(config).forEach(([key, value]) => {
  if (!window.ENV?.env[key]) {
    window.ENV?.set(key, value);
  }
});

console.log('[ENV] Configuração aplicada:', config); 
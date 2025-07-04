# Configuração de Ambientes - MSoft Framework

Este documento explica como configurar e usar as variáveis de ambiente no MSoft Framework.

## 📋 Visão Geral

O MSoft Framework utiliza um sistema robusto de variáveis de ambiente que permite configurar diferentes comportamentos para desenvolvimento e produção, sem modificar o código fonte.

## 🏗️ Arquitetura do Sistema

### Arquivos de Configuração

1. **`env.example`** - Template com todas as variáveis disponíveis
2. **`env.development.js`** - Configurações para desenvolvimento
3. **`env.production.js`** - Configurações para produção
4. **`src/config/env.js`** - Sistema de carregamento de variáveis
5. **Sistema automático** - Detecção automática de ambiente

### Fluxo de Carregamento

```
index.html
    ↓
env.js (sistema de variáveis)
    ↓
env.development.js OU env.production.js
    ↓
config.js (usa as variáveis)
    ↓
core.js (aplica as configurações)
```

## 🔧 Configuração Inicial

### 1. Copie o Arquivo de Exemplo

```bash
cp env.example env.development.js
```

### 2. Configure o Ambiente

O sistema detecta automaticamente o ambiente, mas você pode configurar manualmente se necessário:

```bash
# Edite o index.html para escolher o ambiente
# Descomente a linha do ambiente desejado
```

### 3. Edite as Variáveis

Abra o arquivo do ambiente desejado e configure as variáveis:

```bash
# Desenvolvimento
nano env.development.js

# Produção
nano env.production.js
```

## 📝 Variáveis Disponíveis

### Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NODE_ENV` | Ambiente da aplicação | `development` ou `production` |
| `BUILD_NUMBER` | Número da build | `dev-001` ou `prod-001` |

### API

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `API_BASE_URL` | URL base da API | `http://localhost:3003` |
| `API_TOKEN` | Token de autenticação da API | `your-api-token` |
| `USE_PROXY` | Usar proxy para requisições | `true` ou `false` |
| `PROXY_URL` | URL do proxy | `https://api.msoft.com.br` |

### Segurança

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `APP_TOKEN` | Token da aplicação | `your-app-token` |
| `CSRF_SECRET` | Chave secreta para CSRF | `your-csrf-secret` |
| `JWT_SECRET` | Chave secreta para JWT | `your-jwt-secret` |
| `JWT_EXPIRES_IN` | Tempo de expiração do JWT | `24h` |
| `SESSION_SECRET` | Chave secreta da sessão | `your-session-secret` |
| `COOKIE_SECRET` | Chave secreta dos cookies | `your-cookie-secret` |

### Analytics

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `ANALYTICS_ENABLED` | Habilitar analytics | `true` ou `false` |
| `GA_TRACKING_ID` | ID do Google Analytics | `UA-XXXXXXXXX-X` |
| `FB_PIXEL_ID` | ID do Facebook Pixel | `your-facebook-pixel-id` |

### Cache

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `CACHE_DURATION` | Duração do cache em segundos | `3600` |
| `CACHE_MAX_SIZE` | Tamanho máximo do cache | `100` |

### Rate Limiting

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `RATE_LIMIT_WINDOW_MS` | Janela de tempo em ms | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Máximo de requisições | `100` |

### Upload

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `MAX_FILE_SIZE` | Tamanho máximo de arquivo | `5242880` (5MB) |
| `ALLOWED_FILE_TYPES` | Tipos de arquivo permitidos | `image/jpeg,image/png` |

### Logging

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `LOG_LEVEL` | Nível de log | `debug`, `info`, `error` |
| `LOG_ENDPOINT` | Endpoint para logs remotos | `https://logs.msoft.com.br` |

### URLs

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `SITE_URL` | URL do site | `http://localhost:3000` |
| `API_URL` | URL da API | `http://localhost:3003` |

### SEO

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `SITE_NAME` | Nome do site | `MSoft Framework` |
| `SITE_DESCRIPTION` | Descrição do site | `Framework JavaScript moderno` |
| `SITE_KEYWORDS` | Palavras-chave | `framework,javascript,frontend` |
| `OG_IMAGE_URL` | URL da imagem OG | `https://msoft.com.br/og-image.jpg` |

## 🚀 Uso no Código

### Acessando Variáveis

```javascript
// Usando o sistema de ambiente
const apiUrl = window.env.get('API_BASE_URL');
const isProduction = window.env.isProduction();
const debugEnabled = window.env.getBoolean('DEBUG');

// Usando as funções do config
const apiUrl = getEnv('API_BASE_URL');
const cacheDuration = getEnv('CACHE_DURATION', 3600);
```

### Exemplos de Uso

```javascript
// Configuração de API
const apiConfig = {
  baseUrl: getEnv('API_BASE_URL'),
  token: getEnv('API_TOKEN'),
  timeout: 30000
};

// Configuração de cache
const cacheConfig = {
  enabled: getEnv('CACHE_ENABLED', true),
  duration: getEnv('CACHE_DURATION', 3600),
  maxSize: getEnv('CACHE_MAX_SIZE', 100)
};

// Configuração de analytics
if (getEnv('ANALYTICS_ENABLED', false)) {
  // Inicializar Google Analytics
  const trackingId = getEnv('GA_TRACKING_ID');
  if (trackingId) {
    // Configurar GA
  }
}
```

## 🔄 Troca de Ambiente

O sistema detecta automaticamente o ambiente, mas você pode configurar manualmente se necessário:

### Manualmente

1. **Edite o `index.html`**:
   ```html
   <!-- Desenvolvimento -->
   <script src="/env.development.js"></script>
   <!-- Produção -->
   <!-- <script src="/env.production.js"></script> -->
   ```

2. **Comente/descomente** as linhas apropriadas

## 🛡️ Segurança

### Boas Práticas

1. **Nunca commite tokens reais** no repositório
2. **Use placeholders** em `env.production.js`:
   ```javascript
   APP_TOKEN: 'REPLACE_WITH_REAL_APP_TOKEN'
   ```
3. **Configure tokens reais** apenas no servidor de produção
4. **Use HTTPS** em produção
5. **Valide todas as variáveis** antes de usar

### Exemplo de Configuração Segura

```javascript
// env.production.js
window.ENV_CONFIG = {
  NODE_ENV: 'production',
  API_BASE_URL: 'https://api.msoft.com.br',
  APP_TOKEN: 'REPLACE_WITH_REAL_APP_TOKEN', // ⚠️ Configurar no servidor
  API_TOKEN: 'REPLACE_WITH_REAL_API_TOKEN', // ⚠️ Configurar no servidor
  CSRF_SECRET: 'REPLACE_WITH_REAL_CSRF_SECRET', // ⚠️ Configurar no servidor
  // ... outras variáveis
};
```

## 🔍 Debugging

### Verificar Variáveis Carregadas

```javascript
// No console do navegador
console.log('Todas as variáveis:', window.ENV_CONFIG);
console.log('Ambiente:', window.env.get('NODE_ENV'));
console.log('API URL:', window.env.get('API_BASE_URL'));
```

### Logs de Debug

```javascript
// Habilitar logs detalhados
window.env.set('DEBUG', 'true');
window.env.set('LOG_LEVEL', 'debug');
```

## 📊 Monitoramento

### Variáveis de Monitoramento

```javascript
// Performance
ENABLE_PERFORMANCE_MONITORING=true
ENABLE_ERROR_TRACKING=true
SENTRY_DSN=your-sentry-dsn

// Logs
LOG_LEVEL=info
LOG_ENDPOINT=https://logs.msoft.com.br
```

### Métricas Automáticas

O framework monitora automaticamente:
- Tempo de carregamento de páginas
- Erros JavaScript
- Performance de componentes
- Requisições de API

## 🔧 Personalização

### Adicionando Novas Variáveis

1. **Adicione no `env.example`**:
   ```bash
   # Nova funcionalidade
   NEW_FEATURE_ENABLED=true
   NEW_FEATURE_URL=https://api.example.com
   ```

2. **Configure nos ambientes**:
   ```javascript
   // env.development.js
   NEW_FEATURE_ENABLED: 'true',
   NEW_FEATURE_URL: 'http://localhost:3004'
   
   // env.production.js
   NEW_FEATURE_ENABLED: 'true',
   NEW_FEATURE_URL: 'https://api.example.com'
   ```

3. **Use no código**:
   ```javascript
   if (getEnv('NEW_FEATURE_ENABLED', false)) {
     const url = getEnv('NEW_FEATURE_URL');
     // Usar a nova funcionalidade
   }
   ```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Variável não encontrada**:
   ```javascript
   // Use valor padrão
   const value = getEnv('VARIABLE_NAME', 'default_value');
   ```

2. **Ambiente não detectado**:
   - Verifique se o arquivo de ambiente está sendo carregado no index.html
   - O sistema detecta automaticamente o ambiente

3. **Configurações não aplicadas**:
   - Verifique se o arquivo de ambiente está sendo carregado
   - Limpe o cache do navegador
   - Verifique a ordem dos scripts no `index.html`

### Logs de Debug

```javascript
// Habilitar logs detalhados
window.env.set('DEBUG', 'true');
window.env.set('LOG_LEVEL', 'debug');

// Verificar carregamento
console.log('ENV_CONFIG:', window.ENV_CONFIG);
console.log('env object:', window.env);
```

## 📚 Referências

- [Configuração Principal](src/config/config.js)
- [Sistema de Ambiente](src/config/env.js)
- [Configurações de Segurança](src/config/security.js)
- [Validador](src/utils/validator.js)
- [Documentação de Segurança](SECURITY.md)

---

Para mais informações, consulte a [documentação principal](README.md) ou entre em contato com a equipe de desenvolvimento. 
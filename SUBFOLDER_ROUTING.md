# 🔧 Solução para Roteamento em Subpastas - MSoft Framework

## Problema Identificado

O sistema de roteamento do MSoft Framework estava usando caminhos absolutos fixos (ex: `/src/pages/`, `/src/components/`), o que causava falhas quando o site era hospedado em uma subpasta do servidor.

### Exemplo do Problema:
- **Site na raiz**: `https://exemplo.com/` ✅ Funcionava
- **Site em subpasta**: `https://exemplo.com/msoft-site/` ❌ Não funcionava

## Solução Implementada

### Abordagem: Configuração de Caminho Base Dinâmico

Implementamos um sistema de configuração de caminho base dinâmico no `config.js` que detecta automaticamente o caminho base da aplicação e resolve os caminhos absolutos conforme necessário.

### 1. Configuração BasePath no config.js

Adicionada nova seção `basePath` no arquivo `src/config/config.js`:

```javascript
basePath: {
  // Detecta automaticamente o caminho base da aplicação
  auto: true,
  // Caminho base manual (usado se auto = false)
  manual: window.ENV?.get('BASE_PATH') || "",
  // Função para obter o caminho base atual
  getCurrent() {
    if (!this.auto) {
      return this.manual;
    }
    
    const pathname = window.location.pathname;
    const segments = pathname.split('/').filter(segment => segment !== '');
    
    // Se estamos na raiz, retorna string vazia
    if (segments.length === 0) {
      return '';
    }
    
    // Remove o último segmento se for um arquivo (tem extensão)
    const lastSegment = segments[segments.length - 1];
    if (lastSegment && lastSegment.includes('.')) {
      segments.pop();
    }
    
    // Se ainda há segmentos, retorna o caminho base
    if (segments.length > 0) {
      return `/${segments.join('/')}`;
    }
    
    return '';
  },
  // Função para resolver caminhos absolutos
  resolve(path) {
    const basePath = this.getCurrent();
    
    if (!path || typeof path !== 'string') {
      return '';
    }
    
    // Se o caminho já é absoluto (começa com /), adiciona o basePath
    if (path.startsWith('/')) {
      return `${basePath}${path}`;
    }
    
    // Se é relativo, adiciona o basePath e /
    return `${basePath}/${path}`;
  }
}
```

### 2. Modificações nos Arquivos

#### Arquivos Modificados:

1. **`src/config/config.js`**
   - Adicionada seção `basePath` com detecção automática
   - Mantidos caminhos absolutos nas configurações
   - Adicionados logs de debug para troubleshooting

2. **`src/core/core.js`**
   - Substituídos caminhos por `window.config.basePath.resolve()`
   - Carregamento de páginas e componentes usa caminhos resolvidos

3. **`src/config/sw.js`**
   - Service worker mantém caminhos absolutos
   - Registro do service worker usa caminho resolvido

4. **`index.html`**
   - Service worker registration usa `window.config.basePath.resolve()`

5. **Arquivos de Teste**
   - `test-config-basepath.html`: Teste específico da nova configuração

## Como Funciona

### Detecção Automática

O sistema detecta automaticamente se está em uma subpasta:

```javascript
// Exemplo 1: Site na raiz
// URL: https://exemplo.com/
// config.basePath.getCurrent() → ""

// Exemplo 2: Site em subpasta
// URL: https://exemplo.com/msoft-site/
// config.basePath.getCurrent() → "/msoft-site"

// Exemplo 3: Site em subpasta com arquivo
// URL: https://exemplo.com/msoft-site/index.html
// config.basePath.getCurrent() → "/msoft-site"
```

### Resolução de Caminhos

```javascript
// Exemplo 1: Site na raiz
config.basePath.resolve('/src/pages/home.html') → '/src/pages/home.html'

// Exemplo 2: Site em subpasta
config.basePath.resolve('/src/pages/home.html') → '/msoft-site/src/pages/home.html'

// Exemplo 3: Caminho relativo
config.basePath.resolve('src/pages/home.html') → '/msoft-site/src/pages/home.html'
```

### Configuração Manual

É possível desabilitar a detecção automática e usar um caminho manual:

```javascript
// No config.js ou via variável de ambiente
basePath: {
  auto: false,
  manual: "/caminho/manual"
}
```

## Testes

### Arquivo de Teste Específico

Criado o arquivo `test-config-basepath.html` para testar a nova configuração:

```bash
# Abrir no navegador
open test-config-basepath.html
```

### Testes Disponíveis

1. **Teste de Detecção de Base Path**: Verifica se a detecção automática está correta
2. **Teste de Resolução de Caminhos**: Testa a resolução de diferentes tipos de caminhos
3. **Teste de Carregamento de Páginas**: Testa o carregamento real de páginas
4. **Teste de Carregamento de Componentes**: Testa o carregamento real de componentes
5. **Controles de Configuração**: Permite testar modo automático vs manual

## Compatibilidade

### Cenários Suportados

✅ **Site na raiz do servidor**
- `https://exemplo.com/`
- `https://exemplo.com/index.html`

✅ **Site em subpasta**
- `https://exemplo.com/msoft-site/`
- `https://exemplo.com/msoft-site/index.html`
- `https://exemplo.com/projetos/msoft-site/`

✅ **Subpastas aninhadas**
- `https://exemplo.com/projetos/2024/msoft-site/`

✅ **Configuração manual**
- Qualquer caminho base definido manualmente

### Navegadores Suportados

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

## Implementação

### Passos para Aplicar

1. **Verificar se o arquivo `src/config/config.js` está carregado**
2. **Testar em diferentes cenários de hospedagem**
3. **Verificar se todos os assets estão sendo carregados corretamente**

### Verificação

Para verificar se a solução está funcionando:

```javascript
// No console do navegador
console.log('Base Path:', window.config.basePath.getCurrent());
console.log('Resolved Path:', window.config.basePath.resolve('/src/pages/home.html'));
```

## Benefícios

1. **Flexibilidade**: Funciona em qualquer estrutura de pastas
2. **Compatibilidade**: Mantém compatibilidade com sites na raiz
3. **Automatização**: Detecta automaticamente o ambiente
4. **Configurabilidade**: Permite configuração manual quando necessário
5. **Manutenibilidade**: Código centralizado no config.js
6. **Performance**: Sem overhead significativo
7. **Debug**: Logs detalhados para troubleshooting

## Troubleshooting

### Problemas Comuns

1. **Assets não carregam**
   - Verificar se `window.config` está disponível
   - Verificar se `window.config.basePath` está definido
   - Verificar se os caminhos estão sendo resolvidos corretamente

2. **Roteamento não funciona**
   - Verificar se o arquivo `config.js` está sendo carregado
   - Verificar se não há erros no console
   - Verificar se a detecção automática está funcionando

3. **Service Worker não funciona**
   - Verificar se os caminhos no `sw.js` estão corretos
   - Verificar se o registro do service worker está usando o caminho resolvido
   - Limpar cache do navegador

### Debug

Para ativar logs de debug:

```javascript
// No console do navegador
window.config.app.debug = true;
```

Os logs aparecerão no console com prefixo `[Config] basePath`.

## Configuração Avançada

### Variáveis de Ambiente

É possível configurar via variáveis de ambiente:

```javascript
// .env
BASE_PATH=/caminho/manual
NODE_ENV=production
DEBUG=true
```

### Configuração Programática

```javascript
// Desabilitar detecção automática
window.config.basePath.auto = false;
window.config.basePath.manual = "/caminho/manual";

// Habilitar detecção automática
window.config.basePath.auto = true;
```

## Conclusão

A nova abordagem de configuração de caminho base dinâmico oferece:

- **Simplicidade**: Configuração centralizada no config.js
- **Flexibilidade**: Funciona automaticamente ou com configuração manual
- **Robustez**: Logs de debug para troubleshooting
- **Compatibilidade**: Mantém todos os caminhos absolutos existentes
- **Escalabilidade**: Fácil de estender para novos cenários

Esta solução resolve o problema de roteamento em subpastas mantendo a simplicidade e compatibilidade do sistema original. 
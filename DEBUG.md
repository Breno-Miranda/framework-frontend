# Sistema de Debug - MSoft Framework

## Visão Geral

O MSoft Framework agora possui um sistema de debug controlado por URL que permite esconder todos os logs do console quando não necessário, melhorando a experiência do usuário final e a performance da aplicação.

## Como Funciona

### Debug Desabilitado (Padrão)
- Todos os `console.log`, `console.warn` e `console.info` são silenciados
- Apenas `console.error` permanece ativo para erros críticos
- A aplicação roda de forma limpa sem poluir o console

### Debug Habilitado
- Adicione `?debug=true` à URL para habilitar todos os logs
- Exemplo: `https://seusite.com/?debug=true`
- Exemplo: `https://seusite.com/blog?debug=true`

## Uso para Desenvolvedores

### 1. Habilitar Debug via URL
```
https://seusite.com/?debug=true
```

### 2. Usar o Sistema de Debug no Código
```javascript
// Em vez de console.log
console.log('Mensagem de debug');

// Use o sistema de debug
window.Debug?.log('Mensagem de debug');

// Com dados adicionais
window.Debug?.log('Dados da API:', responseData);

// Para warnings
window.Debug?.warn('Aviso importante:', warningData);

// Para informações
window.Debug?.info('Informação:', infoData);
```

### 3. Verificar se Debug está Habilitado
```javascript
if (window.Debug?.isEnabled()) {
  // Executar código apenas quando debug estiver ativo
  performDebugOperations();
}
```

## API do Sistema de Debug

### Métodos Disponíveis

#### `window.Debug.log(message, data)`
- Exibe mensagem de log quando debug está habilitado
- `message`: String com a mensagem
- `data`: Dados opcionais para exibir

#### `window.Debug.warn(message, data)`
- Exibe warning quando debug está habilitado
- `message`: String com a mensagem
- `data`: Dados opcionais para exibir

#### `window.Debug.info(message, data)`
- Exibe informação quando debug está habilitado
- `message`: String com a mensagem
- `data`: Dados opcionais para exibir

#### `window.Debug.isEnabled()`
- Retorna `true` se debug está habilitado
- Retorna `false` se debug está desabilitado

#### `window.Debug.enable()`
- Habilita debug dinamicamente
- Restaura o console original

#### `window.Debug.disable()`
- Desabilita debug dinamicamente
- Silencia console.log, console.warn, console.info

#### `window.Debug.addDebugToUrl()`
- Adiciona `?debug=true` à URL atual
- Habilita debug automaticamente

#### `window.Debug.removeDebugFromUrl()`
- Remove `?debug=true` da URL atual
- Desabilita debug automaticamente

## Exemplos de Uso

### 1. Log Condicional
```javascript
// Antes
console.log('Dados da API:', apiData);

// Depois
window.Debug?.log('Dados da API:', apiData);
```

### 2. Debug de Performance
```javascript
// Medir tempo de carregamento
const startTime = performance.now();
// ... código ...
const endTime = performance.now();
window.Debug?.log('Tempo de execução:', endTime - startTime);
```

### 3. Debug de Componentes
```javascript
// Verificar se componente foi carregado
window.Debug?.log('Componente carregado:', componentName);
```

### 4. Debug de API
```javascript
// Log de requisições
window.Debug?.log('API Request:', { url, method, data });
window.Debug?.log('API Response:', response);
```

## Service Worker

O Service Worker também possui debug condicional:

```javascript
// No Service Worker
debugLog('Cache aberto');
debugLog('Removendo cache antigo:', cacheName);
```

## Benefícios

### Para Usuários Finais
- Console limpo sem logs desnecessários
- Melhor performance da aplicação
- Experiência mais profissional

### Para Desenvolvedores
- Debug fácil via URL
- Logs detalhados quando necessário
- Não precisa modificar código para debug
- Sistema centralizado de logging

### Para Produção
- Logs automáticos desabilitados
- Melhor segurança (menos informações expostas)
- Performance otimizada

## Migração de Código Existente

### Substituir console.log
```javascript
// Antes
console.log('Mensagem');

// Depois
window.Debug?.log('Mensagem');
```

### Substituir console.warn
```javascript
// Antes
console.warn('Aviso');

// Depois
window.Debug?.warn('Aviso');
```

### Substituir console.info
```javascript
// Antes
console.info('Informação');

// Depois
window.Debug?.info('Informação');
```

### Manter console.error
```javascript
// Manter como está - erros críticos sempre aparecem
console.error('Erro crítico');
```

## Configuração

O sistema de debug é carregado automaticamente no `index.html`:

```html
<!-- Sistema de Debug (deve ser carregado antes de todos os outros scripts) -->
<script src="src/utils/debug.js"></script>
```

## Compatibilidade

- Funciona em todos os navegadores modernos
- Compatível com ES6+
- Não interfere com outras bibliotecas
- Funciona com Service Workers

## Troubleshooting

### Debug não funciona
1. Verifique se a URL contém `?debug=true`
2. Verifique se o arquivo `debug.js` foi carregado
3. Verifique o console do navegador para erros

### Logs não aparecem
1. Confirme que debug está habilitado: `window.Debug?.isEnabled()`
2. Verifique se está usando `window.Debug?.log()` em vez de `console.log()`
3. Recarregue a página com `?debug=true`

### Performance
- O sistema de debug tem impacto mínimo na performance
- Quando desabilitado, não há overhead
- Quando habilitado, apenas adiciona prefixo `[DEBUG]` aos logs 
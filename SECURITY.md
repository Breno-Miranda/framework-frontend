# Segurança do MSoft Framework

Este documento descreve as melhorias de segurança implementadas no MSoft Framework.

## 🔒 Melhorias de Segurança Implementadas

### 1. Sistema de Configuração de Segurança (`src/config/security.js`)

#### Headers de Segurança
- **X-XSS-Protection**: Proteção contra ataques XSS
- **X-Content-Type-Options**: Previne MIME type sniffing
- **X-Frame-Options**: Proteção contra clickjacking
- **Referrer-Policy**: Controle de informações de referência
- **Permissions-Policy**: Controle de permissões do navegador
- **Content-Security-Policy**: Política de segurança de conteúdo

#### Configurações de Autenticação
- Validação de senhas com requisitos mínimos
- Sistema de tokens CSRF
- Rate limiting para tentativas de login
- Expiração de tokens configurável

#### Sanitização de Dados
- Sanitização automática de HTML
- Validação de URLs
- Criptografia básica de dados sensíveis
- Filtros de entrada configuráveis

### 2. Sistema de Validação (`src/utils/validator.js`)

#### Validações Implementadas
- **Campos obrigatórios**: Verificação de campos vazios
- **Emails**: Validação de formato de email
- **URLs**: Verificação de URLs seguras
- **Telefones**: Validação de formato brasileiro
- **CPF**: Validação completa de CPF
- **Datas**: Verificação de datas válidas
- **Comprimento**: Validação de tamanho mínimo/máximo
- **Intervalos**: Validação de valores numéricos
- **Listas**: Verificação de valores permitidos

#### Validação de Formulários
```javascript
const validationRules = {
  email: ['required', 'isEmail'],
  name: ['required', { minLength: 2 }],
  message: ['required', { minLength: 10 }]
};

if (!validator.validate(data, validationRules)) {
  const errors = validator.getErrors();
  // Tratar erros
}
```

### 3. Melhorias no Core (`src/core/core.js`)

#### Sanitização Automática
- Todos os inputs são sanitizados antes do processamento
- HTML malicioso é removido automaticamente
- Scripts inline são validados e sanitizados

#### Rate Limiting
- Limitação de requisições por URL
- Configuração de janela de tempo
- Proteção contra ataques de força bruta

#### Validação de URLs
- Verificação de URLs antes da navegação
- Log de tentativas de acesso a URLs suspeitas
- Bloqueio de URLs maliciosas

#### Cache Seguro
- Cache de requisições com expiração
- Sanitização de dados em cache
- Proteção contra cache poisoning

### 4. Configuração do Servidor (`.htaccess`)

#### Headers de Segurança
```apache
Header always set X-XSS-Protection "1; mode=block"
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
```

#### Content Security Policy
```apache
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://code.jquery.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.msoft.com.br;"
```

#### Proteção contra Ataques
- Bloqueio de user agents maliciosos
- Proteção contra SQL injection
- Proteção contra XSS
- Bloqueio de acesso a arquivos sensíveis
- Proteção contra hotlinking

#### Compressão e Performance
- Compressão Gzip habilitada
- Cache de navegador configurado
- Otimização de tipos MIME
- Configurações de timeout

### 5. Melhorias no HTML (`index.html`)

#### Meta Tags de Segurança
```html
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta http-equiv="X-Content-Type-Options" content="nosnof">
```

#### Cross-Origin Resource Sharing
```html
<link crossorigin="anonymous" href="...">
<script crossorigin="anonymous" src="...">
```

#### Structured Data
- Dados estruturados para SEO
- Informações da organização
- Metadados de segurança

### 6. Monitoramento e Logs

#### Logs de Segurança
- Eventos de segurança são registrados
- Tentativas de acesso suspeitas
- Erros de validação
- Falhas de autenticação

#### Monitoramento de Performance
- Métricas de carregamento
- Tempo de resposta
- Uso de recursos
- Erros de aplicação

## 🛡️ Práticas de Segurança Recomendadas

### Para Desenvolvedores

1. **Sempre validar inputs**
   ```javascript
   if (!validator.isEmail(email)) {
     // Tratar erro
   }
   ```

2. **Sanitizar dados antes de exibir**
   ```javascript
   const safeHtml = SecurityUtils.sanitizeHtml(userInput);
   ```

3. **Usar HTTPS em produção**
   - Configure certificados SSL
   - Force redirecionamento HTTPS
   - Habilite HSTS

4. **Manter dependências atualizadas**
   - Monitore vulnerabilidades
   - Atualize regularmente
   - Use ferramentas de análise

### Para Administradores

1. **Configurar servidor web**
   - Aplique headers de segurança
   - Configure rate limiting
   - Monitore logs de acesso

2. **Backup e recuperação**
   - Faça backups regulares
   - Teste procedimentos de recuperação
   - Mantenha cópias offline

3. **Monitoramento contínuo**
   - Configure alertas de segurança
   - Monitore tentativas de acesso
   - Analise logs regularmente

## 🔍 Testes de Segurança

### Testes Automatizados
```javascript
// Teste de validação de email
test('Email validation', () => {
  expect(validator.isEmail('test@example.com')).toBe(true);
  expect(validator.isEmail('invalid-email')).toBe(false);
});

// Teste de sanitização
test('HTML sanitization', () => {
  const input = '<script>alert("xss")</script>Hello';
  const output = SecurityUtils.sanitizeHtml(input);
  expect(output).toBe('Hello');
});
```

### Testes Manuais
1. **Teste de XSS**: Tente inserir scripts em campos de input
2. **Teste de SQL Injection**: Tente comandos SQL em formulários
3. **Teste de CSRF**: Verifique tokens em requisições
4. **Teste de Rate Limiting**: Faça muitas requisições rapidamente

## 📊 Métricas de Segurança

### Indicadores a Monitorar
- Tentativas de login falhadas
- Requisições bloqueadas por rate limiting
- Erros de validação
- Tentativas de acesso a arquivos sensíveis
- Tempo de resposta da aplicação

### Ferramentas Recomendadas
- **OWASP ZAP**: Teste de vulnerabilidades
- **Burp Suite**: Análise de segurança
- **Lighthouse**: Auditoria de segurança
- **Security Headers**: Verificação de headers

## 🚨 Incidentes de Segurança

### Procedimento de Resposta
1. **Identificação**: Detecte o incidente rapidamente
2. **Contenção**: Isole sistemas afetados
3. **Eradicação**: Remova a causa raiz
4. **Recuperação**: Restaure sistemas
5. **Análise**: Documente lições aprendidas

### Contatos de Emergência
- **Equipe de Segurança**: security@msoft.com.br
- **Suporte Técnico**: support@msoft.com.br
- **Administrador**: admin@msoft.com.br

## 📚 Recursos Adicionais

### Documentação
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Mozilla Security Guidelines](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Web Security Fundamentals](https://web.dev/security/)

### Ferramentas
- [Security Headers](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [Qualys SSL Labs](https://www.ssllabs.com/ssltest/)

---

**Última atualização**: Dezembro 2024  
**Versão**: 1.0.0  
**Responsável**: Equipe de Segurança MSoft 
# MSoft Framework

Um framework JavaScript moderno e leve para desenvolvimento web, focado em simplicidade, performance e facilidade de uso.

## 🚀 Início Rápido

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/your-repo/msoft-framework.git
   cd msoft-framework
   ```

2. **Execute o build automatizado:**
   ```sh
   # Torne o script executável
   chmod +x build.sh
   
   # Execute o build
   ./build.sh
   ```

3. **Configure o ambiente:**
   ```sh
   # Opção 1: Interface web (recomendado)
   open src/pages/switch-env.html
   
   # Opção 2: Manualmente
   # Edite index.html e comente/descomente as linhas de ambiente
   ```

4. **Abra `index.html` no seu navegador**
   Pronto! O build já baixou todos os CDNs e otimizou os arquivos.

## 🔧 Sistema de Build Automatizado

O projeto inclui um script de build (`build.sh`) que automatiza todo o processo de preparação para produção:

### **O que o build faz:**

1. **Download automático de CDNs:**
   - Bootstrap CSS/JS (5.3.0)
   - Bootstrap Icons CSS/Font (1.11.0)
   - Swiper CSS/JS (8)
   - Skeleton CSS (2.0.4)
   - jQuery (3.7.1)
   - PapaParse (5.4.1)
   - Marked

2. **Organização de assets:**
   - CSS → `assets/vendor/css/`
   - JS → `assets/vendor/js/`
   - Fonts → `assets/vendor/fonts/`
   - Favicons → `assets/vendor/favicon/`
   - Imagens → `assets/images/`

3. **Otimização:**
   - Minificação de CSS, JS e HTML
   - Ajuste de caminhos para produção
   - Cópia de favicons e imagens
   - Limpeza de arquivos de desenvolvimento

4. **Estrutura de saída:**
   ```
   dist/
   ├── assets/vendor/css/     # CDNs baixados
   ├── assets/vendor/js/      # CDNs baixados
   ├── assets/vendor/fonts/   # Fontes
   ├── assets/vendor/favicon/ # Favicons
   ├── assets/images/         # Imagens
   └── src/                   # Código minificado
   ```

### **Executar o build:**
```bash
./build.sh
```

### **Adicionar novos CDNs:**
Edite o arquivo `build.sh` e adicione na seção de downloads:
```bash
# Novo CDN
echo "Baixando Novo CDN..."
curl -sSL "https://cdn.jsdelivr.net/npm/novo-cdn@versao/arquivo.min.js" -o "dist/assets/vendor/js/novo-cdn.min.js"
echo "✓ Novo CDN baixado"
```

## 🌐 Sistema de Roteamento e URLs

O MSoft Framework possui um sistema avançado de roteamento que funciona perfeitamente em qualquer ambiente, seja desenvolvimento local ou produção.

### **BASE_PATH - Detecção Automática de Ambiente**

O sistema detecta automaticamente o ambiente e configura o `BASE_PATH` apropriado:

```javascript
// src/config/config.js
const config = {
  basePath: {
    auto: false, // Detecta automaticamente
    development: "/$SUBPASTA", // Para desenvolvimento local
    production: "" // Para produção (raiz)
  }
};
```

#### **Como funciona:**

1. **Desenvolvimento Local**: 
   - URL: `http://localhost/framework/`
   - BASE_PATH: `/framework`
   - Links: `/docs` → `/framework/docs`

2. **Produção**: 
   - URL: `https://site.com/`
   - BASE_PATH: `""` (vazio)
   - Links: `/docs` → `/docs`

3. **Subpastas**: 
   - URL: `https://site.com/app/`
   - BASE_PATH: `/app`
   - Links: `/docs` → `/app/docs`

### **URL Processor - Processamento Automático**

O sistema inclui um processador automático de URLs (`src/utils/url-processor.js`) que:

#### **Funcionalidades:**

1. **Processamento de Links Estáticos:**
   ```html
   <!-- Antes -->
   <a href="/docs">Documentação</a>
   
   <!-- Depois (desenvolvimento) -->
   <a href="/framework/docs">Documentação</a>
   ```

2. **Processamento de Links Dinâmicos:**
   ```html
   <!-- Links em componentes carregados dinamicamente -->
   <a href="/about">Sobre</a>
   <!-- Automaticamente processado para /framework/about -->
   ```

3. **Prevenção de Loops Infinitos:**
   ```javascript
   // Evita URLs malformadas como /framework/framework/docs
   if (url.includes(BASE_PATH)) {
     return url; // Não reaplica o BASE_PATH
   }
   ```

4. **Observador de Mudanças no DOM:**
   ```javascript
   // Processa novos links adicionados dinamicamente
   const observer = new MutationObserver(processNewLinks);
   observer.observe(document.body, { childList: true, subtree: true });
   ```

#### **Configuração do Processador:**

```javascript
// src/utils/url-processor.js
const urlProcessor = {
  // Processa todos os links no DOM
  processAllLinks() {
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => this.processLink(link));
  },
  
  // Processa um link específico
  processLink(link) {
    const href = link.getAttribute('href');
    if (this.shouldProcess(href)) {
      const newHref = window.Helpers?.resolveUrl(href) || href;
      link.setAttribute('href', newHref);
    }
  },
  
  // Verifica se deve processar o link
  shouldProcess(href) {
    return href && 
           !href.startsWith('http') && 
           !href.startsWith('#') && 
           !href.startsWith('mailto:') &&
           !href.startsWith('tel:') &&
           !href.includes('${window.Helpers'); // Evita template literals
  }
};
```

### **Helpers - Funções Utilitárias**

O sistema inclui funções utilitárias para resolução de URLs:

```javascript
// src/core/helpers.js
window.Helpers = {
  // Resolve uma URL considerando o BASE_PATH
  resolveUrl(path) {
    const basePath = window.BASE_PATH || '';
    
    // Se o BASE_PATH for /$SUBPASTA (desenvolvimento), trata como raiz
    if (basePath === '/$SUBPASTA') {
      return path;
    }
    
    // Se o path já contém o BASE_PATH, não reaplica
    if (path.includes(basePath)) {
      return path;
    }
    
    // Concatena BASE_PATH com o path
    return basePath + path;
  },
  
  // Obtém o BASE_PATH atual
  getBasePath() {
    return window.BASE_PATH || '';
  },
  
  // Verifica se está em desenvolvimento
  isDevelopment() {
    return window.BASE_PATH === '/$SUBPASTA';
  }
};
```

### **Sistema de Rotas Inteligente**

O roteamento considera automaticamente o `BASE_PATH`:

```javascript
// src/core/core.js
class Core {
  // Extrai o nome da página do pathname
  extractPageName(pathname) {
    // Remove o BASE_PATH do pathname antes de extrair a página
    const basePath = window.BASE_PATH || '';
    let cleanPath = pathname;
    
    if (basePath && pathname.startsWith(basePath)) {
      cleanPath = pathname.substring(basePath.length);
    }
    
    // Remove barras iniciais e finais
    cleanPath = cleanPath.replace(/^\/+|\/+$/g, '');
    
    // Se vazio, retorna página padrão
    return cleanPath || this.config.routes.defaultPage;
  },
  
  // Atualiza a URL considerando o BASE_PATH
  updateURL(pageName, params = {}) {
    const basePath = window.BASE_PATH || '';
    const url = basePath + '/' + pageName;
    
    if (this.config.routes.navigation.enableHistory) {
      window.history.pushState(params, '', url);
    }
  }
}
```

### **Exemplos de Uso**

#### **1. Links Simples:**
```html
<!-- Em qualquer componente -->
<a href="/docs">Documentação</a>
<a href="/about">Sobre</a>
<a href="/contact">Contato</a>

<!-- Automaticamente processados para: -->
<!-- Desenvolvimento: /framework/docs, /framework/about, /framework/contact -->
<!-- Produção: /docs, /about, /contact -->
```

#### **2. Navegação Programática:**
```javascript
// Navegar para uma página
core.navigate('docs');

// Em desenvolvimento: /framework/docs
// Em produção: /docs
```

#### **3. Links em Componentes Dinâmicos:**
```html
<!-- src/components/footer.html -->
<div class="footer-links">
  <a href="/privacy">Privacidade</a>
  <a href="/terms">Termos</a>
  <a href="/contact">Contato</a>
</div>

<!-- Todos os links são processados automaticamente -->
```

#### **4. Tratamento de 404:**
```javascript
// Se a página não existir, redireciona para 404
// Em desenvolvimento: /framework/404
// Em produção: /404
```

### **Configuração Avançada**

#### **Personalizar BASE_PATH:**
```javascript
// src/config/config.js
const config = {
  basePath: {
    auto: false,
    development: "/meu-projeto", // Customizar para desenvolvimento
    production: "/app" // Customizar para produção
  }
};
```

#### **Desabilitar Processamento:**
```html
<!-- Adicionar data-no-process para pular o processamento -->
<a href="/external-link" data-no-process>Link Externo</a>
```

#### **Processamento Manual:**
```javascript
// Processar um link manualmente
const link = document.querySelector('#my-link');
window.UrlProcessor?.processLink(link);

// Ou usar o helper
const resolvedUrl = window.Helpers?.resolveUrl('/docs');
```

### **Vantagens do Sistema:**

✅ **Funciona em qualquer ambiente** - Desenvolvimento, produção, subpastas  
✅ **Detecção automática** - Não precisa configurar manualmente  
✅ **Prevenção de loops** - Evita URLs malformadas  
✅ **Processamento dinâmico** - Funciona com conteúdo carregado via AJAX  
✅ **Performance otimizada** - Processamento eficiente e observador inteligente  
✅ **Compatibilidade total** - Funciona com todos os navegadores modernos  

## 📁 Estrutura do Projeto

```
msoft-site/
├── index.html                    # Página principal
├── build.sh                     # Script de build automatizado
├── sitemap.xml                  # Mapa do site
├── .htaccess                    # Configurações Apache
├── assets/                      # Assets locais
│   └── vendor/                  # Bibliotecas e recursos
│       ├── css/                 # CSS customizado
│       │   └── style.css        # Estilos principais
│       ├── js/                  # JavaScript customizado
│       ├── images/              # Imagens do projeto
│       ├── favicon/             # Favicons e webmanifest
│       └── fonts/               # Fontes customizadas
├── src/                         # Código fonte
│   ├── components/              # Componentes reutilizáveis
│   │   ├── header.html          # Cabeçalho (com menu processado)
│   │   ├── footer.html          # Rodapé (com links processados)
│   │   ├── modal.html           # Modal
│   │   ├── banner.html          # Banner
│   │   ├── contact.html         # Formulário de contato
│   │   ├── products.html        # Lista de produtos
│   │   ├── packages.html        # Pacotes
│   │   ├── steps.html           # Passos/processo
│   │   ├── search.html          # Busca
│   │   ├── icons.html           # Ícones
│   │   ├── highlight.html       # Destaque
│   │   └── blog-content.html    # Conteúdo do blog
│   ├── config/                  # Configurações
│   │   ├── config.js            # Configurações principais (BASE_PATH)
│   │   ├── env.js               # Sistema de variáveis de ambiente
│   │   ├── env.development.js   # Configurações de desenvolvimento
│   │   ├── env.production.js    # Configurações de produção
│   │   ├── security.js          # Configurações de segurança
│   │   ├── sw.js                # Service Worker
│   │   └── switch-env.js        # Script para trocar ambientes
│   ├── core/                    # Core do framework
│   │   ├── core.js              # Sistema principal (roteamento)
│   │   ├── component.js         # Sistema de componentes
│   │   ├── helpers.js           # Funções utilitárias (resolveUrl)
│   │   └── skeleton.js          # Componentes de loading
│   ├── data/                    # Dados estáticos
│   │   └── blog-posts.js        # Posts do blog
│   ├── pages/                   # Páginas da aplicação
│   │   ├── home.html            # Página inicial
│   │   ├── about.html           # Sobre
│   │   ├── contact.html         # Contato
│   │   ├── framework.html       # Sobre o framework
│   │   ├── docs.html            # Documentação
│   │   ├── examples.html        # Exemplos
│   │   ├── materials.html       # Materiais
│   │   ├── games.html           # Jogos
│   │   ├── blog-ads.html        # Blog - Anúncios
│   │   ├── blog-review.html     # Blog - Reviews
│   │   ├── faq.html             # FAQ
│   │   ├── terms.html           # Termos de uso
│   │   ├── privacy.html         # Política de privacidade
│   │   ├── cookies.html         # Política de cookies
│   │   ├── lgpd.html            # LGPD
│   │   ├── policy.html          # Políticas
│   │   ├── switch-env.html      # Interface de troca de ambiente
│   │   └── 404.html             # Página de erro
│   ├── services/                # Serviços e APIs
│   └── utils/                   # Utilitários
│       ├── validator.js         # Sistema de validação
│       └── url-processor.js     # Processador automático de URLs
├── dist/                        # Build de produção (gerado automaticamente)
│   ├── assets/                  # Assets otimizados
│   │   ├── vendor/              # CDNs baixados e minificados
│   │   │   ├── css/             # Bootstrap, Icons, Swiper, Skeleton
│   │   │   ├── js/              # jQuery, Bootstrap, Swiper, PapaParse, Marked
│   │   │   ├── fonts/           # Bootstrap Icons
│   │   │   └── favicon/         # Favicons e webmanifest
│   │   └── images/              # Imagens otimizadas
│   └── src/                     # Código fonte minificado
├── ENVIRONMENT.md               # Documentação de ambientes
├── SECURITY.md                  # Documentação de segurança
└── README.md                    # Este arquivo
```

## ✨ Características

- **Vanilla JavaScript**: Sem dependências pesadas, apenas JavaScript puro
- **Sistema de Componentes**: Arquitetura modular e reutilizável
- **Roteamento Inteligente**: Navegação SPA com fallback para SSR
- **Sistema de URLs Avançado**: Processamento automático com BASE_PATH
- **Performance Otimizada**: Lazy loading, cache inteligente e compressão
- **Responsivo**: Design mobile-first com Bootstrap 5
- **Segurança**: Validação, sanitização e proteções XSS/CSRF
- **Variáveis de Ambiente**: Sistema robusto de configuração por ambiente
- **SEO Otimizado**: Meta tags dinâmicas e structured data
- **PWA Ready**: Service worker e manifest configurados
- **Acessibilidade**: ARIA labels e navegação por teclado

## 🔧 Configuração de Ambientes

### Variáveis de Ambiente

O framework suporta dois ambientes principais:

#### Desenvolvimento (`env.development.js`)
- API URL: `http://localhost:3003`
- Debug habilitado
- Logs detalhados
- Cache reduzido
- Validações mais permissivas
- BASE_PATH: `/framework` (detectado automaticamente)

#### Produção (`env.production.js`)
- API URL: `https://api.msoft.com.br`
- Debug desabilitado
- Logs apenas de erro
- Cache otimizado
- Validações rigorosas
- BASE_PATH: `""` (raiz)

### Principais Variáveis

```javascript
// Ambiente
NODE_ENV=development|production

// API
API_BASE_URL=http://localhost:3003
API_TOKEN=your-api-token

// Segurança
APP_TOKEN=your-app-token
CSRF_SECRET=your-csrf-secret
JWT_SECRET=your-jwt-secret

// Analytics
ANALYTICS_ENABLED=true|false
GA_TRACKING_ID=UA-XXXXXXXXX-X

// Cache
CACHE_DURATION=3600
CACHE_MAX_SIZE=100

// Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

// Roteamento
BASE_PATH=/framework|"" // Detectado automaticamente
```

### Troca de Ambiente

#### Interface Web (Recomendado)
Abra o arquivo `switch-env.html` no navegador para uma interface gráfica:

```bash
# Abra no navegador
open switch-env.html
```

#### Manualmente
Edite o arquivo `index.html` e comente/descomente as linhas apropriadas:

```html
<!-- Desenvolvimento -->
<script src="/env.development.js"></script>
<!-- Produção -->
<!-- <script src="/env.production.js"></script> -->
```

#### Script Node.js (se disponível)
```bash
# Ativar desenvolvimento
node switch-env.js development

# Ativar produção
node switch-env.js production

# Verificar ambiente atual
node switch-env.js status
```

## 🛠️ Desenvolvimento

### Criando uma Nova Página

1. Adicione seu arquivo HTML em `src/pages/`
2. Registre-o em `src/config/config.js`:
   ```javascript
   validPages: [
     'home', 
     'about', 
     'your-new-page'
   ]
   ```

### Criando Componentes

1. Crie seu componente HTML em `src/components/`
2. Use-o em qualquer página:
   ```html
   <div data-component="your-component"></div>
   ```

### Sistema de Roteamento

- Roteamento automático baseado na estrutura de arquivos
- URLs limpas sem extensão .html
- Tratamento de 404 integrado
- Suporte a parâmetros de URL
- **Processamento automático de BASE_PATH**
- **Detecção inteligente de ambiente**

### Gerenciamento de Estado

```javascript
// Definir estado
core.setData('user', { name: 'João', age: 25 });

// Obter estado
const user = core.getData('user');
```

### Requisições API

```javascript
// GET request
const data = await core.fetchAPI('/api/users');

// POST request
const result = await core.fetchAPI('/api/users', 'POST', { name: 'João' });
```

## 🎯 Perfeito Para

- Landing Pages
- Sites de Pequenas Empresas
- Sites de Portfólio
- Sites de Documentação
- Protótipos
- MVPs (Produtos Mínimos Viáveis)
- Aplicações Web Simples
- Dashboards Administrativos

## ⚡ Performance

### Otimizações Implementadas

- **Lazy Loading**: Carregamento sob demanda
- **Cache Inteligente**: Cache em múltiplas camadas
- **Compressão**: Gzip/Brotli para assets
- **Minificação**: CSS e JS minificados em produção
- **CDN**: Recursos externos via CDN
- **Preload**: Carregamento antecipado de recursos críticos
- **URL Processing**: Processamento eficiente de links

### Métricas de Performance

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Validação e Sanitização

Use o sistema de validação integrado:

```javascript
// Validação de formulário
const formData = {
  email: 'usuario@exemplo.com',
  senha: '123456'
};

const rules = {
  email: 'required|email',
  senha: 'required|min:6'
};

const result = validator.validate(formData, rules);
if (result.isValid) {
  // Dados válidos
} else {
  // Mostrar erros
  console.log(result.errors);
}
```

## 🔧 Personalização

- Fácil de estender
- Simples de modificar
- Estrutura flexível
- Sem configuração complexa
- Sistema de temas integrado
- Variáveis CSS customizáveis
- **Sistema de URLs configurável**

## 📱 Design Responsivo

- Abordagem mobile-first
- Integração Bootstrap 5
- Breakpoints customizáveis
- Layouts flexíveis
- Componentes adaptativos

## 🌐 Tecnologias Utilizadas

### **Core:**
- **JavaScript ES6+**: Linguagem principal
- **Vanilla JS**: Sem dependências pesadas

### **CSS Frameworks:**
- **Bootstrap 5.3.0**: Framework CSS responsivo
- **Bootstrap Icons 1.11.0**: Ícones vetoriais
- **Skeleton CSS 2.0.4**: Componentes de loading

### **JavaScript Libraries:**
- **jQuery 3.7.1**: Manipulação DOM
- **Swiper 8**: Carrosséis e sliders
- **PapaParse 5.4.1**: Parsing CSV
- **Marked**: Renderização Markdown

### **Build Tools:**
- **Bash Script**: Build automatizado
- **Python**: Minificação (jsmin, csscompressor, htmlmin)
- **cURL**: Download de CDNs

### **Performance:**
- **Lazy Loading**: Carregamento sob demanda
- **Minificação**: CSS, JS e HTML otimizados
- **CDN Local**: Bibliotecas baixadas automaticamente
- **Service Worker**: Cache e PWA
- **URL Processor**: Processamento automático de links

## 🚀 Deploy

### Produção

1. **Execute o build de produção**:
   ```bash
   # Execute o build automatizado
   ./build.sh
   ```

2. **Configure o ambiente de produção**:
   ```bash
   # Edite as variáveis de produção
   nano src/config/env.production.js
   # Configure tokens reais, URLs de produção, etc.
   ```

3. **Faça upload da pasta dist**:
   ```bash
   # Para servidor Apache
   rsync -avz dist/ user@server:/var/www/html/
   
   # Para CDN/Cloud Storage
   # Use ferramentas específicas do seu provedor
   
   # Para GitHub Pages
   # Faça push da pasta dist para o branch gh-pages
   ```

### **Vantagens do Build Automatizado:**

- **CDNs locais**: Todas as bibliotecas baixadas automaticamente
- **Otimização**: Arquivos minificados e comprimidos
- **Estrutura limpa**: Apenas arquivos necessários para produção
- **Caminhos corretos**: Todos os assets com paths otimizados
- **PWA ready**: Service worker e manifest configurados
- **URLs processadas**: Sistema de roteamento otimizado

### Configuração do Servidor

O framework inclui configurações para:
- Apache (.htaccess)
- URLs amigáveis
- Cache de recursos
- Compressão gzip

#### Apache (.htaccess já configurado)
```apache
# Cache e compressão
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
</IfModule>

# Segurança
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# SPA Routing (importante para o sistema de URLs)
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

#### Nginx
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    root /var/www/html;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/css application/javascript;

    # Cache
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing (importante para o sistema de URLs)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔒 Segurança

### Medidas Implementadas

- **Validação de Input**: Sanitização automática de dados
- **CSRF Protection**: Tokens CSRF em formulários
- **XSS Prevention**: Escape automático de conteúdo
- **Rate Limiting**: Limitação de requisições
- **Content Security Policy**: Headers de segurança
- **HTTPS Enforcement**: Redirecionamento para HTTPS

### Configurações de Segurança

```javascript
// Em security.js
const securityConfig = {
  csrf: {
    enabled: true,
    secret: getEnv('CSRF_SECRET')
  },
  xss: {
    enabled: true,
    whiteList: {}
  },
  rateLimit: {
    enabled: true,
    windowMs: getEnv('RATE_LIMIT_WINDOW_MS'),
    maxRequests: getEnv('RATE_LIMIT_MAX_REQUESTS')
  }
};
```

Veja mais detalhes em [SECURITY.md](SECURITY.md).

## 📊 Analytics e Monitoramento

### Google Analytics
```javascript
// Configurado automaticamente se GA_TRACKING_ID estiver definido
if (config.analytics.enabled) {
  // Tracking automático de páginas e eventos
}
```

### Performance Monitoring
```javascript
// Métricas de performance monitoradas automaticamente
const metrics = ['fcp', 'lcp', 'fid', 'cls'];
```

### Configuração
```javascript
// Em env.development.js ou env.production.js
ANALYTICS_ENABLED=true|false
GA_TRACKING_ID=UA-XXXXXXXXX-X
FB_PIXEL_ID=your-facebook-pixel-id
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
- Fazer fork do repositório
- Criar uma branch de feature
- Enviar um pull request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

---

**Construído para simplicidade e velocidade!** 🚀


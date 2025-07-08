/**
 * Configurações do Framework MSoft
 * Centraliza todas as configurações da aplicação usando variáveis de ambiente
 */

const config = {
  // Configurações da Aplicação
  app: {
    name: window.ENV?.get('SITE_NAME') || "MSoft Framework",
    version: "1.0.0",
    environment: window.ENV?.get('NODE_ENV') || "development",
    debug: window.ENV?.getBoolean('DEBUG') || false,
    build: window.ENV?.get('BUILD_NUMBER') || "dev",
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    token: window.ENV?.get('TOKEN') || "",
  },

  // Configurações de Caminho Base
  basePath: {
    // Detecta automaticamente o caminho base da aplicação
    auto: true,
    // Caminho base manual (usado se auto = false)
    base_path: window.ENV?.get('BASE_PATH') || "",
    // Função para obter o caminho base atual
    getCurrent() {
      if (!this.auto) {
        window.Debug?.log('[Config] basePath - usando caminho manual:', this.base_path);
        return this.base_path;
      }
      
      const pathname = window.location.pathname;
      const segments = pathname.split('/').filter(segment => segment !== '');
      
      window.Debug?.log('[Config] basePath - pathname:', pathname);
      window.Debug?.log('[Config] basePath - segments:', segments);
      
      // Se estamos na raiz, retorna string vazia
      if (segments.length === 0) {
        window.Debug?.log('[Config] basePath - retornando raiz (vazio)');
        return '';
      }
      
      // Remove o último segmento se for um arquivo (tem extensão)
      const lastSegment = segments[segments.length - 1];
      if (lastSegment && lastSegment.includes('.')) {
        segments.pop();
        window.Debug?.log('[Config] basePath - removido arquivo:', lastSegment);
      }
      
      // Se ainda há segmentos, retorna o caminho base
      if (segments.length > 0) {
        const basePath = `/${segments.join('/')}`;
        window.Debug?.log('[Config] basePath - retornando basePath:', basePath);
        return basePath;
      }
      
      window.Debug?.log('[Config] basePath - retornando vazio (após processamento)');
      return '';
    },
    // Função para resolver caminhos absolutos
    resolve(path) {
      if (!path || typeof path !== 'string') {
        window.Debug?.log('[Config] basePath.resolve - path inválido:', path);
        return '';
      }
      
      const basePath = this.getCurrent();
      window.Debug?.log('[Config] basePath.resolve - path:', path);
      window.Debug?.log('[Config] basePath.resolve - basePath:', basePath);
      
      // Se o BASE_PATH é vazio, trata como raiz (desenvolvimento)
      if (!basePath || basePath === '') {
        window.Debug?.log('[Config] basePath.resolve - detectado ambiente de desenvolvimento, usando raiz');
        return path;
      }
      
      // Se não há BASE_PATH, retorna o caminho original
      if (!basePath || basePath === '') {
        return path;
      }
      
      // Se o caminho já é absoluto (começa com /), adiciona o basePath
      if (path.startsWith('/')) {
        const resolved = `${basePath}${path}`;
        window.Debug?.log('[Config] basePath.resolve - caminho absoluto resolvido:', resolved);
        return resolved;
      }
      
      // Se é relativo, adiciona o basePath e /
      const resolved = `${basePath}/${path}`;
      window.Debug?.log('[Config] basePath.resolve - caminho relativo resolvido:', resolved);
      return resolved;
    }
  },

  // Configurações da API
  api: {
    baseUrl: window.location.origin,
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    useProxy: window.ENV?.getBoolean('USE_PROXY') || false,
    proxyUrl: window.ENV?.get('PROXY_URL') || "",
    token: window.ENV?.get('API_TOKEN') || "",
    endpoints: {
      auth: "/auth",
      users: "/users",
      posts: "/posts",
      upload: "/upload",
      // Endpoints da API
      pages: "/api/pages",
      posts: "/api/posts",
      categories: "/api/categories",
      media: "/api/upload/files"
    },
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  },

  // Configurações de Rotas
  routes: {
    defaultPage: "home",
    page404: "404",
    validPages: [
      // Páginas principais
      'home', 
      'servicos',
      'blog',
      'sobre',
      'contato',
      'orcamento',
      
      // Páginas legais
      'termos',
      'privacidade',
      'cookies',
      'lgpd',
      
      // Páginas de redirecionamento (mantidas para compatibilidade)
      'about',
      'contact',
      
      // Páginas técnicas (mantidas do framework original)
      'framework',
      'docs',
      'examples',
      'blog-ads',
      'blog-review',
      'blogs',
      'blog-custom',
      'games',
      'materials',
      'privacy',
      'terms',
      'faq',
      '404',
      'cms-example',
      'test-script'
    ],
    // Configurações de navegação
    navigation: {
      enableHistory: true,
      enableScrollRestoration: true,
      scrollBehavior: 'smooth'
    }
  },

  // Configurações de Componentes
  components: {
    path: "/src/components",
    defaultSkeleton: true,
    skeletonDelay: 400,
    lazyLoad: true,
    preload: false,
    cache: {
      enabled: true,
      duration: window.ENV?.getNumber('CACHE_DURATION') || 3600,
      maxSize: window.ENV?.getNumber('CACHE_MAX_SIZE') || 50
    }
  },

  // Configurações de Assets
  assets: {
    images: "/src/assets/images",
    css: "/src/assets/css",
    js: "/src/assets/js",
    vendor: "/src/assets/vendor",
    favicon: "/src/assets/favicon",
    // Configurações de otimização
    optimization: {
      compressImages: true,
      minifyCSS: window.ENV?.isProduction(),
      minifyJS: window.ENV?.isProduction(),
      cacheBusting: window.ENV?.isProduction()
    }
  },

  // Configurações de CDN
  vendors: {
    css: [
      "assets/vendor/css/bootstrap.min.css",
      "assets/vendor/css/swiper-bundle.min.css",
      "assets/vendor/css/bootstrap-icons.css"
    ],
    js: [
      "assets/vendor/js/jquery-3.7.1.min.js",
      "assets/vendor/js/bootstrap.bundle.min.js",
      "assets/vendor/js/swiper-bundle.min.js",
      "assets/vendor/js/marked.min.js",
      "assets/vendor/js/papaparse.min.js"
    ]
  },

  // Configurações de Analytics
  analytics: {
    enabled: window.ENV?.getBoolean('ANALYTICS_ENABLED') || false,
    trackingId: window.ENV?.get('GA_TRACKING_ID') || "UA-XXXXXXXXX-X",
    providers: {
      google: {
        enabled: true,
        trackingId: window.ENV?.get('GA_TRACKING_ID')
      },
      facebook: {
        enabled: false,
        pixelId: window.ENV?.get('FB_PIXEL_ID')
      }
    },
    events: {
      pageView: true,
      userInteraction: true,
      formSubmission: true,
      errorTracking: true
    }
  },

  // Configurações de Cache
  cache: {
    enabled: true,
    duration: window.ENV?.getNumber('CACHE_DURATION') || 3600,
    strategies: {
      memory: {
        enabled: true,
        maxSize: window.ENV?.getNumber('CACHE_MAX_SIZE') || 100,
        ttl: 1800
      },
      localStorage: {
        enabled: true,
        prefix: "msoft_",
        maxSize: "10MB"
      },
      sessionStorage: {
        enabled: true,
        prefix: "msoft_session_"
      }
    }
  },

  // Configurações de Performance
  performance: {
    lazyLoad: true,
    preload: true,
    minify: window.ENV?.isProduction(),
    compression: {
      enabled: true,
      level: 6
    },
    monitoring: {
      enabled: window.ENV?.getBoolean('ENABLE_PERFORMANCE_MONITORING') || true,
      metrics: ["fcp", "lcp", "fid", "cls"]
    }
  },

  // Configurações de Tema
  theme: {
    primary: "#007bff",
    secondary: "#6c757d",
    success: "#28a745",
    danger: "#dc3545",
    warning: "#ffc107",
    info: "#17a2b8",
    light: "#f8f9fa",
    dark: "#343a40",
    // Variáveis CSS customizáveis
    variables: {
      "--bs-primary": "#007bff",
      "--bs-secondary": "#6c757d",
      "--bs-success": "#28a745",
      "--bs-danger": "#dc3545",
      "--bs-warning": "#ffc107",
      "--bs-info": "#17a2b8"
    }
  },

  // Configurações de Internacionalização
  i18n: {
    defaultLocale: "pt-BR",
    supportedLocales: ["pt-BR", "en-US", "es-ES"],
    fallbackLocale: "pt-BR",
    loadPath: "/src/locales/{locale}.json",
    debug: !window.ENV?.isProduction()
  },

  // Configurações de Logs
  logging: {
    enabled: true,
    level: window.ENV?.get('LOG_LEVEL') || "info",
    console: {
      enabled: true,
      level: window.ENV?.isProduction() ? "error" : "debug"
    },
    remote: {
      enabled: window.ENV?.isProduction(),
      endpoint: window.ENV?.get('LOG_ENDPOINT'),
      batchSize: 10,
      flushInterval: 5000
    }
  },

  // Configurações de Notificações
  notifications: {
    toast: {
      enabled: true,
      position: "top-right",
      duration: 5000,
      maxVisible: 5
    },
    push: {
      enabled: false,
      vapidPublicKey: window.ENV?.get('VAPID_PUBLIC_KEY')
    }
  },

  // Configurações de Upload
  upload: {
    maxFileSize: window.ENV?.getNumber('MAX_FILE_SIZE') || 5 * 1024 * 1024, // 5MB
    allowedTypes: window.ENV?.get('ALLOWED_FILE_TYPES')?.split(',') || ["image/jpeg", "image/png", "image/gif", "application/pdf"],
    maxFiles: 10,
    chunkSize: 1024 * 1024, // 1MB
    retryAttempts: 3
  },

  // Configurações de SEO
  seo: {
    defaultTitle: window.ENV?.get('SITE_NAME') || "MSoft Framework",
    defaultDescription: window.ENV?.get('SITE_DESCRIPTION') || "Framework JavaScript moderno e leve",
    defaultKeywords: window.ENV?.get('SITE_KEYWORDS') || "framework, javascript, frontend, web development",
    ogImage: window.ENV?.get('OG_IMAGE_URL') || "/src/assets/images/og-image.jpg",
    twitterCard: "summary_large_image",
    structuredData: {
      enabled: true,
      organization: {
        name: "MSoft",
        url: window.ENV?.get('SITE_URL') || "https://msoft.com.br",
        logo: "https://msoft.com.br/logo.png"
      }
    }
  },

  // Configurações de Segurança
  security: {
    appToken: window.ENV?.get('APP_TOKEN') || "",
    csrfSecret: window.ENV?.get('CSRF_SECRET') || "",
    passwordMinLength: window.ENV?.getNumber('PASSWORD_MIN_LENGTH') || 8,
    sessionSecret: window.ENV?.get('SESSION_SECRET') || "",
    cookieSecret: window.ENV?.get('COOKIE_SECRET') || "",
    jwtSecret: window.ENV?.get('JWT_SECRET') || "",
    jwtExpiresIn: window.ENV?.get('JWT_EXPIRES_IN') || "24h"
  },

  // Configurações de Database
  database: {
    host: window.ENV?.get('DB_HOST') || "localhost",
    port: window.ENV?.getNumber('DB_PORT') || 5432,
    name: window.ENV?.get('DB_NAME') || "msoft_framework",
    user: window.ENV?.get('DB_USER') || "postgres",
    password: window.ENV?.get('DB_PASSWORD') || ""
  },

  // Configurações de Email
  email: {
    host: window.ENV?.get('SMTP_HOST') || "smtp.gmail.com",
    port: window.ENV?.getNumber('SMTP_PORT') || 587,
    user: window.ENV?.get('SMTP_USER') || "",
    password: window.ENV?.get('SMTP_PASSWORD') || "",
    secure: window.ENV?.isProduction()
  },

  // Configurações de Redis
  redis: {
    host: window.ENV?.get('REDIS_HOST') || "localhost",
    port: window.ENV?.getNumber('REDIS_PORT') || 6379,
    password: window.ENV?.get('REDIS_PASSWORD') || ""
  },

  // Configurações de AWS
  aws: {
    accessKeyId: window.ENV?.get('AWS_ACCESS_KEY_ID') || "",
    secretAccessKey: window.ENV?.get('AWS_SECRET_ACCESS_KEY') || "",
    region: window.ENV?.get('AWS_REGION') || "us-east-1",
    s3Bucket: window.ENV?.get('AWS_S3_BUCKET') || ""
  },

  // Configurações de Social Login
  social: {
    google: {
      clientId: window.ENV?.get('GOOGLE_CLIENT_ID') || "",
      clientSecret: window.ENV?.get('GOOGLE_CLIENT_SECRET') || ""
    },
    facebook: {
      appId: window.ENV?.get('FACEBOOK_APP_ID') || "",
      appSecret: window.ENV?.get('FACEBOOK_APP_SECRET') || ""
    }
  },

  // Configurações de Pagamento
  payment: {
    stripe: {
      publicKey: window.ENV?.get('STRIPE_PUBLIC_KEY') || "",
      secretKey: window.ENV?.get('STRIPE_SECRET_KEY') || ""
    }
  },

  // Configurações de Rate Limiting
  rateLimit: {
    windowMs: window.ENV?.getNumber('RATE_LIMIT_WINDOW_MS') || 15 * 60 * 1000,
    maxRequests: window.ENV?.getNumber('RATE_LIMIT_MAX_REQUESTS') || 100
  },

  // Configurações de Features
  features: {
    registration: window.ENV?.getBoolean('ENABLE_REGISTRATION') || true,
    emailVerification: window.ENV?.getBoolean('ENABLE_EMAIL_VERIFICATION') || false,
    twoFactor: window.ENV?.getBoolean('ENABLE_TWO_FACTOR') || false,
    socialLogin: window.ENV?.getBoolean('ENABLE_SOCIAL_LOGIN') || false
  },

  // Configurações de Monitoramento
  monitoring: {
    performance: window.ENV?.getBoolean('ENABLE_PERFORMANCE_MONITORING') || true,
    errorTracking: window.ENV?.getBoolean('ENABLE_ERROR_TRACKING') || true,
    sentryDsn: window.ENV?.get('SENTRY_DSN') || ""
  },

  // Configurações de URLs
  urls: {
    site: window.ENV?.get('SITE_URL') || "http://localhost:3000",
    api: window.ENV?.get('API_URL') || "http://localhost:3003"
  },

  // Configurações de Social Media
  socialMedia: {
    twitter: window.ENV?.get('TWITTER_HANDLE') || "@msoft",
    facebook: window.ENV?.get('FACEBOOK_PAGE') || "https://facebook.com/msoft",
    linkedin: window.ENV?.get('LINKEDIN_PAGE') || "https://linkedin.com/company/msoft",
    github: window.ENV?.get('GITHUB_PAGE') || "https://github.com/msoft"
  },

  // Configurações de Suporte
  support: {
    email: window.ENV?.get('SUPPORT_EMAIL') || "support@msoft.com.br",
    adminEmail: window.ENV?.get('ADMIN_EMAIL') || "admin@msoft.com.br",
    securityEmail: window.ENV?.get('SECURITY_EMAIL') || "security@msoft.com.br"
  }
};

// Configurações específicas por ambiente
const environmentConfigs = {
  development: {
    api: {
      baseUrl: window.ENV?.get('API_BASE_URL'),
      debug: true
    },
    logging: {
      level: "debug"
    },
    debug: true,
    showErrors: true,
    logRequests: true
  },
  staging: {
    api: {
      baseUrl: window.ENV?.get('API_BASE_URL'),
      debug: false
    },
    logging: {
      level: "info"
    },
    debug: false,
    showErrors: false,
    logRequests: true
  },
  production: {
    api: {
      baseUrl: window.ENV?.get('API_BASE_URL'),
      debug: false
    },
    logging: {
      level: "error"
    },
    performance: {
      minify: true,
      compression: {
        enabled: true
      }
    },
    debug: false,
    showErrors: false,
    logRequests: false
  }
};

// Aplica configurações específicas do ambiente
const currentEnv = config.app.environment;
if (environmentConfigs[currentEnv]) {
  Object.assign(config, environmentConfigs[currentEnv]);
}

// Função para obter configuração
const getConfig = (path) => {
  return path.split('.').reduce((obj, key) => obj && obj[key], config);
};

// Função para definir configuração
const setConfig = (path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, config);
  target[lastKey] = value;
};

// Função para obter variável de ambiente
const getEnv = (key, defaultValue = null) => {
  return window.ENV?.get(key, defaultValue);
};

// Função para definir variável de ambiente
const setEnv = (key, value) => {
  window.ENV?.set(key, value);
};

// Exporta configurações e funções utilitárias
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { config, getConfig, setConfig, getEnv, setEnv };
} else {
  window.config = config;
  window.getConfig = getConfig;
  window.setConfig = setConfig;
  window.getEnv = getEnv;
  window.setEnv = setEnv;
}



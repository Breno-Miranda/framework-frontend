/**
 * Configurações de Segurança do Framework
 * Centraliza todas as configurações relacionadas à segurança
 */

const SecurityConfig = {
  // Configurações de CORS
  cors: {
    enabled: true,
    allowedOrigins: window.ENV?.NODE_ENV === 'production' 
      ? ['https://yourdomain.com', 'https://www.yourdomain.com']
      : ['http://localhost:3000', 'http://localhost:3003', 'http://127.0.0.1:5500', '*'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-TOKEN'],
    credentials: true
  },

  // Headers de Segurança
  headers: {
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://code.jquery.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.yourdomain.com;"
  },

  // Configurações de Autenticação
  auth: {
    tokenExpiration: 3600, // 1 hora
    refreshTokenExpiration: 86400, // 24 horas
    maxLoginAttempts: 5,
    lockoutDuration: 900, // 15 minutos
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true
  },

  // Configurações de Rate Limiting
  rateLimit: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 100, // máximo de 100 requisições por janela
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },

  // Configurações de Sanitização
  sanitization: {
    enabled: true,
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a'],
    allowedAttributes: {
      'a': ['href', 'title', 'target'],
      'img': ['src', 'alt', 'title']
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed']
  },

  // Configurações de Logs de Segurança
  logging: {
    enabled: true,
    logLevel: window.ENV?.NODE_ENV === 'production' ? 'error' : 'debug',
    logSecurityEvents: true,
    logFailedLogins: true,
    logSuspiciousActivity: true
  },

  // Configurações de Sessão
  session: {
    secure: window.ENV?.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  },

  // Configurações de API
  api: {
    requireAuth: true,
    validateOrigin: true,
    validateReferer: true,
    maxPayloadSize: '10mb',
    timeout: 30000
  },

  // Configurações de Validação de Input
  validation: {
    maxStringLength: 1000,
    maxArrayLength: 100,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    validateEmail: true,
    validatePhone: true
  }
};

// Funções de utilidade de segurança
const SecurityUtils = {
  /**
   * Sanitiza uma string removendo tags HTML perigosas
   * @param {string} input - String a ser sanitizada
   * @returns {string} - String sanitizada
   */
  sanitizeHtml: (input) => {
    if (!input || typeof input !== 'string') return '';
    
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  /**
   * Valida se uma URL é segura
   * @param {string} url - URL a ser validada
   * @returns {boolean} - True se a URL for segura
   */
  isValidUrl: (url) => {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  },

  /**
   * Gera um token CSRF
   * @returns {string} - Token CSRF
   */
  generateCSRFToken: () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Valida um token CSRF
   * @param {string} token - Token a ser validado
   * @returns {boolean} - True se o token for válido
   */
  validateCSRFToken: (token) => {
    const storedToken = localStorage.getItem('csrf_token');
    return token && storedToken && token === storedToken;
  },

  /**
   * Criptografa dados sensíveis (básico - para produção usar biblioteca especializada)
   * @param {string} data - Dados a serem criptografados
   * @returns {string} - Dados criptografados
   */
  encryptData: (data) => {
    if (!data) return '';
    return btoa(encodeURIComponent(JSON.stringify(data)));
  },

  /**
   * Descriptografa dados
   * @param {string} encryptedData - Dados criptografados
   * @returns {any} - Dados descriptografados
   */
  decryptData: (encryptedData) => {
    if (!encryptedData) return null;
    try {
      return JSON.parse(decodeURIComponent(atob(encryptedData)));
    } catch {
      return null;
    }
  },

  /**
   * Valida se um email é válido
   * @param {string} email - Email a ser validado
   * @returns {boolean} - True se o email for válido
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Valida se uma senha atende aos requisitos de segurança
   * @param {string} password - Senha a ser validada
   * @returns {object} - Resultado da validação
   */
  validatePassword: (password) => {
    const result = {
      isValid: true,
      errors: []
    };

    if (!password || password.length < SecurityConfig.auth.passwordMinLength) {
      result.isValid = false;
      result.errors.push(`Senha deve ter pelo menos ${SecurityConfig.auth.passwordMinLength} caracteres`);
    }

    if (SecurityConfig.auth.requireUppercase && !/[A-Z]/.test(password)) {
      result.isValid = false;
      result.errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }

    if (SecurityConfig.auth.requireNumbers && !/\d/.test(password)) {
      result.isValid = false;
      result.errors.push('Senha deve conter pelo menos um número');
    }

    if (SecurityConfig.auth.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      result.isValid = false;
      result.errors.push('Senha deve conter pelo menos um caractere especial');
    }

    return result;
  },

  /**
   * Registra eventos de segurança
   * @param {string} event - Tipo do evento
   * @param {object} data - Dados do evento
   */
  logSecurityEvent: (event, data = {}) => {
    if (!SecurityConfig.logging.enabled) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    };

    console.warn('[Security Event]', logEntry);

    // Em produção, enviar para serviço de logs
    if (window.ENV?.NODE_ENV === 'production') {
      // Implementar envio para serviço de logs
    }
  }
};

// Exporta as configurações e utilitários
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SecurityConfig, SecurityUtils };
} else {
  window.SecurityConfig = SecurityConfig;
  window.SecurityUtils = SecurityUtils;
} 
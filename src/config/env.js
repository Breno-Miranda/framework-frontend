/**
 * Sistema de Variáveis de Ambiente para Browser
 * Permite configurar variáveis de ambiente que funcionam no navegador
 */

class EnvironmentConfig {
  constructor() {
    this.env = {};
    this.loadEnvironment();
  }

  /**
   * Carrega as variáveis de ambiente
   */
  loadEnvironment() {
    // Tenta carregar de um arquivo .env.js (se existir)
    this.loadFromFile();
    
    // Carrega de meta tags no HTML
    this.loadFromMetaTags();
    
    // Carrega de localStorage (para configurações do usuário)
    this.loadFromLocalStorage();
    
    // Define valores padrão
    this.setDefaults();
  }

  /**
   * Carrega variáveis de um arquivo .env.js
   */
  loadFromFile() {
    try {
      // Em um ambiente real, você pode carregar um arquivo .env.js
      // que seria gerado pelo build process
      if (window.ENV_CONFIG) {
        Object.assign(this.env, window.ENV_CONFIG);
      }
    } catch (error) {
      console.warn('[ENV] Erro ao carregar arquivo de configuração:', error);
    }
  }

  /**
   * Carrega variáveis de meta tags no HTML
   */
  loadFromMetaTags() {
    const metaTags = document.querySelectorAll('meta[name^="env-"]');
    metaTags.forEach(meta => {
      const name = meta.getAttribute('name').replace('env-', '');
      const value = meta.getAttribute('content');
      this.env[name] = value;
    });
  }

  /**
   * Carrega variáveis do localStorage
   */
  loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem('msoft_env');
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.assign(this.env, parsed);
      }
    } catch (error) {
      console.warn('[ENV] Erro ao carregar do localStorage:', error);
    }
  }

  /**
   * Define valores padrão
   */
  setDefaults() {
    const defaults = {
      NODE_ENV: 'development',
      API_BASE_URL: 'http://localhost:3003',
      USE_PROXY: 'false',
      PROXY_URL: '',
      ANALYTICS_ENABLED: 'false',
      GA_TRACKING_ID: '',
      FB_PIXEL_ID: '',
      LOG_LEVEL: 'info',
      LOG_ENDPOINT: '',
      VAPID_PUBLIC_KEY: '',
      BUILD_NUMBER: 'dev',
      BASE_PATH: ''
    };

    // Aplica defaults apenas se a variável não existir
    Object.entries(defaults).forEach(([key, value]) => {
      if (!this.env[key]) {
        this.env[key] = value;
      }
    });
  }

  /**
   * Obtém uma variável de ambiente
   * @param {string} key - Chave da variável
   * @param {any} defaultValue - Valor padrão se não existir
   * @returns {any} - Valor da variável
   */
  get(key, defaultValue = null) {
    return this.env[key] !== undefined ? this.env[key] : defaultValue;
  }

  /**
   * Define uma variável de ambiente
   * @param {string} key - Chave da variável
   * @param {any} value - Valor da variável
   */
  set(key, value) {
    this.env[key] = value;
    
    // Salva no localStorage para persistência
    try {
      const stored = JSON.parse(localStorage.getItem('msoft_env') || '{}');
      stored[key] = value;
      localStorage.setItem('msoft_env', JSON.stringify(stored));
    } catch (error) {
      console.warn('[ENV] Erro ao salvar no localStorage:', error);
    }
  }

  /**
   * Verifica se uma variável existe
   * @param {string} key - Chave da variável
   * @returns {boolean} - True se existe
   */
  has(key) {
    return this.env[key] !== undefined;
  }

  /**
   * Obtém todas as variáveis
   * @returns {object} - Todas as variáveis
   */
  getAll() {
    return { ...this.env };
  }

  /**
   * Verifica se está em desenvolvimento
   * @returns {boolean} - True se for desenvolvimento
   */
  isDevelopment() {
    return this.get('NODE_ENV') === 'development';
  }

  /**
   * Verifica se está em produção
   * @returns {boolean} - True se for produção
   */
  isProduction() {
    return this.get('NODE_ENV') === 'production';
  }

  /**
   * Verifica se está em staging
   * @returns {boolean} - True se for staging
   */
  isStaging() {
    return this.get('NODE_ENV') === 'staging';
  }

  /**
   * Converte string 'true'/'false' para boolean
   * @param {string} key - Chave da variável
   * @returns {boolean} - Valor booleano
   */
  getBoolean(key) {
    const value = this.get(key);
    return value === 'true' || value === true;
  }

  /**
   * Converte string para número
   * @param {string} key - Chave da variável
   * @returns {number} - Valor numérico
   */
  getNumber(key) {
    const value = this.get(key);
    return value ? Number(value) : 0;
  }
}

// Instância global
window.ENV = new EnvironmentConfig();

// Exporta para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnvironmentConfig;
} 
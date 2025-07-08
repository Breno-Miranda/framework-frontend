/**
 * Sistema de Debug Controlado por URL
 * Permite habilitar logs apenas quando ?debug=true estiver na URL
 */

class DebugManager {
  constructor() {
    this.isDebugEnabled = this.checkDebugParameter();
    this.originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info
    };
    
    this.setupConsoleOverride();
  }

  /**
   * Verifica se o parâmetro debug=true está na URL
   * @returns {boolean} - True se debug está habilitado
   */
  checkDebugParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('debug') === 'true';
  }

  /**
   * Configura override do console para esconder logs quando debug não estiver habilitado
   */
  setupConsoleOverride() {
    if (!this.isDebugEnabled) {
      // Substitui console.log por uma função vazia
      console.log = () => {};
      console.info = () => {};
      console.warn = () => {};
      // Mantém console.error para erros críticos
      // console.error = () => {};
    }
  }

  /**
   * Restaura o console original
   */
  restoreConsole() {
    console.log = this.originalConsole.log;
    console.warn = this.originalConsole.warn;
    console.error = this.originalConsole.error;
    console.info = this.originalConsole.info;
  }

  /**
   * Função de log que só funciona quando debug está habilitado
   * @param {string} message - Mensagem para log
   * @param {any} data - Dados adicionais
   */
  log(message, data = null) {
    if (this && this.isDebugEnabled) {
      if (data) {
        this.originalConsole.log(`[DEBUG] ${message}`, data);
      } else {
        this.originalConsole.log(`[DEBUG] ${message}`);
      }
    }
  }

  /**
   * Função de warn que só funciona quando debug está habilitado
   * @param {string} message - Mensagem para warn
   * @param {any} data - Dados adicionais
   */
  warn(message, data = null) {
    if (this && this.isDebugEnabled) {
      if (data) {
        this.originalConsole.warn(`[DEBUG] ${message}`, data);
      } else {
        this.originalConsole.warn(`[DEBUG] ${message}`);
      }
    }
  }

  /**
   * Função de info que só funciona quando debug está habilitado
   * @param {string} message - Mensagem para info
   * @param {any} data - Dados adicionais
   */
  info(message, data = null) {
    if (this && this.isDebugEnabled) {
      if (data) {
        this.originalConsole.info(`[DEBUG] ${message}`, data);
      } else {
        this.originalConsole.info(`[DEBUG] ${message}`);
      }
    }
  }

  /**
   * Função de error que só funciona quando debug está habilitado
   * @param {string} message - Mensagem para error
   * @param {any} data - Dados adicionais
   */
  error(message, data = null) {
    if (this && this.isDebugEnabled) {
      if (data) {
        this.originalConsole.error(`[DEBUG] ${message}`, data);
      } else {
        this.originalConsole.error(`[DEBUG] ${message}`);
      }
    }
  }

  /**
   * Verifica se o debug está habilitado
   * @returns {boolean} - True se debug está habilitado
   */
  isEnabled() {
    return this.isDebugEnabled;
  }

  /**
   * Habilita o debug dinamicamente
   */
  enable() {
    this.isDebugEnabled = true;
    this.restoreConsole();
  }

  /**
   * Desabilita o debug dinamicamente
   */
  disable() {
    this.isDebugEnabled = false;
    this.setupConsoleOverride();
  }

  /**
   * Adiciona o parâmetro debug=true à URL atual
   */
  addDebugToUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set('debug', 'true');
    window.history.replaceState({}, '', url);
    this.enable();
  }

  /**
   * Remove o parâmetro debug da URL atual
   */
  removeDebugFromUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete('debug');
    window.history.replaceState({}, '', url);
    this.disable();
  }
}

// Instância global
window.Debug = new DebugManager();

// Verificação de segurança para garantir que o Debug está disponível
if (!window.Debug || !window.Debug.isDebugEnabled) {
  // Fallback para console normal se o Debug não estiver disponível
  window.Debug = {
    log: console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    info: console.info.bind(console),
    isDebugEnabled: false,
    enable: function() { this.isDebugEnabled = true; },
    disable: function() { this.isDebugEnabled = false; }
  };
}

// Exporta para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DebugManager;
} 
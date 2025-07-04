// Create Helpers object
const Helpers = {
  // Path Management
  getBasePath() {
    // Detecta o caminho base da aplicação
    const pathname = window.location.pathname;
    const segments = pathname.split('/').filter(segment => segment !== '');
    
    // Debug log
    window.Debug?.log('[Helpers] getBasePath - pathname:', pathname);
    window.Debug?.log('[Helpers] getBasePath - segments:', segments);
    
    // Se estamos na raiz, retorna string vazia
    if (segments.length === 0) {
      window.Debug?.log('[Helpers] getBasePath - retornando raiz (vazio)');
      return '';
    }
    
    // Se estamos em uma subpasta, retorna o caminho base
    // Remove o último segmento se for um arquivo (tem extensão)
    const lastSegment = segments[segments.length - 1];
    if (lastSegment && lastSegment.includes('.')) {
      segments.pop();
      window.Debug?.log('[Helpers] getBasePath - removido arquivo:', lastSegment);
    }
    
    // Se ainda há segmentos, retorna o caminho base
    if (segments.length > 0) {
      const basePath = `/${segments.join('/')}`;
      window.Debug?.log('[Helpers] getBasePath - retornando basePath:', basePath);
      return basePath;
    }
    
    window.Debug?.log('[Helpers] getBasePath - retornando vazio (após processamento)');
    return '';
  },

  // Resolve caminhos relativos baseado no caminho base da aplicação
  resolvePath(path) {
    if (!path || typeof path !== 'string') {
      window.Debug?.log('[Helpers] resolvePath - path inválido:', path);
      return '';
    }
    
    const basePath = this.getBasePath();
    window.Debug?.log('[Helpers] resolvePath - path:', path);
    window.Debug?.log('[Helpers] resolvePath - basePath:', basePath);
    
    // Se o caminho já é absoluto (começa com /), adiciona o basePath
    if (path.startsWith('/')) {
      const resolved = `${basePath}${path}`;
      window.Debug?.log('[Helpers] resolvePath - caminho absoluto resolvido:', resolved);
      return resolved;
    }
    
    // Se é relativo, adiciona o basePath e /
    const resolved = `${basePath}/${path}`;
    window.Debug?.log('[Helpers] resolvePath - caminho relativo resolvido:', resolved);
    return resolved;
  },

  // Resolve URLs com BASE_PATH configurado
  resolveUrl(path) {
    if (!path || typeof path !== 'string') {
      window.Debug?.log('[Helpers] resolveUrl - path inválido:', path);
      return '';
    }
    
    // Se há BASE_PATH configurado, usa-o
    if (window.config?.basePath?.base_path) {
      const basePath = window.config.basePath.base_path;
      
      // Se o BASE_PATH é vazio, trata como raiz (desenvolvimento)
      if (!basePath || basePath === '') {
        window.Debug?.log('[Helpers] resolveUrl - detectado ambiente de desenvolvimento, usando raiz');
        return path;
      }
      
      // Verifica se o caminho já contém o BASE_PATH (evita loop)
      if (path.startsWith(basePath)) {
        window.Debug?.log('[Helpers] resolveUrl - caminho já contém BASE_PATH, retornando original:', path);
        return path;
      }
      
      // Se o caminho já é absoluto (começa com /), adiciona o basePath
      if (path.startsWith('/')) {
        const resolved = `${basePath}${path}`;
        window.Debug?.log('[Helpers] resolveUrl - caminho absoluto resolvido:', resolved);
        return resolved;
      }
      
      // Se é relativo, adiciona o basePath e /
      const resolved = `${basePath}/${path}`;
      window.Debug?.log('[Helpers] resolveUrl - caminho relativo resolvido:', resolved);
      return resolved;
    }
    
    // Sem BASE_PATH configurado, retorna o caminho original
    window.Debug?.log('[Helpers] resolveUrl - sem BASE_PATH, retornando original:', path);
    return path;
  },

  // DOM Manipulation
  createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else {
        element.setAttribute(key, value);
      }
    });

    // Add children
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });

    return element;
  },

  // Event Handling
  delegate(element, eventType, selector, handler) {
    element.addEventListener(eventType, event => {
      const target = event.target.closest(selector);
      if (target && element.contains(target)) {
        handler.call(target, event);
      }
    });
  },

  // Data Handling
  async fetchData(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  // Storage
  storage: {
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },

    get(key) {
      const value = localStorage.getItem(key);
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    },

    remove(key) {
      localStorage.removeItem(key);
    }
  },

  // Validation
  validate: {
    email(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    required(value) {
      return value !== null && value !== undefined && value !== '';
    }
  },

  // Formatting
  format: {
    date(date, format = 'DD/MM/YYYY') {
      const d = new Date(date);
      return format
        .replace('DD', String(d.getDate()).padStart(2, '0'))
        .replace('MM', String(d.getMonth() + 1).padStart(2, '0'))
        .replace('YYYY', d.getFullYear());
    },

    currency(value, locale = 'pt-BR', currency = 'BRL') {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency
      }).format(value);
    }
  },

  slugify(text) {
    return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }
};

// Register helpers globally
window.Helpers = Helpers;

// Register helpers with core
if (window.core) {
  window.core.helpers = Helpers;
} else {
  // If core is not available yet, wait for it
  document.addEventListener('DOMContentLoaded', () => {
    if (window.core) {
      window.core.helpers = Helpers;
    }
  });
} 
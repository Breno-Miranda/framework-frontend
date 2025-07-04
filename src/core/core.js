/**
 * Core Framework Class
 * Classe principal do framework MSoft
 */

class Core {
  constructor() {
    // Componentes JS registrados
    this.components = new Map();
    // Componentes HTML já carregados via fetch
    this.loadedHtmlComponents = new Set();
    // Estado global
    this.state = {};
    // Parâmetros da URL
    this.params = [];
    // Skeleton universal
    this.skeleton = null;
    // Caminho atual
    this._currentPath = null;
    // Inicialização única
    this._globalComponentsLoaded = false;
    // Lista de páginas válidas
    this.registerPages = (window.config && window.config.routes && window.config.routes.validPages) || ['home', 'about', 'contact'];
    // Cache de requisições
    this.requestCache = new Map();
    // Rate limiting
    this.rateLimitMap = new Map();
    // Inicializa o core
    this.init();
  }

  /**
   * Registro de componentes JS
   * @param {string} name - Nome do componente
   * @param {class} component - Classe do componente
   */
  registerComponent(name, component) {
    if (!name || typeof name !== 'string') {
      console.error('[Core] Nome do componente inválido:', name);
      return;
    }
    this.components.set(name, component);
  }

  /**
   * Obtém um componente registrado
   * @param {string} name - Nome do componente
   * @returns {class|null} - Classe do componente ou null
   */
  getComponent(name) {
    return this.components.get(name);
  }

  /**
   * Inicialização principal
   */
  async init() {
    try {
      if (window.Debug && window.Debug.log) {
      window.Debug.log('[Core] Iniciando framework...');
    }
      
      // Inicializa configurações de segurança
      this.initSecurity();
      
      // Inicializa o roteador
      this.initRouter();
      
      // Inicializa componentes
      await this.initializeComponents(document.body);
      
      // Inicializa analytics se habilitado
      if (window.config && window.config.analytics && window.config.analytics.enabled) {
        this.initAnalytics();
      }
      
      // Inicializa monitoramento de performance
      if (window.config && window.config.performance && window.config.performance.monitoring && window.config.performance.monitoring.enabled) {
        this.initPerformanceMonitoring();
      }
      
      if (window.Debug && window.Debug.log) {
        window.Debug.log('[Core] Framework inicializado com sucesso');
      }
    } catch (error) {
      console.error('[Core] Erro na inicialização:', error);
      this.toast('Erro ao inicializar a aplicação', 'error');
    }
  }

  /**
   * Inicializa configurações de segurança
   */
  initSecurity() {
    // Gera token CSRF se não existir
    if (!localStorage.getItem('csrf_token')) {
      const csrfToken = this.generateCSRFToken();
      localStorage.setItem('csrf_token', csrfToken);
    }

    // Aplica headers de segurança
    this.applySecurityHeaders();

    // Configura interceptadores de eventos
    this.setupSecurityInterceptors();
  }

  /**
   * Gera token CSRF
   */
  generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Aplica headers de segurança
   */
  applySecurityHeaders() {
    const securityHeaders = {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://code.jquery.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:;"
    };

    Object.entries(securityHeaders).forEach(([header, value]) => {
      try {
        // Aplica CSP via meta tag se necessário
        if (header === 'Content-Security-Policy') {
          const meta = document.createElement('meta');
          meta.httpEquiv = header;
          meta.content = value;
          document.head.appendChild(meta);
        }
      } catch (error) {
        console.warn(`[Security] Erro ao aplicar header ${header}:`, error);
      }
    });
  }

  /**
   * Configura interceptadores de segurança
   */
  setupSecurityInterceptors() {
    // Intercepta cliques em links externos
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.hostname !== window.location.hostname) {
        // Log de segurança
        this.logSecurityEvent('external_link_click', {
          url: link.href,
          target: link.target
        });
      }
    });

    // Intercepta submissões de formulário
    document.addEventListener('submit', (e) => {
      this.validateFormSubmission(e);
    });
  }

  /**
   * Log de eventos de segurança
   */
  logSecurityEvent(event, data) {
    if (window.Debug && window.Debug.log) {
      window.Debug.log(`[Security] ${event}:`, data);
    }
  }

  /**
   * Sanitiza HTML
   */
  sanitizeHtml(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  /**
   * Valida URL
   */
  isValidUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Valida submissão de formulário
   * @param {Event} event - Evento de submit
   */
  validateFormSubmission(event) {
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validação básica
    const validationRules = {
      email: ['required', 'isEmail'],
      name: ['required', { minLength: 2 }],
      message: ['required', { minLength: 10 }]
    };

    if (window.validator && !window.validator.validate(data, validationRules)) {
      event.preventDefault();
      const errors = window.validator.getErrors();
      errors.forEach(error => {
        this.toast(`${error.field}: ${error.message}`, 'error');
      });
      return false;
    }

    // Sanitização dos dados
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string') {
        data[key] = this.sanitizeHtml(data[key]);
      }
    });

    return true;
  }

  /**
   * Inicializa todos os [data-component]
   * @param {Element} container - Container onde procurar componentes
   */
  async initializeComponents(container) {
    if (!container || !container.querySelectorAll) {
      console.warn('[Core] Container inválido para inicialização de componentes');
      return;
    }

    const elements = container.querySelectorAll('[data-component]');
    window.Debug?.log(`[Core] Encontrados ${elements.length} elementos com data-component`);
    
    for (const el of elements) {
      const name = el.getAttribute('data-component');
      window.Debug?.log(`[Core] Processando componente: ${name}`);
      
      if (!name || name === 'skeleton') {
        window.Debug?.log(`[Core] Pulando componente: ${name}`);
        continue;
      }

      try {
        // Verifica se já foi carregado
        if (this.loadedHtmlComponents.has(name)) {
          continue;
        }

        // Tenta carregar componente HTML
        let componentPath;
        
        // Se BASE_PATH está vazio e auto está true, usa caminho absoluto
        if ((!window.config?.basePath?.base_path || window.config.basePath.base_path === '') && 
            window.config?.basePath?.auto === true) {
          componentPath = `/src/components/${name}.html`;
        } else if (window.config?.basePath?.auto === false && window.config?.basePath?.base_path) {
          // Se auto está false e há BASE_PATH configurado
          componentPath = `${window.config.basePath.base_path}/src/components/${name}.html`;
        } else {
          // Usa o resolve padrão
          componentPath = window.config?.basePath?.resolve(`/src/components/${name}.html`) || `/src/components/${name}.html`;
        }
        window.Debug?.log(`[Core] Tentando carregar componente HTML: ${componentPath}`);
        const res = await fetch(componentPath);
        if (res.ok) {
          const html = await res.text();
          window.Debug?.log(`[Core] Componente HTML carregado: ${name}`);
          
          el.innerHTML = html;
          
          this.loadedHtmlComponents.add(name);
          continue;
        } else {
          window.Debug?.warn(`[Core] Falha ao carregar componente HTML: ${name} (${res.status})`);
        }
      } catch (error) {
        console.warn(`[Core] Erro ao carregar componente HTML ${name}:`, error);
      }

      // Tenta carregar componente JS
      const Comp = this.getComponent(name);
      if (Comp) {
        try {
          const instance = new Comp();
          if (typeof instance.render === 'function') {
            instance.render(el);
          }
        } catch (error) {
          console.error(`[Core] Erro ao renderizar componente ${name}:`, error);
        }
      }
    }
    
    // Processa URLs após inicializar todos os componentes
    if (window.UrlProcessor) {
      window.UrlProcessor.reprocess().catch(error => {
        console.error('[Core] Erro ao reprocessar URLs após inicializar componentes:', error);
      });
    }
  }

  /**
   * SPA: Carrega página em #root
   */
  async loadPage() {
    const root = document.getElementById('root');
    if (!root) {
      console.error('[Core] Elemento #root não encontrado');
      return;
    }

    this.showSkeleton(root);

    // Obtém segmentos do pathname
    const segments = window.location.pathname.split('/');
    
    // Calcula o nome da página considerando o BASE_PATH
    let pageName = 'home';
    let params = [];
    
    if (window.config?.basePath?.base_path) {
      // Se há BASE_PATH configurado, remove-o do pathname
      const basePathSegments = window.config.basePath.base_path.split('/').filter(s => s);
      const pathSegments = segments.filter(s => s);
      
      // Remove os segmentos do BASE_PATH do início
      const remainingSegments = pathSegments.slice(basePathSegments.length);
      
      if (remainingSegments.length > 0) {
        pageName = remainingSegments[0];
        params = remainingSegments.slice(1);
      }
    } else {
      // Sem BASE_PATH, usa o comportamento padrão
      pageName = segments[1] || 'home';
      params = segments.slice(2);
    }
    
    this.params = params;

    // Valida parâmetros
    this.params = this.params.map(param => this.sanitizeHtml(param));

    window.Debug?.log(`[Core] Carregando página: ${pageName}`, this.params);
    
    // Armazena os parâmetros no estado global
    this.state = { ...this.state, params: this.params };
    
    // Dispara evento de mudança de parâmetros
    window.dispatchEvent(new CustomEvent('paramsChange', { 
      detail: { params: this.params }
    }));
    
    try {
      // Verifica se o arquivo existe no path
      let filePath;
      
      // Se BASE_PATH está vazio e auto está true, usa caminho absoluto
      if ((!window.config?.basePath?.base_path || window.config.basePath.base_path === '') && 
          window.config?.basePath?.auto === true) {
        filePath = `/src/pages/${pageName}.html`;
      } else if (window.config?.basePath?.auto === false && window.config?.basePath?.base_path) {
        // Se auto está false e há BASE_PATH configurado
        filePath = `${window.config.basePath.base_path}/src/pages/${pageName}.html`;
      } else {
        // Usa o resolve padrão
        filePath = window.config?.basePath?.resolve(`/src/pages/${pageName}.html`) || `/src/pages/${pageName}.html`;
      }

      if (!this.registerPages.includes(pageName)) {
        throw new Error('Página não encontrada');
      }

      const res = await fetch(filePath);
      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }

      const html = await res.text();

      // Verifica se a resposta está vazia ou é inválida
      if (!html || html.trim() === '') {
        throw new Error('Página está vazia');
      }

      // Limpa o conteúdo atual do root
      root.innerHTML = html;
      
      // Inicializa componentes dentro do root
      this.initializeComponents(root);
      
      // Processa URLs para considerar o BASE_PATH usando Promise.all
      if (window.UrlProcessor) {
        window.UrlProcessor.reprocess().catch(error => {
          console.error('[Core] Erro ao reprocessar URLs:', error);
        });
      }
      
      // Atualiza a URL mantendo os parâmetros e considerando o BASE_PATH
      const paramsString = this.params.length > 0 ? `/${this.params.join('/')}` : '';
      let newPath;
      
      if (window.config?.basePath?.base_path) {
        // Com BASE_PATH, constrói o caminho completo
        const basePath = window.config.basePath.base_path;
        if (pageName === 'home') {
          newPath = basePath === '/' ? '/' : basePath;
        } else {
          newPath = `${basePath}/${pageName}${paramsString}`;
        }
      } else {
        // Sem BASE_PATH, usa o comportamento padrão
        newPath = pageName === 'home' ? '/' : `/${pageName}${paramsString}`;
      }
      
      window.history.replaceState({}, '', newPath);

      // Dispara evento de página carregada
      window.dispatchEvent(new CustomEvent('pageLoaded', { 
        detail: { page: pageName, params: this.params }
      }));

    } catch (error) {
      console.error('[Core] Erro ao carregar página:', error);
      
      // Redireciona para 404
      try {
        let errorPath;
        
        // Se BASE_PATH está vazio e auto está true, usa caminho absoluto
        if ((!window.config?.basePath?.base_path || window.config.basePath.base_path === '') && 
            window.config?.basePath?.auto === true) {
          errorPath = `/src/pages/404.html`;
        } else if (window.config?.basePath?.auto === false && window.config?.basePath?.base_path) {
          // Se auto está false e há BASE_PATH configurado
          errorPath = `${window.config.basePath.base_path}/src/pages/404.html`;
        } else {
          // Usa o resolve padrão
          errorPath = window.config?.basePath?.resolve('/src/pages/404.html') || '/src/pages/404.html';
        }
        const errorRes = await fetch(errorPath);
        if (errorRes.ok) {
          const errorHtml = await errorRes.text();
          if (errorHtml && errorHtml.trim() !== '') {
            root.innerHTML = errorHtml;
            
            // Atualiza URL para 404 considerando o BASE_PATH
            let errorPath;
            if (window.config?.basePath?.base_path) {
              const basePath = window.config.basePath.base_path;
              errorPath = basePath === '/' ? '/404' : `${basePath}/404`;
            } else {
              errorPath = '/404';
            }
            window.history.replaceState({}, '', errorPath);
            
            this.initializeComponents(root);
            return;
          }
        }
      } catch (error) {
        console.error('[Core] Erro ao carregar página 404:', error);
      }
      
      // Fallback se não conseguir carregar a página 404
      root.innerHTML = '<div class="error">Página não encontrada</div>';
    }
  }

  /**
   * SPA: Navegação e roteamento
   */
  initRouter() {
    window.addEventListener('popstate', () => this.handleRoute(window.location.pathname));
    
    document.addEventListener('click', e => {
      const link = e.target.closest('a');
      if (link && link.href.startsWith(window.location.origin) && !link.hasAttribute('target')) {
        e.preventDefault();
        
        // Valida URL antes de navegar
        if (this.isValidUrl(link.href)) {
          this.navigate(link.pathname);
        } else {
          window.Debug?.warn('[Security] URL inválida detectada:', link.href);
        }
      }
    });
    
    this.handleRoute(window.location.pathname);
  }

  /**
   * Manipula mudança de rota
   * @param {string} path - Caminho da rota
   */
  handleRoute(path) {
    if (this._currentPath === path) return;
    this._currentPath = path;
    this.loadPage(path);
  }

  /**
   * Navega para uma nova rota
   * @param {string} path - Caminho da rota
   */
  navigate(path) {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      this.handleRoute(path);
    }
  }

  /**
   * Skeleton universal
   * @param {Element} element - Elemento onde mostrar skeleton
   * @param {string} type - Tipo de skeleton
   * @param {number} count - Quantidade de itens
   */
  showSkeleton(element, type = 'card', count = 3) {
    try {
      // Verifica se a classe Skeleton está disponível
      if (typeof window.Skeleton === 'undefined') {
        window.Debug?.warn('[Core] Classe Skeleton não está disponível, usando fallback');
        element.innerHTML = '<div class="skeleton-card">Carregando...</div>';
        return;
      }

      // Cria nova instância do Skeleton
      const skeleton = new window.Skeleton({ type, count });
      skeleton.render();
      element.innerHTML = skeleton.template;
    } catch (error) {
      console.error('[Core] Erro ao mostrar skeleton:', error);
      element.innerHTML = '<div class="skeleton-card">Carregando...</div>';
    }
  }

  /**
   * FetchAPI com melhorias de segurança
   * @param {string} url - URL da requisição
   * @param {string} verb - Método HTTP
   * @param {object} data - Dados da requisição
   * @returns {Promise} - Resposta da API
   */
  async fetchAPI(url, verb = 'GET', data = {}) {
    console.time('fetchAPI');
    try {
      // Validação de entrada
      if (!url || typeof url !== 'string') {
        throw new Error('URL inválida');
      }

      if (!this.isValidUrl(url) && !url.startsWith('/')) {
        throw new Error('URL não é segura');
      }

      // Rate limiting
      if (!this.checkRateLimit(url)) {
        throw new Error('Muitas requisições. Tente novamente em alguns minutos.');
      }

      // Verifica cache
      const cacheKey = `${verb}:${url}:${JSON.stringify(data)}`;
      if (verb === 'GET' && this.requestCache.has(cacheKey)) {
        const cached = this.requestCache.get(cacheKey);
        if (Date.now() - cached.timestamp < 3600 * 1000) { // 1 hora
          window.Debug?.log('[API] Retornando dados do cache:', url);
          return cached.data;
        }
      }

      // Verifica se a URL base está definida
      if (!window.config?.api?.baseUrl) {
        throw new Error('API base URL não está configurada');
      }

      // Verifica se há configuração de proxy
      const useProxy = window.config?.api?.useProxy || false;
      const proxyUrl = window.config?.api?.proxyUrl || '';
      let fullUrl = '';

      if (useProxy && proxyUrl) {
        // Usa proxy
        const cleanProxyUrl = proxyUrl.replace(/\/+$/, '');
        const cleanUrl = url.replace(/^\/+/, '');
        fullUrl = `${cleanProxyUrl}/api/${cleanUrl}`;
      } else {
        // Usa baseUrl da API
        const baseUrl = window.config.api.baseUrl.replace(/\/+$/, '');
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        fullUrl = `${baseUrl}${cleanUrl}`;
      }

      window.Debug?.log(`[API Request] ${verb} ${fullUrl}`, data);

      const options = {
        method: verb,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        mode: 'cors',
        credentials: 'include'
      };

      // Adiciona token de autorização se disponível
      const authToken = localStorage.getItem('auth_token');
      if (authToken) {
        options.headers['Authorization'] = `Bearer ${authToken}`;
      }

      // Adiciona token CSRF
      const csrfToken = localStorage.getItem('csrf_token');
      if (csrfToken) {
        options.headers['X-CSRF-TOKEN'] = csrfToken;
      }

      // Só adiciona o body se não for GET
      if (verb !== 'GET') {
        const sanitizedData = this.sanitizeRequestData(data);
        options.body = JSON.stringify(sanitizedData);
      }

      const res = await fetch(fullUrl, options);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`API Error: ${res.status} ${res.statusText} - ${JSON.stringify(errorData)}`);
      }

      const responseData = await res.json();

      if (verb === 'GET') {
        this.requestCache.set(cacheKey, {
          data: responseData,
          timestamp: Date.now()
        });
      }

      window.Debug?.log(`[API Response] ${verb} ${url}:`, responseData);
      console.timeEnd('fetchAPI');
      return responseData;
    } catch (error) {
      this.logSecurityEvent('api_error', {
        url,
        verb,
        error: error.message
      });

      let errorMessage = 'Erro ao acessar o servidor. Por favor, tente novamente mais tarde.';
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
      } else if (error.message.includes('API base URL')) {
        errorMessage = 'Configuração da API está incompleta. Contate o suporte.';
      } else if (error.message.includes('Muitas requisições')) {
        errorMessage = error.message;
      }

      this.toast(errorMessage, 'error');
      console.error(`[API Error] ${verb} ${url}:`, {
        error: error.message,
        stack: error.stack,
        url: url,
        verb: verb
      });

      throw error;
    }
  }

  /**
   * Sanitiza dados da requisição
   * @param {object} data - Dados a serem sanitizados
   * @returns {object} - Dados sanitizados
   */
  sanitizeRequestData(data) {
    if (!data || typeof data !== 'object') return data;

    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeHtml(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeRequestData(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  /**
   * Verifica rate limiting
   * @param {string} url - URL da requisição
   * @returns {boolean} - True se permitido
   */
  checkRateLimit(url) {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutos
    const maxRequests = 100; // 100 requisições por janela

    if (!this.rateLimitMap.has(url)) {
      this.rateLimitMap.set(url, []);
    }

    const requests = this.rateLimitMap.get(url);
    
    // Remove requisições antigas
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.rateLimitMap.set(url, validRequests);
    return true;
  }

  /**
   * Obtém dados globais
   * @param {string} key - Chave do elemento
   * @returns {string} - Valor do elemento
   */
  getData(key) {
    const element = document.getElementById(key);
    if (!element) {
      window.Debug?.warn(`[Core] Elemento com ID '${key}' não encontrado`);
      return '';
    }
    return element.value || '';
  }

  /**
   * Define dados globais
   * @param {string} key - Chave do elemento
   * @param {string} value - Valor a ser definido
   * @param {boolean} isValue - Se é para definir value ou innerHTML
   * @param {boolean} isAfter - Se deve inserir após o elemento
   */
  setData(key, value, isValue = null, isAfter = false) {
    const element = document.getElementById(key);
    if (!element) {
      window.Debug?.warn(`[Core] Elemento com ID '${key}' não encontrado`);
      return;
    }

    // Sanitiza o valor antes de inserir
    const sanitizedValue = this.sanitizeHtml(value);

    if (isValue) {
      element.value = sanitizedValue;
    } else {
      if (isAfter) {
        element.insertAdjacentHTML('afterend', sanitizedValue);
      } else {
        element.innerHTML = sanitizedValue;
      }
    }
  }

  /**
   * Event listener com melhor tratamento de erros
   * @param {string} event - Tipo do evento
   * @param {Function} callback - Função callback
   * @returns {Promise} - Promise do evento
   */
  eventListener(event, callback) {
    if (!event || typeof event !== 'string') {
      console.error('[Core] Tipo de evento inválido:', event);
      return Promise.reject(new Error('Tipo de evento inválido'));
    }

    if (!callback || typeof callback !== 'function') {
      console.error('[Core] Callback inválido para evento:', event);
      return Promise.reject(new Error('Callback inválido'));
    }

    return new Promise((resolve, reject) => {
      try {
        const wrappedCallback = (data) => {
          try {
            const result = callback(data);
            resolve(result);
          } catch (error) {
            console.error(`[Core] Erro no callback do evento ${event}:`, error);
            reject(error);
          }
        };

        window.document.addEventListener(event, wrappedCallback);
      } catch (error) {
        console.error(`[Core] Erro ao adicionar listener para evento ${event}:`, error);
        reject(error);
      }
    });
  }

  /**
   * Sistema de notificação toast melhorado
   * @param {string} message - Mensagem a ser exibida
   * @param {string} type - Tipo do toast (success, error, warning, info)
   */
  toast(message, type = 'success') {
    if (!message || typeof message !== 'string') {
      console.warn('[Core] Mensagem de toast inválida:', message);
      return;
    }

    // Sanitiza a mensagem
    const sanitizedMessage = this.sanitizeHtml(message);

    // Cria o container de toasts se não existir
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'position-fixed top-0 end-0 p-3';
      toastContainer.style.zIndex = '9999';
      document.body.appendChild(toastContainer);
    }

    // Define as cores e ícones baseados no tipo
    const toastConfig = {
      success: {
        bgColor: 'bg-success',
        icon: 'bi-check-circle-fill'
      },
      error: {
        bgColor: 'bg-danger',
        icon: 'bi-x-circle-fill'
      },
      warning: {
        bgColor: 'bg-warning',
        icon: 'bi-exclamation-triangle-fill'
      },
      info: {
        bgColor: 'bg-info',
        icon: 'bi-info-circle-fill'
      }
    };

    const config = toastConfig[type] || toastConfig.success;
    const timestamp = new Date().toLocaleTimeString();

    // Cria o toast
    const toast = document.createElement('div');
    toast.className = `toast ${config.bgColor} text-white`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
      <div class="toast-body">
        <i class="bi ${config.icon} me-2"></i>
        ${sanitizedMessage}
        <small class="d-block mt-1 opacity-75">${timestamp}</small>
      </div>
    `;

    // Adiciona o toast ao container
    toastContainer.appendChild(toast);

    // Inicializa o toast do Bootstrap
    const bsToast = new bootstrap.Toast(toast, {
      animation: true,
      autohide: true,
      delay: 5000
    });

    // Mostra o toast
    bsToast.show();

    // Remove o toast do DOM quando escondido
    toast.addEventListener('hidden.bs.toast', () => {
      toast.remove();
    });

    // Log do toast
    window.Debug?.log(`[Toast] ${type.toUpperCase()}: ${sanitizedMessage}`);
  }

  /**
   * Inicializa analytics
   */
  initAnalytics() {
    if (window.config && window.config.analytics && window.config.analytics.providers && 
        window.config.analytics.providers.google && window.config.analytics.providers.google.enabled && 
        window.config.analytics.providers.google.trackingId) {
      // Google Analytics
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', window.config.analytics.providers.google.trackingId);
      
      // Carrega script do GA
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${window.config.analytics.providers.google.trackingId}`;
      script.async = true;
      document.head.appendChild(script);
    }
  }

  /**
   * Inicializa monitoramento de performance
   */
  initPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Para FCP, filtre pelo nome
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            window.Debug?.log('[Performance] FCP:', entry.startTime);
          } else {
            if (window.Debug && window.Debug.log) {
              window.Debug.log(`[Performance] ${entry.name}:`, entry.value || entry.startTime);
            }
          }
        }
      });
      // Use 'paint' ao invés de 'fcp'
      const metrics = window.config?.performance?.monitoring?.metrics || ['navigation', 'resource', 'paint'];
      observer.observe({ entryTypes: metrics });
    }
  }
}

// Instancia global quando o DOM estiver pronto
function initializeCore() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.core = new Core();
    });
  } else {
    window.core = new Core();
  }
}

initializeCore();


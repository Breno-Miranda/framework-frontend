/**
 * Processador de URLs para substituir links absolutos por links com BASE_PATH
 * Este utilitário processa automaticamente todos os links do site usando Promise.all
 */

class UrlProcessor {
  constructor() {
    this.processedElements = new WeakSet();
    this.init();
  }

  async init() {
    try {
      // Aguarda todas as dependências necessárias
      await Promise.all([
        this.waitForConfig(),
        this.waitForDOM(),
        this.waitForHelpers()
      ]);

      console.log('[UrlProcessor] Todas as dependências carregadas, processando links...');
      this.processAllLinks();
      this.observeDOMChanges();
    } catch (error) {
      console.error('[UrlProcessor] Erro na inicialização:', error);
    }
  }

  /**
   * Aguarda a configuração estar disponível
   */
  waitForConfig() {
    return new Promise((resolve) => {
      if (window.config) {
        resolve();
        return;
      }

      const checkConfig = setInterval(() => {
        if (window.config) {
          clearInterval(checkConfig);
          resolve();
        }
      }, 10);
    });
  }

  /**
   * Aguarda o DOM estar pronto
   */
  waitForDOM() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  }

  /**
   * Aguarda os helpers estarem disponíveis
   */
  waitForHelpers() {
    return new Promise((resolve) => {
      if (window.Helpers) {
        resolve();
        return;
      }

      const checkHelpers = setInterval(() => {
        if (window.Helpers) {
          clearInterval(checkHelpers);
          resolve();
        }
      }, 10);
    });
  }

  /**
   * Processa todos os links do documento
   */
  processAllLinks() {
    console.log('[UrlProcessor] Processando links...');
    console.log('[UrlProcessor] BASE_PATH:', window.config?.basePath?.base_path);
    
    // Processa links estáticos
    this.processStaticLinks();
    
    // Processa links em componentes carregados dinamicamente
    this.processComponentLinks();
    
    // Nota: processamento de scripts dinâmicos desabilitado para evitar conflitos
    // com expressões ${window.Helpers?.resolveUrl()} já implementadas
  }

  /**
   * Processa links estáticos (href com /)
   */
  processStaticLinks() {
    const links = document.querySelectorAll('a[href^="/"]');
    console.log('[UrlProcessor] Encontrados', links.length, 'links estáticos');
    
    links.forEach(link => {
      if (!this.processedElements.has(link)) {
        const originalHref = link.getAttribute('href');
        const newHref = this.resolveUrl(originalHref);
        
        if (originalHref !== newHref) {
          console.log('[UrlProcessor] Processando link estático:', originalHref, '->', newHref);
          link.setAttribute('href', newHref);
        }
        
        this.processedElements.add(link);
      }
    });
  }



  /**
   * Processa links em componentes carregados dinamicamente
   */
  processComponentLinks() {
    // Processa links em elementos com data-component
    const components = document.querySelectorAll('[data-component]');
    components.forEach(component => {
      if (!this.processedElements.has(component)) {
        const links = component.querySelectorAll('a[href^="/"]');
        links.forEach(link => {
          if (!this.processedElements.has(link)) {
            const originalHref = link.getAttribute('href');
            const newHref = this.resolveUrl(originalHref);
            
            if (originalHref !== newHref) {
              console.log('[UrlProcessor] Processando link em componente:', originalHref, '->', newHref);
              link.setAttribute('href', newHref);
            }
            
            this.processedElements.add(link);
          }
        });
        
        this.processedElements.add(component);
      }
    });
  }

  /**
   * Observa mudanças no DOM para processar novos links
   */
  observeDOMChanges() {
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Verifica se há links no novo elemento
              if (node.querySelector && node.querySelector('a[href^="/"]')) {
                shouldProcess = true;
              }
              // Se o próprio elemento é um link
              if (node.tagName === 'A' && node.getAttribute('href')?.startsWith('/')) {
                shouldProcess = true;
              }
              // Se é um componente
              if (node.hasAttribute && node.hasAttribute('data-component')) {
                shouldProcess = true;
              }
            }
          });
        }
      });
      
      if (shouldProcess) {
        console.log('[UrlProcessor] Novos links detectados, processando...');
        // Usa Promise.all para garantir que tudo seja processado
        Promise.all([
          this.waitForConfig(),
          this.waitForHelpers()
        ]).then(() => {
          this.processAllLinks();
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Resolve uma URL com BASE_PATH
   */
  resolveUrl(path) {
    if (!path || typeof path !== 'string') {
      return path;
    }
    
    const basePath = window.config?.basePath?.base_path || '';
    
    // Se o BASE_PATH é vazio, trata como raiz (desenvolvimento)
    if (!basePath || basePath === '') {
      console.log('[UrlProcessor] resolveUrl - detectado ambiente de desenvolvimento, usando raiz');
      return path;
    }
    
    // Se há BASE_PATH configurado, usa-o
    if (basePath) {
      // Verifica se o caminho já contém o BASE_PATH (evita loop)
      if (path.startsWith(basePath)) {
        console.log('[UrlProcessor] resolveUrl - caminho já contém BASE_PATH, retornando original:', path);
        return path;
      }
      
      // Se o caminho já é absoluto (começa com /), adiciona o basePath
      if (path.startsWith('/')) {
        const resolved = `${basePath}${path}`;
        console.log('[UrlProcessor] resolveUrl - caminho absoluto resolvido:', resolved);
        return resolved;
      }
      
      // Se é relativo, adiciona o basePath e /
      const resolved = `${basePath}/${path}`;
      console.log('[UrlProcessor] resolveUrl - caminho relativo resolvido:', resolved);
      return resolved;
    }
    
    // Sem BASE_PATH configurado, retorna o caminho original
    console.log('[UrlProcessor] resolveUrl - sem BASE_PATH, retornando original:', path);
    return path;
  }

  /**
   * Processa conteúdo HTML dinâmico
   */
  processHtmlContent(htmlContent) {
    if (!htmlContent || typeof htmlContent !== 'string') {
      return htmlContent;
    }
    
    const basePath = window.config?.basePath?.base_path || '';
    
    // Se o BASE_PATH é vazio, não processa (desenvolvimento)
    if (!basePath || basePath === '') {
      return htmlContent;
    }
    
    // Se não há BASE_PATH, não processa
    if (!basePath) {
      return htmlContent;
    }
    
    // Substitui links absolutos por links com BASE_PATH
    return htmlContent.replace(
      /href="\/([^"]*)"/g,
      (match, path) => {
        // Verifica se o caminho já contém o BASE_PATH (evita loop)
        if (path.startsWith(basePath.replace('/', ''))) {
          return match;
        }
        return `href="${basePath}/${path}"`;
      }
    ).replace(
      /href='\/([^']*)'/g,
      (match, path) => {
        // Verifica se o caminho já contém o BASE_PATH (evita loop)
        if (path.startsWith(basePath.replace('/', ''))) {
          return match;
        }
        return `href="${basePath}/${path}"`;
      }
    );
  }

  /**
   * Força reprocessamento de todos os links
   */
  async reprocess() {
    console.log('[UrlProcessor] Forçando reprocessamento...');
    
    // Aguarda todas as dependências
    await Promise.all([
      this.waitForConfig(),
      this.waitForHelpers()
    ]);
    
    this.processedElements = new WeakSet();
    this.processAllLinks();
  }

  /**
   * Verifica se o processador está funcionando
   */
  isWorking() {
    return window.config && window.Helpers && this.processedElements.size > 0;
  }

  /**
   * Testa o processador com um link de exemplo
   */
  test() {
    console.log('[UrlProcessor] Testando processador...');
    console.log('[UrlProcessor] Config disponível:', !!window.config);
    console.log('[UrlProcessor] Helpers disponível:', !!window.Helpers);
    console.log('[UrlProcessor] BASE_PATH:', window.config?.basePath?.base_path);
    
    const testUrl = '/test';
    const resolvedUrl = this.resolveUrl(testUrl);
    console.log('[UrlProcessor] Teste de URL:', testUrl, '->', resolvedUrl);
    
    return {
      config: !!window.config,
      helpers: !!window.Helpers,
      basePath: window.config?.basePath?.base_path,
      testUrl: resolvedUrl,
      processedElements: this.processedElements.size
    };
  }
}

// Inicializa o processador de forma assíncrona
async function initializeUrlProcessor() {
  try {
    window.UrlProcessor = new UrlProcessor();
    console.log('[UrlProcessor] Processador inicializado com sucesso');
  } catch (error) {
    console.error('[UrlProcessor] Erro ao inicializar:', error);
  }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeUrlProcessor);

// Inicializa quando a página carregar (fallback)
window.addEventListener('load', () => {
  if (!window.UrlProcessor) {
    initializeUrlProcessor();
  }
});

// Exporta para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UrlProcessor;
} 
// Core Framework Class
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
    
    this.init();
  }

  // Registro de componentes JS
  registerComponent(name, component) {
    this.components.set(name, component);
  }

  getComponent(name) {
    return this.components.get(name);
  }

  // Inicialização principal
  async init() {
    this.initRouter();
    this.initializeComponents(document.body);
  }


  // Inicializa todos os [data-component]
  initializeComponents(container) {
    const elements = container.querySelectorAll('[data-component]');
    elements.forEach(async el => {
      const name = el.getAttribute('data-component');
      if (name !== 'skeleton' && !this.loadedHtmlComponents.has(name)) {
        try {
          // Add 3 second delay to demonstrate skeleton loading
          await new Promise(resolve => setTimeout(resolve, 900));
          
          const res = await fetch(`src/components/${name}.html`);
          if (res.ok) {
            el.innerHTML = await res.text();
            this.loadedHtmlComponents.add(name);
            return;
          }
        } catch {}
      }
      const Comp = this.getComponent(name);
      if (Comp) {
        const instance = new Comp();
        if (typeof instance.render === 'function') instance.render(el);
      }
    });
  }

  // SPA: Carrega página em #root
  async loadPage(path) {
    const root = document.getElementById('root');
    if (!root) return;
    this.showSkeleton(root);

    // Se path for '/' ou vazio, use 'home', senão limpa o path
    const isRoot = (path === '/' || path === '');
    const clean = isRoot ? 'home' : path.replace(/^\/+/,'').replace(/\.html$/,'');
    
    // Separa a página dos parâmetros
    const segments = clean.split('/');
    const pageName = segments[0];
    this.params = segments.slice(1);
    
    // Armazena os parâmetros no estado global
    this.state = { ...this.state, params: this.params };
    
    // Dispara evento de mudança de parâmetros
    window.dispatchEvent(new CustomEvent('paramsChange', { 
      detail: { params: this.params }
    }));
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    try {
      // Verifica se o arquivo existe no path
      const filePath = `src/pages/${pageName}.html`;
      
      if (!this.validPages.includes(pageName)) {
        throw new Error('Page not found');
      }

      const res = await fetch(filePath);
      const html = await res.text();
      
      // Verifica se a resposta está vazia ou é inválida
      if (!html || html.trim() === '') {
        throw new Error('Page is empty');
      }

      root.innerHTML = html;

      // Executa scripts dentro da página
      try {
        const scripts = root.getElementsByTagName('script');
        const scriptPromises = Array.from(scripts).map(async (oldScript) => {
          try {
            const newScript = document.createElement('script');
            
            // Preserva todos os atributos
            Array.from(oldScript.attributes).forEach(attr => {
              newScript.setAttribute(attr.name, attr.value);
            });

            // Se for script externo (src)
            if (oldScript.src) {
              await new Promise((resolve, reject) => {
                newScript.onload = resolve;
                newScript.onerror = reject;
                newScript.src = oldScript.src;
              });
            } else {
              // Script inline
              newScript.textContent = oldScript.textContent;
            }

            // Substitui o script antigo pelo novo
            oldScript.parentNode.replaceChild(newScript, oldScript);
          } catch (error) {
            console.error('Erro ao carregar script:', error);
          }
        });

        // Aguarda todos os scripts serem executados
        await Promise.all(scriptPromises);
      } catch (error) {
        console.error('Erro ao executar scripts da página:', error);
      }

      this.initializeComponents(root);
      
      // Só atualiza a URL se não for root
      if (!isRoot) {
        window.history.pushState({}, '', `/${clean}`);
      }
    } catch (error) {
      // Redireciona para 404
      try {
        const errorRes = await fetch('/src/pages/404.html');
        if (errorRes.ok) {
          const errorHtml = await errorRes.text();
          if (errorHtml && errorHtml.trim() !== '') {
            root.innerHTML = errorHtml;
            // Atualiza a URL para 404
            window.history.replaceState({}, '', '/404');
            this.initializeComponents(root);
            return;
          }
        }
      } catch (error) {
        console.error('Erro ao carregar página 404:', error);
      }
      // Fallback se não conseguir carregar a página 404
      root.innerHTML = '<div class="error">Página não encontrada</div>';
    }
  }

  // SPA: Navegação e roteamento
  initRouter() {
    window.addEventListener('popstate', () => this.handleRoute(window.location.pathname));
    document.addEventListener('click', e => {
      const link = e.target.closest('a');
      if (link && link.href.startsWith(window.location.origin) && !link.hasAttribute('target')) {
        e.preventDefault();
        this.navigate(link.pathname);
      }
    });
    this.handleRoute(window.location.pathname);
  }

  handleRoute(path) {
    if (this._currentPath === path) return;
    this._currentPath = path;
    console.log(`path`,path);
    this.loadPage(path);
  }

  navigate(path) {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      this.handleRoute(path);
    }
  }

  // Skeleton universal
  showSkeleton(element, type = 'card', count = 3) {
    if (!this.skeleton) this.skeleton = new Skeleton();
    this.skeleton.setState({ type, count });
    element.innerHTML = this.skeleton.template;
  }
}

// Instancia global
window.core = new Core();
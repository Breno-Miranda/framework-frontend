class Skeleton extends Component {
  constructor(options = {}) {
    super({
      name: 'skeleton',
      template: '',
      styles: `
        .skeleton-card {
          min-height: 250px !important;
          width: 80%;
          background: #fff;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          margin:auto;
          margin-bottom: 1rem;
          border: 0px
        }

        .skeleton-image {
          width: 100%;
          height: 200px !important;
          background: #e0e0e0;
          border-radius: 4px;
          margin-bottom: 1rem;
          animation: pulse 1.5s infinite;
          display: block;
        }

        .skeleton-content {
          padding: 0.5rem;
        }

        .skeleton-title {
          width: 70%;
          height: 24px !important;
          background: #e0e0e0;
          margin-bottom: 1rem;
          border-radius: 4px;
          animation: pulse 1.5s infinite;
          display: block;
        }

        .skeleton-text {
          width: 100%;
          height: 16px !important;
          background: #e0e0e0;
          margin-bottom: 0.5rem;
          border-radius: 4px;
          animation: pulse 1.5s infinite;
          display: block;
        }

        .skeleton-button {
          width: 120px;
          height: 40px !important;
          background: #e0e0e0;
          border-radius: 4px;
          animation: pulse 1.5s infinite;
          display: block;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `,
      state: {
        type: 'card',
        count: 1
      }
    });

    this.templates = {
      card: `
        <div class="card skeleton-card">
          <div class="skeleton-image"></div>
          <div class="skeleton-content">
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text"></div>
          </div>
        </div>
      `,
      text: `
        <div class="skeleton-text"></div>
      `,
      image: `
        <div class="skeleton-image"></div>
      `,
      button: `
        <div class="skeleton-button"></div>
      `
    };
  }

  render() {
    const { type = 'card', count = 1 } = this.state;
    const template = this.templates[type] || this.templates.card;
    this.template = Array(count).fill(template).join('');
    super.render();
  }
}

// Registro robusto do componente Skeleton
function registerSkeletonWhenCoreReady() {
  if (window.core && typeof window.core.registerComponent === 'function') {
    Skeleton.register('skeleton');
  } else {
    setTimeout(registerSkeletonWhenCoreReady, 50);
  }
}
registerSkeletonWhenCoreReady(); 
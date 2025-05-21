# Framework Frontend

A lightweight, modern frontend framework built with vanilla JavaScript. Perfect for small to medium-sized projects that need a quick setup and easy maintenance.

## 🚀 Quick Start

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/framework-frontend.git
   ```

2. **Open `index.html` in your browser**
   That's it! No build process, no dependencies to install.

## 📁 Project Structure

```
framework-frontend/
├── index.html          # Main entry point
├── src/
│   ├── core/          # Core framework files
│   │   └── core.js    # Main framework class
│   ├── pages/         # HTML pages
│   │   ├── home.html
│   │   ├── about.html
│   │   └── 404.html
│   └── components/    # Reusable components
│       ├── header.html
│       └── footer.html
├── assets/           # Static assets
│   ├── css/
│   └── images/
└── .htaccess        # Apache configuration
```

## ✨ Features

- **Zero Dependencies**: Pure vanilla JavaScript
- **SPA Ready**: Built-in routing system
- **Component Based**: Easy to create and reuse components
- **Modern Architecture**: Clean and maintainable code
- **Fast Development**: No build process needed
- **Lightweight**: Minimal overhead
- **Responsive**: Mobile-first approach

## 🛠️ Development

### Creating a New Page

1. Add your HTML file to `src/pages/`
2. Register it in `core.js`:
   ```javascript
   this.validPages = ['home', 'about', 'your-new-page'];
   ```

### Creating Components

1. Create your component HTML in `src/components/`
2. Use it in any page:
   ```html
   <div data-component="your-component"></div>
   ```

### Routing

- Automatic routing based on file structure
- Clean URLs without .html extension
- Built-in 404 handling

## 🎯 Perfect For

- Landing Pages
- Small Business Websites
- Portfolio Sites
- Documentation Sites
- Prototypes
- MVPs (Minimum Viable Products)

## ⚡ Performance

- No framework overhead
- Minimal JavaScript footprint
- Fast initial load
- No build process delays

## 🔧 Customization

- Easy to extend
- Simple to modify
- Flexible structure
- No complex configuration

## 📱 Responsive Design

- Mobile-first approach
- Bootstrap 5 integration
- Customizable breakpoints
- Flexible layouts

## 🚀 Deployment

1. Upload files to your server
2. Configure .htaccess (included)
3. Done!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Fork the repository
- Create a feature branch
- Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built for simplicity and speed!** 🚀


/**
 * Script para trocar entre ambientes de desenvolvimento e produção
 * Uso: node switch-env.js [development|production]
 */

const fs = require('fs');
const path = require('path');

// Função para ler o arquivo index.html
function readIndexHtml() {
  const indexPath = path.join(__dirname, 'index.html');
  return fs.readFileSync(indexPath, 'utf8');
}

// Função para escrever o arquivo index.html
function writeIndexHtml(content) {
  const indexPath = path.join(__dirname, 'index.html');
  fs.writeFileSync(indexPath, content, 'utf8');
}

// Função para trocar o ambiente
function switchEnvironment(environment) {
  const validEnvironments = ['development', 'production'];
  
  if (!validEnvironments.includes(environment)) {
    console.error('❌ Ambiente inválido. Use: development ou production');
    process.exit(1);
  }

  console.log(`🔄 Trocando para ambiente: ${environment}`);

  let content = readIndexHtml();
  
  if (environment === 'development') {
    // Ativa desenvolvimento, desativa produção
    content = content.replace(
      /<!-- Desenvolvimento -->\s*<!-- <script src="\/env\.development\.js"><\/script> -->/,
      '<!-- Desenvolvimento -->\n  <script src="/env.development.js"></script>'
    );
    content = content.replace(
      /<!-- Produção -->\s*<script src="\/env\.production\.js"><\/script>/,
      '<!-- Produção -->\n  <!-- <script src="/env.production.js"></script> -->'
    );
  } else {
    // Ativa produção, desativa desenvolvimento
    content = content.replace(
      /<!-- Desenvolvimento -->\s*<script src="\/env\.development\.js"><\/script>/,
      '<!-- Desenvolvimento -->\n  <!-- <script src="/env.development.js"></script> -->'
    );
    content = content.replace(
      /<!-- Produção -->\s*<!-- <script src="\/env\.production\.js"><\/script> -->/,
      '<!-- Produção -->\n  <script src="/env.production.js"></script>'
    );
  }

  writeIndexHtml(content);
  
  console.log(`✅ Ambiente alterado para: ${environment}`);
  console.log(`📝 Arquivo index.html atualizado`);
  
  // Mostra informações do ambiente
  if (environment === 'development') {
    console.log('\n🔧 Configurações de Desenvolvimento:');
    console.log('   - API URL: http://localhost:3003');
    console.log('   - Debug: habilitado');
    console.log('   - Logs: detalhados');
    console.log('   - Cache: reduzido');
  } else {
    console.log('\n🚀 Configurações de Produção:');
    console.log('   - API URL: https://api.msoft.com.br');
    console.log('   - Debug: desabilitado');
    console.log('   - Logs: apenas erros');
    console.log('   - Cache: otimizado');
    console.log('   ⚠️  Lembre-se de configurar os tokens reais em env.production.js');
  }
}

// Função para mostrar o ambiente atual
function showCurrentEnvironment() {
  const content = readIndexHtml();
  
  if (content.includes('<script src="/env.development.js"></script>')) {
    console.log('🔧 Ambiente atual: DESENVOLVIMENTO');
  } else if (content.includes('<script src="/env.production.js"></script>')) {
    console.log('🚀 Ambiente atual: PRODUÇÃO');
  } else {
    console.log('❓ Ambiente não detectado');
  }
}

// Função principal
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📋 Uso: node switch-env.js [development|production|status]');
    console.log('');
    console.log('Comandos disponíveis:');
    console.log('  development  - Ativa ambiente de desenvolvimento');
    console.log('  production   - Ativa ambiente de produção');
    console.log('  status       - Mostra o ambiente atual');
    console.log('');
    showCurrentEnvironment();
    return;
  }

  const command = args[0].toLowerCase();
  
  switch (command) {
    case 'development':
    case 'dev':
      switchEnvironment('development');
      break;
    case 'production':
    case 'prod':
      switchEnvironment('production');
      break;
    case 'status':
      showCurrentEnvironment();
      break;
    default:
      console.error('❌ Comando inválido. Use: development, production ou status');
      process.exit(1);
  }
}

// Executa o script
if (require.main === module) {
  main();
}

module.exports = { switchEnvironment, showCurrentEnvironment }; 
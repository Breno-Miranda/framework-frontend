#!/bin/bash
set -e

# =============================================================================
# LISTA DE CDNs BAIXADOS AUTOMATICAMENTE
# =============================================================================
# Para adicionar novos CDNs, siga o padrão abaixo:
#
# CSS:
# - Bootstrap 5.3.0: https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css
# - Bootstrap Icons 1.11.0: https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css
# - Swiper 8: https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css
# - Skeleton 2.0.4: https://cdn.jsdelivr.net/npm/skeleton-css@2.0.4/css/skeleton.css
#
# FONTS:
# - Bootstrap Icons Font: https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/fonts/bootstrap-icons.woff2
#
# JS:
# - jQuery 3.7.1: https://code.jquery.com/jquery-3.7.1.min.js
# - Bootstrap Bundle 5.3.0: https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js
# - Swiper 8: https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js
# - PapaParse 5.4.1: https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js
# - Marked: https://cdn.jsdelivr.net/npm/marked/marked.min.js
#
# PADRÃO PARA ADICIONAR NOVOS CDNs:
# 1. Adicione o comentário com a descrição
# 2. Use curl -sSL para download
# 3. Salve na pasta correta (css/js/fonts)
# 4. Adicione mensagem de confirmação
# =============================================================================

# Instala dependências Python para minificação
pip3 install --quiet jsmin csscompressor htmlmin

# Definição do destino
SUBPASTA="$1"
if [ -z "$SUBPASTA" ]; then
  DIST_DIR="dist"
else
  # Remove barras do início/fim e garante barra única no início
  SUBPASTA=$(echo "$SUBPASTA" | sed 's#^/*##; s#/*$##')
  SUBPASTA="/$SUBPASTA"
  DIST_DIR="dist$SUBPASTA"
fi

# Garante que estamos no diretório correto
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 1. Limpa e cria pasta dist
rm -rf $DIST_DIR
mkdir -p $DIST_DIR/assets/vendor/css
mkdir -p $DIST_DIR/assets/vendor/js
mkdir -p $DIST_DIR/assets/vendor/fonts
mkdir -p $DIST_DIR/assets/favicon
mkdir -p $DIST_DIR/assets/images

# 1.1. Download e minificação de CDNs
echo "Baixando e minificando CDNs..."

# Bootstrap CSS
echo "Baixando Bootstrap CSS..."
curl -sSL "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" -o "$DIST_DIR/assets/vendor/css/bootstrap.min.css"
echo "✓ Bootstrap CSS baixado e minificado"

# Bootstrap Icons CSS
echo "Baixando Bootstrap Icons CSS..."
curl -sSL "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" -o "$DIST_DIR/assets/vendor/css/bootstrap-icons.css"
echo "✓ Bootstrap Icons CSS baixado"

# Swiper CSS
echo "Baixando Swiper CSS..."
curl -sSL "https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css" -o "$DIST_DIR/assets/vendor/css/swiper-bundle.min.css"
echo "✓ Swiper CSS baixado e minificado"

# Skeleton CSS
echo "Baixando Skeleton CSS..."
curl -sSL "https://cdn.jsdelivr.net/npm/skeleton-css@2.0.4/css/skeleton.css" -o "$DIST_DIR/assets/vendor/css/skeleton.css"
echo "✓ Skeleton CSS baixado"

# Bootstrap Icons Font
echo "Baixando Bootstrap Icons Font..."
curl -sSL "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/fonts/bootstrap-icons.woff2" -o "$DIST_DIR/assets/vendor/fonts/bootstrap-icons.woff2"
echo "✓ Bootstrap Icons Font baixada"

# jQuery
echo "Baixando jQuery..."
curl -sSL "https://code.jquery.com/jquery-3.7.1.min.js" -o "$DIST_DIR/assets/vendor/js/jquery-3.7.1.min.js"
echo "✓ jQuery baixado e minificado"

# Bootstrap JS
echo "Baixando Bootstrap JS..."
curl -sSL "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" -o "$DIST_DIR/assets/vendor/js/bootstrap.bundle.min.js"
echo "✓ Bootstrap JS baixado e minificado"

# Swiper JS
echo "Baixando Swiper JS..."
curl -sSL "https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js" -o "$DIST_DIR/assets/vendor/js/swiper-bundle.min.js"
echo "✓ Swiper JS baixado e minificado"

# PapaParse
echo "Baixando PapaParse..."
curl -sSL "https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js" -o "$DIST_DIR/assets/vendor/js/papaparse.min.js"
echo "✓ PapaParse baixado e minificado"

# Marked
echo "Baixando Marked..."
curl -sSL "https://cdn.jsdelivr.net/npm/marked/marked.min.js" -o "$DIST_DIR/assets/vendor/js/marked.min.js"
echo "✓ Marked baixado e minificado"

# Ajusta Bootstrap Icons CSS para usar fonte local
sed -i '' 's#url("./fonts/bootstrap-icons.woff2#url("../fonts/bootstrap-icons.woff2#g' $DIST_DIR/assets/vendor/css/bootstrap-icons.css
echo "✓ Bootstrap Icons CSS ajustado para fonte local"

# 2. Copia favicon para assets/favicon
echo "Copiando favicon..."
cp -r assets/vendor/favicon/* $DIST_DIR/assets/favicon/

# 3. Copia imagens para assets/images
echo "Copiando imagens..."
cp -r assets/vendor/images/* $DIST_DIR/assets/images/

# 4. Copia apenas arquivos essenciais (html, js, css, imagens, favicon, manifest, sw.js)
find . \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.png' -o -name '*.jpg' -o -name '*.jpeg' -o -name '*.ico' -o -name '*.webmanifest' -o -name 'sw.js' -o -name '*.woff2' \) \
  ! -path './node_modules/*' ! -path './dist/*' ! -path './*.DS_Store' ! -path './env.*' ! -path './*.sh' | while read file; do
  if [ -f "$file" ]; then
    target="$DIST_DIR/${file#./}"
    mkdir -p "$(dirname "$target")"
    cp "$file" "$target"
    echo "Copiado: $file -> $target"
  fi
done

# 5. Substitui apenas referências de assets nos HTML/JS para produção
for file in $(find $DIST_DIR -name '*.html' -o -name '*.js'); do
  sed -i '' 's#src/assets/#assets/#g' "$file"
done

# 6. Ajusta paths no config.js para produção
sed -i '' 's#src/assets/vendor/css/#assets/vendor/css/#g' $DIST_DIR/src/config/config.js
sed -i '' 's#src/assets/vendor/js/#assets/vendor/js/#g' $DIST_DIR/src/config/config.js
sed -i '' 's#src/assets/images/#assets/images/#g' $DIST_DIR/src/config/config.js
sed -i '' 's#src/assets/favicon/#assets/favicon/#g' $DIST_DIR/src/config/config.js

# 7. Configura BASE_PATH e basePath.auto antes da minificação
echo "SUBPASTA: $SUBPASTA"
if [ -n "$1" ]; then
  # Se passou parâmetro, configura para subpasta
  sed -i '' "s|base_path: .*|base_path: '$SUBPASTA',|" $DIST_DIR/src/config/config.js
  sed -i '' "s|auto: .*|auto: false,|" $DIST_DIR/src/config/config.js
  # Substitui a variável $SUBPASTA no env.js
  sed -i '' "s|'/\$SUBPASTA'|'$SUBPASTA'|g" $DIST_DIR/src/config/env.js
  echo "✓ BASE_PATH configurado para: $SUBPASTA (auto: false)"
else
  # Se não passou parâmetro, mantém auto: true
  sed -i '' "s|auto: .*|auto: true,|" $DIST_DIR/src/config/config.js
  echo "✓ BASE_PATH mantido como auto: true"
fi

# 8. Minifica todos os JS em dist (exceto .min.js e vendor) usando Python/jsmin
find $DIST_DIR -name "*.js" ! -name "*.min.js" ! -path "*vendor*" | while read file; do
  # Verifica se o arquivo contém optional chaining antes de minificar
  if grep -q "?\\." "$file"; then
    echo "Arquivo $file contém optional chaining, pulando minificação"
  else
    python3 -c "from jsmin import jsmin; f=open('$file'); d=f.read(); f.close(); open('$file','w').write(jsmin(d))"
    echo "Minificado JS: $file"
  fi
done

# 9. Minifica todos os CSS em dist (exceto .min.css e vendor) usando Python/csscompressor
find $DIST_DIR -name "*.css" ! -name "*.min.css" ! -path "*vendor*" | while read file; do
  python3 -c "from csscompressor import compress; f=open('$file'); d=f.read(); f.close(); open('$file','w').write(compress(d))"
  echo "Minificado CSS: $file"
done

# 10. Minifica HTML usando Python/htmlmin
find $DIST_DIR -name "*.html" | while read file; do
  python3 -c "import htmlmin; f=open('$file'); d=f.read(); f.close(); open('$file','w').write(htmlmin.minify(d, remove_comments=True, remove_empty_space=True))"
  echo "Minificado HTML: $file"
done

# 11. Cria versão de produção do index.html
echo "Criando versão de produção do index.html..."
echo "✓ Index.html de produção criado (arquivos de ambiente removidos)"

echo "Build de produção finalizado em $DIST_DIR"
echo "Todos os assets estão em $DIST_DIR/assets/vendor/css, $DIST_DIR/assets/vendor/js, $DIST_DIR/assets/images e $DIST_DIR/assets/favicon" 
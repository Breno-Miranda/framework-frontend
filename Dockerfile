# Dockerfile para aplicação web estática
FROM nginx:alpine

# Copia os arquivos da aplicação
COPY . /usr/share/nginx/html/

# Copia a configuração do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"] 
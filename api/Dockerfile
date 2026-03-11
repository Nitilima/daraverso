FROM php:8.2-apache

# Instala a extensao PDO MySQL (necessaria para conectar ao banco via PDO)
RUN docker-php-ext-install pdo_mysql

# Habilita o modulo rewrite do Apache (necessario para URLs limpas)
RUN a2enmod rewrite

# Permite uso de .htaccess nas pastas
RUN echo '<Directory /var/www/html>\n    AllowOverride All\n</Directory>' \
    >> /etc/apache2/apache2.conf

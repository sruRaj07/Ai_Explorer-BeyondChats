FROM php:8.2-cli

# Install system & build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    curl \
    sqlite3 \
    libsqlite3-dev \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    default-mysql-client \
    build-essential \
    pkg-config \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        pdo_sqlite \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy Laravel application
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Fix permissions
RUN chmod -R 775 storage bootstrap/cache

# Expose Render port
EXPOSE 10000

# Start Laravel
CMD php artisan migrate --force && \
    php artisan serve --host=0.0.0.0 --port=10000
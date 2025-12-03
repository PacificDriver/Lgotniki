# 🚀 Краткая инструкция по установке

## Быстрый старт для Ubuntu 24.04

### 1. Установка зависимостей (5 минут)

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# PHP 8.2
sudo add-apt-repository ppa:ondrej/php -y
sudo apt install -y php8.2 php8.2-cli php8.2-fpm php8.2-pgsql php8.2-redis \
    php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip

# Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Redis
sudo apt install -y redis-server
sudo systemctl enable redis-server && sudo systemctl start redis-server

# Nginx
sudo apt install -y nginx

# Supervisor
sudo apt install -y supervisor
```

### 2. Настройка PostgreSQL (2 минуты)

```bash
sudo -u postgres psql << EOF
CREATE DATABASE bus_notifications;
CREATE USER busadmin WITH ENCRYPTED PASSWORD 'YourSecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE bus_notifications TO busadmin;
\q
EOF
```

### 3. Установка приложения (3 минуты)

```bash
cd /var/www
sudo git clone <your-repo-url> notiify
cd notiify

# Зависимости
sudo composer install --no-dev --optimize-autoloader

# Конфигурация
sudo cp .env.example .env
sudo php artisan key:generate
```

### 4. Редактирование .env (2 минуты)

```bash
sudo nano .env
```

Измените эти строки:

```env
DB_DATABASE=bus_notifications
DB_USERNAME=busadmin
DB_PASSWORD=YourSecurePassword123!

MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

WHATSAPP_API_URL=https://your-whatsapp-api.com
WHATSAPP_API_TOKEN=your-token
```

### 5. Миграции и данные (1 минута)

```bash
php artisan migrate
php artisan db:seed
```

### 6. Права доступа (1 минута)

```bash
sudo chown -R www-data:www-data /var/www/notiify
sudo chmod -R 755 /var/www/notiify
sudo chmod -R 775 /var/www/notiify/storage
sudo chmod -R 775 /var/www/notiify/bootstrap/cache
```

### 7. Nginx конфигурация (2 минуты)

```bash
sudo nano /etc/nginx/sites-available/notiify
```

Вставьте:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/notiify/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Активация:

```bash
sudo ln -s /etc/nginx/sites-available/notiify /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. Supervisor для очередей (2 минуты)

```bash
sudo nano /etc/supervisor/conf.d/notiify-worker.conf
```

Вставьте:

```ini
[program:notiify-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/notiify/artisan queue:work redis --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/notiify/storage/logs/worker.log
```

Запуск:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start notiify-worker:*
```

## ✅ Готово!

Откройте в браузере: `http://your-domain.com`

**Учетные данные:**
- Администратор: `admin@busnotifications.ru` / `password`
- Оператор: `operator@busnotifications.ru` / `password`

## 🔧 Команды для проверки:

```bash
# Статус сервисов
sudo systemctl status postgresql
sudo systemctl status redis-server
sudo systemctl status nginx
sudo supervisorctl status

# Тест приложения
cd /var/www/notiify
php artisan about

# Логи
tail -f storage/logs/laravel.log
tail -f storage/logs/worker.log
```

## 🆘 Проблемы?

1. **Проверьте логи**: `storage/logs/laravel.log`
2. **Права доступа**: `sudo chown -R www-data:www-data /var/www/notiify`
3. **Очистка кэша**: `php artisan config:clear && php artisan cache:clear`
4. **Перезапуск worker**: `sudo supervisorctl restart notiify-worker:*`

---

**Общее время установки: ~20 минут** ⏱️





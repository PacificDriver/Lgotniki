#!/bin/bash

# Скрипт для проверки и запуска бэкенда на сервере

echo "=== Проверка статуса бэкенда ==="

# Проверка, запущен ли бэкенд
if pgrep -f "node.*dist/index.js" > /dev/null; then
    echo "✓ Бэкенд запущен"
    ps aux | grep "node.*dist/index.js" | grep -v grep
else
    echo "✗ Бэкенд не запущен"
fi

# Проверка порта 3001
echo ""
echo "=== Проверка порта 3001 ==="
if netstat -tuln | grep :3001 > /dev/null || ss -tuln | grep :3001 > /dev/null; then
    echo "✓ Порт 3001 прослушивается"
    netstat -tuln | grep :3001 || ss -tuln | grep :3001
else
    echo "✗ Порт 3001 не прослушивается"
fi

# Проверка подключения к базе данных
echo ""
echo "=== Проверка переменных окружения ==="
if [ -f backend/.env ]; then
    echo "✓ Файл .env найден"
    echo "Проверка переменных:"
    grep -E "^(DB_|DATABASE_)" backend/.env | sed 's/=.*/=***/' || echo "Переменные БД не найдены"
else
    echo "✗ Файл .env не найден в backend/"
fi

# Проверка логов nginx
echo ""
echo "=== Последние ошибки nginx ==="
if [ -f /var/log/nginx/error.log ]; then
    tail -20 /var/log/nginx/error.log | grep -i "502\|bad gateway\|upstream" || echo "Нет ошибок 502 в логах"
fi

# Проверка логов бэкенда (если есть)
echo ""
echo "=== Проверка логов бэкенда ==="
if [ -f backend/logs/app.log ] || [ -f /var/log/lgotniki-backend.log ]; then
    echo "Последние строки логов:"
    tail -20 backend/logs/app.log 2>/dev/null || tail -20 /var/log/lgotniki-backend.log 2>/dev/null
else
    echo "Логи бэкенда не найдены"
fi

echo ""
echo "=== Команды для запуска бэкенда ==="
echo "1. Перейти в директорию бэкенда:"
echo "   cd /path/to/backend"
echo ""
echo "2. Установить зависимости (если нужно):"
echo "   npm install --production"
echo ""
echo "3. Собрать проект:"
echo "   npm run build"
echo ""
echo "4. Запустить бэкенд:"
echo "   npm start"
echo ""
echo "Или запустить через PM2:"
echo "   pm2 start dist/index.js --name lgotniki-backend"
echo "   pm2 save"
echo "   pm2 startup"




#!/bin/bash

# Скрипт для запуска бэкенда на сервере

set -e

BACKEND_DIR="/path/to/backend"  # УКАЖИТЕ ПУТЬ К БЭКЕНДУ НА СЕРВЕРЕ
SERVICE_NAME="lgotniki-backend"

echo "=== Запуск бэкенда ==="

# Переход в директорию бэкенда
cd "$BACKEND_DIR" || {
    echo "Ошибка: директория $BACKEND_DIR не найдена"
    echo "Измените BACKEND_DIR в скрипте на правильный путь"
    exit 1
}

# Проверка наличия .env файла
if [ ! -f .env ]; then
    echo "⚠ Предупреждение: файл .env не найден"
    echo "Убедитесь, что переменные окружения настроены"
fi

# Проверка наличия node_modules
if [ ! -d node_modules ]; then
    echo "Установка зависимостей..."
    npm install --production
fi

# Сборка проекта
echo "Сборка проекта..."
npm run build

# Проверка наличия скомпилированного кода
if [ ! -f dist/index.js ]; then
    echo "Ошибка: dist/index.js не найден после сборки"
    exit 1
fi

# Остановка предыдущего процесса (если запущен)
if pgrep -f "node.*dist/index.js" > /dev/null; then
    echo "Остановка предыдущего процесса..."
    pkill -f "node.*dist/index.js"
    sleep 2
fi

# Запуск через PM2 (рекомендуется) или напрямую
if command -v pm2 &> /dev/null; then
    echo "Запуск через PM2..."
    pm2 delete "$SERVICE_NAME" 2>/dev/null || true
    pm2 start dist/index.js --name "$SERVICE_NAME"
    pm2 save
    echo "✓ Бэкенд запущен через PM2"
    echo "Проверить статус: pm2 status"
    echo "Посмотреть логи: pm2 logs $SERVICE_NAME"
else
    echo "PM2 не установлен. Запуск напрямую..."
    echo "Для продакшена рекомендуется установить PM2: npm install -g pm2"
    nohup node dist/index.js > backend.log 2>&1 &
    echo $! > backend.pid
    echo "✓ Бэкенд запущен (PID: $(cat backend.pid))"
    echo "Логи: tail -f backend.log"
fi

# Проверка, что сервер запустился
sleep 3
if netstat -tuln | grep :3001 > /dev/null || ss -tuln | grep :3001 > /dev/null; then
    echo "✓ Порт 3001 прослушивается"
    echo "✓ Бэкенд успешно запущен!"
else
    echo "⚠ Порт 3001 не прослушивается. Проверьте логи на наличие ошибок."
fi




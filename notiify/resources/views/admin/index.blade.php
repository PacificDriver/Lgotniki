<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Панель администратора</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f7fa;
        }
        
        .header {
            background: #764ba2;
            color: white;
            padding: 20px 40px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .header h1 {
            font-size: 1.5rem;
        }
        
        .container {
            max-width: 1200px;
            margin: 30px auto;
            padding: 0 20px;
        }
        
        .card {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 25px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        .card h2 {
            color: #333;
            margin-bottom: 20px;
            font-size: 1.3rem;
        }
        
        .settings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .setting-item {
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #764ba2;
        }
        
        .setting-item h3 {
            color: #333;
            margin-bottom: 10px;
        }
        
        .setting-item p {
            color: #666;
            margin-bottom: 15px;
            line-height: 1.6;
        }
        
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .btn-primary {
            background: #764ba2;
            color: white;
        }
        
        .btn-primary:hover {
            background: #5f3a82;
        }
        
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        
        .status-ok {
            background: #51cf66;
        }
        
        .status-error {
            background: #ff6b6b;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>⚙️ Панель администратора</h1>
    </div>
    
    <div class="container">
        <div class="card">
            <h2>Системные настройки</h2>
            <div class="settings-grid">
                <div class="setting-item">
                    <h3>📡 API Перевозчика</h3>
                    <p>Синхронизация данных с системой перевозчика</p>
                    <button class="btn btn-primary" onclick="alert('Синхронизация станций...')">
                        Синхронизировать станции
                    </button>
                </div>
                
                <div class="setting-item">
                    <h3>✉️ Email настройки</h3>
                    <p>Конфигурация SMTP сервера для отправки писем</p>
                    <button class="btn btn-primary" onclick="alert('Тест email отправки...')">
                        Проверить подключение
                    </button>
                </div>
                
                <div class="setting-item">
                    <h3>📱 WhatsApp API</h3>
                    <p>Настройка подключения к WhatsApp Business API</p>
                    <button class="btn btn-primary" onclick="alert('Тест WhatsApp API...')">
                        Проверить подключение
                    </button>
                </div>
                
                <div class="setting-item">
                    <h3>⚙️ Redis / Очереди</h3>
                    <p>Управление очередями отправки уведомлений</p>
                    <button class="btn btn-primary" onclick="alert('Очистка очередей...')">
                        Управление очередями
                    </button>
                </div>
            </div>
        </div>
        
        <div class="card">
            <h2>Статус сервисов</h2>
            <div style="padding: 20px;">
                <div style="margin-bottom: 15px;">
                    <span class="status-indicator status-ok"></span>
                    <strong>База данных:</strong> Подключена
                </div>
                <div style="margin-bottom: 15px;">
                    <span class="status-indicator status-ok"></span>
                    <strong>Redis:</strong> Активен
                </div>
                <div style="margin-bottom: 15px;">
                    <span class="status-indicator status-error"></span>
                    <strong>WhatsApp API:</strong> Не настроен (требуется конфигурация)
                </div>
                <div style="margin-bottom: 15px;">
                    <span class="status-indicator status-error"></span>
                    <strong>API Перевозчика:</strong> Не настроен (требуется конфигурация)
                </div>
            </div>
        </div>
        
        <div class="card">
            <h2>Управление пользователями</h2>
            <p style="color: #666; margin-bottom: 20px;">
                Добавление и управление учетными записями операторов и администраторов
            </p>
            <button class="btn btn-primary" onclick="alert('Создание нового пользователя...')">
                ➕ Добавить пользователя
            </button>
        </div>
    </div>
</body>
</html>





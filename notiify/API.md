# 📡 API Документация

## Базовая информация

- **Base URL**: `https://yourdomain.com/api`
- **Аутентификация**: Laravel Sanctum (Bearer Token)
- **Формат ответов**: JSON
- **Кодировка**: UTF-8

## Аутентификация

Все запросы требуют токен аутентификации в заголовке:

```http
Authorization: Bearer YOUR_TOKEN_HERE
```

## Общие коды ответов

- `200 OK` - Успешный запрос
- `201 Created` - Ресурс создан
- `400 Bad Request` - Неверные параметры
- `401 Unauthorized` - Требуется аутентификация
- `403 Forbidden` - Недостаточно прав
- `404 Not Found` - Ресурс не найден
- `422 Unprocessable Entity` - Ошибка валидации
- `500 Internal Server Error` - Серверная ошибка

## Endpoints

### 🏢 Станции

#### Получить список станций

```http
GET /api/stations
```

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Смирных",
      "code": "SMR",
      "city": "Смирных",
      "region": "Сахалинская область",
      "latitude": "49.7739000",
      "longitude": "142.8442000",
      "is_active": true
    }
  ]
}
```

#### Синхронизация станций (Admin)

```http
POST /api/stations/sync
```

**Требования**: Роль `admin`

**Ответ:**
```json
{
  "success": true,
  "message": "Stations synchronization completed",
  "synced_count": 15
}
```

---

### 🚌 Рейсы

#### Получить отмененные рейсы

```http
GET /api/trips/cancelled
```

**Параметры:**
| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| departure_station_id | integer | Да | ID станции отправления |
| arrival_station_id | integer | Да | ID станции прибытия |
| date_from | date | Да | Дата начала (YYYY-MM-DD) |
| date_to | date | Нет | Дата окончания (YYYY-MM-DD) |

**Пример запроса:**
```http
GET /api/trips/cancelled?departure_station_id=1&arrival_station_id=2&date_from=2024-10-26
```

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "trip_number": "507",
      "departure_time": "2024-10-26T10:30:00.000000Z",
      "arrival_time": "2024-10-26T13:30:00.000000Z",
      "status": "cancelled",
      "cancellation_reason": "Технические неисправности автобуса",
      "cancelled_at": "2024-10-25T15:00:00.000000Z",
      "route": {
        "id": 1,
        "departure_station": {
          "id": 1,
          "name": "Смирных"
        },
        "arrival_station": {
          "id": 2,
          "name": "Южно-Сахалинск"
        }
      }
    }
  ],
  "count": 1
}
```

#### Получить информацию о рейсе

```http
GET /api/trips/{id}
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "trip_number": "507",
    "status": "cancelled",
    "route": { ... },
    "passengers": [ ... ]
  }
}
```

---

### 👥 Пассажиры

#### Получить пассажиров рейса

```http
GET /api/passengers/by-trip/{tripId}
```

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "first_name": "Иван",
      "last_name": "Иванов",
      "middle_name": "Иванович",
      "full_name": "Иванов Иван Иванович",
      "email": "ivanov@example.com",
      "phone": "+79001234567",
      "seat_number": "1",
      "ticket_price": "1500.00",
      "ticket_status": "paid"
    }
  ],
  "total_count": 15,
  "valid_count": 15,
  "invalid_count": 0
}
```

---

### 📋 Задачи на рассылку

#### Получить список задач

```http
GET /api/notification-tasks
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "title": "Отмена рейса 507",
        "status": "completed",
        "total_recipients": 15,
        "sent_count": 15,
        "failed_count": 0,
        "created_at": "2024-10-25T15:00:00.000000Z",
        "creator": {
          "id": 2,
          "name": "Оператор Иван"
        }
      }
    ],
    "current_page": 1,
    "per_page": 20,
    "total": 5
  }
}
```

#### Создать задачу на рассылку

```http
POST /api/notification-tasks
```

**Тело запроса:**
```json
{
  "title": "Отмена рейса 507",
  "trip_ids": [1, 2],
  "template_id": 1,
  "custom_message": "Ваш рейс отменен",
  "scheduled_at": "2024-10-26T10:00:00Z"
}
```

**Параметры:**
| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| title | string | Да | Название задачи |
| trip_ids | array | Да | Массив ID рейсов |
| template_id | integer | Нет | ID шаблона сообщения |
| custom_message | string | Нет | Свой текст сообщения |
| scheduled_at | datetime | Нет | Запланированное время |

**Ответ:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Отмена рейса 507",
    "status": "draft",
    "total_recipients": 15,
    "created_at": "2024-10-25T15:00:00.000000Z"
  },
  "message": "Notification task created successfully"
}
```

#### Запустить отправку

```http
POST /api/notification-tasks/{id}/send
```

**Ответ:**
```json
{
  "success": true,
  "message": "Notifications queued successfully",
  "total_recipients": 15,
  "total_notifications": 30
}
```

#### Получить статус задачи

```http
GET /api/notification-tasks/{id}/status
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": 1,
      "status": "processing",
      "total_recipients": 15
    },
    "stats": {
      "total": 15,
      "sent": 12,
      "failed": 1,
      "pending": 2,
      "queued": 0,
      "success_rate": 80.00
    }
  }
}
```

---

### 📝 Шаблоны сообщений

#### Получить список шаблонов

```http
GET /api/templates
```

**Параметры (query):**
- `type` - фильтр по типу (cancellation, delay, general)
- `active_only` - только активные (true/false)

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Уведомление об отмене рейса",
      "slug": "cancellation-notification",
      "type": "cancellation",
      "subject": "Отмена рейса №{{trip_number}}",
      "body": "Уважаемый(ая) {{passenger_full_name}}, ...",
      "available_variables": [
        "passenger_full_name",
        "trip_number",
        "departure_station",
        "arrival_station"
      ],
      "is_active": true
    }
  ]
}
```

#### Создать шаблон

```http
POST /api/templates
```

**Тело запроса:**
```json
{
  "name": "Мой шаблон",
  "slug": "my-template",
  "type": "general",
  "subject": "Тема письма",
  "body": "Текст с {{переменными}}",
  "available_variables": ["passenger_full_name", "trip_number"]
}
```

#### Обновить шаблон

```http
PUT /api/templates/{id}
```

#### Удалить шаблон

```http
DELETE /api/templates/{id}
```

---

### ✉️ Уведомления

#### Получить список уведомлений

```http
GET /api/notifications
```

**Параметры (query):**
- `status` - фильтр по статусу (pending, queued, sent, failed)
- `channel` - фильтр по каналу (email, whatsapp)
- `task_id` - фильтр по задаче

**Ответ:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "channel": "email",
        "recipient": "ivanov@example.com",
        "subject": "Отмена рейса №507",
        "status": "sent",
        "sent_at": "2024-10-25T15:05:00.000000Z",
        "passenger": {
          "id": 1,
          "full_name": "Иванов Иван Иванович"
        }
      }
    ],
    "current_page": 1,
    "per_page": 50
  }
}
```

#### Получить информацию об уведомлении

```http
GET /api/notifications/{id}
```

---

## Переменные в шаблонах

Доступные переменные для подстановки в шаблоны:

| Переменная | Описание |
|------------|----------|
| `{{passenger_full_name}}` | ФИО пассажира полностью |
| `{{passenger_first_name}}` | Имя пассажира |
| `{{passenger_last_name}}` | Фамилия пассажира |
| `{{trip_number}}` | Номер рейса |
| `{{departure_station}}` | Станция отправления |
| `{{arrival_station}}` | Станция прибытия |
| `{{departure_time}}` | Время отправления |
| `{{departure_date}}` | Дата отправления |
| `{{departure_time_only}}` | Только время |
| `{{arrival_time}}` | Время прибытия |
| `{{seat_number}}` | Номер места |
| `{{cancellation_reason}}` | Причина отмены |
| `{{delay_minutes}}` | Задержка в минутах |

---

## Примеры использования

### Python

```python
import requests

BASE_URL = "https://yourdomain.com/api"
TOKEN = "your_token_here"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# Получить отмененные рейсы
response = requests.get(
    f"{BASE_URL}/trips/cancelled",
    headers=headers,
    params={
        "departure_station_id": 1,
        "arrival_station_id": 2,
        "date_from": "2024-10-26"
    }
)

trips = response.json()["data"]

# Создать задачу на рассылку
trip_ids = [trip["id"] for trip in trips]

response = requests.post(
    f"{BASE_URL}/notification-tasks",
    headers=headers,
    json={
        "title": "Отмена рейсов",
        "trip_ids": trip_ids,
        "template_id": 1
    }
)

task = response.json()["data"]

# Запустить отправку
requests.post(
    f"{BASE_URL}/notification-tasks/{task['id']}/send",
    headers=headers
)
```

### JavaScript

```javascript
const BASE_URL = 'https://yourdomain.com/api';
const TOKEN = 'your_token_here';

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

// Получить отмененные рейсы
const response = await fetch(
  `${BASE_URL}/trips/cancelled?departure_station_id=1&arrival_station_id=2&date_from=2024-10-26`,
  { headers }
);

const { data: trips } = await response.json();

// Создать задачу
const taskResponse = await fetch(`${BASE_URL}/notification-tasks`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    title: 'Отмена рейсов',
    trip_ids: trips.map(t => t.id),
    template_id: 1
  })
});

const { data: task } = await taskResponse.json();

// Запустить отправку
await fetch(`${BASE_URL}/notification-tasks/${task.id}/send`, {
  method: 'POST',
  headers
});
```

---

## Ошибки

### Пример ответа с ошибкой валидации:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "trip_ids": [
      "The trip ids field is required."
    ],
    "title": [
      "The title field is required."
    ]
  }
}
```

### Пример ответа с ошибкой доступа:

```json
{
  "message": "Insufficient permissions.",
  "required_role": "admin",
  "user_role": "operator"
}
```

---

## Rate Limiting

API имеет ограничения на количество запросов:
- **60 запросов в минуту** для аутентифицированных пользователей
- **10 запросов в минуту** для неаутентифицированных

При превышении лимита вернется код `429 Too Many Requests`.





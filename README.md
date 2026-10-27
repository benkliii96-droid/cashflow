# Cashflow

Личный учёт доходов и расходов. Pet-project для портфолио fullstack-разработчика.

Без регистрации: открыл — сразу работаешь. Категории создаются при первой миграции (зарплата, продукты, транспорт и т.д.), можно добавлять свои.

## Стек

| Слой | Технологии |
|------|------------|
| Backend | Python, Django, Django REST Framework, SQLite |
| Frontend | React, TypeScript, Vite |
| API | REST JSON |

## Что умеет

- категории доходов и расходов (создание / удаление)
- операции: сумма, дата, комментарий, привязка к категории
- сводка: доход / расход / баланс
- фильтр истории по типу

## Как устроен прокси

Vite проксирует запросы фронта на Django:

```
браузер → http://127.0.0.1:5173/api/...
              ↓ (vite proxy)
         http://127.0.0.1:8000/api/...
```

Настройка в `frontend/vite.config.ts`:

```ts
proxy: { '/api': 'http://127.0.0.1:8000' }
```

То есть backend должен слушать **порт 8000** (стандартный `runserver`).

## Запуск

Нужны: Python 3.11+, Node.js 18+.

**1. Backend** (из корня репозитория):

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend: `http://127.0.0.1:8000`

**2. Frontend** (второй терминал):

```bash
cd frontend
npm install
npm run dev
```

**3. Открыть в браузере**

Смотри URL в терминале Vite. Обычно это:

```
http://127.0.0.1:5173/
```

Если 5173 занят, Vite сам возьмёт следующий свободный порт — открой тот, что напечатан в консоли (`Local: http://127.0.0.1:XXXX/`).

## API (кратко)

- `GET/POST /api/categories/`
- `GET/POST /api/transactions/`
- `GET /api/summary/`

## Структура

```
cashflow/
  config/          # Django settings
  finance/         # модели, API
  frontend/        # React-приложение
  manage.py
  requirements.txt
```

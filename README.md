# Cashflow

Учёт доходов и расходов. Без авторизации.

**Стек:** Django + DRF, React + TypeScript + Vite, SQLite

## Функции

- категории (доход / расход), сидятся при migrate
- операции: сумма, дата, комментарий
- сводка: доход, расход, баланс
- фильтр истории

## Прокси

`frontend/vite.config.ts`:

```ts
proxy: { '/api': 'http://127.0.0.1:8000' }
```

Фронт ходит на `/api/*` → Vite проксирует на Django `:8000`.

## Запуск

```bash
# backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# frontend (второй терминал)
cd frontend
npm install
npm run dev
```

Открыть URL из вывода Vite (`Local:`), обычно `http://127.0.0.1:5173`.

## API

- `GET/POST /api/categories/`
- `GET/POST /api/transactions/`
- `GET /api/summary/`

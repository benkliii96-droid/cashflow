# Cashflow

Personal finance tracker (pet project).

**Stack:** Django + Django REST Framework + JWT · React + TypeScript + Vite · SQLite

## Features

- registration / login (JWT)
- income & expense categories
- transactions CRUD
- balance summary

## Run locally

```bash
# backend
python -m venv .venv
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## API

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `GET/POST /api/categories/`
- `GET/POST /api/transactions/`
- `GET /api/summary/`

# Cashflow

Personal finance tracker (pet project).

**Stack:** Django + DRF · React + TypeScript + Vite · SQLite

## Features

- no login — open and use
- seeded categories (salary, groceries, etc.)
- create/delete categories and transactions
- income / expense summary

## Run

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

cd frontend
npm install
npm run dev
```

Open http://127.0.0.1:5173

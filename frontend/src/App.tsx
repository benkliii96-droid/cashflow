import { FormEvent, useEffect, useState } from 'react'
import api, { Category, Summary, Transaction } from './api'
import './App.css'

type Mode = 'login' | 'register'

function App() {
  const [token, setToken] = useState(localStorage.getItem('access'))
  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [summary, setSummary] = useState<Summary | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const [catName, setCatName] = useState('')
  const [catKind, setCatKind] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString().slice(0, 10))

  async function loadData() {
    const [s, c, t] = await Promise.all([
      api.get<Summary>('/summary/'),
      api.get<Category[]>('/categories/'),
      api.get<Transaction[]>('/transactions/'),
    ])
    setSummary(s.data)
    setCategories(c.data)
    setTransactions(t.data)
    if (c.data.length && categoryId === '') {
      setCategoryId(c.data[0].id)
    }
  }

  useEffect(() => {
    if (!token) return
    loadData().catch(() => {
      localStorage.removeItem('access')
      setToken(null)
    })
  }, [token])

  async function onAuth(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'register') {
        await api.post('/auth/register/', { username, password })
      }
      const { data } = await api.post('/auth/login/', { username, password })
      localStorage.setItem('access', data.access)
      setToken(data.access)
    } catch {
      setError('Не удалось войти. Проверь логин/пароль.')
    }
  }

  async function addCategory(e: FormEvent) {
    e.preventDefault()
    await api.post('/categories/', { name: catName, kind: catKind })
    setCatName('')
    await loadData()
  }

  async function addTransaction(e: FormEvent) {
    e.preventDefault()
    if (!categoryId) return
    await api.post('/transactions/', {
      category: categoryId,
      amount,
      note,
      occurred_at: occurredAt,
    })
    setAmount('')
    setNote('')
    await loadData()
  }

  function logout() {
    localStorage.removeItem('access')
    setToken(null)
  }

  if (!token) {
    return (
      <div className="shell">
        <div className="card auth">
          <h1>Cashflow</h1>
          <p className="muted">Учёт доходов и расходов · Django + React</p>
          <div className="tabs">
            <button
              className={mode === 'login' ? 'active' : ''}
              onClick={() => setMode('login')}
              type="button"
            >
              Вход
            </button>
            <button
              className={mode === 'register' ? 'active' : ''}
              onClick={() => setMode('register')}
              type="button"
            >
              Регистрация
            </button>
          </div>
          <form onSubmit={onAuth}>
            <label>
              Логин
              <input value={username} onChange={(e) => setUsername(e.target.value)} required />
            </label>
            <label>
              Пароль
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </label>
            {error && <p className="error">{error}</p>}
            <button type="submit">{mode === 'login' ? 'Войти' : 'Создать аккаунт'}</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="shell">
      <header className="top">
        <div>
          <h1>Cashflow</h1>
          <p className="muted">Личный учёт финансов</p>
        </div>
        <button type="button" className="ghost" onClick={logout}>
          Выйти
        </button>
      </header>

      <section className="stats">
        <div className="stat">
          <span>Доходы</span>
          <strong>{summary?.income ?? '—'}</strong>
        </div>
        <div className="stat">
          <span>Расходы</span>
          <strong>{summary?.expense ?? '—'}</strong>
        </div>
        <div className="stat accent">
          <span>Баланс</span>
          <strong>{summary?.balance ?? '—'}</strong>
        </div>
      </section>

      <div className="grid">
        <form className="card" onSubmit={addCategory}>
          <h2>Категория</h2>
          <label>
            Название
            <input value={catName} onChange={(e) => setCatName(e.target.value)} required />
          </label>
          <label>
            Тип
            <select
              value={catKind}
              onChange={(e) => setCatKind(e.target.value as 'income' | 'expense')}
            >
              <option value="expense">Расход</option>
              <option value="income">Доход</option>
            </select>
          </label>
          <button type="submit">Добавить</button>
        </form>

        <form className="card" onSubmit={addTransaction}>
          <h2>Операция</h2>
          <label>
            Категория
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.kind === 'income' ? 'доход' : 'расход'})
                </option>
              ))}
            </select>
          </label>
          <label>
            Сумма
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
          <label>
            Дата
            <input
              type="date"
              value={occurredAt}
              onChange={(e) => setOccurredAt(e.target.value)}
              required
            />
          </label>
          <label>
            Комментарий
            <input value={note} onChange={(e) => setNote(e.target.value)} />
          </label>
          <button type="submit">Сохранить</button>
        </form>
      </div>

      <section className="card">
        <h2>История</h2>
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Категория</th>
              <th>Тип</th>
              <th>Сумма</th>
              <th>Комментарий</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.occurred_at}</td>
                <td>{t.category_name}</td>
                <td>{t.kind === 'income' ? 'доход' : 'расход'}</td>
                <td className={t.kind}>{t.amount}</td>
                <td>{t.note || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default App

import { FormEvent, useEffect, useMemo, useState } from 'react'
import api from './api'
import type { Category, Summary, Transaction } from './api'
import './App.css'

function App() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [catName, setCatName] = useState('')
  const [catKind, setCatKind] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString().slice(0, 10))
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

  async function loadData() {
    const [s, c, t] = await Promise.all([
      api.get<Summary>('/summary/'),
      api.get<Category[]>('/categories/'),
      api.get<Transaction[]>('/transactions/'),
    ])
    setSummary(s.data)
    setCategories(c.data)
    setTransactions(t.data)
    setCategoryId((prev) => prev || (c.data[0]?.id ?? ''))
  }

  useEffect(() => {
    loadData().catch(console.error)
  }, [])

  const visible = useMemo(
    () => (filter === 'all' ? transactions : transactions.filter((t) => t.kind === filter)),
    [transactions, filter],
  )

  async function addCategory(e: FormEvent) {
    e.preventDefault()
    const { data } = await api.post<Category>('/categories/', { name: catName, kind: catKind })
    setCatName('')
    await loadData()
    setCategoryId(data.id)
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

  async function removeCategory(id: number) {
    await api.delete(`/categories/${id}/`)
    await loadData()
  }

  async function removeTransaction(id: number) {
    await api.delete(`/transactions/${id}/`)
    await loadData()
  }

  return (
    <div className="page">
      <div className="ledger-grid" aria-hidden />
      <header className="hero">
        <p className="eyebrow">personal ledger</p>
        <h1>Cashflow</h1>
        <p className="lead">Доходы, расходы и категории — без лишнего входа.</p>
      </header>

      <section className="stats">
        <article>
          <span>Доход</span>
          <strong className="plus">{summary?.income ?? '0.00'}</strong>
        </article>
        <article>
          <span>Расход</span>
          <strong className="minus">{summary?.expense ?? '0.00'}</strong>
        </article>
        <article className="balance">
          <span>Баланс</span>
          <strong>{summary?.balance ?? '0.00'}</strong>
        </article>
      </section>

      <div className="layout">
        <form className="panel" onSubmit={addCategory}>
          <h2>Категории</h2>
          <div className="chips">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`chip ${c.kind}`}
                onClick={() => setCategoryId(c.id)}
              >
                <span>{c.name}</span>
                <em onClick={(e) => { e.stopPropagation(); removeCategory(c.id) }}>×</em>
              </button>
            ))}
          </div>
          <label>
            Новая категория
            <input value={catName} onChange={(e) => setCatName(e.target.value)} required />
          </label>
          <label>
            Тип
            <select value={catKind} onChange={(e) => setCatKind(e.target.value as 'income' | 'expense')}>
              <option value="expense">Расход</option>
              <option value="income">Доход</option>
            </select>
          </label>
          <button type="submit" className="primary">Добавить категорию</button>
        </form>

        <form className="panel" onSubmit={addTransaction}>
          <h2>Операция</h2>
          <label>
            Категория
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              required
            >
              {categories.length === 0 && <option value="">Сначала добавь категорию</option>}
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.kind === 'income' ? 'доход' : 'расход'}
                </option>
              ))}
            </select>
          </label>
          <div className="two">
            <label>
              Сумма
              <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </label>
            <label>
              Дата
              <input type="date" value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} required />
            </label>
          </div>
          <label>
            Комментарий
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="опционально" />
          </label>
          <button type="submit" className="primary" disabled={!categories.length}>Записать</button>
        </form>
      </div>

      <section className="panel wide">
        <div className="table-head">
          <h2>История</h2>
          <div className="filters">
            {(['all', 'income', 'expense'] as const).map((f) => (
              <button key={f} type="button" className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>
                {f === 'all' ? 'Все' : f === 'income' ? 'Доход' : 'Расход'}
              </button>
            ))}
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Категория</th>
              <th>Сумма</th>
              <th>Заметка</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((t) => (
              <tr key={t.id}>
                <td>{t.occurred_at}</td>
                <td>{t.category_name}</td>
                <td className={t.kind}>{t.amount}</td>
                <td>{t.note || '—'}</td>
                <td>
                  <button type="button" className="ghost" onClick={() => removeTransaction(t.id)}>удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default App

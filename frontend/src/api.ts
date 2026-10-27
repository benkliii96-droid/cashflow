import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

export default api

export type Category = {
  id: number
  name: string
  kind: 'income' | 'expense'
}

export type Transaction = {
  id: number
  category: number
  category_name: string
  kind: 'income' | 'expense'
  amount: string
  note: string
  occurred_at: string
}

export type Summary = {
  income: string
  expense: string
  balance: string
}

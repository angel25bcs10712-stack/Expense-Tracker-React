import { useMemo, useState } from 'react'
import { parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Filters from '../components/Filters'
import SearchBar from '../components/SearchBar'
import TransactionCard from '../components/TransactionCard'
import useTransactions from '../hooks/useTransactions'
import useDebounce from '../hooks/useDebounce'
import useCurrency from '../hooks/useCurrency'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/transactionConstants'

function matchesQuery(transaction, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const title = (transaction.title || '').toLowerCase()
  const notes = (transaction.notes || '').toLowerCase()
  return title.includes(q) || notes.includes(q)
}

function dateInRange(dateStr, fromDate, toDate) {
  const d = parseISO(dateStr)
  if (fromDate) {
    const start = parseISO(fromDate)
    if (d < start) return false
  }
  if (toDate) {
    const end = parseISO(toDate)
    if (d > end) return false
  }
  return true
}

export default function Transactions() {
  const navigate = useNavigate()
  const { transactions, deleteTransaction } = useTransactions()
  const { formatCurrency } = useCurrency()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedQuery = useDebounce(searchQuery, 250)

  const [category, setCategory] = useState('')
  const [type, setType] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [sortBy, setSortBy] = useState('date')

  const categoryOptions = useMemo(() => {
    return ['', ...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]
  }, [])

  const typeOptions = ['income', 'expense']

  const filtered = useMemo(() => {
    const list = transactions
      .filter((t) => matchesQuery(t, debouncedQuery))
      .filter((t) => (category ? t.category === category : true))
      .filter((t) => (type ? t.type === type : true))
      .filter((t) => dateInRange(t.date, fromDate, toDate))

    const sorted = [...list].sort((a, b) => {
      if (sortBy === 'amount') return Number(b.amount) - Number(a.amount)
      if (sortBy === 'category') return String(a.category).localeCompare(String(b.category))
      // date
      return parseISO(b.date).getTime() - parseISO(a.date).getTime()
    })

    return sorted
  }, [transactions, debouncedQuery, category, type, fromDate, toDate, sortBy])

  const onDelete = (id) => {
    const ok = window.confirm('Delete this transaction?')
    if (!ok) return
    deleteTransaction(id)
    toast.success('Transaction deleted')
  }

  return (
    <div>
      <h1 className="page-title">Transactions</h1>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="grid" style={{ gap: 14 }}>
          <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />

          <Filters
            category={category}
            onCategoryChange={setCategory}
            type={type}
            onTypeChange={setType}
            fromDate={fromDate}
            onFromDateChange={setFromDate}
            toDate={toDate}
            onToDateChange={setToDate}
            categoryOptions={categoryOptions}
            typeOptions={['', ...typeOptions]}
          />

          <div className="grid grid-2">
            <div className="field">
              <label className="label">Sorting</label>
              <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="category">Category</option>
              </select>
              <div className="help">Sorted automatically as you change filters.</div>
            </div>
            <div className="field">
              <label className="label">Result</label>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 800 }}>{filtered.length} transaction(s)</div>
                <button className="btn primary" type="button" onClick={() => navigate('/transactions/new')}>
                  Add Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="card">
          <div style={{ fontWeight: 800, marginBottom: 6 }}>No transactions yet</div>
          <div className="muted">Add your first income or expense to see analytics.</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div style={{ fontWeight: 800, marginBottom: 6 }}>No matches</div>
          <div className="muted">Try adjusting search, filters, or date range.</div>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <TransactionCard
                  key={t.id}
                  transaction={t}
                  onEdit={(id) => navigate(`/transactions/edit/${id}`)}
                  onDelete={onDelete}
                  formatCurrency={(amt) => formatCurrency(amt, 'INR')}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}


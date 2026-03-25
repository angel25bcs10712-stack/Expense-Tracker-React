import { useContext, useMemo, useState } from 'react'
import { addMonths, endOfMonth, format, isWithinInterval, parseISO, startOfMonth } from 'date-fns'
import Charts from '../components/Charts/Charts'
import useCurrency from '../hooks/useCurrency'
import { FinanceContext } from '../context/FinanceContext'
import { EXPENSE_CATEGORIES } from '../utils/transactionConstants'

function inRange(dateStr, start, end) {
  const d = parseISO(dateStr)
  return isWithinInterval(d, { start, end })
}

export default function Analytics() {
  const ctx = useContext(FinanceContext)
  const { transactions } = ctx
  const { formatCurrency } = useCurrency()

  const [monthKey, setMonthKey] = useState(() => format(new Date(), 'yyyy-MM'))
  const monthDate = useMemo(() => new Date(`${monthKey}-01T00:00:00`), [monthKey])

  const expensesForMonth = useMemo(() => {
    const start = startOfMonth(monthDate)
    const end = endOfMonth(monthDate)
    return transactions
      .filter((t) => t.type === 'expense' && inRange(t.date, start, end))
      .map((t) => ({ ...t, amount: Number(t.amount || 0) }))
  }, [transactions, monthDate])

  const expenseByCategory = useMemo(() => {
    const map = new Map()
    for (const t of expensesForMonth) {
      map.set(t.category, (map.get(t.category) || 0) + t.amount)
    }

    const list = [...map.entries()].map(([category, value]) => ({
      category,
      value,
    }))

    // Show categories in a stable order when equal
    list.sort((a, b) => b.value - a.value)
    return list
  }, [expensesForMonth])

  const spendingTrend = useMemo(() => {
    const baseStart = startOfMonth(monthDate)
    const months = Array.from({ length: 6 }).map((_, i) => addMonths(baseStart, -5 + i))
    return months.map((m) => {
      const s = startOfMonth(m)
      const e = endOfMonth(m)
      const sum = transactions
        .filter((t) => t.type === 'expense' && inRange(t.date, s, e))
        .reduce((acc, t) => acc + Number(t.amount || 0), 0)
      return { month: format(m, 'MMM'), value: sum }
    })
  }, [transactions, monthDate])

  const incomeVsExpense = useMemo(() => {
    const baseStart = startOfMonth(monthDate)
    const months = Array.from({ length: 6 }).map((_, i) => addMonths(baseStart, -5 + i))
    return months.map((m) => {
      const s = startOfMonth(m)
      const e = endOfMonth(m)

      const income = transactions
        .filter((t) => t.type === 'income' && inRange(t.date, s, e))
        .reduce((acc, t) => acc + Number(t.amount || 0), 0)

      const expense = transactions
        .filter((t) => t.type === 'expense' && inRange(t.date, s, e))
        .reduce((acc, t) => acc + Number(t.amount || 0), 0)

      return { month: format(m, 'MMM'), income, expense }
    })
  }, [transactions, monthDate])

  const recurringExpenses = useMemo(() => {
    const start = startOfMonth(monthDate)
    const end = endOfMonth(monthDate)
    return transactions.filter((t) => t.type === 'expense' && t.recurring && inRange(t.date, start, end))
  }, [transactions, monthDate])

  const totalExpenseMonth = useMemo(() => expensesForMonth.reduce((acc, t) => acc + t.amount, 0), [expensesForMonth])

  const categoryBreakdown = useMemo(() => {
    const map = new Map(expenseByCategory.map((d) => [d.category, d.value]))
    const list = EXPENSE_CATEGORIES.map((c) => ({
      category: c,
      value: map.get(c) || 0,
    })).filter((x) => x.value > 0)

    // If no entries match PRD categories (e.g. income inserted), fall back to the computed list.
    return list.length > 0 ? list : expenseByCategory
  }, [expenseByCategory])

  if (transactions.length === 0) {
    return (
      <div>
        <h1 className="page-title">Analytics</h1>
        <div className="card">
          <div style={{ fontWeight: 800, marginBottom: 6 }}>No data yet</div>
          <div className="muted">Add transactions first to see analytics and charts.</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">Analytics</h1>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <div className="muted" style={{ fontSize: 12 }}>
              Detailed insights
            </div>
            <div style={{ fontWeight: 800, marginTop: 4 }}>{format(monthDate, 'MMMM yyyy')}</div>
          </div>

          <div className="field" style={{ minWidth: 180 }}>
            <label className="label">Month</label>
            <input className="input" type="month" value={monthKey} onChange={(e) => setMonthKey(e.target.value)} />
          </div>
        </div>
      </div>

      <Charts
        currency="INR"
        expenseByCategory={expenseByCategory}
        spendingTrend={spendingTrend}
        incomeVsExpense={incomeVsExpense}
        formatValue={(v) => formatCurrency(v, 'INR')}
      />

      <div style={{ height: 14 }} />

      <div className="grid grid-2">
        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <strong>Category Breakdown</strong>
            <span className="muted" style={{ fontSize: 12 }}>
              Total: {formatCurrency(totalExpenseMonth, 'INR')}
            </span>
          </div>
          <div style={{ height: 10 }} />
          {categoryBreakdown.length === 0 ? (
            <div className="muted">No expenses in this month.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {categoryBreakdown.map((c) => {
                  const share = totalExpenseMonth > 0 ? (c.value / totalExpenseMonth) * 100 : 0
                  return (
                    <tr key={c.category}>
                      <td>{c.category}</td>
                      <td style={{ fontWeight: 800 }}>{formatCurrency(c.value, 'INR')}</td>
                      <td>{share.toFixed(1)}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <strong>Recurring Expenses</strong>
            <span className="badge recurring">{recurringExpenses.length} item(s)</span>
          </div>
          <div style={{ height: 10 }} />
          {recurringExpenses.length === 0 ? (
            <div className="muted">No recurring expenses in this month.</div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {recurringExpenses.slice(0, 6).map((t) => (
                <div key={t.id} className="row" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'grid', gap: 4 }}>
                    <div style={{ fontWeight: 800 }}>{t.title}</div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {t.category} • {t.date}
                    </div>
                  </div>
                  <div style={{ fontWeight: 900, color: '#fca5a5' }}>{formatCurrency(t.amount, 'INR')}</div>
                </div>
              ))}
              {recurringExpenses.length > 6 ? (
                <div className="help">Showing top 6 recurring items.</div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


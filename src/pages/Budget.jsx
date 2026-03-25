import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import BudgetCard from '../components/BudgetCard'
import useBudget from '../hooks/useBudget'
import useCurrency from '../hooks/useCurrency'

export default function Budget() {
  const { budget, setMonthlyBudget, calculateForMonth } = useBudget()
  const { formatCurrency } = useCurrency()

  const [monthKey, setMonthKey] = useState(() => format(new Date(), 'yyyy-MM'))
  const monthDate = useMemo(() => new Date(`${monthKey}-01T00:00:00`), [monthKey])

  const [inputBudget, setInputBudget] = useState(Number(budget.monthlyBudget || 0))

  const { monthlyBudget, totalSpending, remainingBudget, percentUsed } = calculateForMonth(monthDate)

  const onSave = () => {
    setMonthlyBudget(inputBudget)
    toast.success('Budget updated')
  }

  return (
    <div>
      <h1 className="page-title">Budget</h1>

      <div className="two-col">
        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="muted" style={{ fontSize: 12 }}>
                Set monthly budget (used for the selected month)
              </div>
              <div style={{ fontWeight: 800, marginTop: 4 }}>{format(monthDate, 'MMMM yyyy')}</div>
            </div>

            <div className="field" style={{ minWidth: 180 }}>
              <label className="label">Month</label>
              <input className="input" type="month" value={monthKey} onChange={(e) => setMonthKey(e.target.value)} />
            </div>
          </div>

          <div style={{ height: 14 }} />

          <div className="field">
            <label className="label">Monthly Budget (INR)</label>
            <input
              className="input"
              type="number"
              step="0.01"
              value={inputBudget}
              onChange={(e) => setInputBudget(e.target.value)}
            />
            <div className="help">Example: ₹50,000</div>
          </div>

          <div style={{ height: 12 }} />

          <div className="row" style={{ justifyContent: 'space-between' }}>
            <button
              className="btn"
              type="button"
              onClick={() => {
                setInputBudget(Number(budget.monthlyBudget || 0))
              }}
            >
              Reset
            </button>
            <button className="btn primary" type="button" onClick={onSave}>
              Save Budget
            </button>
          </div>
        </div>

        <BudgetCard
          monthlyBudget={monthlyBudget}
          totalSpending={totalSpending}
          remainingBudget={remainingBudget}
          percentUsed={percentUsed}
          formatCurrency={(amt) => formatCurrency(amt, 'INR')}
        />
      </div>
    </div>
  )
}


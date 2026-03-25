import { useContext, useEffect, useMemo, useState } from 'react'
import { addMonths, endOfMonth, format, isWithinInterval, parseISO, startOfMonth } from 'date-fns'
import { toast } from 'react-toastify'
import Charts from '../components/Charts/Charts'
import BudgetCard from '../components/BudgetCard'
import { getExchangeRate } from '../services/api'
import useBudget from '../hooks/useBudget'
import useCurrency from '../hooks/useCurrency'
import { FinanceContext } from '../context/FinanceContext'
import { motion } from 'framer-motion'

const CURRENCIES = [
  { code: 'INR', label: 'INR' },
  { code: 'USD', label: 'USD' },
  { code: 'EUR', label: 'EUR' },
  { code: 'GBP', label: 'GBP' },
]

function inRange(dateStr, start, end) {
  const d = parseISO(dateStr)
  return isWithinInterval(d, { start, end })
}

export default function Dashboard() {
  const ctx = useContext(FinanceContext)
  const { transactions } = ctx
  const { calculateForMonth } = useBudget()
  const { formatCurrency } = useCurrency()

  const MotionDiv = motion.div

  const [monthKey, setMonthKey] = useState(() => format(new Date(), 'yyyy-MM'))
  const monthDate = useMemo(() => new Date(`${monthKey}-01T00:00:00`), [monthKey])

  const [currencyTo, setCurrencyTo] = useState('INR')
  const [exchangeRate, setExchangeRate] = useState(1)
  const [rateLoading, setRateLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function loadRate() {
      if (currencyTo === 'INR') {
        setExchangeRate(1)
        return
      }

      setRateLoading(true)
      try {
        const rate = await getExchangeRate('INR', currencyTo)
        if (cancelled) return
        setExchangeRate(rate)
      } catch {
        if (cancelled) return
        setExchangeRate(1)
        toast.error('Currency conversion unavailable (showing INR values).')
      } finally {
        if (!cancelled) setRateLoading(false)
      }
    }

    loadRate()
    return () => {
      cancelled = true
    }
  }, [currencyTo])

  const computed = useMemo(() => {
    const start = startOfMonth(monthDate)
    const end = endOfMonth(monthDate)

    const expenseByCategoryMap = new Map()
    let totalExpensesINR = 0
    let totalIncomeINR = 0

    for (const t of transactions) {
      if (!inRange(t.date, start, end)) continue
      const amount = Number(t.amount || 0)
      if (t.type === 'expense') {
        totalExpensesINR += amount
        expenseByCategoryMap.set(t.category, (expenseByCategoryMap.get(t.category) || 0) + amount)
      } else {
        totalIncomeINR += amount
      }
    }

    const expenseByCategory = [...expenseByCategoryMap.entries()]
      .map(([category, value]) => ({
        category,
        value: value * exchangeRate,
      }))
      .sort((a, b) => b.value - a.value)

    const recurringCount = transactions.filter(
      (t) => t.type === 'expense' && t.recurring && inRange(t.date, start, end)
    ).length

    return {
      expenseByCategory,
      recurringCount,
      totalExpenses: totalExpensesINR * exchangeRate,
      totalIncome: totalIncomeINR * exchangeRate,
      netBalance: (totalIncomeINR - totalExpensesINR) * exchangeRate,
    }
  }, [transactions, monthDate, exchangeRate])

  const { monthlyBudget, totalSpending, remainingBudget, percentUsed, totalIncome, totalExpenses, netBalance } =
    calculateForMonth(monthDate)

  const dashboardMonthBudget = Number(monthlyBudget) * exchangeRate
  const dashboardTotalSpending = Number(totalSpending) * exchangeRate
  const dashboardRemaining = Number(remainingBudget) * exchangeRate
  const dashboardPercentUsed = percentUsed
  const topCategory = computed.expenseByCategory[0]?.category || 'N/A'

  const spendingTrend = useMemo(() => {
    const baseStart = startOfMonth(monthDate)
    const months = Array.from({ length: 6 }).map((_, i) => addMonths(baseStart, -5 + i))

    return months.map((m) => {
      const s = startOfMonth(m)
      const e = endOfMonth(m)
      const sum = transactions
        .filter((t) => t.type === 'expense' && inRange(t.date, s, e))
        .reduce((acc, t) => acc + Number(t.amount || 0), 0)
      return { month: format(m, 'MMM'), value: sum * exchangeRate }
    })
  }, [transactions, monthDate, exchangeRate])

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

      return {
        month: format(m, 'MMM'),
        income: income * exchangeRate,
        expense: expense * exchangeRate,
      }
    })
  }, [transactions, monthDate, exchangeRate])

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>

      <div className="two-col" style={{ marginBottom: 14 }}>
        <MotionDiv
          className="card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="muted" style={{ fontSize: 12 }}>
                Month
              </div>
              <div style={{ fontWeight: 800, marginTop: 4 }}>{format(monthDate, 'MMMM yyyy')}</div>
            </div>

            <div className="row">
              <div className="field" style={{ minWidth: 160 }}>
                <label className="label">Select Month</label>
                <input className="input" type="month" value={monthKey} onChange={(e) => setMonthKey(e.target.value)} />
              </div>
              <div className="field" style={{ minWidth: 140 }}>
                <label className="label">Currency</label>
                <select className="select" value={currencyTo} onChange={(e) => setCurrencyTo(e.target.value)}>
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {rateLoading && currencyTo !== 'INR' ? (
            <div className="help" style={{ marginTop: 10 }}>
              Loading exchange rate...
            </div>
          ) : null}

          <div style={{ height: 12 }} />

          <div className="grid grid-3">
            <div className="kpi">
              <div className="cap">Total Income</div>
              <div className="value">{formatCurrency(totalIncome * exchangeRate, currencyTo)}</div>
            </div>
            <div className="kpi">
              <div className="cap">Total Expenses</div>
              <div className="value">{formatCurrency(totalExpenses * exchangeRate, currencyTo)}</div>
            </div>
            <div className="kpi">
              <div className="cap">Net Balance</div>
              <div className="value">{formatCurrency(netBalance * exchangeRate, currencyTo)}</div>
            </div>
          </div>

          <div style={{ height: 12 }} />

          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="muted" style={{ fontSize: 12 }}>
                Top Spending Category
              </div>
              <div style={{ fontWeight: 800, marginTop: 4 }}>{topCategory}</div>
            </div>
            <div className="badge recurring">
              {computed.recurringCount} recurring expense(s)
            </div>
          </div>

          <div style={{ height: 14 }} />

          <Charts
            currency={currencyTo}
            expenseByCategory={computed.expenseByCategory}
            spendingTrend={spendingTrend}
            incomeVsExpense={incomeVsExpense}
            formatValue={(v) => formatCurrency(v, currencyTo)}
          />
        </MotionDiv>

        <div className="card soft" style={{ alignSelf: 'start' }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <strong>Budget Tracking</strong>
            <span className="muted" style={{ fontSize: 12 }}>
              {format(monthDate, 'MMM yyyy')}
            </span>
          </div>
          <div style={{ height: 10 }} />
          <BudgetCard
            monthlyBudget={dashboardMonthBudget}
            totalSpending={dashboardTotalSpending}
            remainingBudget={dashboardRemaining}
            percentUsed={dashboardPercentUsed}
            formatCurrency={(amt) => formatCurrency(amt, currencyTo)}
          />
        </div>
      </div>
    </div>
  )
}


import { endOfMonth, isWithinInterval, parseISO, startOfMonth } from 'date-fns'
import { useContext } from 'react'
import { FinanceContext } from '../context/FinanceContext'

export default function useBudget() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useBudget must be used within FinanceProvider')
  const { transactions, budget, setMonthlyBudget } = ctx

  const calculateForMonth = (monthDate = new Date()) => {
    const start = startOfMonth(monthDate)
    const end = endOfMonth(monthDate)

    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .filter((t) => {
        const d = parseISO(t.date)
        return isWithinInterval(d, { start, end })
      })
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)

    const income = transactions
      .filter((t) => t.type === 'income')
      .filter((t) => {
        const d = parseISO(t.date)
        return isWithinInterval(d, { start, end })
      })
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)

    const monthlyBudget = Number(budget.monthlyBudget || 0)
    const remaining = monthlyBudget - expenses
    const percentUsed = monthlyBudget > 0 ? (expenses / monthlyBudget) * 100 : 0

    return {
      monthlyBudget,
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses,
      totalSpending: expenses,
      remainingBudget: remaining,
      percentUsed,
      start,
      end,
    }
  }

  return {
    budget,
    setMonthlyBudget,
    calculateForMonth,
  }
}


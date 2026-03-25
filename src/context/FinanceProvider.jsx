import { useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { FinanceContext } from './FinanceContext'

const STORAGE = {
  transactions: 'expense_tracker_transactions_v1',
  budget: 'expense_tracker_budget_v1',
}

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const storedTx = safeParse(localStorage.getItem(STORAGE.transactions), null)
    return Array.isArray(storedTx) ? storedTx : []
  })

  const [budget, setBudget] = useState(() => {
    const storedBudget = safeParse(localStorage.getItem(STORAGE.budget), null)
    if (storedBudget && typeof storedBudget.monthlyBudget === 'number') {
      return { monthlyBudget: storedBudget.monthlyBudget }
    }
    return { monthlyBudget: 0 }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE.transactions, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem(STORAGE.budget, JSON.stringify(budget))
  }, [budget])

  const addTransaction = (tx) => {
    const next = {
      id: tx.id || uuidv4(),
      title: tx.title,
      amount: Number(tx.amount),
      category: tx.category,
      type: tx.type,
      date: tx.date,
      notes: tx.notes || '',
      recurring: Boolean(tx.recurring),
    }
    setTransactions((prev) => [next, ...prev])
    return next
  }

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const updateTransaction = (id, patch) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        return {
          ...t,
          ...patch,
          amount: patch.amount !== undefined ? Number(patch.amount) : t.amount,
          recurring: patch.recurring !== undefined ? Boolean(patch.recurring) : t.recurring,
        }
      })
    )
  }

  const value = useMemo(
    () => ({
      transactions,
      budget,
      setMonthlyBudget: (monthlyBudget) => setBudget({ monthlyBudget: Number(monthlyBudget) || 0 }),
      addTransaction,
      deleteTransaction,
      updateTransaction,
    }),
    [transactions, budget]
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}


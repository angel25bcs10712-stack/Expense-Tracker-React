import { useContext } from 'react'
import { FinanceContext } from '../context/FinanceContext'

export default function useTransactions() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useTransactions must be used within FinanceProvider')
  const { transactions, addTransaction, deleteTransaction, updateTransaction } = ctx

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  }
}


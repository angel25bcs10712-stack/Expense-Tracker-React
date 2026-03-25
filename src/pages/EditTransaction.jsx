import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { format } from 'date-fns'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import useTransactions from '../hooks/useTransactions'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, TRANSACTION_TYPES } from '../utils/transactionConstants'

const schema = yup.object({
  title: yup.string().trim().required('Title is required').min(2, 'Title must be at least 2 characters'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be greater than 0')
    .required('Amount is required'),
  category: yup.string().trim().required('Category is required'),
  date: yup
    .string()
    .required('Date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  type: yup.mixed().oneOf(TRANSACTION_TYPES).required('Transaction type is required'),
  notes: yup.string().optional().max(300, 'Notes are too long'),
  recurring: yup.boolean().required(),
})

export default function EditTransaction() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { transactions, updateTransaction } = useTransactions()

  const existing = useMemo(() => transactions.find((t) => t.id === id), [transactions, id])
  const defaultDate = useMemo(() => format(new Date(), 'yyyy-MM-dd'), [])

  const [selectedType, setSelectedType] = useState(() => existing?.type || 'expense')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: existing?.title || '',
      amount: existing?.amount || '',
      category: existing?.category || '',
      date: existing?.date || defaultDate,
      type: existing?.type || 'expense',
      notes: existing?.notes || '',
      recurring: Boolean(existing?.recurring),
    },
  })

  useEffect(() => {
    if (!existing) return
    reset({
      title: existing.title,
      amount: existing.amount,
      category: existing.category,
      date: existing.date,
      type: existing.type,
      notes: existing.notes || '',
      recurring: Boolean(existing.recurring),
    })
  }, [existing, reset])

  const categories = selectedType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  if (!existing) {
    return (
      <div>
        <h1 className="page-title">Edit Transaction</h1>
        <div className="card">
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Transaction not found</div>
          <div className="muted">The transaction may have been deleted.</div>
          <div style={{ height: 12 }} />
          <button className="btn primary" onClick={() => navigate('/transactions')} type="button">
            Back to Transactions
          </button>
        </div>
      </div>
    )
  }

  const onSubmit = (values) => {
    updateTransaction(id, {
      title: values.title.trim(),
      amount: values.amount,
      category: values.category,
      type: values.type,
      date: values.date,
      notes: values.notes || '',
      recurring: values.type === 'expense' ? Boolean(values.recurring) : false,
    })
    toast.success('Transaction updated')
    navigate('/transactions')
  }

  return (
    <div>
      <h1 className="page-title">Edit Transaction</h1>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="grid" style={{ gap: 14 }}>
          <div className="grid grid-2">
            <div className="field">
              <label className="label">Title</label>
              <input className="input" placeholder="e.g. Netflix, Salary" {...register('title')} />
              {errors.title ? <div className="error">{errors.title.message}</div> : null}
            </div>

            <div className="field">
              <label className="label">Amount</label>
              <input
                className="input"
                type="number"
                step="0.01"
                placeholder="e.g. 499"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount ? <div className="error">{errors.amount.message}</div> : null}
            </div>
          </div>

          <div className="grid grid-2">
            <div className="field">
              <label className="label">Transaction Type</label>
              <select
                className="select"
                value={selectedType}
                onChange={(e) => {
                  const next = e.target.value
                  setValue('type', next)
                  setSelectedType(next)
                  setValue('category', '')
                  setValue('recurring', false)
                }}
              >
                {TRANSACTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.type ? <div className="error">{errors.type.message}</div> : null}
            </div>

            <div className="field">
              <label className="label">Date</label>
              <input className="input" type="date" {...register('date')} />
              {errors.date ? <div className="error">{errors.date.message}</div> : null}
            </div>
          </div>

          <div className="grid grid-2">
            <div className="field">
              <label className="label">Category</label>
              <select className="select" {...register('category')}>
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category ? <div className="error">{errors.category.message}</div> : null}
            </div>

            <div className="field">
              <label className="label">Recurring</label>
              {selectedType === 'expense' ? (
                <div className="row" style={{ alignItems: 'center' }}>
                  <input
                    id="recurring"
                    type="checkbox"
                    {...register('recurring')}
                    style={{ width: 18, height: 18 }}
                  />
                  <label htmlFor="recurring" className="muted" style={{ margin: 0 }}>
                    Mark this expense as recurring
                  </label>
                </div>
              ) : (
                <div className="muted">Not applicable for income.</div>
              )}
            </div>
          </div>

          <div className="field">
            <label className="label">Notes</label>
            <textarea className="textarea" placeholder="Optional notes..." {...register('notes')} />
            {errors.notes ? <div className="error">{errors.notes.message}</div> : null}
          </div>

          <div className="row" style={{ justifyContent: 'space-between' }}>
            <button className="btn" type="button" onClick={() => navigate('/transactions')}>
              Cancel
            </button>
            <button className="btn primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


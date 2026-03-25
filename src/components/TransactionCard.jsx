import { FaEdit, FaRegTrashAlt, FaSyncAlt } from 'react-icons/fa'

export default function TransactionCard({ transaction, onEdit, onDelete, formatCurrency }) {
  const amount = Number(transaction.amount || 0)

  return (
    <tr>
      <td>
        <div style={{ display: 'grid', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <strong>{transaction.title}</strong>
            {transaction.type === 'expense' && transaction.recurring ? (
              <span className="badge recurring">
                <FaSyncAlt size={12} />
                Recurring
              </span>
            ) : null}
          </div>
          <span className="muted">{transaction.category}</span>
        </div>
      </td>
      <td>
        <span style={{ color: transaction.type === 'income' ? '#86efac' : '#fca5a5', fontWeight: 800 }}>
          {formatCurrency(amount)}
        </span>
      </td>
      <td>{transaction.date}</td>
      <td>{transaction.type}</td>
      <td style={{ width: 170 }}>
        <div className="row">
          <button className="btn ghost" onClick={() => onEdit(transaction.id)} type="button">
            <FaEdit /> Edit
          </button>
          <button className="btn danger" onClick={() => onDelete(transaction.id)} type="button">
            <FaRegTrashAlt /> Delete
          </button>
        </div>
      </td>
    </tr>
  )
}


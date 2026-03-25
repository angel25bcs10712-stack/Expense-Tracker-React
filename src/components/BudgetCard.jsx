export default function BudgetCard({ monthlyBudget, totalSpending, remainingBudget, percentUsed, formatCurrency }) {
  const usedStr = Number.isFinite(percentUsed) ? `${percentUsed.toFixed(1)}%` : '0%'

  return (
    <div className="card">
      <div className="kpi">
        <div className="cap">Monthly Budget</div>
        <div className="value">{formatCurrency(monthlyBudget || 0)}</div>
      </div>

      <div style={{ height: 12 }} />

      <div className="grid grid-2">
        <div className="kpi">
          <div className="cap">Total Spending</div>
          <div className="value" style={{ fontSize: 18 }}>
            {formatCurrency(totalSpending || 0)}
          </div>
        </div>
        <div className="kpi">
          <div className="cap">Remaining</div>
          <div className="value" style={{ fontSize: 18 }}>
            {formatCurrency(remainingBudget || 0)}
          </div>
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div className="muted">Budget Used</div>
        <div style={{ fontWeight: 800 }}>{usedStr}</div>
      </div>

      <div style={{ height: 10 }} />

      <div style={{ height: 10, borderRadius: 999, border: '1px solid rgba(15, 23, 42, 0.08)', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${Math.max(0, Math.min(100, percentUsed || 0))}%`,
            background:
              percentUsed > 100
                ? 'rgba(239,68,68,0.6)'
                : 'linear-gradient(90deg, rgba(124,58,237,0.9), rgba(34,197,94,0.9))',
          }}
        />
      </div>
    </div>
  )
}


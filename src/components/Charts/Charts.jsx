import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts'

const PIE_COLORS = [
  'rgba(124,58,237,0.9)',
  'rgba(34,197,94,0.9)',
  'rgba(59,130,246,0.9)',
  'rgba(245,158,11,0.9)',
  'rgba(244,63,94,0.9)',
  'rgba(168,85,247,0.9)',
  'rgba(20,184,166,0.9)',
]

function LightTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.98)',
        border: '1px solid rgba(15,23,42,0.12)',
        boxShadow: '0 10px 20px rgba(2,6,23,0.08)',
        padding: 10,
        color: '#0f172a',
        borderRadius: 10,
      }}
    >
      {label ? <div style={{ fontWeight: 800, marginBottom: 6 }}>{label}</div> : null}
      {payload.map((p) => (
        <div key={p.dataKey} style={{ fontSize: 13 }}>
          <span style={{ opacity: 0.85 }}>{p.name ? `${p.name}: ` : ''}</span>
          <span style={{ fontWeight: 800, color: '#0f172a' }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function Charts({
  expenseByCategory,
  spendingTrend,
  incomeVsExpense,
  formatValue,
  currency,
}) {
  const pieData = expenseByCategory?.map((d) => ({
    name: d.category,
    value: d.value,
  }))

  const trendData = spendingTrend?.map((d) => ({
    month: d.month,
    value: d.value,
  }))

  const barData = incomeVsExpense?.map((d) => ({
    month: d.month,
    income: d.income,
    expense: d.expense,
  }))

  return (
    <div className="grid grid-3">
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <strong>Spending by Category</strong>
          <span className="muted">{currency}</span>
        </div>
        <div style={{ height: 280, marginTop: 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData || []}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                labelLine={false}
                label={(entry) => (entry.value ? '' : '')}
              >
                {(pieData || []).map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={<LightTooltip />}
                formatter={(v) => formatValue(v)}
                labelFormatter={(l) => l}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <strong>Monthly Spending Trend</strong>
        <div style={{ height: 280, marginTop: 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData || []}>
              <CartesianGrid stroke="rgba(15,23,42,0.08)" />
              <XAxis dataKey="month" stroke="rgba(15,23,42,0.5)" />
              <YAxis stroke="rgba(15,23,42,0.5)" tickFormatter={(v) => formatValue(v)} />
              <Tooltip content={<LightTooltip />} formatter={(v) => formatValue(v)} />
              <Line type="monotone" dataKey="value" stroke="rgba(124,58,237,0.95)" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <strong>Income vs Expense</strong>
          <span className="muted">{currency}</span>
        </div>
        <div style={{ height: 280, marginTop: 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData || []}>
              <CartesianGrid stroke="rgba(15,23,42,0.08)" />
              <XAxis dataKey="month" stroke="rgba(15,23,42,0.5)" />
              <YAxis stroke="rgba(15,23,42,0.5)" tickFormatter={(v) => formatValue(v)} />
              <Tooltip content={<LightTooltip />} formatter={(v) => formatValue(v)} />
              <Legend wrapperStyle={{ color: '#334155' }} iconType="circle" />
              <Bar dataKey="income" name="Income" fill="rgba(34,197,94,0.9)" radius={[10, 10, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="rgba(239,68,68,0.85)" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}


export default function Filters({
  category,
  onCategoryChange,
  type,
  onTypeChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  categoryOptions,
  typeOptions,
}) {
  return (
    <div className="grid grid-2">
      <div className="field">
        <label className="label">Category</label>
        <select className="select" value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c || 'All'}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="label">Type</label>
        <select className="select" value={type} onChange={(e) => onTypeChange(e.target.value)}>
          {typeOptions.map((t) => (
            <option key={t} value={t}>
              {t || 'All'}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="label">From</label>
        <input className="input" type="date" value={fromDate} onChange={(e) => onFromDateChange(e.target.value)} />
      </div>

      <div className="field">
        <label className="label">To</label>
        <input className="input" type="date" value={toDate} onChange={(e) => onToDateChange(e.target.value)} />
      </div>
    </div>
  )
}


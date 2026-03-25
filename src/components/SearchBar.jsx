export default function SearchBar({ query, onQueryChange }) {
  return (
    <div className="field">
      <label className="label">Search (title / notes)</label>
      <input
        className="input"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="e.g. netflix, dinner, salary..."
      />
    </div>
  )
}


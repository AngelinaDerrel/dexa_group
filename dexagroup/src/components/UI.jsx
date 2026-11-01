export function Button({ children, variant = 'primary', loading = false, ...props }) {
  return <button className={`button button-${variant}`} disabled={loading || props.disabled} {...props}>{loading && <span className="spinner" />} {loading ? 'Memproses...' : children}</button>
}
export function InputField({ label, error, ...props }) {
  return <div className="field"><label htmlFor={props.id}>{label}</label><input {...props} />{error && <span className="field-error">{error}</span>}</div>
}
export function Card({ children, className = '' }) { return <section className={`card ${className}`}>{children}</section> }
export function LoadingSpinner() { return <span className="spinner" aria-label="Memuat" /> }
export function EmptyState({ title = 'Belum ada data', children }) { return <div className="empty-state"><strong>{title}</strong>{children}</div> }
export function StatusBadge({ children, status = 'neutral' }) { return <span className={`status-badge status-${status}`}>{children}</span> }
export function Modal({ title, children, onClose }) {
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="modal" role="dialog" aria-modal="true"><div className="modal-header"><h2>{title}</h2><button className="modal-close" onClick={onClose} aria-label="Tutup">×</button></div>{children}</div></div>
}
export function DataTable({ columns, rows, emptyTitle }) {
  if (!rows.length) return <EmptyState title={emptyTitle} />
  return <div className="table-wrap"><table className="data-table"><thead><tr>{columns.map((col) => <th key={col.key}>{col.label}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.id}>{columns.map((col) => <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>)}</tr>)}</tbody></table></div>
}

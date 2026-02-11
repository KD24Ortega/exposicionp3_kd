import { formatMoney } from '../utils/money.js'

export default function ExpenseList({ items, onRemove, onEdit, editingId, moneyConfig }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
          <h2 className="h5 card-title mb-0">Movimientos</h2>
          <span className="badge text-bg-light">{items.length} items</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card-body">
          <p className="text-body-secondary mb-0">No hay datos.</p>
        </div>
      ) : (
        <ul className="list-group list-group-flush">
          {items.map(it => (
            <li
              key={it.id}
              className={
                'list-group-item ' +
                (editingId && it.id === editingId ? 'list-group-item-warning' : '')
              }
            >
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className={"badge " + (it.type === 'INCOME' ? 'text-bg-success' : 'text-bg-danger')}>
                      {it.type === 'INCOME' ? 'Ingreso' : 'Gasto'}
                    </span>
                    <span className="fw-semibold">{it.category}</span>
                  </div>

                  {it.note ? <div className="text-body-secondary mt-1">{it.note}</div> : null}
                  <small className="text-body-secondary">{new Date(it.date).toLocaleString()}</small>
                </div>

                <div className="text-end" style={{ minWidth: 140 }}>
                  <div className="fw-semibold">
                    {formatMoney(it.amount, moneyConfig)}
                  </div>
                  <div className="d-flex justify-content-end gap-2 mt-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => onEdit?.(it)}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={()=>onRemove(it.id)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

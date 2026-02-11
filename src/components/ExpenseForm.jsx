import { useEffect, useMemo, useRef, useState } from 'react'

export default function ExpenseForm({ onAdd, editingItem, onUpdate, onCancelEdit, focusSignal, prefillType }) {
  const initial = useMemo(() => {
    return {
      type: editingItem?.type ?? (prefillType === 'INCOME' || prefillType === 'EXPENSE' ? prefillType : 'EXPENSE'),
      amount: editingItem ? String(editingItem.amount ?? '') : '',
      category: editingItem?.category ?? 'General',
      note: editingItem?.note ?? ''
    }
  }, [editingItem, prefillType])

  const [type, setType] = useState(() => initial.type)
  const [amount, setAmount] = useState(() => initial.amount)
  const [category, setCategory] = useState(() => initial.category)
  const [note, setNote] = useState(() => initial.note)

  const amountRef = useRef(null)

  useEffect(() => {
    // External side-effect only: focus the input when opening via shortcut.
    if (typeof focusSignal === 'number' && !editingItem) {
      requestAnimationFrame(() => amountRef.current?.focus())
    }
  }, [focusSignal, prefillType, editingItem])

  function submit(e) {
    e.preventDefault()
    const value = Number(amount)
    if (!value || value <= 0) return

    const payload = {
      type,
      amount: value,
      category: category.trim() || 'General',
      note: note.trim()
    }

    if (editingItem) {
      onUpdate?.(payload)
    } else {
      onAdd({
        ...payload,
        date: new Date().toISOString()
      })
    }

    setAmount('')
    setNote('')
  }

  return (
    <form onSubmit={submit} className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap">
          <h2 className="h5 card-title mb-0">{editingItem ? 'Editar movimiento' : 'Registrar'}</h2>
          {editingItem ? (
            <span className="badge text-bg-warning">Editando</span>
          ) : null}
        </div>

        <div className="row g-2">
          <div className="col-12 col-md-3">
            <label className="form-label" htmlFor="type">Tipo</label>
            <select id="type" value={type} onChange={e=>setType(e.target.value)} className="form-select">
              <option value="INCOME">Ingreso</option>
              <option value="EXPENSE">Gasto</option>
            </select>
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label" htmlFor="amount">Monto</label>
            <input
              id="amount"
              ref={amountRef}
              value={amount}
              onChange={e=>setAmount(e.target.value)}
              type="number"
              min="0"
              step="0.01"
              placeholder="10.00"
              autoFocus
              className="form-control"
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label" htmlFor="category">Categoría</label>
            <input
              id="category"
              value={category}
              onChange={e=>setCategory(e.target.value)}
              placeholder="Transporte"
              className="form-control"
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label" htmlFor="note">Nota</label>
            <input
              id="note"
              value={note}
              onChange={e=>setNote(e.target.value)}
              placeholder="Bus, comida, etc."
              className="form-control"
            />
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button type="submit" className="btn btn-primary">
            {editingItem ? 'Actualizar' : 'Guardar'}
          </button>

          {editingItem ? (
            <button type="button" className="btn btn-outline-secondary" onClick={onCancelEdit}>
              Cancelar
            </button>
          ) : null}
        </div>
      </div>
    </form>
  )
}

export default function Filters({
  type,
  setType,
  q,
  setQ,
  datePreset,
  setDatePreset,
  fromDate,
  setFromDate,
  toDate,
  setToDate
}) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-3">
            <label className="form-label" htmlFor="filterType">Tipo</label>
            <select id="filterType" value={type} onChange={e=>setType(e.target.value)} className="form-select">
              <option value="ALL">Todos</option>
              <option value="INCOME">Ingresos</option>
              <option value="EXPENSE">Gastos</option>
            </select>
          </div>

          <div className="col-12 col-md-5">
            <label className="form-label" htmlFor="filterQ">Buscar</label>
            <input
              id="filterQ"
              value={q}
              onChange={e=>setQ(e.target.value)}
              placeholder="Buscar por categoría o nota"
              className="form-control"
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="filterDatePreset">Fecha</label>
            <select
              id="filterDatePreset"
              value={datePreset}
              onChange={e => setDatePreset(e.target.value)}
              className="form-select"
            >
              <option value="TODAY">Hoy</option>
              <option value="WEEK">Esta semana</option>
              <option value="MONTH">Este mes</option>
              <option value="CUSTOM">Personalizado</option>
            </select>
          </div>
        </div>

        {datePreset === 'CUSTOM' ? (
          <div className="row g-2 mt-1">
            <div className="col-12 col-md-3">
              <label className="form-label" htmlFor="filterFrom">Desde</label>
              <input
                id="filterFrom"
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label" htmlFor="filterTo">Hasta</label>
              <input
                id="filterTo"
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="col-12 col-md-6 d-flex align-items-end">
              <div className="text-body-secondary small">
                El listado se actualiza automáticamente al cambiar el rango.
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

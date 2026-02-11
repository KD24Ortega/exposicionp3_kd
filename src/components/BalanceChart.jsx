import { formatMoney } from '../utils/money.js'

export default function BalanceChart({ items, moneyConfig, maxBars = 14 }) {
  const series = buildDailyBalance(items)

  const visible = series.slice(-maxBars)
  const maxAbs = visible.reduce((m, d) => Math.max(m, Math.abs(d.value)), 0)

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
          <h2 className="h5 card-title mb-0">Balance por día</h2>
          <span className="badge text-bg-light">últimos {visible.length}</span>
        </div>

        {visible.length === 0 ? (
          <p className="text-body-secondary mb-0 mt-2">No hay datos para graficar.</p>
        ) : (
          <div className="mt-3">
            <div className="overflow-auto" aria-label="Gráfico de balance por día">
              <div style={{ minWidth: visible.length * 44 }}>
                <div className="position-relative" style={{ height: 160, paddingBottom: 26 }}>
                  <div
                    className="position-absolute start-0 end-0"
                    style={{ top: '50%', height: 1, background: 'var(--bs-border-color)' }}
                  />

                  <div className="h-100 d-flex align-items-stretch gap-2">
                    {visible.map(d => {
                      const h = maxAbs === 0 ? 0 : Math.round((Math.abs(d.value) / maxAbs) * 70)
                      const isPos = d.value >= 0

                      return (
                        <div key={d.day} className="position-relative" style={{ width: 42 }}>
                          <span
                            className="badge text-bg-light border position-absolute start-50 translate-middle-x"
                            style={{ bottom: 6, zIndex: 3 }}
                            title={d.day}
                          >
                            {formatDayLabel(d.day)}
                          </span>

                          <div
                            className={
                              'position-absolute start-50 translate-middle-x rounded ' +
                              (isPos ? 'bg-success' : 'bg-danger')
                            }
                            style={
                              isPos
                                ? { bottom: '50%', width: 14, height: `${h}%` }
                                : { top: '50%', width: 14, height: `${h}%` }
                            }
                            title={`${d.day}: ${formatMoney(d.value, moneyConfig)}`}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-3 flex-wrap mt-2 small text-body-secondary">
              <span className="d-inline-flex align-items-center gap-1">
                <span className="rounded" style={{ width: 10, height: 10, background: 'var(--bs-success)' }} />
                ingreso neto
              </span>
              <span className="d-inline-flex align-items-center gap-1">
                <span className="rounded" style={{ width: 10, height: 10, background: 'var(--bs-danger)' }} />
                gasto neto
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function buildDailyBalance(items) {
  const map = new Map()

  for (const it of items) {
    const day = toLocalDayKey(it.date)
    const signed = it.type === 'INCOME' ? it.amount : -it.amount
    map.set(day, (map.get(day) ?? 0) + signed)
  }

  return [...map.entries()]
    .map(([day, value]) => ({ day, value }))
    .sort((a, b) => a.day.localeCompare(b.day))
}

function toLocalDayKey(isoDate) {
  const d = new Date(isoDate)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDayLabel(dayKey) {
  // dayKey: YYYY-MM-DD -> dd/mm
  const mm = dayKey.slice(5, 7)
  const dd = dayKey.slice(8, 10)
  return `${dd}/${mm}`
}

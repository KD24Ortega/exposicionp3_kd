import { useEffect, useMemo, useState } from 'react'
import PwaUpdater from './components/PwaUpdater.jsx'
import ExpenseForm from './components/ExpenseForm.jsx'
import ExpenseList from './components/ExpenseList.jsx'
import Summary from './components/Summary.jsx'
import Filters from './components/Filters.jsx'
import BalanceChart from './components/BalanceChart.jsx'
import { loadItems, saveItems } from './utils/storage.js'
import { defaultMoneyPref, loadMoneyPref, moneyConfigFromPref, saveMoneyPref } from './utils/money.js'

export default function App() {
  const [items, setItems] = useState(() => loadItems())
  const [type, setType] = useState('ALL') // ALL | INCOME | EXPENSE
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState(null) // item | null
  const [datePreset, setDatePreset] = useState('MONTH') // TODAY | WEEK | MONTH | CUSTOM
  const [fromDate, setFromDate] = useState('') // YYYY-MM-DD
  const [toDate, setToDate] = useState('') // YYYY-MM-DD
  const [moneyPref, setMoneyPref] = useState(() => loadMoneyPref() ?? defaultMoneyPref())
  const [newSignal] = useState(() => (getLaunchAction().action === 'new' ? 1 : 0))
  const [prefillType] = useState(() => getLaunchAction().type) // INCOME | EXPENSE | null
  const [theme, setTheme] = useState(() => {
    try {
      const t = localStorage.getItem('theme_pref_v1')
      return t === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => { saveItems(items) }, [items])
  useEffect(() => { saveMoneyPref(moneyPref) }, [moneyPref])
  useEffect(() => {
    // External side-effect only (no setState): bring the form into view if launched from shortcut.
    if (getLaunchAction().action === 'new') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme)
    try {
      localStorage.setItem('theme_pref_v1', theme)
    } catch {
      // ignore
    }
  }, [theme])

  const moneyConfig = useMemo(() => moneyConfigFromPref(moneyPref), [moneyPref])

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase()
    const range = getDateRangeMs(datePreset, fromDate, toDate)

    return items.filter(it => {
      const byType = type === 'ALL' || it.type === type
      const byQ = !qLower || (it.note + ' ' + it.category).toLowerCase().includes(qLower)

      const t = new Date(it.date).getTime()
      const byDate =
        (range.fromMs == null || t >= range.fromMs) &&
        (range.toMs == null || t <= range.toMs)

      return byType && byQ && byDate
    })
  }, [items, type, q, datePreset, fromDate, toDate])

  function addItem(newItem) {
    setItems(prev => [{ ...newItem, id: crypto.randomUUID() }, ...prev])
  }

  function updateItem(id, patch) {
    setItems(prev => prev.map(it => (it.id === id ? { ...it, ...patch } : it)))
  }

  function removeItem(id) {
    setItems(prev => prev.filter(x => x.id !== id))
    setEditing(prev => (prev?.id === id ? null : prev))
  }

  return (
    <div className="container py-4" style={{ maxWidth: 960 }}>
      <header className="d-flex justify-content-between align-items-start align-items-md-center gap-3 flex-wrap">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div>
            <h1 className="h3 mb-0">GastoZen</h1>
            <div className="text-body-secondary">Sin internet • Instalable • Rápido</div>
          </div>
          <span className={"badge " + (navigator.onLine ? 'text-bg-success' : 'text-bg-secondary')}>
            {navigator.onLine ? 'Online' : 'Offline'}
          </span>

          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="themeSwitch"
              checked={theme === 'dark'}
              onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
            />
            <label className="form-check-label" htmlFor="themeSwitch">
              {theme === 'dark' ? 'Oscuro' : 'Claro'}
            </label>
          </div>

          <select
            className="form-select form-select-sm"
            style={{ width: 'auto' }}
            value={moneyConfig.mode}
            onChange={(e) => setMoneyPref({ mode: e.target.value })}
            aria-label="Moneda"
            title="Moneda"
          >
            <option value="USD_EC">USD (Ecuador)</option>
            <option value="EUR_ES">EUR (España)</option>
          </select>
        </div>

        <div style={{ minWidth: 260 }}>
          <PwaUpdater />
        </div>
      </header>

      <main className="mt-4 d-grid gap-3">
        <ExpenseForm
          key={(editing?.id ?? 'new') + '-' + newSignal}
          onAdd={addItem}
          editingItem={editing}
          focusSignal={newSignal}
          prefillType={prefillType}
          onUpdate={(patch) => {
            if (!editing) return
            updateItem(editing.id, patch)
            setEditing(null)
          }}
          onCancelEdit={() => setEditing(null)}
        />
        <Summary items={items} moneyConfig={moneyConfig} />
        <BalanceChart items={filtered} moneyConfig={moneyConfig} />
        <Filters
          type={type}
          setType={setType}
          q={q}
          setQ={setQ}
          datePreset={datePreset}
          setDatePreset={setDatePreset}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
        />
        <ExpenseList
          items={filtered}
          onRemove={removeItem}
          onEdit={(item) => setEditing(item)}
          editingId={editing?.id ?? null}
          moneyConfig={moneyConfig}
        />
      </main>

      <footer className="mt-4 text-body-secondary">
        <small>Demo rápida: registra un movimiento, recarga y prueba sin internet. Tus datos siguen aquí.</small>
      </footer>
    </div>
  )
}

function getDateRangeMs(preset, fromDate, toDate) {
  const now = new Date()

  if (preset === 'TODAY') {
    const start = startOfDay(now)
    const end = endOfDay(now)
    return { fromMs: start.getTime(), toMs: end.getTime() }
  }

  if (preset === 'WEEK') {
    // Semana iniciando en lunes (convención común en ES).
    const start = startOfDay(now)
    const day = start.getDay() // 0=Dom..6=Sáb
    const deltaToMonday = (day + 6) % 7
    start.setDate(start.getDate() - deltaToMonday)

    const end = endOfDay(new Date(start))
    end.setDate(end.getDate() + 6)
    return { fromMs: start.getTime(), toMs: end.getTime() }
  }

  if (preset === 'MONTH') {
    const start = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1))
    const end = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0))
    return { fromMs: start.getTime(), toMs: end.getTime() }
  }

  // CUSTOM (o cualquier otro): usa inputs si existen.
  const from = fromDate ? startOfDay(parseDateInput(fromDate)) : null
  const to = toDate ? endOfDay(parseDateInput(toDate)) : null

  if (from && to && from.getTime() > to.getTime()) {
    return { fromMs: to.getTime(), toMs: from.getTime() }
  }

  return { fromMs: from ? from.getTime() : null, toMs: to ? to.getTime() : null }
}

function parseDateInput(yyyyMmDd) {
  // Fuerza medianoche local para evitar offset por zona horaria.
  const [y, m, d] = yyyyMmDd.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfDay(date) {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

function getLaunchAction() {
  try {
    const params = new URLSearchParams(window.location.search)
    const action = params.get('action')
    const hashNew = window.location.hash === '#new'
    const type = params.get('type')

    return {
      action: action === 'new' || hashNew ? 'new' : null,
      type: type === 'INCOME' || type === 'EXPENSE' ? type : null
    }
  } catch {
    return { action: null, type: null }
  }
}

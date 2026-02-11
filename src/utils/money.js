const MONEY_KEY = 'money_pref_v1'

export function loadMoneyPref() {
  try {
    const raw = localStorage.getItem(MONEY_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveMoneyPref(pref) {
  localStorage.setItem(MONEY_KEY, JSON.stringify(pref))
}

export function normalizeMoneyPref(pref) {
  if (!pref || typeof pref !== 'object') return defaultMoneyPref()

  const mode = pref.mode
  if (mode === 'USD_EC' || mode === 'EUR_ES') return { mode }

  return defaultMoneyPref()
}

export function defaultMoneyPref() {
  return { mode: 'USD_EC' }
}

export function moneyConfigFromPref(pref) {
  const p = normalizeMoneyPref(pref)

  if (p.mode === 'EUR_ES') {
    return {
      mode: 'EUR_ES',
      locale: 'es-ES',
      currency: 'EUR',
      label: 'EUR'
    }
  }

  return {
    mode: 'USD_EC',
    locale: 'es-EC',
    currency: 'USD',
    label: 'USD'
  }
}

export function formatMoney(amount, moneyConfig) {
  const n = Number(amount)
  if (!Number.isFinite(n)) return ''

  const { locale, currency } = moneyConfig ?? moneyConfigFromPref(defaultMoneyPref())
  return n.toLocaleString(locale, { style: 'currency', currency })
}

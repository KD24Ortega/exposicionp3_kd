const KEY = 'gastos_pwa_v1'

export function loadItems() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveItems(items) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

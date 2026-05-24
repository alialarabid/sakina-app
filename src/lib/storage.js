// Tiny namespaced localStorage wrapper. All app state lives here so the
// PWA works fully offline with no backend.
const PREFIX = 'sakina:'

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* storage full or unavailable — non-fatal */
  }
}

// Today's date as a stable key (YYYY-MM-DD, local time) for daily counters.
export function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

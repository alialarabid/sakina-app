import { Coordinates, CalculationMethod, PrayerTimes, Madhab, Prayer } from 'adhan'

// Calculation methods we expose (label shown in Settings).
export const CALC_METHODS = {
  UmmAlQura: 'Umm al-Qura (Makkah)',
  Dubai: 'Dubai / UAE',
  MuslimWorldLeague: 'Muslim World League',
  Egyptian: 'Egyptian',
  Karachi: 'Karachi',
  NorthAmerica: 'North America (ISNA)',
  Kuwait: 'Kuwait',
  Qatar: 'Qatar',
  Singapore: 'Singapore',
  Turkey: 'Turkey',
}

function paramsFor(method, madhhab) {
  const fn = CalculationMethod[method] || CalculationMethod.UmmAlQura
  const p = fn()
  p.madhab = madhhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi
  return p
}

export function computeTimes(coords, method, madhhab, date = new Date()) {
  const c = new Coordinates(coords.lat, coords.lng)
  return new PrayerTimes(c, date, paramsFor(method, madhhab))
}

// The day's entries (Sunrise included but flagged so the UI can de-emphasise it).
const ORDER = [
  ['fajr', 'Fajr', false],
  ['sunrise', 'Sunrise', true],
  ['dhuhr', 'Dhuhr', false],
  ['asr', 'Asr', false],
  ['maghrib', 'Maghrib', false],
  ['isha', 'Isha', false],
]

export function dayList(pt) {
  return ORDER.map(([key, label, minor]) => ({ key, label, minor, time: pt[key] }))
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

// Next upcoming prayer, rolling over to tomorrow's Fajr after Isha.
export function nextPrayer(coords, method, madhhab, now = new Date()) {
  const pt = computeTimes(coords, method, madhhab, now)
  const np = pt.nextPrayer() // 'fajr' | ... | 'none'
  if (np === Prayer.None) {
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    const ptT = computeTimes(coords, method, madhhab, tomorrow)
    return { key: 'fajr', name: 'Fajr', time: ptT.fajr }
  }
  return { key: np, name: cap(np), time: pt.timeForPrayer(np) }
}

// Which prayer is "current" (for highlighting the list).
export function currentPrayerKey(coords, method, madhhab, now = new Date()) {
  const pt = computeTimes(coords, method, madhhab, now)
  const cp = pt.currentPrayer()
  return cp === Prayer.None ? null : cp
}

export function fmtTime(d) {
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function countdown(target, now = new Date()) {
  let ms = target - now
  if (ms < 0) ms = 0
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

// Promise wrapper around the Geolocation API.
export function locate() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('unsupported'))
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 3600000 },
    )
  })
}

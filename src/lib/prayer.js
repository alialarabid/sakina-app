import { Capacitor } from '@capacitor/core'
import { Geolocation } from '@capacitor/geolocation'
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

export function fmtTime(d, lang = 'en') {
  return d.toLocaleTimeString(lang === 'ar' ? 'ar-SA' : [], { hour: 'numeric', minute: '2-digit' })
}

const toArDigits = (s) => s.replace(/\d/g, (c) => '٠١٢٣٤٥٦٧٨٩'[c])
export function countdown(target, now = new Date(), lang = 'en') {
  let ms = target - now
  if (ms < 0) ms = 0
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  if (lang === 'ar') return toArDigits(h > 0 ? `${h} س ${m} د` : `${m} د`)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

// Get the user's rough location once. The Android app uses the native
// location service (the WebView's own geolocation is unreliable there);
// the web uses the browser API. Errors use code 1 for "denied".
export async function locate() {
  if (Capacitor.isNativePlatform()) {
    try {
      let perm = await Geolocation.checkPermissions()
      if (perm.location !== 'granted' && perm.coarseLocation !== 'granted') {
        perm = await Geolocation.requestPermissions({ permissions: ['coarseLocation'] })
      }
      if (perm.location !== 'granted' && perm.coarseLocation !== 'granted') {
        throw Object.assign(new Error('denied'), { code: 1 })
      }
      // Fresh fix first (so travellers get the new city); if the phone
      // can't get one, fall back to its last known position.
      let pos
      try {
        pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 })
      } catch (e) {
        if (/denied/i.test(e?.message || '')) throw e
        pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: false, timeout: 10000, maximumAge: Infinity })
      }
      return { lat: pos.coords.latitude, lng: pos.coords.longitude }
    } catch (e) {
      if (e?.code === 1 || /denied/i.test(e?.message || '')) throw Object.assign(new Error('denied'), { code: 1 })
      throw e
    }
  }
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('unsupported'))
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    )
  })
}

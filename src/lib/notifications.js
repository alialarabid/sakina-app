import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { computeTimes } from './prayer.js'

export const isNative = () => Capacitor.isNativePlatform()

// Prayers we remind for (sunrise excluded).
const PRAYERS = [
  ['fajr', 'Fajr'],
  ['dhuhr', 'Dhuhr'],
  ['asr', 'Asr'],
  ['maghrib', 'Maghrib'],
  ['isha', 'Isha'],
]
const DAYS_AHEAD = 3        // schedule a rolling 3-day window
const DHIKR_ID = 900

// Fire a sample notification ~4s out so the user can confirm reminders work
// without waiting for a prayer time. Returns true if scheduled.
export async function sendTest() {
  if (!isNative()) return false
  try {
    if (!(await ensurePermission())) return false
    await LocalNotifications.schedule({
      notifications: [{
        id: 950,
        title: 'Sakina',
        body: 'Reminders are working, alhamdulillah. 🌙',
        schedule: { at: new Date(Date.now() + 4000) },
      }],
    })
    return true
  } catch {
    return false
  }
}

export async function ensurePermission() {
  if (!isNative()) return false
  const cur = await LocalNotifications.checkPermissions()
  if (cur.display === 'granted') return true
  const req = await LocalNotifications.requestPermissions()
  return req.display === 'granted'
}

// Cancel everything we previously scheduled, then (re)schedule from settings.
export async function reschedule(settings) {
  if (!isNative()) return
  try {
    const pending = await LocalNotifications.getPending()
    if (pending.notifications.length) {
      await LocalNotifications.cancel({
        notifications: pending.notifications.map((n) => ({ id: n.id })),
      })
    }

    const { coords, calcMethod, madhhab, remindPrayers, remindDhikr } = settings
    if (!remindPrayers && !remindDhikr) return
    if (!(await ensurePermission())) return

    const out = []
    const now = new Date()

    if (remindPrayers && coords) {
      for (let d = 0; d < DAYS_AHEAD; d++) {
        const date = new Date(now)
        date.setDate(now.getDate() + d)
        const pt = computeTimes(coords, calcMethod, madhhab, date)
        PRAYERS.forEach(([key, name], i) => {
          const at = pt[key]
          if (at > now) {
            out.push({
              id: d * 10 + i + 1,
              title: name,
              body: `It’s time for ${name}.`,
              schedule: { at, allowWhileIdle: true },
            })
          }
        })
      }
    }

    if (remindDhikr) {
      // A gentle daily nudge at 8pm local.
      out.push({
        id: DHIKR_ID,
        title: 'A moment of remembrance',
        body: 'Take a minute for dhikr and a breath of gratitude.',
        schedule: { on: { hour: 20, minute: 0 }, allowWhileIdle: true },
      })
    }

    if (out.length) await LocalNotifications.schedule({ notifications: out })
  } catch (e) {
    // Native plugin unavailable or scheduling failed — non-fatal on web.
    console.warn('notification scheduling skipped:', e?.message || e)
  }
}

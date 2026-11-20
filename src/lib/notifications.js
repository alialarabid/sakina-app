import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { computeTimes } from './prayer.js'
import { STRINGS } from './i18n.js'

export const isNative = () => Capacitor.isNativePlatform()

// Prayers we remind for (sunrise excluded).
const PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']
// Rolling window, refreshed every time the app opens or resumes, so reminders
// keep coming for a week even if the app isn't opened (5 x 7 = 35 alarms).
const DAYS_AHEAD = 7
const SMALL_ICON = 'ic_stat_sakina'

const tr = (lang, key, vars) => {
  let s = STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v)
  return s
}
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
        smallIcon: SMALL_ICON,
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

// Android 12+: exact alarms need the user's OK ("Alarms & reminders").
// Without it Android may deliver a prayer reminder up to an hour late.
export async function exactAllowed() {
  if (!isNative()) return true
  try {
    const r = await LocalNotifications.checkExactNotificationSetting()
    return r.exact_alarm === 'granted'
  } catch {
    return true
  }
}
export async function askExact() {
  if (!isNative()) return
  try {
    if (!(await exactAllowed())) await LocalNotifications.changeExactNotificationSetting()
  } catch { /* older Android: nothing to ask */ }
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
    const lang = settings.uiLang === 'ar' ? 'ar' : 'en'
    if (!remindPrayers && !remindDhikr) return
    if (!(await ensurePermission())) return

    const out = []
    const now = new Date()

    if (remindPrayers && coords) {
      for (let d = 0; d < DAYS_AHEAD; d++) {
        const date = new Date(now)
        date.setDate(now.getDate() + d)
        const pt = computeTimes(coords, calcMethod, madhhab, date)
        PRAYERS.forEach((key, i) => {
          const at = pt[key]
          if (at > now) {
            const name = tr(lang, 'p.' + key)
            out.push({
              id: d * 10 + i + 1,
              title: name,
              body: tr(lang, 'notif.prayer', { p: name }),
              smallIcon: SMALL_ICON,
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
        title: tr(lang, 'notif.dhikrTitle'),
        body: tr(lang, 'notif.dhikrBody'),
        smallIcon: SMALL_ICON,
        schedule: { on: { hour: 20, minute: 0 }, allowWhileIdle: true },
      })
    }

    if (out.length) await LocalNotifications.schedule({ notifications: out })
  } catch (e) {
    // Native plugin unavailable or scheduling failed — non-fatal on web.
    console.warn('notification scheduling skipped:', e?.message || e)
  }
}

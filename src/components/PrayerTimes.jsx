import { useEffect, useState } from 'react'
import { useSettings } from '../lib/settings.jsx'
import { useT } from '../lib/i18n.js'
import {
  computeTimes, dayList, nextPrayer, currentPrayerKey, fmtTime, countdown, locate,
} from '../lib/prayer.js'

export default function PrayerTimes() {
  const { settings, update } = useSettings()
  const { t } = useT()
  const { coords, calcMethod, madhhab } = settings
  const [now, setNow] = useState(new Date())
  const [status, setStatus] = useState('idle') // idle | locating | denied | error

  // Tick so the countdown + highlight stay fresh.
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const enable = async () => {
    setStatus('locating')
    try {
      update({ coords: await locate() })
      setStatus('idle')
    } catch (e) {
      setStatus(e && e.code === 1 ? 'denied' : 'error')
    }
  }

  if (!coords) {
    const msg =
      status === 'denied' ? t('prayer.denied')
        : status === 'error' ? t('prayer.error')
          : t('prayer.share')
    return (
      <section className="prayer-prompt">
        <div>
          <div className="pp-title">{t('prayer.title')}</div>
          <div className="pp-sub">{msg}</div>
        </div>
        <button className="btn-primary" onClick={enable} disabled={status === 'locating'}>
          {status === 'locating' ? t('prayer.locating') : t('prayer.enable')}
        </button>
      </section>
    )
  }

  const pt = computeTimes(coords, calcMethod, madhhab, now)
  const next = nextPrayer(coords, calcMethod, madhhab, now)
  const curKey = currentPrayerKey(coords, calcMethod, madhhab, now)
  const list = dayList(pt)

  return (
    <section className="prayer">
      <div className="next-prayer">
        <span className="np-label">{t('prayer.next')}</span>
        <span className="np-name">{t('p.' + next.key)}</span>
        <span className="np-time">{fmtTime(next.time)}</span>
        <span className="np-count">{t('prayer.in', { t: countdown(next.time, now) })}</span>
      </div>

      <div className="prayer-list">
        {list.map((p) => (
          <div
            key={p.key}
            className={
              'pr-row' +
              (p.key === next.key ? ' next' : '') +
              (p.key === curKey ? ' current' : '') +
              (p.minor ? ' minor' : '')
            }
          >
            <span className="pr-name">{t('p.' + p.key)}</span>
            <span className="pr-time">{fmtTime(p.time)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { useSettings } from '../lib/settings.jsx'
import {
  computeTimes, dayList, nextPrayer, currentPrayerKey, fmtTime, countdown, locate,
} from '../lib/prayer.js'

export default function PrayerTimes() {
  const { settings, update } = useSettings()
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
      status === 'denied'
        ? 'Location was blocked. Allow it in your browser to see prayer times.'
        : status === 'error'
          ? "Couldn't get your location — try again."
          : 'Share your location to see today’s prayer times.'
    return (
      <section className="prayer-prompt">
        <div>
          <div className="pp-title">Prayer times</div>
          <div className="pp-sub">{msg}</div>
        </div>
        <button className="btn-primary" onClick={enable} disabled={status === 'locating'}>
          {status === 'locating' ? 'Locating…' : 'Enable'}
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
        <span className="np-label">Next prayer</span>
        <span className="np-name">{next.name}</span>
        <span className="np-time">{fmtTime(next.time)}</span>
        <span className="np-count">in {countdown(next.time, now)}</span>
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
            <span className="pr-name">{p.label}</span>
            <span className="pr-time">{fmtTime(p.time)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

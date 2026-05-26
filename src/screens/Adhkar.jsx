import { useRef, useState } from 'react'
import data from '../data/adhkar.json'
import CounterRing from '../components/CounterRing.jsx'
import ShareButton from '../components/ShareButton.jsx'
import { useSettings } from '../lib/settings.jsx'
import { useT } from '../lib/i18n.js'

export default function Adhkar() {
  const { settings } = useSettings()
  const { t } = useT()
  const showTranslation = settings.display === 'full'
  const items = data.items
  const total = items.length

  const [i, setI] = useState(0)
  const [counts, setCounts] = useState({})
  const [finished, setFinished] = useState(false)
  const touchX = useRef(null)

  const cur = items[i]
  const count = counts[cur.id] || 0
  const done = count >= cur.repeat

  const next = () => (i < total - 1 ? setI(i + 1) : setFinished(true))
  const prev = () => i > 0 && setI(i - 1)

  const tap = () => {
    if (done) return next()
    setCounts((c) => ({ ...c, [cur.id]: Math.min((c[cur.id] || 0) + 1, cur.repeat) }))
  }

  const onTouchStart = (e) => (touchX.current = e.changedTouches[0].clientX)
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (dx < -50) next()
    else if (dx > 50) prev()
    touchX.current = null
  }

  if (finished) {
    return (
      <div className="complete">
        <div className="bloom" />
        <p className="ar complete-ar">تَقَبَّلَ اللّٰهُ</p>
        <p className="complete-en">{t('adhkar.accept')}</p>
        <p className="complete-note">{t('adhkar.done')}</p>
        <button className="btn-primary" onClick={() => { setFinished(false); setI(0); setCounts({}) }}>
          {t('adhkar.again')}
        </button>
      </div>
    )
  }

  return (
    <div className="reader" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <header className="reader-head">
        <span className="reader-title">{t('adhkar.title')}</span>
        <span className="reader-pos" dir="ltr">{i + 1} / {total}</span>
      </header>
      <div className="reader-bar"><span style={{ width: `${((i + 1) / total) * 100}%` }} /></div>

      <div className="reader-body" key={cur.id}>
        <p className="ar reader-ar" style={{ fontSize: `calc(27px * var(--ar-scale))` }}>{cur.arabic}</p>
        {showTranslation && cur.translation && <p className="reader-tr">{cur.translation}</p>}
        <div className="reader-meta">
          <span className="reader-ref">{t('ref.hisn')}</span>
          <ShareButton item={cur} />
        </div>
      </div>

      <div className="reader-foot">
        <button className="nav-btn" onClick={prev} disabled={i === 0} aria-label="Previous">
          <Chevron dir="left" />
        </button>

        <CounterRing
          size={104}
          stroke={5}
          progress={count / cur.repeat}
          onTap={tap}
          ariaLabel={done ? 'Next' : `Count, ${count} of ${cur.repeat}`}
          center={
            done ? (
              <span className="ring-done"><Check /></span>
            ) : (
              <span className="ring-num">
                {count}<small>/{cur.repeat}</small>
              </span>
            )
          }
        />

        <button className="nav-btn" onClick={next} aria-label="Next">
          <Chevron dir="right" />
        </button>
      </div>

      <p className="reader-hint">{done ? t('adhkar.tapNext') : cur.repeat > 1 ? t('adhkar.tapN', { n: cur.repeat }) : t('adhkar.tapDone')}</p>
    </div>
  )
}

function Chevron({ dir }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir === 'right' ? 'none' : 'scaleX(-1)' }}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}
function Check() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

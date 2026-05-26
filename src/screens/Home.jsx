import adhkar from '../data/adhkar.json'
import PrayerTimes from '../components/PrayerTimes.jsx'
import { useSettings } from '../lib/settings.jsx'
import { useT } from '../lib/i18n.js'
import { daypart, adhkarMood, hijriDate, hijriDateAr, gregorianDate } from '../lib/time.js'

// A calm, authentic dhikr to feature, rotating by day (from the verified set).
function featured() {
  const d = new Date()
  const day = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000)
  return adhkar.items[day % adhkar.items.length]
}

export default function Home({ go }) {
  const { settings } = useSettings()
  const { t } = useT()
  const showTranslation = settings.display === 'full'
  const mood = adhkarMood()
  const feat = featured()

  return (
    <>
      <section className="hero">
        <Ornament />
        <p className="hero-eyebrow">{t('greeting.' + daypart())}</p>
        <h1 className="hero-salam ar">السَّلامُ عَلَيْكُم</h1>
        <p className="hero-sub">{t('home.peace')}</p>
        <div className="hero-dates">
          <span className="ar">{hijriDateAr()}</span>
          <span className="dot">·</span>
          <span>{hijriDate()}</span>
        </div>
        <p className="hero-greg">{gregorianDate()}</p>
      </section>

      <PrayerTimes />

      <button className="primary-card" onClick={() => go('adhkar')}>
        <div>
          <div className="pc-label">{mood === 'morning' ? t('home.morning') : t('home.evening')}</div>
          <div className="pc-sub">{t('home.adhkarSub', { n: adhkar.items.length })}</div>
        </div>
        <Arrow />
      </button>

      <div className="quick-row">
        <button className="quick" onClick={() => go('duas')}>
          <span className="q-ar ar">دُعَاء</span>
          <span className="q-en">{t('tab.duas')}</span>
        </button>
        <button className="quick" onClick={() => go('tasbih')}>
          <span className="q-ar ar">تَسْبِيح</span>
          <span className="q-en">{t('tab.tasbih')}</span>
        </button>
      </div>

      <button className="feature" onClick={() => go('adhkar')}>
        <div className="feature-label">{t('home.featured')}</div>
        <p className="ar feature-ar">{feat.arabic}</p>
        {showTranslation && <p className="feature-tr">{feat.translation}</p>}
      </button>

      <p className="app-foot">
        Sakina · سكينة<br />{t('home.foot')}
      </p>
    </>
  )
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

// Faint eight-point star (khatam) — quiet Islamic geometry behind the greeting.
function Ornament() {
  return (
    <svg className="ornament" viewBox="0 0 200 200" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="45" y="45" width="110" height="110" transform="rotate(45 100 100)" />
        <rect x="45" y="45" width="110" height="110" />
        <circle cx="100" cy="100" r="78" strokeWidth="0.8" />
      </g>
    </svg>
  )
}

import { useState } from 'react'
import data from '../data/duas.json'
import DhikrCard from '../components/DhikrCard.jsx'
import { useSettings } from '../lib/settings.jsx'
import { useT } from '../lib/i18n.js'

export default function Duas() {
  const { settings } = useSettings()
  const { t, lang } = useT()
  const showTranslation = settings.display === 'full'
  const [openId, setOpenId] = useState(null)

  const category = data.categories.find((c) => c.id === openId)
  const countLabel = (n) => t(n > 1 ? 'duas.countP' : 'duas.count', { n })

  if (category) {
    return (
      <>
        <header className="screen-head">
          <button className="back" onClick={() => setOpenId(null)}>
            <Chevron /> {t('duas.title')}
          </button>
          <h1 className="ar" style={{ marginTop: 6 }}>{category.titleAr}</h1>
          {lang === 'en' && <p style={{ marginTop: 4, color: 'var(--ink-3)' }}>{category.title}</p>}
        </header>

        {category.items.map((item) => (
          <DhikrCard key={item.id} item={item} showTranslation={showTranslation} />
        ))}

        <p className="app-foot">{data.source}</p>
      </>
    )
  }

  return (
    <>
      <header className="screen-head">
        <h1>{t('duas.title')}</h1>
        <p>{t('duas.subtitle')}</p>
      </header>

      <div className="cat-grid">
        {data.categories.map((c) => (
          <button key={c.id} className="cat" onClick={() => setOpenId(c.id)}>
            <div className="cat-ar">{c.titleAr}</div>
            {lang === 'en' && <div className="cat-en">{c.title}</div>}
            <div className="cat-n">{countLabel(c.items.length)}</div>
          </button>
        ))}
      </div>

      <p className="app-foot">{data.source}</p>
    </>
  )
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

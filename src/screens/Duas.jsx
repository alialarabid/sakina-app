import { useState } from 'react'
import data from '../data/duas.json'
import DhikrCard from '../components/DhikrCard.jsx'
import { useSettings } from '../lib/settings.jsx'

export default function Duas() {
  const { settings } = useSettings()
  const showTranslation = settings.display === 'full'
  const [openId, setOpenId] = useState(null)

  const category = data.categories.find((c) => c.id === openId)

  if (category) {
    return (
      <>
        <header className="screen-head">
          <button className="back" onClick={() => setOpenId(null)}>
            <Chevron /> Du&#700;a
          </button>
          <h1 style={{ marginTop: 6 }}>{category.title}</h1>
          <p className="ar" style={{ fontSize: '19px', marginTop: 4 }}>{category.titleAr}</p>
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
        <h1>Du&#700;a</h1>
        <p>Supplications for the moments of the day.</p>
      </header>

      <div className="cat-grid">
        {data.categories.map((c) => (
          <button key={c.id} className="cat" onClick={() => setOpenId(c.id)}>
            <div className="cat-ar">{c.titleAr}</div>
            <div className="cat-en">{c.title}</div>
            <div className="cat-n">{c.items.length} du&#700;a{c.items.length > 1 ? 's' : ''}</div>
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

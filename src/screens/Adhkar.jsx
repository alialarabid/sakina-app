import { useMemo, useState } from 'react'
import data from '../data/adhkar.json'
import DhikrCard from '../components/DhikrCard.jsx'
import { useSettings } from '../lib/settings.jsx'

export default function Adhkar() {
  const { settings } = useSettings()
  const showTranslation = settings.display === 'full'

  // count per item id, in-session; tap the pill to advance toward its repeat.
  const [counts, setCounts] = useState({})

  const tap = (item) =>
    setCounts((c) => ({
      ...c,
      [item.id]: Math.min((c[item.id] || 0) + 1, item.repeat),
    }))

  const done = useMemo(
    () => data.items.filter((it) => (counts[it.id] || 0) >= it.repeat).length,
    [counts],
  )
  const total = data.items.length
  const allDone = done === total

  return (
    <>
      <header className="screen-head">
        <h1>{data.title}</h1>
        <p className="ar" style={{ fontSize: '20px', marginTop: 4 }}>{data.titleAr}</p>
      </header>

      <div className="progress">
        <div className="bar"><span style={{ width: `${(done / total) * 100}%` }} /></div>
        <span className="count">{done}/{total}</span>
        {done > 0 && (
          <button className="back" onClick={() => setCounts({})}>Reset</button>
        )}
      </div>

      {allDone && (
        <div className="done-banner">
          <p className="ar">تَقَبَّلَ اللَّهُ</p>
          <p>You've completed the morning &amp; evening remembrance.</p>
        </div>
      )}

      {data.items.map((item) => (
        <DhikrCard
          key={item.id}
          item={item}
          showTranslation={showTranslation}
          counter={{ count: counts[item.id] || 0, onTap: () => tap(item) }}
        />
      ))}

      <p className="app-foot">{data.source}</p>
    </>
  )
}

import { useEffect, useState } from 'react'
import { load, save, todayKey } from '../lib/storage.js'
import { promptForToday } from '../data/gratitude.js'

// Canonical short adhkar for the counter.
const PHRASES = [
  { key: 'subhanallah', ar: 'سُبْحَانَ اللَّه', en: 'SubhanAllah' },
  { key: 'alhamdulillah', ar: 'الْحَمْدُ لِلَّه', en: 'Alhamdulillah' },
  { key: 'allahuakbar', ar: 'اللَّهُ أَكْبَر', en: 'Allahu Akbar' },
  { key: 'astaghfirullah', ar: 'أَسْتَغْفِرُ اللَّه', en: 'Astaghfirullah' },
  { key: 'tahleel', ar: 'لَا إِلَٰهَ إِلَّا اللَّه', en: 'La ilaha illAllah' },
]

const dayStoreKey = () => 'tasbih:' + todayKey()

export default function Tasbih() {
  const [phrase, setPhrase] = useState(PHRASES[0].key)
  const [byPhrase, setByPhrase] = useState(() => load(dayStoreKey(), {}))

  useEffect(() => {
    save(dayStoreKey(), byPhrase)
  }, [byPhrase])

  const count = byPhrase[phrase] || 0
  const total = Object.values(byPhrase).reduce((a, b) => a + b, 0)

  const tap = () => {
    if (navigator.vibrate) navigator.vibrate(8)
    setByPhrase((b) => ({ ...b, [phrase]: (b[phrase] || 0) + 1 }))
  }
  const reset = () => setByPhrase((b) => ({ ...b, [phrase]: 0 }))

  const active = PHRASES.find((p) => p.key === phrase)

  return (
    <>
      <header className="screen-head">
        <h1>Tasbih</h1>
        <p>Tap to count your dhikr.</p>
      </header>

      <div className="tasbih">
        <div className="phrase-ar">{active.ar}</div>
        <div className="phrase-en">{active.en}</div>

        <button className="counter-btn" onClick={tap} aria-label={`Count ${active.en}, currently ${count}`}>
          {count}
        </button>

        <div className="tasbih-controls">
          {PHRASES.map((p) => (
            <button
              key={p.key}
              className={'chip' + (p.key === phrase ? ' on' : '')}
              onClick={() => setPhrase(p.key)}
              title={p.en}
            >
              {p.en}
            </button>
          ))}
        </div>

        <button className="back" style={{ marginTop: 18 }} onClick={reset} disabled={!count}>
          Reset {active.en}
        </button>

        <div className="daily-total">Today across all dhikr: {total}</div>

        <div className="gratitude">
          <div className="label">Moment of shukr</div>
          <p>{promptForToday()}</p>
        </div>
      </div>
    </>
  )
}

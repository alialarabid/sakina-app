import { useEffect, useState } from 'react'
import { load, save, todayKey } from '../lib/storage.js'
import { promptForToday } from '../data/gratitude.js'
import CounterRing from '../components/CounterRing.jsx'

const PHRASES = [
  { key: 'subhanallah', ar: 'سُبْحَانَ اللَّه', en: 'SubhanAllah' },
  { key: 'alhamdulillah', ar: 'الْحَمْدُ لِلَّه', en: 'Alhamdulillah' },
  { key: 'allahuakbar', ar: 'اللَّهُ أَكْبَر', en: 'Allahu Akbar' },
  { key: 'astaghfirullah', ar: 'أَسْتَغْفِرُ اللَّه', en: 'Astaghfirullah' },
  { key: 'tahleel', ar: 'لَا إِلَٰهَ إِلَّا اللَّه', en: 'La ilaha illAllah' },
]
const CYCLE = 33
const dayStoreKey = () => 'tasbih:' + todayKey()

export default function Tasbih() {
  const [phrase, setPhrase] = useState(PHRASES[0].key)
  const [byPhrase, setByPhrase] = useState(() => load(dayStoreKey(), {}))

  useEffect(() => { save(dayStoreKey(), byPhrase) }, [byPhrase])

  const count = byPhrase[phrase] || 0
  const total = Object.values(byPhrase).reduce((a, b) => a + b, 0)
  const cycles = Math.floor(count / CYCLE)
  const inCycle = count % CYCLE
  const progress = count > 0 && inCycle === 0 ? 1 : inCycle / CYCLE

  const tap = () => {
    const nextCount = count + 1
    if (nextCount % CYCLE === 0 && navigator.vibrate) navigator.vibrate([12, 40, 12])
    setByPhrase((b) => ({ ...b, [phrase]: (b[phrase] || 0) + 1 }))
  }
  const reset = () => setByPhrase((b) => ({ ...b, [phrase]: 0 }))
  const active = PHRASES.find((p) => p.key === phrase)

  return (
    <div className="tasbih">
      <div className="phrase-ar ar">{active.ar}</div>
      <div className="phrase-en">{active.en}</div>

      <CounterRing
        size={244}
        stroke={7}
        progress={progress}
        onTap={tap}
        ariaLabel={`Count ${active.en}, ${count}`}
        center={
          <span className="tasbih-num">
            {count}
            <small>{cycles > 0 ? `${cycles} × ${CYCLE}` : `of ${CYCLE}`}</small>
          </span>
        }
      />

      <div className="tasbih-controls">
        {PHRASES.map((p) => (
          <button key={p.key} className={'chip' + (p.key === phrase ? ' on' : '')} onClick={() => setPhrase(p.key)}>
            {p.en}
          </button>
        ))}
      </div>

      <button className="link-btn" onClick={reset} disabled={!count}>Reset {active.en}</button>
      <div className="daily-total">Today, all dhikr: {total}</div>

      <div className="gratitude">
        <div className="label">Moment of shukr</div>
        <p>{promptForToday()}</p>
      </div>
    </div>
  )
}

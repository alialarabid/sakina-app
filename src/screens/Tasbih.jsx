import { useEffect, useState } from 'react'
import { load, save, todayKey } from '../lib/storage.js'
import { promptForToday } from '../data/gratitude.js'
import CounterRing from '../components/CounterRing.jsx'
import { useT } from '../lib/i18n.js'

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
  const { t } = useT()
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
            <small>{cycles > 0 ? t('tasbih.cycles', { n: cycles, c: CYCLE }) : t('tasbih.ofCycle', { c: CYCLE })}</small>
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

      <button className="link-btn" onClick={reset} disabled={!count}>{t('tasbih.reset', { x: active.en })}</button>
      <div className="daily-total">{t('tasbih.today', { n: total })}</div>

      <div className="gratitude">
        <div className="label">{t('tasbih.shukr')}</div>
        <p>{promptForToday()}</p>
      </div>
    </div>
  )
}

import { useSettings } from '../lib/settings.jsx'

export default function Settings() {
  const { settings, update } = useSettings()

  const clampScale = (next) => Math.min(1.4, Math.max(0.9, Math.round(next * 10) / 10))

  return (
    <>
      <header className="screen-head">
        <h1>Settings</h1>
      </header>

      <div className="setting">
        <div>
          <div className="s-label">Theme</div>
          <div className="s-sub">Follows your device by default</div>
        </div>
        <div className="segment">
          {['system', 'light', 'dark'].map((t) => (
            <button key={t} className={settings.theme === t ? 'on' : ''} onClick={() => update({ theme: t })}>
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="setting">
        <div>
          <div className="s-label">Display</div>
          <div className="s-sub">Show English translation under the Arabic</div>
        </div>
        <div className="segment">
          <button className={settings.display === 'arabic' ? 'on' : ''} onClick={() => update({ display: 'arabic' })}>
            Arabic
          </button>
          <button className={settings.display === 'full' ? 'on' : ''} onClick={() => update({ display: 'full' })}>
            + English
          </button>
        </div>
      </div>

      <div className="setting">
        <div>
          <div className="s-label">Arabic size</div>
          <div className="s-sub">{Math.round(settings.fontScale * 100)}%</div>
        </div>
        <div className="segment">
          <button onClick={() => update({ fontScale: clampScale(settings.fontScale - 0.1) })} aria-label="Smaller">A−</button>
          <button onClick={() => update({ fontScale: clampScale(settings.fontScale + 0.1) })} aria-label="Larger">A+</button>
        </div>
      </div>

      <div className="note">
        <strong>About the text.</strong> All Arabic and English come verbatim from
        <em> Hisn al-Muslim (Fortress of the Muslim)</em>, compiled by Saʼid bin Ali
        al-Qahtani, via the hisnmuslim.com data set. Nothing in the adhkar or duʼa is
        generated or paraphrased.
      </div>

      <div className="note" style={{ marginTop: 12 }}>
        <strong>Coming next.</strong> Transliteration (once sourced from a verified
        reference), prayer times &amp; reminders, and Qibla — planned for the native
        version.
      </div>

      <p className="app-foot">
        Sakina · سكينة<br />
        Made as a sadaqah jariyah. May it benefit you.
      </p>
    </>
  )
}

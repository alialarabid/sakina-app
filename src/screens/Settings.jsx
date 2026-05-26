import { useState } from 'react'
import { useSettings } from '../lib/settings.jsx'
import { CALC_METHODS, locate } from '../lib/prayer.js'
import { isNative } from '../lib/notifications.js'

export default function Settings() {
  const { settings, update } = useSettings()
  const [locStatus, setLocStatus] = useState('idle')

  const useMyLocation = async () => {
    setLocStatus('locating')
    try {
      update({ coords: await locate() })
      setLocStatus('done')
    } catch (e) {
      setLocStatus(e && e.code === 1 ? 'denied' : 'error')
    }
  }

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

      <h2 className="settings-section">Prayer times</h2>

      <div className="setting">
        <div>
          <div className="s-label">Location</div>
          <div className="s-sub">
            {locStatus === 'locating' ? 'Locating…'
              : locStatus === 'denied' ? 'Permission blocked — allow location in your browser'
              : locStatus === 'error' ? "Couldn't get location — try again"
              : settings.coords ? 'Location set' : 'Not set'}
          </div>
        </div>
        <button className="link-btn" onClick={useMyLocation} disabled={locStatus === 'locating'}>
          {settings.coords ? 'Update' : 'Use my location'}
        </button>
      </div>

      <div className="setting">
        <div>
          <div className="s-label">Calculation method</div>
          <div className="s-sub">How prayer times are computed</div>
        </div>
        <select
          className="select"
          value={settings.calcMethod}
          onChange={(e) => update({ calcMethod: e.target.value })}
        >
          {Object.entries(CALC_METHODS).map(([k, label]) => (
            <option key={k} value={k}>{label}</option>
          ))}
        </select>
      </div>

      <div className="setting">
        <div>
          <div className="s-label">Asr (madhhab)</div>
          <div className="s-sub">Hanafi makes Asr later</div>
        </div>
        <div className="segment">
          <button className={settings.madhhab === 'shafi' ? 'on' : ''} onClick={() => update({ madhhab: 'shafi' })}>Standard</button>
          <button className={settings.madhhab === 'hanafi' ? 'on' : ''} onClick={() => update({ madhhab: 'hanafi' })}>Hanafi</button>
        </div>
      </div>

      <h2 className="settings-section">Reminders</h2>

      <div className="setting">
        <div>
          <div className="s-label">Prayer reminders</div>
          <div className="s-sub">A notification at each prayer time</div>
        </div>
        <div className="segment">
          <button className={settings.remindPrayers ? 'on' : ''} onClick={() => update({ remindPrayers: true })}>On</button>
          <button className={!settings.remindPrayers ? 'on' : ''} onClick={() => update({ remindPrayers: false })}>Off</button>
        </div>
      </div>

      <div className="setting">
        <div>
          <div className="s-label">Daily dhikr nudge</div>
          <div className="s-sub">A gentle reminder each evening</div>
        </div>
        <div className="segment">
          <button className={settings.remindDhikr ? 'on' : ''} onClick={() => update({ remindDhikr: true })}>On</button>
          <button className={!settings.remindDhikr ? 'on' : ''} onClick={() => update({ remindDhikr: false })}>Off</button>
        </div>
      </div>

      {!isNative() && (
        <div className="note">
          Reminders fire in the <strong>installed app</strong>. On the web they’re saved as a
          preference but won’t send notifications.
        </div>
      )}

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
        <a href="/privacy.html" target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>Privacy</a>
        <br /><br />
        Sakina · سكينة<br />
        Made as a sadaqah jariyah. May it benefit you.
      </p>
    </>
  )
}

import { useState } from 'react'
import { useSettings } from '../lib/settings.jsx'
import { useT } from '../lib/i18n.js'
import { CALC_METHODS, locate } from '../lib/prayer.js'
import { isNative, sendTest } from '../lib/notifications.js'

export default function Settings() {
  const { settings, update } = useSettings()
  const { t } = useT()
  const [locStatus, setLocStatus] = useState('idle')
  const [tested, setTested] = useState(false)

  const useMyLocation = async () => {
    setLocStatus('locating')
    try {
      update({ coords: await locate() })
      setLocStatus('done')
    } catch (e) {
      setLocStatus(e && e.code === 1 ? 'denied' : 'error')
    }
  }

  const fireTest = async () => {
    await sendTest()
    setTested(true)
    setTimeout(() => setTested(false), 2500)
  }

  const clampScale = (next) => Math.min(1.4, Math.max(0.9, Math.round(next * 10) / 10))

  return (
    <>
      <header className="screen-head">
        <h1>{t('set.title')}</h1>
      </header>

      <div className="setting">
        <div>
          <div className="s-label">{t('set.language')}</div>
          <div className="s-sub">{t('set.languageSub')}</div>
        </div>
        <div className="segment">
          <button className={settings.uiLang !== 'ar' ? 'on' : ''} onClick={() => update({ uiLang: 'en' })}>{t('lang.en')}</button>
          <button className={settings.uiLang === 'ar' ? 'on' : ''} onClick={() => update({ uiLang: 'ar' })}>{t('lang.ar')}</button>
        </div>
      </div>

      <div className="setting">
        <div>
          <div className="s-label">{t('set.theme')}</div>
          <div className="s-sub">{t('set.themeSub')}</div>
        </div>
        <div className="segment">
          {['system', 'light', 'dark'].map((k) => (
            <button key={k} className={settings.theme === k ? 'on' : ''} onClick={() => update({ theme: k })}>
              {t('theme.' + k)}
            </button>
          ))}
        </div>
      </div>

      <div className="setting">
        <div>
          <div className="s-label">{t('set.translation')}</div>
          <div className="s-sub">{t('set.translationSub')}</div>
        </div>
        <div className="segment">
          <button className={settings.display === 'arabic' ? 'on' : ''} onClick={() => update({ display: 'arabic' })}>{t('set.transOff')}</button>
          <button className={settings.display === 'full' ? 'on' : ''} onClick={() => update({ display: 'full' })}>{t('set.transOn')}</button>
        </div>
      </div>

      <div className="setting">
        <div>
          <div className="s-label">{t('set.size')}</div>
          <div className="s-sub">{Math.round(settings.fontScale * 100)}%</div>
        </div>
        <div className="segment">
          <button onClick={() => update({ fontScale: clampScale(settings.fontScale - 0.1) })} aria-label="Smaller">A−</button>
          <button onClick={() => update({ fontScale: clampScale(settings.fontScale + 0.1) })} aria-label="Larger">A+</button>
        </div>
      </div>

      <h2 className="settings-section">{t('set.prayer')}</h2>

      <div className="setting">
        <div>
          <div className="s-label">{t('set.location')}</div>
          <div className="s-sub">
            {locStatus === 'locating' ? t('prayer.locating')
              : locStatus === 'denied' ? t('prayer.denied')
              : locStatus === 'error' ? t('prayer.error')
              : settings.coords ? t('set.locSet') : t('set.locNot')}
          </div>
        </div>
        <button className="link-btn" onClick={useMyLocation} disabled={locStatus === 'locating'}>
          {settings.coords ? t('set.locUpdate') : t('set.locUse')}
        </button>
      </div>

      <div className="setting">
        <div>
          <div className="s-label">{t('set.calc')}</div>
          <div className="s-sub">{t('set.calcSub')}</div>
        </div>
        <select className="select" value={settings.calcMethod} onChange={(e) => update({ calcMethod: e.target.value })}>
          {Object.entries(CALC_METHODS).map(([k, label]) => (
            <option key={k} value={k}>{label}</option>
          ))}
        </select>
      </div>

      <div className="setting">
        <div>
          <div className="s-label">{t('set.asr')}</div>
          <div className="s-sub">{t('set.asrSub')}</div>
        </div>
        <div className="segment">
          <button className={settings.madhhab === 'shafi' ? 'on' : ''} onClick={() => update({ madhhab: 'shafi' })}>{t('asr.standard')}</button>
          <button className={settings.madhhab === 'hanafi' ? 'on' : ''} onClick={() => update({ madhhab: 'hanafi' })}>{t('asr.hanafi')}</button>
        </div>
      </div>

      <h2 className="settings-section">{t('set.reminders')}</h2>

      <div className="setting">
        <div>
          <div className="s-label">{t('set.remPrayer')}</div>
          <div className="s-sub">{t('set.remPrayerSub')}</div>
        </div>
        <div className="segment">
          <button className={settings.remindPrayers ? 'on' : ''} onClick={() => update({ remindPrayers: true })}>{t('set.on')}</button>
          <button className={!settings.remindPrayers ? 'on' : ''} onClick={() => update({ remindPrayers: false })}>{t('set.off')}</button>
        </div>
      </div>

      <div className="setting">
        <div>
          <div className="s-label">{t('set.remDhikr')}</div>
          <div className="s-sub">{t('set.remDhikrSub')}</div>
        </div>
        <div className="segment">
          <button className={settings.remindDhikr ? 'on' : ''} onClick={() => update({ remindDhikr: true })}>{t('set.on')}</button>
          <button className={!settings.remindDhikr ? 'on' : ''} onClick={() => update({ remindDhikr: false })}>{t('set.off')}</button>
        </div>
      </div>

      {isNative() && (
        <div className="setting">
          <div>
            <div className="s-label">{tested ? t('set.testSent') : t('set.test')}</div>
          </div>
          <button className="link-btn" onClick={fireTest} disabled={tested}>{t('prayer.enable')}</button>
        </div>
      )}

      {!isNative() && <div className="note">{t('set.remNote')}</div>}

      <div className="note" style={{ marginTop: 12 }}>{t('set.aboutText')}</div>

      <p className="app-foot">
        <a href="/privacy.html" target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>{t('set.privacy')}</a>
        <br /><br />
        Sakina · سكينة<br />
        {t('set.madeAs')}
      </p>
    </>
  )
}

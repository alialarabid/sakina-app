import { createContext, useContext, useEffect, useState } from 'react'
import { load, save } from './storage.js'

const SettingsContext = createContext(null)

// display: 'arabic' (Arabic only) | 'translit' (+ transliteration) | 'full' (+ translation)
const DEFAULTS = {
  theme: 'system',   // 'light' | 'dark' | 'system'
  display: 'full',
  fontScale: 1,      // 0.9 – 1.4, multiplies Arabic size
  // Prayer times
  coords: null,      // { lat, lng } once the user shares location
  calcMethod: 'UmmAlQura',
  madhhab: 'shafi',  // 'shafi' | 'hanafi' (Asr calculation)
  // Reminders (fire only in the installed native app)
  remindPrayers: false,
  remindDhikr: false,
}

function resolveTheme(theme) {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => ({ ...DEFAULTS, ...load('settings', {}) }))

  // Persist + apply theme to the document element.
  useEffect(() => {
    save('settings', settings)
    document.documentElement.setAttribute('data-theme', resolveTheme(settings.theme))
    document.documentElement.style.setProperty('--ar-scale', String(settings.fontScale))
  }, [settings])

  // React to OS theme changes while on 'system'.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (settings.theme === 'system') {
        document.documentElement.setAttribute('data-theme', resolveTheme('system'))
      }
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [settings.theme])

  const update = (patch) => setSettings((s) => ({ ...s, ...patch }))

  return (
    <SettingsContext.Provider value={{ settings, update }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}

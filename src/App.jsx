import { useEffect, useState } from 'react'
import Home from './screens/Home.jsx'
import Adhkar from './screens/Adhkar.jsx'
import Duas from './screens/Duas.jsx'
import Tasbih from './screens/Tasbih.jsx'
import Settings from './screens/Settings.jsx'
import { daypart } from './lib/time.js'
import './App.css'

const TABS = [
  { id: 'home', label: 'Home', icon: HomeIcon, Screen: Home },
  { id: 'adhkar', label: 'Adhkar', icon: SunMoonIcon, Screen: Adhkar },
  { id: 'duas', label: 'Duʼa', icon: HandsIcon, Screen: Duas },
  { id: 'tasbih', label: 'Tasbih', icon: BeadsIcon, Screen: Tasbih },
  { id: 'settings', label: 'Settings', icon: GearIcon, Screen: Settings },
]

function initialTab() {
  const t = new URLSearchParams(window.location.search).get('tab')
  return TABS.some((x) => x.id === t) ? t : 'home'
}

export default function App() {
  const [tab, setTab] = useState(initialTab)
  const Active = TABS.find((t) => t.id === tab).Screen

  // Keep the time-of-day atmosphere fresh.
  useEffect(() => {
    const apply = () => document.documentElement.setAttribute('data-daypart', daypart())
    apply()
    const t = setInterval(apply, 60_000)
    return () => clearInterval(t)
  }, [])

  // Let any screen request a tab change (e.g. Home quick links).
  const go = (id) => setTab(id)

  return (
    <div className="app">
      <main className="app-main" key={tab}>
        <Active go={go} />
      </main>

      <nav className="tabbar" aria-label="Sections">
        {TABS.map((t) => {
          const Icon = t.icon
          const active = t.id === tab
          return (
            <button
              key={t.id}
              className={'tab' + (active ? ' tab--active' : '')}
              onClick={() => setTab(t.id)}
              aria-current={active ? 'page' : undefined}
            >
              <Icon />
              <span>{t.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

/* --- line icons --- */
function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11.5 12 4l8 7.5M6 10v9h12v-9" />
    </svg>
  )
}
function SunMoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 18a5 5 0 1 1-4.9-6 4 4 0 1 0 4.9 6Z" />
      <path d="M6 6.5 6.6 8M3.5 11H5M19 4l.5 1.4M21 8.5h-1.4" />
    </svg>
  )
}
function HandsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 11V5.5a1.5 1.5 0 0 1 3 0V10M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V6a1.5 1.5 0 0 1 3 0v6.5c0 3.6-2 6.5-5.5 6.5S5 16.5 5 13v-1.5a1.5 1.5 0 0 1 3 0" />
    </svg>
  )
}
function BeadsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="8" r="2" /><circle cx="12" cy="6" r="2" /><circle cx="18" cy="8" r="2" />
      <path d="M6 10v3a6 6 0 0 0 12 0v-3" />
    </svg>
  )
}
function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4M18.7 18.7l-1.4-1.4M6.7 6.7 5.3 5.3" />
    </svg>
  )
}

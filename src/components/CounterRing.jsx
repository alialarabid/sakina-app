import { useState } from 'react'

// A circular, tappable progress ring with a ripple on each tap.
// progress: 0..1 fill of the ring. center: node shown in the middle.
export default function CounterRing({ size = 240, stroke = 6, progress = 0, onTap, center, ariaLabel }) {
  const [ripples, setRipples] = useState([])
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(1, progress))

  const handle = (e) => {
    if (navigator.vibrate) navigator.vibrate(8)
    const id = Date.now() + Math.random()
    setRipples((rs) => [...rs, id])
    setTimeout(() => setRipples((rs) => rs.filter((x) => x !== id)), 650)
    onTap?.(e)
  }

  return (
    <button className="ring" style={{ width: size, height: size }} onClick={handle} aria-label={ariaLabel}>
      {ripples.map((id) => (
        <span key={id} className="ring-ripple" />
      ))}
      <svg width={size} height={size} className="ring-svg" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--hairline)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s var(--ease)' }}
        />
      </svg>
      <span className="ring-center">{center}</span>
    </button>
  )
}

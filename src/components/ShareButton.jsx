import { useState } from 'react'

// Share a du'a/dhikr outward (Web Share API) with a clipboard fallback.
// Spreading a remembrance is itself a small sadaqah — and it carries the app link.
export default function ShareButton({ item }) {
  const [copied, setCopied] = useState(false)

  const share = async (e) => {
    e.stopPropagation?.()
    const text =
      `${item.arabic}\n\n` +
      (item.translation ? `${item.translation}\n\n` : '') +
      `— Hisn al-Muslim\nvia Sakina · https://sakina-app-mu.vercel.app`

    if (navigator.share) {
      try {
        await navigator.share({ text })
        return
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button className="share-btn" onClick={share} aria-label="Share this duʼa">
      {copied ? (
        <span className="share-copied">Copied</span>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
        </svg>
      )}
    </button>
  )
}

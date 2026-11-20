// Time-of-day + calendar helpers. All client-side, offline.

// Four dayparts drive the app's shifting atmosphere.
export function daypart(d = new Date()) {
  const h = d.getHours()
  if (h >= 4 && h < 7) return 'dawn'
  if (h >= 7 && h < 16) return 'day'
  if (h >= 16 && h < 19) return 'dusk'
  return 'night'
}

// A short, warm greeting line for the Home hero.
export function greeting(d = new Date()) {
  const part = daypart(d)
  return {
    dawn: 'A blessed dawn',
    day: 'A peaceful day',
    dusk: 'A gentle evening',
    night: 'A restful night',
  }[part]
}

// Which adhkar set fits this moment (the source groups morning & evening
// together; this just nudges the user toward the right intention).
export function adhkarMood(d = new Date()) {
  const h = d.getHours()
  return h >= 4 && h < 12 ? 'morning' : 'evening'
}

// Hijri date via the built-in Islamic calendar — no API, works offline.
// Android WebView ships trimmed ICU data: English month names come out as
// Gregorian ones ("June 10, 1448 BC"). So take only the numbers from Intl and
// name the month ourselves.
const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabiʻ al-Awwal', 'Rabiʻ al-Thani', 'Jumada al-Ula',
  'Jumada al-Akhirah', 'Rajab', 'Shaʻban', 'Ramadan', 'Shawwal',
  'Dhu al-Qaʻdah', 'Dhu al-Hijjah',
]
export function hijriDate(d = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
      day: 'numeric', month: 'numeric', year: 'numeric',
    }).formatToParts(d)
    const get = (t) => parseInt(parts.find((p) => p.type === t)?.value, 10)
    const day = get('day'), month = get('month'), year = get('year')
    if (!day || !month || !year) return ''
    return `${day} ${HIJRI_MONTHS[month - 1]} ${year} AH`
  } catch {
    return ''
  }
}

export function hijriDateAr(d = new Date(), withYear = false) {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      ...(withYear ? { year: 'numeric' } : {}),
    }).format(d)
  } catch {
    return ''
  }
}

export function gregorianDate(d = new Date(), lang = 'en') {
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(d)
}

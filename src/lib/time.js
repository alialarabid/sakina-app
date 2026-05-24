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
export function hijriDate(d = new Date()) {
  try {
    return new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d)
  } catch {
    return ''
  }
}

export function hijriDateAr(d = new Date()) {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
    }).format(d)
  } catch {
    return ''
  }
}

export function gregorianDate(d = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(d)
}

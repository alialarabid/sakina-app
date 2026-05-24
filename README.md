# Sakina · سكينة

A calm, ad-free companion for the daily remembrance of Allah — morning &
evening adhkar, du'a for the moments of the day, and a dhikr counter. Built as
a sadaqah jariyah.

No ads. No tracking. No accounts. Works offline.

## What's inside (v1)

- **Adhkar** — the morning & evening remembrance (Adhkar as-Sabah wal-Masa),
  card by card, with a tap-to-count repeat tracker and a progress bar.
- **Du'a** — supplications grouped by daily moment: waking, leaving and
  entering the home, the restroom, ablution, the mosque, eating, sleeping,
  travel, worry, and anger.
- **Tasbih** — a dhikr counter (SubhanAllah / Alhamdulillah / Allahu Akbar /
  Astaghfirullah / La ilaha illAllah) with a daily total, plus a gentle
  gratitude prompt.
- **Settings** — light / dark / system theme, Arabic-only or Arabic + English,
  and adjustable Arabic text size.

## A note on authenticity

The Arabic and English text is **never generated or paraphrased**. Every
adhkar and du'a comes verbatim from *Hisn al-Muslim (Fortress of the Muslim)*,
compiled by Sa'id bin Ali al-Qahtani, via the public hisnmuslim.com data set.

The data is built by a script you can re-run and audit:

```bash
npm run fetch-content   # rewrites src/data/adhkar.json and src/data/duas.json
```

The only authored text in the app is the UI labels and the reflective
"moment of shukr" prompts (in `src/data/gratitude.js`) — these are nudges to
reflect, not scripture.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

Build and preview the production PWA:

```bash
npm run build
npm run preview
```

## Run on Replit

1. **Create → Import from GitHub** and point it at this repo.
2. Replit reads `.replit` and runs `npm run dev`.
3. To publish, use Replit's **Deploy** (configured as a static deployment of
   the built `dist/` folder).

## Tech

React + Vite, installable PWA with full offline precache (`vite-plugin-pwa`),
Amiri for Arabic typography. All state is local (`localStorage`) — there is no
backend.

## Roadmap (native)

Prayer times + reliable reminders, Qibla direction, the Hijri date, and
transliteration (once sourced from a verified reference) are planned for a
native build, where scheduled notifications are dependable. The web codebase is
structured to wrap into native (e.g. Capacitor) rather than be rewritten.

## License

Code: MIT (suggested). The religious text is the freely-distributed
Hisn al-Muslim compilation — please preserve the attribution.

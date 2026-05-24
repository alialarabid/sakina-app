/**
 * fetch-content.mjs — builds src/data/{adhkar,duas}.json from the official
 * Hisn al-Muslim API (hisnmuslim.com).
 *
 * AUTHENTICITY: no text is authored or paraphrased here. Arabic + English
 * come verbatim from the source; we only collapse whitespace for layout.
 * Re-run with `npm run fetch-content` to refresh.
 */
import { writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', 'src', 'data')

const SOURCE =
  'Hisn al-Muslim (Fortress of the Muslim), compiled by Saʼid bin Ali al-Qahtani — data via hisnmuslim.com'

// Curated daily-moment du'a categories with clean display titles.
const DUA_CATEGORIES = [
  { id: 1, title: 'Waking up' },
  { id: 10, title: 'Leaving home' },
  { id: 11, title: 'Entering home' },
  { id: 6, title: 'Entering the restroom' },
  { id: 7, title: 'Leaving the restroom' },
  { id: 9, title: 'After ablution (wuduʼ)' },
  { id: 13, title: 'Entering the mosque' },
  { id: 14, title: 'Leaving the mosque' },
  { id: 69, title: 'Before eating' },
  { id: 70, title: 'After eating' },
  { id: 28, title: 'Before sleeping' },
  { id: 95, title: 'Riding a vehicle' },
  { id: 96, title: 'Travel' },
  { id: 34, title: 'Worry & grief' },
  { id: 82, title: 'Anger' },
]
const MORNING_EVENING_ID = 27

const clean = (s) =>
  (s || '')
    .replace(/﻿/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim()

async function getJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} for ${url}`)
  const text = (await res.text()).replace(/^﻿/, '')
  return JSON.parse(text)
}

const firstArray = (obj) => obj[Object.keys(obj)[0]]

async function fetchCategory(id) {
  const [ar, en] = await Promise.all([
    getJSON(`https://www.hisnmuslim.com/api/ar/${id}.json`),
    getJSON(`https://www.hisnmuslim.com/api/en/${id}.json`),
  ])
  const arItems = firstArray(ar)
  const enById = new Map(firstArray(en).map((x) => [x.ID, x]))
  return arItems.map((a) => ({
    id: a.ID,
    arabic: clean(a.ARABIC_TEXT),
    translation: clean(enById.get(a.ID)?.TRANSLATED_TEXT),
    repeat: Number(a.REPEAT) || 1,
  }))
}

async function categoryTitleAr(id) {
  const idx = await getJSON('https://www.hisnmuslim.com/api/ar/husn_ar.json')
  const found = firstArray(idx).find((x) => x.ID === id)
  return found ? clean(found.TITLE) : ''
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true })
  const arIndex = firstArray(await getJSON('https://www.hisnmuslim.com/api/ar/husn_ar.json'))
  const titleArFor = (id) => {
    const f = arIndex.find((x) => x.ID === id)
    return f ? clean(f.TITLE) : ''
  }

  // Morning & evening
  const meItems = await fetchCategory(MORNING_EVENING_ID)
  const adhkar = {
    source: SOURCE,
    title: 'Morning & Evening',
    titleAr: titleArFor(MORNING_EVENING_ID),
    items: meItems,
  }
  await writeFile(join(DATA_DIR, 'adhkar.json'), JSON.stringify(adhkar, null, 2) + '\n')
  console.log(`adhkar.json — ${meItems.length} items`)

  // Du'a categories
  const categories = []
  for (const c of DUA_CATEGORIES) {
    const items = await fetchCategory(c.id)
    categories.push({ id: c.id, title: c.title, titleAr: titleArFor(c.id), items })
    console.log(`  ${c.title} — ${items.length}`)
  }
  await writeFile(
    join(DATA_DIR, 'duas.json'),
    JSON.stringify({ source: SOURCE, categories }, null, 2) + '\n',
  )
  console.log(`duas.json — ${categories.length} categories`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

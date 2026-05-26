import ShareButton from './ShareButton.jsx'
import { useT } from '../lib/i18n.js'

// One unit of remembrance: Arabic (always), optional English, source, and an
// optional tap-to-count repeat pill. Text is never altered here.
export default function DhikrCard({ item, showTranslation, counter }) {
  const { t } = useT()
  const done = counter && counter.count >= item.repeat

  return (
    <article className="card">
      <p className="ar">{item.arabic}</p>

      {showTranslation && item.translation && (
        <p className="translation">{item.translation}</p>
      )}

      <div className="meta">
        <span className="ref">{t('ref.hisn')}</span>

        <div className="meta-actions">
          <ShareButton item={item} />
          {counter ? (
            <button
              className={'repeat' + (done ? ' done' : '')}
              onClick={counter.onTap}
              aria-label={`Repeated ${counter.count} of ${item.repeat}`}
            >
              {done ? '✓ ' : ''}
              {counter.count} / {item.repeat}
              {item.repeat > 1 ? '×' : ''}
            </button>
          ) : item.repeat > 1 ? (
            <span className="repeat" aria-label={`Repeat ${item.repeat} times`}>
              ×{item.repeat}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}

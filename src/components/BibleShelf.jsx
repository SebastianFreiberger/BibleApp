import { useEffect, useRef } from 'react'
import { CaretLeft as ChevronLeft, CaretRight as ChevronRight } from '@phosphor-icons/react'

// El ancho de cada lomo es proporcional a sus capítulos; el alto varía en un
// patrón fijo para que el estante no se vea perfectamente parejo.
const HEIGHT_STEPS = [0, 18, 8, 26, 12]
const SHADE_STEPS = [1, 0.86, 0.74, 0.94, 0.8]

function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16)
  const c = (v) => Math.max(0, Math.min(255, Math.round(v * k))).toString(16).padStart(2, '0')
  return `#${c((n >> 16) & 255)}${c((n >> 8) & 255)}${c(n & 255)}`
}

function Shelf({ title, subtitle, books, color, lang, onSelect, highlightKey }) {
  const trackRef = useRef(null)
  const spineRefs = useRef({})
  const scrollBy = (dir) => trackRef.current?.scrollBy({ left: dir * 600, behavior: 'smooth' })

  useEffect(() => {
    if (!highlightKey) return
    spineRefs.current[highlightKey]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [highlightKey])

  return (
    <section className="bs-shelf-section">
      <div className="bs-shelf-head">
        <div className="bs-shelf-title">
          <h2>{title}</h2>
          <span>{subtitle}</span>
        </div>
        <div className="bs-arrows">
          <button
            type="button"
            className="bs-arrow"
            aria-label={lang === 'es' ? 'Desplazar a la izquierda' : 'Scroll left'}
            onClick={() => scrollBy(-1)}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="bs-arrow"
            aria-label={lang === 'es' ? 'Desplazar a la derecha' : 'Scroll right'}
            onClick={() => scrollBy(1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="bs-shelfwrap">
        <div className="bs-shelf" ref={trackRef}>
          {books.map((book, i) => {
            const name = lang === 'es' ? book.es : book.en
            const width = Math.round(44 + Math.min(book.chapters, 60) * 1.1)
            const height = 170 + HEIGHT_STEPS[i % 5]
            const background = shade(color, SHADE_STEPS[i % 5])
            const active = book.key === highlightKey
            return (
              <button
                type="button"
                key={book.key}
                ref={(el) => { spineRefs.current[book.key] = el }}
                className={'bs-spine' + (active ? ' bs-spine-active' : '')}
                style={{ width, height, background }}
                onClick={() => onSelect(book)}
                aria-label={`${name}, ${book.chapters} ${lang === 'es' ? 'capítulos' : 'chapters'}`}
              >
                <span className="bs-spine-title">{name}</span>
                <span className="bs-spine-count">{book.chapters}</span>
              </button>
            )
          })}
        </div>
        <div className="bs-plank" />
        <div className="bs-plank-shadow" />
      </div>
    </section>
  )
}

/**
 * BibleShelf — vista "biblioteca" de los 66 libros.
 * Dos estantes (AT / NT), cada uno en una sola fila con scroll horizontal.
 *
 * Props:
 *  - books: BOOK_LIST (array con { key, es, en, chapters, testament })
 *  - lang: 'es' | 'en'
 *  - otLabel / ntLabel: títulos ya traducidos de cada testamento
 *  - onSelect(book): se llama al clickear un lomo
 *  - highlightKey: book.key a resaltar y llevar a la vista (ej. resultado de un buscador)
 */
export function BibleShelf({ books, lang, otLabel, ntLabel, onSelect, highlightKey }) {
  const otBooks = books.filter(b => b.testament === 'OT')
  const ntBooks = books.filter(b => b.testament === 'NT')
  const bookWord = lang === 'es' ? 'libros' : 'books'

  return (
    <div className="bs-root">
      <p className="bs-hint">
        {lang === 'es'
          ? 'Deslizá cada estante hacia los costados. El ancho de cada lomo refleja su cantidad de capítulos.'
          : 'Slide each shelf sideways — each spine’s width reflects how many chapters that book has.'}
      </p>
      <Shelf
        title={otLabel}
        subtitle={`${otBooks.length} ${bookWord}`}
        books={otBooks}
        color="#E8C070"
        lang={lang}
        onSelect={onSelect}
        highlightKey={highlightKey}
      />
      <Shelf
        title={ntLabel}
        subtitle={`${ntBooks.length} ${bookWord}`}
        books={ntBooks}
        color="#9FB4FF"
        lang={lang}
        onSelect={onSelect}
        highlightKey={highlightKey}
      />
    </div>
  )
}

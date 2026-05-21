import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Heart, Loader, Sun, Moon } from 'lucide-react'
import { useLang } from '../context'
import { useTheme, useFavorites } from '../hooks'
import { UI_TEXT, BOOK_LIST } from '../data'
import { fetchChapter } from '../services/bibleApi'
import { VersionSelector, Footer, ScrollToTop } from '../components'
import { SearchTab } from '../components/Header'

export function BiblePage() {
  const { lang, bibleVersion } = useLang()
  const { theme, toggleTheme } = useTheme()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const t = UI_TEXT[lang]

  const [view, setView] = useState('books')       // 'books' | 'chapters' | 'reading'
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedChapter, setSelectedChapter] = useState(1)
  const [verses, setVerses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (view !== 'reading' || !selectedBook) return
    setLoading(true)
    setError(false)
    setVerses([])
    fetchChapter(selectedBook.key, selectedChapter, lang, bibleVersion)
      .then(data => {
        if (data.length === 0) setError(true)
        else setVerses(data)
      })
      .finally(() => setLoading(false))
  }, [view, selectedBook, selectedChapter, lang, bibleVersion])

  const handleSelectBook = (book) => {
    setSelectedBook(book)
    setSelectedChapter(1)
    setView('chapters')
  }

  const handleSelectChapter = (ch) => {
    setSelectedChapter(ch)
    setView('reading')
  }

  const handleBack = () => {
    if (view === 'reading') setView('chapters')
    else if (view === 'chapters') setView('books')
  }

  const handlePrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(c => c - 1)
    } else {
      const idx = BOOK_LIST.findIndex(b => b.key === selectedBook.key)
      if (idx > 0) {
        const prev = BOOK_LIST[idx - 1]
        setSelectedBook(prev)
        setSelectedChapter(prev.chapters)
      }
    }
  }

  const handleNextChapter = () => {
    if (selectedChapter < selectedBook.chapters) {
      setSelectedChapter(c => c + 1)
    } else {
      const idx = BOOK_LIST.findIndex(b => b.key === selectedBook.key)
      if (idx < BOOK_LIST.length - 1) {
        const next = BOOK_LIST[idx + 1]
        setSelectedBook(next)
        setSelectedChapter(1)
      }
    }
  }

  const handleToggleFavorite = (verse) => {
    const bookName = lang === 'es' ? selectedBook.es : selectedBook.en
    const ref = `${bookName} ${selectedChapter}:${verse.verse}`
    if (isFavorite(ref, verse.text)) {
      removeFavorite(ref, verse.text)
    } else {
      addFavorite({ reference: ref, text: verse.text, version: bibleVersion })
    }
  }

  const bookName = (book) => lang === 'es' ? book.es : book.en

  const otBooks = BOOK_LIST.filter(b => b.testament === 'OT')
  const ntBooks = BOOK_LIST.filter(b => b.testament === 'NT')

  return (
    <div className="bible-page">
      {/* ── Top navigation bar ───────────────────────── */}
      <nav className="bible-topbar">
        <div className="bible-topbar-left">
          {view === 'books' ? (
            <Link to="/" className="bible-back-link">
              <ArrowLeft size={18} /> <span>{t.backBtn}</span>
            </Link>
          ) : (
            <button className="bible-back-link" onClick={handleBack}>
              <ArrowLeft size={18} />
              <span>
                {view === 'chapters'
                  ? t.bibleTitle
                  : bookName(selectedBook)}
              </span>
            </button>
          )}

          {view !== 'books' && (
            <div className="bible-breadcrumb">
              {view === 'chapters' && (
                <span className="bible-crumb-current">{bookName(selectedBook)}</span>
              )}
              {view === 'reading' && (
                <>
                  <span
                    className="bible-crumb-link"
                    onClick={() => setView('chapters')}
                  >
                    {bookName(selectedBook)}
                  </span>
                  <ChevronRight size={14} className="bible-crumb-sep" />
                  <span className="bible-crumb-current">
                    {t.chapter} {selectedChapter}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="bible-topbar-right">
          <VersionSelector t={t} compact />
          <button
            className="theme-btn"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </nav>

      {/* ── Main content ─────────────────────────────── */}
      <main className="bible-main">

        {/* Books view */}
        {view === 'books' && (
          <div className="bible-books-view">
            <div className="bible-page-header">
              <BookOpen size={36} className="bible-page-icon" />
              <h1>{t.bibleTitle}</h1>
              <p>{t.bibleSubtitle}</p>
              <div className="bible-search-bar">
                <SearchTab t={t} />
              </div>
            </div>

            <section className="bible-testament-section">
              <h2 className="bible-testament-title">
                <span className="testament-badge ot">{t.oldTestament}</span>
                <span className="testament-count">39 {lang === 'es' ? 'libros' : 'books'}</span>
              </h2>
              <div className="bible-book-grid">
                {otBooks.map(book => (
                  <button
                    key={book.key}
                    className="bible-book-card"
                    onClick={() => handleSelectBook(book)}
                  >
                    <span className="book-name">{bookName(book)}</span>
                    <span className="book-chapters">
                      {book.chapters} {book.chapters === 1
                        ? (lang === 'es' ? 'capítulo' : 'chapter')
                        : t.chaptersCount}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="bible-testament-section">
              <h2 className="bible-testament-title">
                <span className="testament-badge nt">{t.newTestament}</span>
                <span className="testament-count">27 {lang === 'es' ? 'libros' : 'books'}</span>
              </h2>
              <div className="bible-book-grid">
                {ntBooks.map(book => (
                  <button
                    key={book.key}
                    className="bible-book-card"
                    onClick={() => handleSelectBook(book)}
                  >
                    <span className="book-name">{bookName(book)}</span>
                    <span className="book-chapters">
                      {book.chapters} {book.chapters === 1
                        ? (lang === 'es' ? 'capítulo' : 'chapter')
                        : t.chaptersCount}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Chapters view */}
        {view === 'chapters' && selectedBook && (
          <div className="bible-chapters-view">
            <div className="bible-page-header small">
              <h2>{bookName(selectedBook)}</h2>
              <p>{selectedBook.chapters} {t.chaptersCount}</p>
            </div>
            <div className="bible-chapter-grid">
              {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(ch => (
                <button
                  key={ch}
                  className="bible-chapter-btn"
                  onClick={() => handleSelectChapter(ch)}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reading view */}
        {view === 'reading' && selectedBook && (
          <div className="bible-reading-view">
            <div className="bible-reading-header">
              <h2>{bookName(selectedBook)} {selectedChapter}</h2>
              <span className="bible-version-badge">{bibleVersion}</span>
            </div>

            {loading && (
              <div className="bible-loading">
                <Loader size={28} className="spin" />
                <p>{t.loadingChapter}</p>
              </div>
            )}

            {error && !loading && (
              <div className="bible-error">
                <p>{t.errorLoadingChapter}</p>
              </div>
            )}

            {!loading && !error && verses.length > 0 && (
              <div className="bible-verse-list">
                {verses.map(v => {
                  const bookName_ = lang === 'es' ? selectedBook.es : selectedBook.en
                  const ref = `${bookName_} ${selectedChapter}:${v.verse}`
                  const fav = isFavorite(ref, v.text)
                  return (
                    <div key={v.verse} className="bible-verse-item">
                      <span className="bible-verse-num">{v.verse}</span>
                      <p className="bible-verse-text">{v.text}</p>
                      <button
                        className={'bible-verse-fav ' + (fav ? 'active' : '')}
                        onClick={() => handleToggleFavorite(v)}
                        title={fav ? t.removeFavorite : t.addFavorite}
                      >
                        <Heart size={14} fill={fav ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Prev / Next chapter navigation */}
            <div className="bible-chapter-nav">
              <button
                className="bible-nav-btn"
                onClick={handlePrevChapter}
                disabled={selectedBook.id === 1 && selectedChapter === 1}
              >
                <ChevronLeft size={18} /> {t.prevChapter}
              </button>
              <span className="bible-nav-label">
                {t.chapter} {selectedChapter} / {selectedBook.chapters}
              </span>
              <button
                className="bible-nav-btn"
                onClick={handleNextChapter}
                disabled={selectedBook.id === 66 && selectedChapter === selectedBook.chapters}
              >
                {t.nextChapter} <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

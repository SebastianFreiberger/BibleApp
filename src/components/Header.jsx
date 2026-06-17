import { useState, useEffect, useRef } from 'react'
import { BookHeart, CalendarHeart, MessageCircleHeart,
         User, Heart, X, BookOpen, Book, Library, Search,
         ChevronRight, Languages, LogOut, Share2 } from 'lucide-react'
import { YMTLogo } from './YMTLogo'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { VersionSelector } from './VersionSelector'

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?'
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Header({ theme, toggleTheme, activeTab, setActiveTab, onDailyTabClick, favorites = [], t }) {
  const { user, isAuthenticated, logout } = useAuth()
  const { lang, setLang } = useLang()
  const [showFavorites, setShowFavorites] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef()

  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`ymt_avatar_${user.id}`)
      if (saved) setAvatarUrl(saved)
    }
  }, [user?.id])

  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const raw = new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
  const formattedDate = raw.charAt(0).toUpperCase() + raw.slice(1)

  return (
    <header className="header">

      {/* ── Navbar ──────────────────────────────────── */}
      <nav className="navbar" ref={navRef}>
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <YMTLogo size={28} />
          <span>YMT</span>
        </Link>

        {/* Controles desktop */}
        <div className="navbar-controls">
          <div className="lang-toggle">
            <button className={'lang-btn' + (lang === 'es' ? ' active' : '')} onClick={() => setLang('es')}>ES</button>
            <button className={'lang-btn' + (lang === 'en' ? ' active' : '')} onClick={() => setLang('en')}>EN</button>
          </div>

          <VersionSelector t={t} />

          <button
            className={'nav-fav-btn' + (showFavorites ? ' active' : '')}
            onClick={() => setShowFavorites(o => !o)}
            title={t.favorites}
          >
            <Heart size={17} fill={favorites.length > 0 ? 'currentColor' : 'none'} />
            {favorites.length > 0 && <span className="nav-fav-badge">{favorites.length}</span>}
          </button>

          {isAuthenticated ? (
            <Link to="/perfil" className="nav-user-btn">
              <div className="nav-user-avatar">
                {avatarUrl
                  ? <img src={avatarUrl} alt="avatar" />
                  : user?.name
                    ? <span>{getInitials(user.name)}</span>
                    : <User size={18} strokeWidth={1.5} />
                }
              </div>
              <span className="nav-user-name">{user?.name?.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link to="/login" className="nav-login-btn">
              <User size={15} />
              <span>{t.login}</span>
            </Link>
          )}
        </div>

        {/* Botón libro — solo mobile */}
        <button
          className={'book-menu-btn' + (menuOpen ? ' open' : '')}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {menuOpen ? <BookOpen size={22} /> : <Book size={22} />}
        </button>

        {/* Panel glassmorphism — solo mobile */}
        <div className={'mobile-menu-panel' + (menuOpen ? ' open' : '')}>

          {/* Perfil / Login */}
          {isAuthenticated ? (
            <Link to="/perfil" className="mmp-item" onClick={() => setMenuOpen(false)}>
              <div className="nav-user-avatar mmp-avatar">
                {avatarUrl
                  ? <img src={avatarUrl} alt="avatar" />
                  : user?.name
                    ? <span>{getInitials(user.name)}</span>
                    : <User size={16} strokeWidth={1.5} />
                }
              </div>
              <div className="mmp-item-text">
                <span className="mmp-item-name">{user?.name?.split(' ')[0]}</span>
                <span className="mmp-item-sub">{lang === 'es' ? 'Ver perfil' : 'View profile'}</span>
              </div>
              <ChevronRight size={15} className="mmp-chevron" />
            </Link>
          ) : (
            <Link to="/login" className="mmp-item" onClick={() => setMenuOpen(false)}>
              <div className="mmp-icon-wrap">
                <User size={16} />
              </div>
              <div className="mmp-item-text">
                <span className="mmp-item-name">{t.login}</span>
              </div>
              <ChevronRight size={15} className="mmp-chevron" />
            </Link>
          )}

          <div className="mmp-sep" />

          {/* Versión bíblica */}
          <div className="mmp-row">
            <div className="mmp-row-left">
              <div className="mmp-icon-wrap mmp-icon-version">
                <BookOpen size={15} />
              </div>
              <span className="mmp-item-name">{lang === 'es' ? 'Versión' : 'Version'}</span>
            </div>
            <VersionSelector t={t} />
          </div>

          <div className="mmp-sep" />

          {/* Favoritos */}
          <button
            className={'mmp-item' + (showFavorites ? ' active' : '')}
            onClick={() => { setShowFavorites(o => !o); setMenuOpen(false) }}
          >
            <div className="mmp-icon-wrap mmp-icon-fav">
              <Heart size={16} fill={favorites.length > 0 ? 'currentColor' : 'none'} />
            </div>
            <div className="mmp-item-text">
              <span className="mmp-item-name">{t.favorites}</span>
            </div>
            {favorites.length > 0 && <span className="mmp-badge">{favorites.length}</span>}
          </button>

          <div className="mmp-sep" />

          {/* Idioma */}
          <div className="mmp-row">
            <div className="mmp-row-left">
              <div className="mmp-icon-wrap mmp-icon-lang">
                <Languages size={15} />
              </div>
              <span className="mmp-item-name">{lang === 'es' ? 'Idioma' : 'Language'}</span>
            </div>
            <div className="lang-toggle">
              <button className={'lang-btn' + (lang === 'es' ? ' active' : '')} onClick={() => setLang('es')}>ES</button>
              <button className={'lang-btn' + (lang === 'en' ? ' active' : '')} onClick={() => setLang('en')}>EN</button>
            </div>
          </div>

          {/* Cerrar sesión — solo si está autenticado */}
          {isAuthenticated && (
            <>
              <div className="mmp-sep" />
              <button
                className="mmp-item mmp-item-logout"
                onClick={() => { logout(); setMenuOpen(false) }}
              >
                <div className="mmp-icon-wrap mmp-icon-logout">
                  <LogOut size={16} />
                </div>
                <div className="mmp-item-text">
                  <span className="mmp-item-name">{lang === 'es' ? 'Cerrar sesión' : 'Log out'}</span>
                </div>
              </button>
            </>
          )}

        </div>
      </nav>

      {/* ── Fecha + Titulo + Tabs ─────────────────────── */}
      <div className="header-sub">
        <p className="header-date">{formattedDate}</p>
        <h1 className="header-title">{t.title}</h1>
        <div className="tabs">
          <button className={'tab' + (activeTab === 'daily' ? ' active' : '')} onClick={() => { setActiveTab('daily'); onDailyTabClick?.() }}>
            <CalendarHeart size={16} className="tab-icon tab-icon-daily" /> {t.dailyTab}
          </button>
          <button className={'tab' + (activeTab === 'mood' ? ' active' : '')} onClick={() => setActiveTab('mood')}>
            <MessageCircleHeart size={16} className="tab-icon tab-icon-mood" /> {t.moodTab}
          </button>
          <Link to="/biblia" className="tab">
            <Library size={16} className="tab-icon tab-icon-bible" /> {t.bibleTab}
          </Link>
        </div>
      </div>

      {showFavorites && (
        <FavoritesPanel favorites={favorites} t={t} lang={lang} onClose={() => setShowFavorites(false)} />
      )}
    </header>
  )
}

export function SearchTab({ t }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef()
  const navigate = useNavigate()
  const { lang } = useLang()

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/busqueda?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
    if (e.key === 'Escape') setQuery('')
  }

  return (
    <div className="search-tab-wrap expanded">
      <Search size={15} className="search-tab-icon" />
      <input
        ref={inputRef}
        className="search-tab-input"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={lang === 'en' ? 'Search the Bible…' : 'Buscar en la Biblia…'}
      />
    </div>
  )
}

async function shareVerse(verse) {
  const text = `"${verse.text}"\n— ${verse.reference}${verse.version ? ` (${verse.version})` : ''}\n\nyourmessagetoday.vercel.app`
  if (navigator.share) { try { await navigator.share({ text }) } catch {} }
  else { await navigator.clipboard.writeText(text) }
}

function FavoritesPanel({ favorites, t, lang, onClose }) {
  return (
    <div className="favorites-panel">
      <div className="favorites-panel-header">
        <div className="favorites-panel-title">
          <Heart size={18} fill="currentColor" />
          <span>{t.favorites}</span>
          {favorites.length > 0 && <span className="favorites-count">{favorites.length}</span>}
        </div>
        <button className="favorites-close" onClick={onClose} aria-label="Cerrar">
          <X size={18} />
        </button>
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <BookOpen size={36} />
          <p>{t.noFavorites}</p>
        </div>
      ) : (
        <div className="favorites-list">
          {[...favorites].slice(-3).reverse().map((verse, i) => (
            <div key={i} className="favorite-item">
              <p className="favorite-text">"{verse.text}"</p>
              <div className="favorite-meta">
                <span className="favorite-reference">— {verse.reference}</span>
                {verse.version && <span className="favorite-version">{verse.version}</span>}
                <button
                  className="favorite-share-btn"
                  onClick={() => shareVerse(verse)}
                  title={lang === 'es' ? 'Compartir' : 'Share'}
                >
                  <Share2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="favorites-panel-footer">
        <Link to="/perfil" className="favorites-goto-profile" onClick={onClose}>
          <span>{t.recentFavoritesTitle}</span>
          <ChevronRight size={15} />
        </Link>
      </div>
    </div>
  )
}

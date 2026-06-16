import { useState, useMemo, useEffect, useRef } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  ArrowLeft, Heart, Flame, BarChart2, Globe, BookOpen,
  CalendarDays, BookMarked, Sun, Moon, LogOut, Trash2,
  User, Check, ChevronLeft, ChevronRight, Clock, Sparkles,
  Camera, Pencil, Sliders
} from 'lucide-react'
import { useAuth } from '../context'
import { useLang } from '../context'
import { useTheme, useFavorites, useStreak } from '../hooks'
import { UI_TEXT, BIBLE_VERSIONS } from '../data'
import { Footer, ScrollToTop } from '../components'

// ── Helpers ────────────────────────────────────────────
function getInitials(name = '') {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?'
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getMemberSince(createdAt, lang) {
  if (!createdAt) return null
  try {
    return new Date(createdAt).toLocaleDateString(
      lang === 'es' ? 'es-ES' : 'en-US',
      { year: 'numeric', month: 'long' }
    )
  } catch { return null }
}

// ── Calendar helper ────────────────────────────────────
function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay() // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // Start week on Monday (shift Sunday to end)
  const startOffset = (firstDay + 6) % 7
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

const WEEK_DAYS_ES = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const WEEK_DAYS_EN = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December']

// ── Section components ─────────────────────────────────

function FavoritesSection({ favorites, removeFavorite, t }) {
  return (
    <div className="ps-section">
      <div className="ps-section-header">
        <Heart size={20} className="ps-section-icon icon-fav" />
        <h2>{t.recentFavoritesTitle}</h2>
        <span className="ps-badge">{favorites.length}</span>
      </div>
      {favorites.length === 0 ? (
        <div className="ps-empty">
          <Heart size={36} strokeWidth={1.5} />
          <p>{t.noFavoritesProfile}</p>
        </div>
      ) : (
        <div className="ps-fav-list">
          {favorites.map((fav, i) => (
            <div key={i} className="ps-fav-card">
              <div className="ps-fav-body">
                <p className="ps-fav-text">"{fav.text}"</p>
                <div className="ps-fav-meta">
                  <span className="ps-fav-ref">— {fav.reference}</span>
                  {fav.version && <span className="ps-fav-version">{fav.version}</span>}
                </div>
              </div>
              <button
                className="ps-fav-remove"
                onClick={() => removeFavorite(fav.reference, fav.text)}
                title={t.removeFavorite}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatsSection({ favorites, streak, lang, bibleVersion, t }) {
  const langLabel = lang === 'es' ? '🇪🇸 Español' : '🇺🇸 English'
  const streakUnit = streak === 1 ? t.streakDay : t.streakDays
  return (
    <div className="ps-section">
      <div className="ps-section-header">
        <BarChart2 size={20} className="ps-section-icon icon-streak" />
        <h2>{t.statsTitle}</h2>
      </div>
      <div className="ps-stats-grid">
        <div className="ps-stat stat-fav">
          <div className="ps-stat-icon"><Heart size={22} /></div>
          <div className="ps-stat-val">{favorites.length}</div>
          <div className="ps-stat-label">{t.savedVerses}</div>
        </div>
        <div className="ps-stat stat-streak">
          <div className="ps-stat-icon"><Flame size={22} /></div>
          <div className="ps-stat-val">{streak}</div>
          <div className="ps-stat-label">{streakUnit} {t.streakLabel.toLowerCase()}</div>
        </div>
        <div className="ps-stat stat-lang">
          <div className="ps-stat-icon"><Globe size={22} /></div>
          <div className="ps-stat-val ps-stat-val-sm">{langLabel}</div>
          <div className="ps-stat-label">{t.languageLabel}</div>
        </div>
        <div className="ps-stat stat-ver">
          <div className="ps-stat-icon"><BookOpen size={22} /></div>
          <div className="ps-stat-val ps-stat-val-sm">{bibleVersion}</div>
          <div className="ps-stat-label">{t.versionLabel}</div>
        </div>
      </div>
    </div>
  )
}

function PreferencesSection({ lang, bibleVersion, setBibleVersion, theme, toggleTheme, t }) {
  const es = lang === 'es'
  const versions = BIBLE_VERSIONS[lang] || []
  return (
    <div className="ps-section">
      <div className="ps-section-header">
        <Sliders size={20} className="ps-section-icon icon-prefs" />
        <h2>{es ? 'Preferencias' : 'Preferences'}</h2>
      </div>

      {/* Apariencia */}
      <p className="pref-group-title">{es ? 'Apariencia' : 'Appearance'}</p>
      <div className="pref-theme-options">
        <button
          className={'pref-theme-card' + (theme === 'light' ? ' active' : '')}
          onClick={() => theme !== 'light' && toggleTheme()}
        >
          <Sun size={20} />
          <span>{es ? 'Claro' : 'Light'}</span>
          {theme === 'light' && <Check size={15} className="pref-theme-check" />}
        </button>
        <button
          className={'pref-theme-card' + (theme === 'dark' ? ' active' : '')}
          onClick={() => theme !== 'dark' && toggleTheme()}
        >
          <Moon size={20} />
          <span>{es ? 'Oscuro' : 'Dark'}</span>
          {theme === 'dark' && <Check size={15} className="pref-theme-check" />}
        </button>
      </div>

      {/* Versión de la Biblia */}
      <p className="pref-group-title">{es ? 'Versión de la Biblia' : 'Bible version'}</p>
      <p className="ps-version-hint">
        {es
          ? 'Elegí la versión que se usará por defecto en toda la aplicación.'
          : 'Choose the version used by default across the entire application.'}
      </p>
      <div className="ps-version-list">
        {versions.map(v => (
          <button
            key={v.code}
            className={'ps-version-card' + (bibleVersion === v.code ? ' active' : '')}
            onClick={() => setBibleVersion(v.code)}
          >
            <div className="ps-ver-left">
              <span className="ps-ver-short">{v.shortName}</span>
              <span className="ps-ver-name">{v.name}</span>
            </div>
            {bibleVersion === v.code && <Check size={18} className="ps-ver-check" />}
          </button>
        ))}
      </div>
    </div>
  )
}

function CalendarSection({ streak, activeDates, lang, t }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const cells = buildCalendar(viewYear, viewMonth)
  const activeSet = new Set(activeDates)
  const weekDays = lang === 'es' ? WEEK_DAYS_ES : WEEK_DAYS_EN
  const monthName = lang === 'es' ? MONTHS_ES[viewMonth] : MONTHS_EN[viewMonth]
  const todayStr = today.toISOString().split('T')[0]
  const streakUnit = streak === 1 ? t.streakDay : t.streakDays

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  return (
    <div className="ps-section">
      <div className="ps-section-header">
        <CalendarDays size={20} className="ps-section-icon icon-cal" />
        <h2>{lang === 'es' ? 'Calendario de racha' : 'Streak calendar'}</h2>
      </div>

      <div className="ps-streak-banner">
        <Flame size={28} className="ps-streak-fire" />
        <div>
          <div className="ps-streak-num">{streak}</div>
          <div className="ps-streak-label">{streakUnit} {t.streakLabel.toLowerCase()}</div>
        </div>
      </div>

      <div className="ps-calendar">
        <div className="ps-cal-header">
          <button className="ps-cal-nav" onClick={prevMonth}><ChevronLeft size={16} /></button>
          <span className="ps-cal-title">{monthName} {viewYear}</span>
          <button className="ps-cal-nav" onClick={nextMonth}><ChevronRight size={16} /></button>
        </div>
        <div className="ps-cal-grid">
          {weekDays.map((d, i) => (
            <div key={i} className="ps-cal-weekday">{d}</div>
          ))}
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} />
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isActive = activeSet.has(dateStr)
            const isToday = dateStr === todayStr
            return (
              <div
                key={dateStr}
                className={`ps-cal-day${isActive ? ' active' : ''}${isToday ? ' today' : ''}`}
              >
                <span className="ps-cal-day-num">{day}</span>
              </div>
            )
          })}
        </div>
        <div className="ps-cal-legend">
          <span className="ps-cal-dot active" />
          <span>{lang === 'es' ? 'Día activo' : 'Active day'}</span>
        </div>
      </div>
    </div>
  )
}

function PlansSection({ lang }) {
  const plans = lang === 'es' ? [
    { title: 'Biblia en un año',       desc: '3-4 capítulos por día · 365 días',   icon: '📅' },
    { title: 'Nuevo Testamento 90 días', desc: '3 capítulos por día · 90 días',    icon: '✝️' },
    { title: 'Salmos y Proverbios',    desc: '1 capítulo diario · 31 días',         icon: '🌿' },
    { title: 'Evangelios',             desc: 'Mateo, Marcos, Lucas, Juan · 60 días',icon: '📖' },
  ] : [
    { title: 'Bible in a Year',        desc: '3-4 chapters per day · 365 days',    icon: '📅' },
    { title: 'New Testament 90 days',  desc: '3 chapters per day · 90 days',       icon: '✝️' },
    { title: 'Psalms & Proverbs',      desc: '1 chapter daily · 31 days',          icon: '🌿' },
    { title: 'The Gospels',            desc: 'Matthew, Mark, Luke, John · 60 days',icon: '📖' },
  ]

  return (
    <div className="ps-section">
      <div className="ps-section-header">
        <BookMarked size={20} className="ps-section-icon icon-plans" />
        <h2>{lang === 'es' ? 'Planes de lectura' : 'Reading plans'}</h2>
        <span className="ps-badge ps-badge-soon">{lang === 'es' ? 'Próximamente' : 'Coming soon'}</span>
      </div>
      <p className="ps-version-hint">
        {lang === 'es'
          ? 'Seguí tu progreso con planes de lectura guiados. Esta función estará disponible pronto.'
          : 'Track your progress with guided reading plans. This feature will be available soon.'}
      </p>
      <div className="ps-plans-grid">
        {plans.map((plan, i) => (
          <div key={i} className="ps-plan-card">
            <span className="ps-plan-icon">{plan.icon}</span>
            <div className="ps-plan-info">
              <span className="ps-plan-title">{plan.title}</span>
              <span className="ps-plan-desc">{plan.desc}</span>
            </div>
            <div className="ps-plan-lock">
              <Clock size={14} />
            </div>
          </div>
        ))}
      </div>
      <div className="ps-plans-coming">
        <Sparkles size={18} />
        <span>{lang === 'es' ? 'Estamos trabajando en esto' : 'We are working on this'}</span>
      </div>
    </div>
  )
}

// ── Profile Info Section ───────────────────────────────
function ProfileInfoSection({ user, avatarUrl, onAvatarChange, onSave, lang }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileRef = useRef()
  const es = lang === 'es'
  const memberSince = getMemberSince(user?.createdAt, lang)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) {
      setError(es ? 'La imagen no puede superar 3MB' : 'Image cannot exceed 3MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => { onAvatarChange(ev.target.result); setError('') }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!name.trim()) { setError(es ? 'El nombre no puede estar vacío' : 'Name cannot be empty'); return }
    if (password && password !== confirm) { setError(es ? 'Las contraseñas no coinciden' : 'Passwords do not match'); return }
    onSave({ name: name.trim(), phone, password: password || null })
    setEditing(false); setPassword(''); setConfirm(''); setError('')
    setSuccess(true); setTimeout(() => setSuccess(false), 2500)
  }

  const handleCancel = () => {
    setEditing(false)
    setName(user?.name || ''); setPhone(user?.phone || '')
    setPassword(''); setConfirm(''); setError('')
  }

  return (
    <div className="ps-section">
      <div className="ps-section-header">
        <User size={20} className="ps-section-icon icon-ver" />
        <h2>{es ? 'Mi perfil' : 'My profile'}</h2>
      </div>

      {/* Avatar */}
      <div className="pi-avatar-wrap">
        <div className="pi-avatar">
          {avatarUrl
            ? <img src={avatarUrl} alt="avatar" />
            : user?.name
              ? <span>{getInitials(user.name)}</span>
              : <User size={36} strokeWidth={1.5} />
          }
          <button className="pi-avatar-edit" onClick={() => fileRef.current.click()} title={es ? 'Cambiar foto' : 'Change photo'}>
            <Camera size={16} />
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} hidden />
      </div>

      {/* Fields */}
      <div className="pi-fields">
        <div className="pi-field">
          <span className="pi-field-label">{es ? 'Nombre' : 'Name'}</span>
          {editing
            ? <input className="pi-input" value={name} onChange={e => { setName(e.target.value); setError('') }} />
            : <span className="pi-field-value">{user?.name}</span>
          }
        </div>

        <div className="pi-field">
          <span className="pi-field-label">Email</span>
          <span className="pi-field-value pi-field-muted">{user?.email}</span>
        </div>

        <div className="pi-field">
          <span className="pi-field-label">{es ? 'Teléfono' : 'Phone'}</span>
          {editing
            ? <input className="pi-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder={es ? 'Sin teléfono' : 'No phone'} />
            : <span className="pi-field-value pi-field-muted">{user?.phone || '—'}</span>
          }
        </div>

        {memberSince && (
          <div className="pi-field">
            <span className="pi-field-label">{es ? 'Miembro desde' : 'Member since'}</span>
            <span className="pi-field-value pi-field-muted">{memberSince}</span>
          </div>
        )}

        {editing && (
          <>
            <div className="pi-field">
              <span className="pi-field-label">{es ? 'Nueva contraseña' : 'New password'}</span>
              <input
                className="pi-input" type="password"
                placeholder={es ? 'Dejar vacío para no cambiar' : 'Leave empty to keep current'}
                value={password} onChange={e => { setPassword(e.target.value); setError('') }}
              />
            </div>
            {password && (
              <div className="pi-field">
                <span className="pi-field-label">{es ? 'Confirmar contraseña' : 'Confirm password'}</span>
                <input
                  className="pi-input" type="password"
                  value={confirm} onChange={e => { setConfirm(e.target.value); setError('') }}
                />
              </div>
            )}
          </>
        )}

        {error && <p className="pi-msg pi-error">{error}</p>}
        {success && <p className="pi-msg pi-success">{es ? '¡Cambios guardados!' : 'Changes saved!'}</p>}
      </div>

      <div className="pi-actions">
        {editing ? (
          <>
            <button className="pi-btn-cancel" onClick={handleCancel}>{es ? 'Cancelar' : 'Cancel'}</button>
            <button className="pi-btn-save" onClick={handleSave}>{es ? 'Guardar cambios' : 'Save changes'}</button>
          </>
        ) : (
          <button className="pi-btn-edit" onClick={() => setEditing(true)}>{es ? 'Editar perfil' : 'Edit profile'}</button>
        )}
      </div>
    </div>
  )
}

// ── Sidebar nav items ──────────────────────────────────
function SidebarItem({ id, icon: Icon, label, active, badge, onClick }) {
  return (
    <button
      className={'ps-nav-item' + (active ? ' active' : '')}
      onClick={() => onClick(id)}
    >
      <Icon size={18} />
      <span>{label}</span>
      {badge != null && <span className="ps-nav-badge">{badge}</span>}
    </button>
  )
}

// ── Main component ─────────────────────────────────────
export function ProfilePage() {
  const { user, isAuthenticated, loading, logout, updateProfile } = useAuth()
  const { lang, bibleVersion, setBibleVersion } = useLang()
  const { theme, toggleTheme } = useTheme()

  const { favorites, removeFavorite } = useFavorites()
  const { streak, activeDates } = useStreak()
  const t = UI_TEXT[lang]

  const [activeSection, setActiveSection] = useState('favorites')
  const [avatarUrl, setAvatarUrl] = useState(null)

  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`ymt_avatar_${user.id}`)
      if (saved) setAvatarUrl(saved)
    }
  }, [user?.id])

  const handleAvatarChange = (data) => {
    localStorage.setItem(`ymt_avatar_${user.id}`, data)
    setAvatarUrl(data)
  }

  const handleSaveProfile = ({ name, phone, password }) => {
    updateProfile({ name, phone, password })
  }

  const memberSince = useMemo(() => getMemberSince(user?.createdAt, lang), [user?.id, lang])
  const initials = getInitials(user?.name)

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>
  if (!isAuthenticated) return <Navigate to="/login" />

  const navItems = [
    { id: 'profile',   icon: User,          label: lang === 'es' ? 'Mi perfil' : 'My profile' },
    { id: 'favorites', icon: Heart,         label: t.recentFavoritesTitle, badge: favorites.length || null },
    { id: 'stats',     icon: BarChart2,     label: t.statsTitle },
    { id: 'preferences', icon: Sliders,      label: lang === 'es' ? 'Preferencias' : 'Preferences' },
    { id: 'calendar',  icon: CalendarDays,  label: lang === 'es' ? 'Calendario' : 'Calendar' },
    { id: 'plans',     icon: BookMarked,    label: lang === 'es' ? 'Planes de lectura' : 'Reading plans' },
  ]

  return (
    <div className="profile-page">
      {/* ── Top bar ───────────────────────────────── */}
      <nav className="bible-topbar">
        <div className="bible-topbar-left">
          <Link to="/" className="bible-back-link">
            <ArrowLeft size={18} /> <span>{t.backBtn}</span>
          </Link>
        </div>
        <div className="bible-topbar-right">
          <button className="theme-btn" onClick={toggleTheme} aria-label="toggle theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button className="profile-logout-btn" onClick={logout} title={t.logout}>
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* ── Layout: sidebar + content ─────────────── */}
      <div className="profile-layout">

        {/* Sidebar */}
        <aside className="profile-sidebar">
          {/* Mini profile */}
          <div className="ps-mini-profile">
            <div className="ps-mini-avatar" onClick={() => setActiveSection('profile')}>
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" />
                : initials
                  ? initials
                  : <User size={18} strokeWidth={1.5} />
              }
              <div className="ps-mini-avatar-edit"><Camera size={12} /></div>
            </div>
            <div className="ps-mini-info">
              <button className="ps-mini-name-btn" onClick={() => setActiveSection('profile')}>
                {user?.name} <Pencil size={12} />
              </button>
              {memberSince && (
                <span className="ps-mini-since">
                  <User size={11} /> {memberSince}
                </span>
              )}
            </div>
          </div>

          <div className="ps-nav-divider" />

          {/* Navigation */}
          <nav className="ps-nav">
            {navItems.map(item => (
              <SidebarItem
                key={item.id}
                {...item}
                active={activeSection === item.id}
                onClick={setActiveSection}
              />
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="profile-content">
          {activeSection === 'profile' && (
            <ProfileInfoSection
              user={user}
              avatarUrl={avatarUrl}
              onAvatarChange={handleAvatarChange}
              onSave={handleSaveProfile}
              lang={lang}
            />
          )}
          {activeSection === 'favorites' && (
            <FavoritesSection favorites={favorites} removeFavorite={removeFavorite} t={t} />
          )}
          {activeSection === 'stats' && (
            <StatsSection favorites={favorites} streak={streak} lang={lang} bibleVersion={bibleVersion} t={t} />
          )}
          {activeSection === 'preferences' && (
            <PreferencesSection
              lang={lang} bibleVersion={bibleVersion} setBibleVersion={setBibleVersion}
              theme={theme} toggleTheme={toggleTheme} t={t}
            />
          )}
          {activeSection === 'calendar' && (
            <CalendarSection streak={streak} activeDates={activeDates} lang={lang} t={t} />
          )}
          {activeSection === 'plans' && (
            <PlansSection lang={lang} />
          )}
        </main>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

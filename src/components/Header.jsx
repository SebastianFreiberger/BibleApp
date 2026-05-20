import { Sun, Moon, BookHeart, CalendarHeart, MessageCircleHeart, User, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Header({ 
  lang, 
  setLang, 
  theme, 
  toggleTheme, 
  activeTab, 
  setActiveTab, 
  t 
}) {
  const { user, isAuthenticated, logout } = useAuth()
  
  const today = new Date()
  const formattedDate = today.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="header">
      <div className="top-controls">
        <div className="language-selector">
          <button 
            className={'lang-btn ' + (lang === 'es' ? 'active' : '')}
            onClick={() => setLang('es')}
          >
            🇪🇸 ES
          </button>
          <button 
            className={'lang-btn ' + (lang === 'en' ? 'active' : '')}
            onClick={() => setLang('en')}
          >
            🇺🇸 EN
          </button>
        </div>
        
        <div className="header-right">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">
                <User size={16} /> {user?.name}
              </span>
              <button className="logout-btn" onClick={logout} title={t.logout || 'Cerrar sesión'}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-link">
              <User size={18} /> <span>{t.login || 'Iniciar sesión'}</span>
            </Link>
          )}
          
          <button 
            className="theme-btn"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
      <h1><BookHeart size={32} className="title-icon" /> {t.title}</h1>
      <p className="date">{formattedDate}</p>
      
      <div className="tabs">
        <button 
          className={'tab ' + (activeTab === 'daily' ? 'active' : '')}
          onClick={() => setActiveTab('daily')}
        >
          <CalendarHeart size={18} className="tab-icon tab-icon-daily" /> {t.dailyTab}
        </button>
        <button 
          className={'tab ' + (activeTab === 'mood' ? 'active' : '')}
          onClick={() => setActiveTab('mood')}
        >
          <MessageCircleHeart size={18} className="tab-icon tab-icon-mood" /> {t.moodTab}
        </button>
      </div>
    </header>
  )
}

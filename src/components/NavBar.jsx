import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Users, HeartHandshake, BookOpen, Menu, X } from 'lucide-react'

const NAV_ITEMS = {
  es: [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/about', label: 'Quienes Somos', icon: Users },
    { path: '/mission', label: 'Que Hacemos', icon: HeartHandshake },
    { path: '/bible', label: 'Biblia', icon: BookOpen },
  ],
  en: [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About Us', icon: Users },
    { path: '/mission', label: 'What We Do', icon: HeartHandshake },
    { path: '/bible', label: 'Bible', icon: BookOpen },
  ]
}

export function NavBar({ lang = 'es' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const items = NAV_ITEMS[lang] || NAV_ITEMS.es

  return (
    <nav className="global-nav">
      <div className="nav-brand">
        <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
          <BookOpen size={22} />
          <span>{lang === 'es' ? 'Tu Mensaje de Hoy' : 'Your Message Today'}</span>
        </Link>
      </div>

      <button
        className="nav-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {items.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <li key={item.path}>
              <Link
                to={item.path + (lang !== 'es' ? `?lang=${lang}` : '')}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

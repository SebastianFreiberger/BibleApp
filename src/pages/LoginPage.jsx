import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useLang } from '../context'
import { UI_TEXT } from '../data'
import { BookHeart, Mail, Lock, LogIn, AlertCircle, ArrowLeft } from 'lucide-react'

export function LoginPage() {
  const { lang } = useLang()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const t = UI_TEXT[lang]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    if (result.success) navigate('/')
    else setError(t.invalidCredentials)
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">

        <Link to="/" className="auth-back">
          <ArrowLeft size={16} />
          {lang === 'es' ? 'Volver al inicio' : 'Back to home'}
        </Link>

        <div className="auth-header">
          <BookHeart size={48} className="auth-logo" />
          <h1>{t.loginTitle}</h1>
          <p>{t.loginSubtitle}</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email"><Mail size={18} />{t.emailLabel}</label>
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tu@email.com" />
          </div>

          <div className="form-group">
            <label htmlFor="password"><Lock size={18} />{t.passwordLabel}</label>
            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span>{t.loggingIn}</span> : <><LogIn size={18} /><span>{t.loginBtn}</span></>}
          </button>
        </form>

        <p className="auth-switch">
          {t.noAccount} <Link to="/register">{t.registerLink}</Link>
        </p>
      </div>
    </div>
  )
}

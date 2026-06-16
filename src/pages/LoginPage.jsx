import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useLang } from '../context'
import { UI_TEXT } from '../data'
import {
  BookHeart, Mail, Lock, LogIn, AlertCircle, ArrowLeft,
  Eye, EyeOff, CheckCircle2
} from 'lucide-react'

// ── Flujo recuperación de contraseña ───────────────────
function ForgotPassword({ t, sendPasswordReset, onBack }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await sendPasswordReset(email)
    setLoading(false)
    if (!result.success) { setError(t.forgotEmailNotFound); return }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="forgot-done">
        <CheckCircle2 size={44} className="forgot-done-icon" />
        <h3>{t.forgotSentTitle}</h3>
        <p>{t.forgotSentDesc} <strong>{email}</strong></p>
        <p className="forgot-hint">{t.forgotSentHint}</p>
        <button className="auth-link-btn" onClick={onBack}>{t.forgotBackToLogin}</button>
      </div>
    )
  }

  return (
    <div className="forgot-wrap">
      <h2 className="forgot-title">{t.forgotTitle}</h2>
      <p className="forgot-hint">{t.forgotEmailHint}</p>

      {error && <div className="auth-error"><AlertCircle size={16} /><span>{error}</span></div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="forgot-email"><Mail size={18} />{t.forgotEmailLabel}</label>
          <input
            type="email" id="forgot-email" value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            required placeholder="tu@email.com"
          />
        </div>
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? t.forgotSending : t.forgotSubmitEmail}
        </button>
      </form>

      <button className="auth-link-btn forgot-back" onClick={onBack}>
        {t.forgotBackToLogin}
      </button>
    </div>
  )
}

// ── Login principal ─────────────────────────────────────
export function LoginPage() {
  const { lang } = useLang()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const { login, sendPasswordReset } = useAuth()
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

        {showForgot ? (
          <ForgotPassword
            t={t}
            sendPasswordReset={sendPasswordReset}
            onBack={() => setShowForgot(false)}
          />
        ) : (
          <>
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
                <input
                  type="email" id="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  required placeholder="tu@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password"><Lock size={18} />{t.passwordLabel}</label>
                <div className="form-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'} id="password"
                    value={password} onChange={e => setPassword(e.target.value)}
                    required placeholder="••••••••"
                  />
                  <button type="button" className="form-eye-btn" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="button" className="auth-forgot-link" onClick={() => setShowForgot(true)}>
                {t.forgotPassword}
              </button>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? <span>{t.loggingIn}</span> : <><LogIn size={18} /><span>{t.loginBtn}</span></>}
              </button>
            </form>

            <p className="auth-switch">
              {t.noAccount} <Link to="/register">{t.registerLink}</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useLang } from '../context'
import { UI_TEXT } from '../data'
import { BookHeart, Mail, Lock, User, UserPlus, AlertCircle, Phone, ArrowLeft, Eye, EyeOff } from 'lucide-react'

export function RegisterPage() {
  const { lang } = useLang()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const t = UI_TEXT[lang]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError(t.passwordTooShort); return }
    if (password !== confirmPassword) { setError(t.passwordMismatch); return }
    setLoading(true)
    const result = await register(name, email, phone, password)
    if (result.success) navigate('/')
    else setError(t.emailExists)
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
          <h1>{t.registerTitle}</h1>
          <p>{t.registerSubtitle}</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name"><User size={18} />{t.nameLabel}</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required placeholder={t.namePlaceholder} />
          </div>

          <div className="form-group">
            <label htmlFor="email"><Mail size={18} />{t.emailLabel}</label>
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tu@email.com" />
          </div>

          <div className="form-group">
            <label htmlFor="phone"><Phone size={18} />{t.phoneLabel}</label>
            <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder={t.phonePlaceholder} />
            <span className="form-hint">{t.phoneHint}</span>
          </div>

          <div className="form-group">
            <label htmlFor="password"><Lock size={18} />{t.passwordLabel}</label>
            <div className="form-input-wrap">
              <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
              <button type="button" className="form-eye-btn" onClick={() => setShowPassword(v => !v)} tabIndex={-1} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword"><Lock size={18} />{t.confirmPasswordLabel}</label>
            <div className="form-input-wrap">
              <input type={showConfirm ? 'text' : 'password'} id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="••••••••" />
              <button type="button" className="form-eye-btn" onClick={() => setShowConfirm(v => !v)} tabIndex={-1} aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span>{t.creatingAccount}</span> : <><UserPlus size={18} /><span>{t.registerBtn}</span></>}
          </button>
        </form>

        <p className="auth-switch">
          {t.hasAccount} <Link to="/login">{t.loginLink}</Link>
        </p>
      </div>
    </div>
  )
}

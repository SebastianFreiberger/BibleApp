import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context'
import { BookHeart, Mail, Lock, User, UserPlus, AlertCircle, Phone } from 'lucide-react'

export function RegisterPage({ lang = 'es' }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const texts = {
    es: {
      title: 'Crear Cuenta',
      subtitle: 'Únete a nuestra comunidad',
      name: 'Nombre completo',
      email: 'Correo electrónico',
      phone: 'Número de teléfono',
      phonePlaceholder: '+56 9 1234 5678',
      phoneHint: 'Para recibir el versículo diario',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      registerBtn: 'Crear Cuenta',
      loadingBtn: 'Creando cuenta...',
      hasAccount: '¿Ya tienes cuenta?',
      login: 'Inicia sesión aquí',
      passwordMismatch: 'Las contraseñas no coinciden',
      passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
      emailExists: 'Este email ya está registrado'
    },
    en: {
      title: 'Create Account',
      subtitle: 'Join our community',
      name: 'Full name',
      email: 'Email address',
      phone: 'Phone number',
      phonePlaceholder: '+1 234 567 8900',
      phoneHint: 'To receive the daily verse',
      password: 'Password',
      confirmPassword: 'Confirm password',
      registerBtn: 'Create Account',
      loadingBtn: 'Creating account...',
      hasAccount: 'Already have an account?',
      login: 'Sign in here',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      emailExists: 'This email is already registered'
    }
  }

  const t = texts[lang]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError(t.passwordTooShort)
      return
    }

    if (password !== confirmPassword) {
      setError(t.passwordMismatch)
      return
    }

    setLoading(true)

    const result = await register(name, email, phone, password)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(t.emailExists)
    }
    
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <BookHeart size={48} className="auth-logo" />
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">
              <User size={18} />
              {t.name}
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Juan Pérez"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={18} />
              {t.email}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <Phone size={18} />
              {t.phone}
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder={t.phonePlaceholder}
            />
            <span className="form-hint">{t.phoneHint}</span>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={18} />
              {t.password}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <Lock size={18} />
              {t.confirmPassword}
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <span>{t.loadingBtn}</span>
            ) : (
              <>
                <UserPlus size={18} />
                <span>{t.registerBtn}</span>
              </>
            )}
          </button>
        </form>

        <p className="auth-switch">
          {t.hasAccount} <Link to="/login">{t.login}</Link>
        </p>
      </div>
    </div>
  )
}

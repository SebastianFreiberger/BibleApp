import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context'
import { BookHeart, Mail, Lock, LogIn, AlertCircle } from 'lucide-react'

export function LoginPage({ lang = 'es' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const texts = {
    es: {
      title: 'Iniciar Sesión',
      subtitle: 'Bienvenido de vuelta',
      email: 'Correo electrónico',
      password: 'Contraseña',
      loginBtn: 'Iniciar Sesión',
      loadingBtn: 'Ingresando...',
      noAccount: '¿No tienes cuenta?',
      register: 'Regístrate aquí',
      invalidCredentials: 'Email o contraseña incorrectos'
    },
    en: {
      title: 'Sign In',
      subtitle: 'Welcome back',
      email: 'Email address',
      password: 'Password',
      loginBtn: 'Sign In',
      loadingBtn: 'Signing in...',
      noAccount: "Don't have an account?",
      register: 'Register here',
      invalidCredentials: 'Invalid email or password'
    }
  }

  const t = texts[lang]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(t.invalidCredentials)
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

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <span>{t.loadingBtn}</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>{t.loginBtn}</span>
              </>
            )}
          </button>
        </form>

        <p className="auth-switch">
          {t.noAccount} <Link to="/register">{t.register}</Link>
        </p>
      </div>
    </div>
  )
}

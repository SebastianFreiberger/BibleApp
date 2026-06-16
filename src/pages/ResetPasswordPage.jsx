import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useLang } from '../context'
import { UI_TEXT } from '../data'
import { BookHeart, Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react'

export function ResetPasswordPage() {
  const { lang } = useLang()
  const t = UI_TEXT[lang]
  const navigate = useNavigate()

  const [ready, setReady] = useState(false)       // sesión de recovery activa
  const [invalid, setInvalid] = useState(false)   // link expirado o inválido
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Supabase parsea el token del hash de la URL y dispara PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })

    // Si después de 4 segundos no llegó el evento, el link es inválido o expiró
    const timeout = setTimeout(() => {
      setReady(prev => { if (!prev) setInvalid(true); return prev })
    }, 4000)

    return () => { subscription.unsubscribe(); clearTimeout(timeout) }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError(t.passwordTooShort); return }
    if (password !== confirm) { setError(t.passwordMismatch); return }
    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) { setError(err.message); return }
    setDone(true)
    setTimeout(() => navigate('/login'), 3000)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <BookHeart size={48} className="auth-logo" />
          <h1>{t.resetPasswordTitle}</h1>
        </div>

        {/* Éxito */}
        {done && (
          <div className="forgot-done">
            <CheckCircle2 size={44} className="forgot-done-icon" />
            <p>{t.forgotSuccess}</p>
            <p className="forgot-hint">{t.resetRedirecting}</p>
          </div>
        )}

        {/* Link inválido o expirado */}
        {!done && invalid && (
          <div className="reset-invalid">
            <AlertCircle size={36} className="reset-invalid-icon" />
            <p>{t.resetLinkExpired}</p>
            <Link to="/login" className="auth-btn" style={{ marginTop: '1rem', textDecoration: 'none', textAlign: 'center' }}>
              {t.forgotBackToLogin}
            </Link>
          </div>
        )}

        {/* Cargando / esperando el evento */}
        {!done && !invalid && !ready && (
          <div className="forgot-done">
            <div className="spinner" />
            <p className="forgot-hint">{t.resetVerifying}</p>
          </div>
        )}

        {/* Formulario de nueva contraseña */}
        {!done && !invalid && ready && (
          <>
            {error && <div className="auth-error"><AlertCircle size={16} /><span>{error}</span></div>}
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="new-pass"><Lock size={18} />{t.forgotNewPassword}</label>
                <div className="form-input-wrap">
                  <input
                    type={showPass ? 'text' : 'password'} id="new-pass"
                    value={password} onChange={e => { setPassword(e.target.value); setError('') }}
                    required placeholder="••••••••"
                  />
                  <button type="button" className="form-eye-btn" onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirm-pass"><Lock size={18} />{t.forgotConfirmPassword}</label>
                <div className="form-input-wrap">
                  <input
                    type={showConfirm ? 'text' : 'password'} id="confirm-pass"
                    value={confirm} onChange={e => { setConfirm(e.target.value); setError('') }}
                    required placeholder="••••••••"
                  />
                  <button type="button" className="form-eye-btn" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? '...' : t.forgotSubmitPassword}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider, useAuth, LangProvider, ThemeProvider, useLang, useTheme } from './context'
import { LandingPage, LoginPage, RegisterPage, HomePage, AttributesPage, BiblePage, ProfilePage, SearchPage, ResetPasswordPage } from './pages'
import './App.css'

function RootRoute() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>
  return isAuthenticated ? <HomePage /> : <LandingPage />
}

function AuthRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>
  return isAuthenticated ? <Navigate to="/" /> : children
}

// Aplica las preferencias guardadas en el perfil al iniciar sesión
function PreferencesSync() {
  const { user } = useAuth()
  const { lang, bibleVersion, applyProfilePrefs } = useLang()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (!user) return
    applyProfilePrefs(
      user.lang !== lang ? user.lang : null,
      user.bibleVersion !== bibleVersion ? user.bibleVersion : null,
    )
    if (user.theme && user.theme !== theme) setTheme(user.theme)
  }, [user?.id])

  return null
}

function AppRoutes() {
  return (
    <>
      <PreferencesSync />
      <Routes>
        <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
        <Route path="/" element={<RootRoute />} />
        <Route path="/biblia" element={<BiblePage />} />
        <Route path="/busqueda" element={<SearchPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/attributes" element={<AttributesPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LangProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </LangProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App

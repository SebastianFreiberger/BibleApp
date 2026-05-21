import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth, LangProvider } from './context'
import { LandingPage, LoginPage, RegisterPage, HomePage, AttributesPage, BiblePage, ProfilePage, SearchPage } from './pages'
import './App.css'

function RootRoute() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>
  return isAuthenticated ? <HomePage /> : <LandingPage />
}

// Componente para rutas de auth (redirige a home si ya está logueado)
function AuthRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    )
  }
  
  return isAuthenticated ? <Navigate to="/" /> : children
}

function AppRoutes() {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <AuthRoute>
            <RegisterPage />
          </AuthRoute>
        } 
      />
      <Route path="/" element={<RootRoute />} />
      <Route path="/biblia" element={<BiblePage />} />
      <Route path="/busqueda" element={<SearchPage />} />
      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="/attributes" element={<AttributesPage />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LangProvider>
    </BrowserRouter>
  )
}

export default App

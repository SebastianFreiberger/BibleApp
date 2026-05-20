import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context'
import { LoginPage, RegisterPage, HomePage, AttributesPage } from './pages'
import './App.css'

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
      <Route path="/" element={<HomePage />} />
      <Route path="/attributes" element={<AttributesPage />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

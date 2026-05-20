import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Simular base de datos de usuarios en localStorage
const USERS_KEY = 'bible_app_users'
const CURRENT_USER_KEY = 'bible_app_current_user'

function getUsers() {
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Cargar usuario al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY)
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const users = getUsers()
    const foundUser = users.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      const userData = { id: foundUser.id, name: foundUser.name, email: foundUser.email }
      setUser(userData)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData))
      return { success: true }
    }
    
    return { success: false, error: 'Credenciales inválidas' }
  }

  const register = async (name, email, phone, password) => {
    const users = getUsers()

    // Verificar si el email ya existe
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Este email ya está registrado' }
    }

    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      password, // En producción esto debería estar hasheado
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    saveUsers(users)

    // Auto login después del registro
    const userData = { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone }
    setUser(userData)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData))

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(CURRENT_USER_KEY)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

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

  const updateProfile = ({ name, phone, password }) => {
    const users = getUsers()
    const idx = users.findIndex(u => u.id === user.id)
    if (idx === -1) return { success: false }
    users[idx].name = name
    if (phone !== undefined) users[idx].phone = phone
    if (password) users[idx].password = password
    saveUsers(users)
    const updated = { ...user, name, phone: phone ?? user.phone }
    setUser(updated)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated))
    return { success: true }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
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

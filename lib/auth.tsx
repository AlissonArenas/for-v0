'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

// Autenticação simulada (somente UI/UX). Quando houver backend real,
// basta trocar as funções login/register/logout por chamadas de API.

const STORAGE_KEY = 'nexus-auth-v1'

export interface AuthUser {
  name: string
  email: string
  avatarHue: number // matiz do avatar gerado por iniciais
  chaptersRead: number
  joinedAt: number
}

const XP_PER_CHAPTER = 75
const XP_PER_LEVEL = 5000

export function getTotalXP(chaptersRead: number): number {
  return chaptersRead * XP_PER_CHAPTER
}

export function getLevel(chaptersRead: number): number {
  return Math.floor(getTotalXP(chaptersRead) / XP_PER_LEVEL) + 1
}

export function getLevelXP(chaptersRead: number): number {
  return getTotalXP(chaptersRead) % XP_PER_LEVEL
}

export function getLevelProgress(chaptersRead: number): number {
  return getLevelXP(chaptersRead) / XP_PER_LEVEL
}

export interface Rank { name: string; color: string }

const RANKS: Rank[] = [
  { name: 'Bronze I', color: '#cd7f32' },
  { name: 'Bronze II', color: '#cd7f32' },
  { name: 'Prata I', color: '#a8a9ad' },
  { name: 'Prata II', color: '#a8a9ad' },
  { name: 'Ouro I', color: '#ffd700' },
  { name: 'Ouro II', color: '#ffd700' },
  { name: 'Platina I', color: '#00d4aa' },
  { name: 'Platina II', color: '#00d4aa' },
  { name: 'Diamante I', color: '#a855f7' },
  { name: 'Diamante II', color: '#a855f7' },
  { name: 'Mestre', color: '#ef4444' },
]

export function getRank(chaptersRead: number): Rank {
  const level = getLevel(chaptersRead)
  const idx = Math.min(Math.floor((level - 1) / 3), RANKS.length - 1)
  return RANKS[idx]
}

interface AuthContextValue {
  user: AuthUser | null
  /** true enquanto carrega a sessão do localStorage (evita piscar a tela de login) */
  loading: boolean
  login: (email: string, password: string) => void
  register: (name: string, email: string, password: string) => void
  logout: () => void
  updateProfile: (changes: Partial<Pick<AuthUser, 'name' | 'avatarHue'>>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadUser(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || typeof parsed.name !== 'string') {
      return null
    }
    return parsed as AuthUser
  } catch {
    return null
  }
}

function saveUser(user: AuthUser | null) {
  try {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // armazenamento indisponível — sessão vale só em memória
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(loadUser())
    setLoading(false)
  }, [])

  const persist = useCallback((next: AuthUser | null) => {
    setUser(next)
    saveUser(next)
  }, [])

  const login = useCallback(
    (email: string, _password: string) => {
      // Simulação: qualquer credencial autentica com um perfil de demonstração
      persist({
        name: email.split('@')[0] || 'Leitor',
        email,
        avatarHue: 27,
        chaptersRead: 1348,
        joinedAt: Date.now(),
      })
    },
    [persist],
  )

  const register = useCallback(
    (name: string, email: string, _password: string) => {
      persist({
        name: name.trim() || 'Leitor',
        email,
        avatarHue: 210,
        chaptersRead: 0,
        joinedAt: Date.now(),
      })
    },
    [persist],
  )

  const logout = useCallback(() => persist(null), [persist])

  const updateProfile = useCallback(
    (changes: Partial<Pick<AuthUser, 'name' | 'avatarHue'>>) => {
      setUser((current) => {
        if (!current) return current
        const next = { ...current, ...changes }
        saveUser(next)
        return next
      })
    },
    [],
  )

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateProfile }),
    [user, loading, login, register, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}

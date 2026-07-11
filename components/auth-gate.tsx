'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

type Mode = 'login' | 'register'

interface AuthGateProps {
  /** Título mostrado acima do formulário, ex.: "Entre para ver seu perfil" */
  title: string
  children: React.ReactNode
}

/**
 * Protege uma área: se o usuário não estiver logado, mostra o formulário
 * de login/cadastro no lugar do conteúdo. (Autenticação simulada — UI/UX.)
 */
export function AuthGate({ title, children }: AuthGateProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true" aria-label="Carregando">
        <div className="h-40 animate-pulse rounded-xl border border-border bg-card" />
        <div className="h-64 animate-pulse rounded-xl border border-border bg-card" />
      </div>
    )
  }

  if (user) return <>{children}</>

  return <AuthForms title={title} />
}

function AuthForms({ title }: { title: string }) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim() || (mode === 'register' && !name.trim())) {
      setError('Preencha todos os campos para continuar.')
      return
    }
    setError(null)
    if (mode === 'login') {
      login(email.trim(), password)
    } else {
      register(name, email.trim(), password)
    }
  }

  const inputClass =
    'h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/50'

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-xl border border-border bg-card p-6 md:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-secondary">
            <Lock className="size-5 text-primary" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-display text-xl font-bold text-balance">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === 'login'
              ? 'Entre com sua conta para continuar.'
              : 'Crie sua conta gratuita em segundos.'}
          </p>
        </div>

        <div
          className="mt-6 grid grid-cols-2 rounded-lg border border-border bg-secondary p-1"
          role="tablist"
          aria-label="Entrar ou cadastrar"
        >
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m)
                setError(null)
              }}
              className={cn(
                'h-9 rounded-md text-sm font-semibold transition-colors',
                mode === m
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {m === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {mode === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-name" className="text-sm font-medium">
                Nome de usuário
              </label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como quer ser chamado"
                autoComplete="username"
                className={inputClass}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-email" className="text-sm font-medium">
              E-mail
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-password" className="text-sm font-medium">
              Senha
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-1 h-11 rounded-md bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {mode === 'login' ? 'Entrar na conta' : 'Criar conta'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          {'Demonstração: qualquer e-mail e senha funcionam.'}
        </p>
      </div>
    </div>
  )
}

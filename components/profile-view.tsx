'use client'

import Link from 'next/link'
import { useState } from 'react'
import { BookOpen, Check, Heart, LogOut, Pencil, X } from 'lucide-react'
import { SeriesCard } from '@/components/series-card'
import { UserAvatar } from '@/components/user-avatar'
import { getLevel, getLevelProgress, useAuth } from '@/lib/auth'
import { useFavorites } from '@/lib/favorites'
import { cn } from '@/lib/utils'

// Opções de avatar (matizes de cor para o avatar de iniciais)
const avatarHues = [27, 60, 100, 150, 190, 210, 280, 320, 350]

export function ProfileView() {
  const { user, logout, updateProfile } = useAuth()
  const { favorites } = useFavorites()
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const [pickingAvatar, setPickingAvatar] = useState(false)

  if (!user) return null

  const level = getLevel(user.chaptersRead)
  const progress = getLevelProgress(user.chaptersRead)
  const toNext = 50 - (user.chaptersRead % 50)

  function startEditName() {
    setNameDraft(user!.name)
    setEditingName(true)
  }

  function saveName() {
    const next = nameDraft.trim()
    if (next) updateProfile({ name: next })
    setEditingName(false)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Cartão do perfil */}
      <section
        aria-labelledby="perfil-titulo"
        className="rounded-xl border border-border bg-card p-5 md:p-7"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Avatar + nível */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <UserAvatar name={user.name} hue={user.avatarHue} className="size-24 text-3xl" />
              <button
                type="button"
                onClick={() => setPickingAvatar((v) => !v)}
                className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Alterar foto de perfil"
                aria-expanded={pickingAvatar}
              >
                <Pencil className="size-3.5" />
              </button>
            </div>
            <span
              className="flex flex-col items-center rounded-lg border border-primary/30 bg-primary/10 px-3 py-2"
              aria-label={`Nível da conta: ${level}`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Nível
              </span>
              <span className="font-display text-2xl font-bold text-primary">{level}</span>
            </span>
          </div>

          {/* Nome + e-mail */}
          <div className="min-w-0 flex-1">
            {editingName ? (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter' &&
                      !e.nativeEvent.isComposing &&
                      e.keyCode !== 229
                    ) {
                      saveName()
                    }
                    if (e.key === 'Escape') setEditingName(false)
                  }}
                  maxLength={24}
                  autoFocus
                  className="h-10 w-full max-w-60 rounded-md border border-input bg-secondary px-3 font-display text-lg font-bold outline-none focus:ring-2 focus:ring-ring/50"
                  aria-label="Novo nome de usuário"
                />
                <button
                  type="button"
                  onClick={saveName}
                  className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90"
                  aria-label="Salvar nome"
                >
                  <Check className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingName(false)}
                  className="flex size-10 items-center justify-center rounded-md border border-border bg-secondary text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Cancelar edição"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1
                  id="perfil-titulo"
                  className="truncate font-display text-2xl font-bold md:text-3xl"
                >
                  {user.name}
                </h1>
                <button
                  type="button"
                  onClick={startEditName}
                  className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label="Alterar nome"
                >
                  <Pencil className="size-4" />
                </button>
              </div>
            )}
            <p className="mt-0.5 truncate text-sm text-muted-foreground">{user.email}</p>

            {/* Progresso de nível */}
            <div className="mt-4 max-w-sm">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{`Nível ${level}`}</span>
                <span>{`${toNext} caps. para o nível ${level + 1}`}</span>
              </div>
              <div
                className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary"
                role="progressbar"
                aria-valuenow={Math.round(progress * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progresso para o próximo nível"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.max(4, progress * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex h-10 shrink-0 items-center gap-2 self-start rounded-md border border-border bg-secondary px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sair
          </button>
        </div>

        {/* Seletor de avatar */}
        {pickingAvatar && (
          <div className="mt-6 rounded-lg border border-border bg-secondary/50 p-4">
            <p className="text-sm font-semibold">Escolha a cor do seu avatar</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {avatarHues.map((hue) => (
                <button
                  key={hue}
                  type="button"
                  onClick={() => {
                    updateProfile({ avatarHue: hue })
                    setPickingAvatar(false)
                  }}
                  className={cn(
                    'rounded-full transition-transform hover:scale-105',
                    user.avatarHue === hue && 'ring-2 ring-ring ring-offset-2 ring-offset-card',
                  )}
                  aria-label={`Selecionar avatar de cor ${hue}`}
                  aria-pressed={user.avatarHue === hue}
                >
                  <UserAvatar name={user.name} hue={hue} className="size-12 text-sm" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Estatísticas */}
      <section aria-label="Estatísticas de leitura" className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="size-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-2xl font-bold">
              {user.chaptersRead.toLocaleString('pt-BR')}
            </p>
            <p className="text-xs text-muted-foreground">Capítulos lidos</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Heart className="size-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-2xl font-bold">{favorites.length}</p>
            <p className="text-xs text-muted-foreground">Obras favoritadas</p>
          </div>
        </div>
      </section>

      {/* Favoritos do usuário */}
      <section aria-labelledby="perfil-favoritos">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="perfil-favoritos" className="font-display text-xl font-bold">
            Meus favoritos
          </h2>
          <Link
            href="/favoritos"
            className="text-sm font-semibold text-primary transition-opacity hover:opacity-80"
          >
            Ver todos
          </Link>
        </div>
        {favorites.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <Heart className="mx-auto size-7 text-muted-foreground" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold">Nenhuma obra favoritada ainda</p>
            <Link
              href="/catalogo"
              className="mt-4 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {favorites.slice(0, 10).map(({ series }) => (
              <SeriesCard key={series.slug} series={series} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

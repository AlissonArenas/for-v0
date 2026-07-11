'use client'

import { useState } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import { UserAvatar } from '@/components/user-avatar'
import {
  getLevel,
  getLevelProgress,
  getLevelXP,
  getRank,
  getTotalXP,
  useAuth,
} from '@/lib/auth'
import { seriesList } from '@/lib/data'
import { cn } from '@/lib/utils'

const avatarHues = [27, 60, 100, 150, 190, 210, 280, 320, 350]

const profileStats = [
  { label: 'Capítulos lidos', value: (n: number) => n.toLocaleString('pt-BR') },
  { label: 'Obras favoritas', value: () => '—' },
  { label: 'Dias consecutivos', value: () => '47' },
  { label: 'Comentários', value: () => '128' },
  { label: 'Avaliações', value: () => '92' },
  { label: 'Conquistas', value: () => '14' },
]

const mostRead = [
  { slug: 'leitor-onisciente', count: 231 },
  { slug: 'a-lamina-do-cacador-sombrio', count: 187 },
  { slug: 'devorador-de-dungeons', count: 88 },
  { slug: 'segunda-vida-do-rankeador', count: 180 },
  { slug: 'o-retorno-do-mago-de-ferro', count: 142 },
  { slug: 'o-necromante-de-elo-s', count: 121 },
]

export function ProfileView() {
  const { user, logout, updateProfile } = useAuth()
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const [pickingAvatar, setPickingAvatar] = useState(false)

  if (!user) return null

  const level = getLevel(user.chaptersRead)
  const progress = getLevelProgress(user.chaptersRead)
  const levelXP = getLevelXP(user.chaptersRead)
  const totalXP = getTotalXP(user.chaptersRead)
  const rank = getRank(user.chaptersRead)
  const xpForNext = 5000 - levelXP

  function saveName() {
    const next = nameDraft.trim()
    if (next) updateProfile({ name: next })
    setEditingName(false)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* ===== Sidebar ===== */}
        <aside className="flex flex-col gap-6">
          {/* Card de perfil com banner */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {/* Banner com gradiente baseado no hue do avatar */}
            <div
              className="relative h-28"
              style={{
                background: `linear-gradient(135deg, oklch(0.45 0.15 ${user.avatarHue}), oklch(0.35 0.10 ${user.avatarHue + 40}))`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            </div>

            <div className="px-5 pb-5">
              {/* Avatar sobreposto */}
              <div className="-mt-12 flex justify-center">
                <div className="relative">
                  <UserAvatar name={user.name} hue={user.avatarHue} className="size-24 border-4 border-card text-3xl shadow-lg" />
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
              </div>

              {/* Nome + e-mail */}
              <div className="mt-3 text-center">
                {editingName ? (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <input
                      type="text"
                      value={nameDraft}
                      onChange={(e) => setNameDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) saveName()
                        if (e.key === 'Escape') setEditingName(false)
                      }}
                      maxLength={24}
                      autoFocus
                      className="h-10 w-full max-w-60 rounded-md border border-input bg-secondary px-3 text-center font-display text-lg font-bold outline-none focus:ring-2 focus:ring-ring/50"
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
                  <div className="flex items-center justify-center gap-2">
                    <h1 className="font-display text-xl font-bold">{user.name}</h1>
                    <button
                      type="button"
                      onClick={() => {
                        setNameDraft(user.name)
                        setEditingName(true)
                      }}
                      className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      aria-label="Alterar nome"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  </div>
                )}
                <p className="mt-0.5 truncate text-sm text-muted-foreground">{user.email}</p>
              </div>

              {/* Selo de rank */}
              <div className="mt-4 flex justify-center">
                <span
                  className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    backgroundColor: `${rank.color}1a`,
                    color: rank.color,
                  }}
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: rank.color }}
                    aria-hidden="true"
                  />
                  {rank.name}
                </span>
              </div>

              {/* Nível + XP */}
              <div className="mt-5 rounded-xl bg-secondary/50 p-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Nível
                  </span>
                  <span className="font-display text-2xl font-bold text-primary">{level}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.max(4, progress * 100)}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{levelXP.toLocaleString('pt-BR')} XP</span>
                  <span>{`${xpForNext.toLocaleString('pt-BR')} XP p/ próximo`}</span>
                </div>
              </div>

              {/* XP total */}
              <div className="mt-3 flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
                <span className="text-xs font-medium text-muted-foreground">XP Total</span>
                <span className="font-display text-sm font-bold">{totalXP.toLocaleString('pt-BR')}</span>
              </div>

              {/* Membro desde */}
              <div className="mt-3 flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
                <span className="text-xs font-medium text-muted-foreground">Membro desde</span>
                <span className="text-sm font-semibold">
                  {new Date(user.joinedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Seletor de avatar */}
          {pickingAvatar && (
            <div className="rounded-2xl border border-border bg-card p-4">
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

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {profileStats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
                <p className="font-display text-xl font-bold">{stat.value(user.chaptersRead)}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={logout}
            className="h-10 rounded-lg border border-border bg-card text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Sair da conta
          </button>
        </aside>

        {/* ===== Conteúdo principal ===== */}
        <section className="flex flex-col gap-6">
          {/* Obras mais lidas */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-bold">Obras mais lidas</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              As obras que você mais acompanhou na plataforma.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {mostRead.map(({ slug, count }, i) => {
                const series = seriesList.find((s) => s.slug === slug)
                if (!series) return null
                return (
                  <div
                    key={slug}
                    className="group relative flex flex-col gap-2 rounded-xl border border-border bg-secondary/30 p-3 transition-colors hover:border-primary/40"
                  >
                    <span className="absolute right-2 top-2 z-10 flex size-6 items-center justify-center rounded-full bg-background/90 font-display text-xs font-bold text-primary shadow">
                      {i + 1}
                    </span>
                    <div className="relative aspect-[7/10] w-full overflow-hidden rounded-lg border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={series.cover}
                        alt={`Capa de ${series.title}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <h3 className="line-clamp-2 text-xs font-semibold leading-snug">{series.title}</h3>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {`${count} cap. lidos`}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Atividade recente (timeline) */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-bold">Atividade recente</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {[
                { action: 'Concluiu o capítulo 231 de Leitor Onisciente', time: 'há 2h' },
                { action: 'Avaliou Devorador de Dungeons com 5 estrelas', time: 'há 5h' },
                { action: 'Favoritou O Necromante de Elo S', time: 'há 1 dia' },
                { action: 'Subiu para o nível ' + level, time: 'há 2 dias' },
                { action: 'Concluiu o capítulo 180 de Segunda Vida do Rankeador', time: 'há 3 dias' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 border-b border-border pb-3 last:border-b-0 last:pb-0">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-relaxed">{item.action}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Conquistas */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-bold">Conquistas</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { name: 'Primeiros passos', desc: 'Leu 10 capítulos', icon: '🌱' },
                { name: 'Aquecendo', desc: 'Leu 100 capítulos', icon: '🔥' },
                { name: 'Maratonista', desc: 'Leu 500 capítulos', icon: '⚡' },
                { name: 'Lenda', desc: 'Leu 1000 capítulos', icon: '👑' },
                { name: 'Colecionador', desc: 'Favoritou 10 obras', icon: '❤️' },
                { name: 'Crítico', desc: 'Avaliou 50 obras', icon: '⭐' },
                { name: 'Social', desc: 'Fez 100 comentários', icon: '💬' },
                { name: 'Dedicação', desc: '30 dias consecutivos', icon: '📅' },
              ].map((badge) => (
                <div
                  key={badge.name}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-secondary/30 p-4 text-center transition-colors hover:border-primary/40"
                >
                  <span className="text-2xl" aria-hidden="true">{badge.icon}</span>
                  <p className="text-xs font-semibold">{badge.name}</p>
                  <p className="text-[11px] text-muted-foreground">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

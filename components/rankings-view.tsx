'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { BookOpen, Eye, Star, Trophy, Users } from 'lucide-react'
import { UserAvatar } from '@/components/user-avatar'
import {
  formatViews,
  getBestRated,
  getMostViewed,
  topReaders,
  type Series,
} from '@/lib/data'
import { cn } from '@/lib/utils'

type Tab = 'leitores' | 'vistas' | 'avaliadas'

const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: 'leitores', label: 'Top leitores', icon: Users },
  { id: 'vistas', label: 'Mais vistas', icon: Eye },
  { id: 'avaliadas', label: 'Melhores avaliações', icon: Star },
]

function rankStyle(position: number): string {
  if (position === 1) return 'bg-primary text-primary-foreground'
  if (position === 2) return 'bg-foreground/80 text-background'
  if (position === 3) return 'bg-accent text-accent-foreground border border-border'
  return 'bg-secondary text-muted-foreground'
}

function RankBadge({ position }: { position: number }) {
  return (
    <span
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold',
        rankStyle(position),
      )}
      aria-label={`${position}º lugar`}
    >
      {position <= 3 ? <Trophy className="size-4" aria-hidden="true" /> : position}
    </span>
  )
}

function ReadersRanking() {
  return (
    <ol className="flex flex-col gap-2">
      {topReaders.map((reader, i) => {
        const position = i + 1
        return (
          <li
            key={reader.id}
            className={cn(
              'flex items-center gap-4 rounded-xl border border-border bg-card p-3.5 transition-colors',
              position <= 3 && 'border-primary/25',
            )}
          >
            <RankBadge position={position} />
            <UserAvatar name={reader.name} hue={reader.avatarHue} className="size-10 text-sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{reader.name}</p>
              <p className="text-xs text-muted-foreground">{`Nível ${reader.level}`}</p>
            </div>
            <div className="flex items-center gap-1.5 text-right">
              <BookOpen className="size-4 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold">{reader.chaptersRead.toLocaleString('pt-BR')}</p>
                <p className="text-[11px] text-muted-foreground">caps. lidos</p>
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function SeriesRanking({
  list,
  metric,
}: {
  list: Series[]
  metric: 'views' | 'rating'
}) {
  return (
    <ol className="flex flex-col gap-2">
      {list.map((series, i) => {
        const position = i + 1
        return (
          <li key={series.slug}>
            <Link
              href={`/series/${series.slug}`}
              className={cn(
                'group flex items-center gap-4 rounded-xl border border-border bg-card p-3.5 transition-colors hover:bg-accent/40',
                position <= 3 && 'border-primary/25',
              )}
            >
              <RankBadge position={position} />
              <div className="relative aspect-[7/10] w-11 shrink-0 overflow-hidden rounded-md border border-border">
                <Image
                  src={series.cover || '/placeholder.svg'}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
                  {series.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {`${series.type} · ${series.genres.slice(0, 2).join(', ')}`}
                </p>
              </div>
              {metric === 'views' ? (
                <div className="flex items-center gap-1.5">
                  <Eye className="size-4 text-primary" aria-hidden="true" />
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatViews(series.views)}</p>
                    <p className="text-[11px] text-muted-foreground">leituras</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
                  <div className="text-right">
                    <p className="text-sm font-bold">
                      {series.rating.toFixed(1).replace('.', ',')}
                    </p>
                    <p className="text-[11px] text-muted-foreground">nota média</p>
                  </div>
                </div>
              )}
            </Link>
          </li>
        )
      })}
    </ol>
  )
}

export function RankingsView() {
  const [tab, setTab] = useState<Tab>('leitores')

  return (
    <div>
      <div
        role="tablist"
        aria-label="Categorias de ranking"
        className="mb-6 flex flex-wrap gap-2"
      >
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              'flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors',
              tab === id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-secondary text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <div role="tabpanel" aria-label={tabs.find((t) => t.id === tab)?.label}>
        {tab === 'leitores' && <ReadersRanking />}
        {tab === 'vistas' && <SeriesRanking list={getMostViewed()} metric="views" />}
        {tab === 'avaliadas' && <SeriesRanking list={getBestRated()} metric="rating" />}
      </div>
    </div>
  )
}

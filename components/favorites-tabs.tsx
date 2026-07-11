'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, Star, TrendingUp } from 'lucide-react'
import { FavoritesList } from '@/components/favorites-list'
import { formatViews, getMostFavorited } from '@/lib/data'
import { cn } from '@/lib/utils'

type Tab = 'meus' | 'comunidade'

function MostFavorited() {
  const ranking = getMostFavorited()

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Os manhwas e manhuas mais favoritados pelos leitores da comunidade.
      </p>
      <ol className="flex flex-col gap-2">
        {ranking.map(({ series, count }, i) => {
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
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold',
                    position === 1
                      ? 'bg-primary text-primary-foreground'
                      : position <= 3
                        ? 'bg-accent text-accent-foreground border border-border'
                        : 'bg-secondary text-muted-foreground',
                  )}
                  aria-label={`${position}º lugar`}
                >
                  {position}
                </span>
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
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{series.type}</span>
                    <span className="flex items-center gap-0.5">
                      <Star className="size-3 fill-primary text-primary" aria-hidden="true" />
                      {series.rating.toFixed(1).replace('.', ',')}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="size-4 fill-primary text-primary" aria-hidden="true" />
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatViews(count)}</p>
                    <p className="text-[11px] text-muted-foreground">favoritos</p>
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export function FavoritesTabs() {
  const [tab, setTab] = useState<Tab>('meus')

  return (
    <div>
      <div role="tablist" aria-label="Favoritos" className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'meus'}
          onClick={() => setTab('meus')}
          className={cn(
            'flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors',
            tab === 'meus'
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-secondary text-muted-foreground hover:text-foreground',
          )}
        >
          <Heart className="size-4" aria-hidden="true" />
          Meus favoritos
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'comunidade'}
          onClick={() => setTab('comunidade')}
          className={cn(
            'flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors',
            tab === 'comunidade'
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-secondary text-muted-foreground hover:text-foreground',
          )}
        >
          <TrendingUp className="size-4" aria-hidden="true" />
          Mais favoritados
        </button>
      </div>

      <div role="tabpanel" aria-label={tab === 'meus' ? 'Meus favoritos' : 'Mais favoritados'}>
        {tab === 'meus' ? <FavoritesList /> : <MostFavorited />}
      </div>
    </div>
  )
}

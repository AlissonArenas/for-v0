'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { SeriesCard } from '@/components/series-card'
import { useFavorites } from '@/lib/favorites'

export function FavoritesList() {
  const { favorites, notifications } = useFavorites()

  if (favorites.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center">
        <Heart className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
        <p className="mt-3 font-semibold">Você ainda não favoritou nenhuma obra</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Toque no coração de qualquer obra no catálogo para acompanhá-la e ser avisado quando sair
          capítulo novo.
        </p>
        <Link
          href="/catalogo"
          className="mt-5 inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Explorar catálogo
        </Link>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground" role="status">
        {favorites.length === 1 ? '1 obra favoritada' : `${favorites.length} obras favoritadas`}
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {favorites.map(({ series }) => {
          const newChapters = notifications.filter((n) => n.slug === series.slug).length
          return (
            <div key={series.slug} className="relative">
              <SeriesCard series={series} />
              {newChapters > 0 && (
                <span className="absolute -left-1.5 -top-1.5 z-10 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground shadow">
                  {newChapters === 1 ? '1 novo cap.' : `${newChapters} novos caps.`}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

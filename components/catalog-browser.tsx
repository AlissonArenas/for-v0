'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { SeriesCard } from '@/components/series-card'
import { allGenres, seriesList } from '@/lib/data'
import { cn } from '@/lib/utils'

type SortKey = 'popular' | 'rating' | 'chapters' | 'az'

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'popular', label: 'Mais lidos' },
  { value: 'rating', label: 'Melhor avaliados' },
  { value: 'chapters', label: 'Mais capítulos' },
  { value: 'az', label: 'A–Z' },
]

function normalizeType(value: string | null): string {
  if (!value) return 'Todos'
  const v = value.trim().toLowerCase()
  if (v === 'manhwa') return 'Manhwa'
  if (v === 'manhua') return 'Manhua'
  return 'Todos'
}

function normalizeGenre(value: string | null): string {
  if (!value) return 'Todos'
  const match = allGenres.find((g) => g.toLowerCase() === value.trim().toLowerCase())
  return match ?? 'Todos'
}

export function CatalogBrowser() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Tipo e gênero são derivados da URL — assim as abas Manhwa/Manhua do
  // header funcionam mesmo quando já estamos dentro do catálogo.
  const type = normalizeType(searchParams.get('tipo'))
  const genre = normalizeGenre(searchParams.get('genero'))
  const queryParam = searchParams.get('q') ?? ''

  const [query, setQuery] = useState(queryParam)
  const [sort, setSort] = useState<SortKey>('popular')

  useEffect(() => {
    setQuery(queryParam)
  }, [queryParam])

  function updateParam(key: 'tipo' | 'genero', value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'Todos') params.delete(key)
    else params.set(key, value)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const results = useMemo(() => {
    let list = seriesList

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.altTitle.toLowerCase().includes(q) ||
          s.author.toLowerCase().includes(q),
      )
    }
    if (type !== 'Todos') list = list.filter((s) => s.type === type)
    if (genre !== 'Todos') list = list.filter((s) => s.genres.includes(genre))

    switch (sort) {
      case 'rating':
        return [...list].sort((a, b) => b.rating - a.rating)
      case 'chapters':
        return [...list].sort((a, b) => b.totalChapters - a.totalChapters)
      case 'az':
        return [...list].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))
      default:
        return [...list].sort((a, b) => b.views - a.views)
    }
  }, [query, type, genre, sort])

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título ou autor..."
              className="h-10 w-full rounded-md border border-input bg-secondary pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/50"
              aria-label="Buscar por título ou autor"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            <span className="sr-only">Ordenar por</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-10 rounded-md border border-input bg-secondary px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/50"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por tipo">
          {['Todos', 'Manhwa', 'Manhua'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => updateParam('tipo', t)}
              aria-pressed={type === t}
              className={cn(
                'h-8 rounded-full border px-4 text-xs font-semibold transition-colors',
                type === t
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-secondary text-muted-foreground hover:text-foreground',
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por gênero">
          {['Todos', ...allGenres].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => updateParam('genero', g)}
              aria-pressed={genre === g}
              className={cn(
                'h-8 rounded-full border px-3.5 text-xs font-medium transition-colors',
                genre === g
                  ? 'border-primary/60 bg-primary/15 text-primary'
                  : 'border-border bg-transparent text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground',
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground" role="status">
        {results.length === 1 ? '1 obra encontrada' : `${results.length} obras encontradas`}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {results.map((series) => (
          <SeriesCard key={series.slug} series={series} />
        ))}
      </div>

      {results.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center">
          <p className="font-semibold">Nenhuma obra encontrada</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tente ajustar os filtros ou buscar por outro termo.
          </p>
        </div>
      )}
    </div>
  )
}

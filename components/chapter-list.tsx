'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Search } from 'lucide-react'
import type { Chapter } from '@/lib/data'
import { timeAgo } from '@/lib/data'

interface ChapterListProps {
  slug: string
  chapters: Chapter[]
  totalChapters: number
}

export function ChapterList({ slug, chapters, totalChapters }: ChapterListProps) {
  const [query, setQuery] = useState('')
  const [ascending, setAscending] = useState(false)

  const filtered = useMemo(() => {
    let list = chapters
    const q = query.trim()
    if (q) list = list.filter((c) => String(c.number).includes(q))
    return ascending ? [...list].sort((a, b) => a.number - b.number) : list
  }, [chapters, query, ascending])

  return (
    <section aria-labelledby="capitulos" className="rounded-xl border border-border bg-card p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="capitulos" className="font-display text-lg font-bold">
          {`Capítulos (${totalChapters})`}
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nº do capítulo"
              className="h-9 w-40 rounded-md border border-input bg-secondary pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/50"
              aria-label="Buscar capítulo por número"
            />
          </div>
          <button
            type="button"
            onClick={() => setAscending((v) => !v)}
            className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-secondary px-3 text-sm font-medium transition-colors hover:bg-accent"
            aria-label={ascending ? 'Ordenar do mais recente' : 'Ordenar do mais antigo'}
          >
            {ascending ? (
              <ArrowUpNarrowWide className="size-4" aria-hidden="true" />
            ) : (
              <ArrowDownWideNarrow className="size-4" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{ascending ? 'Antigos' : 'Recentes'}</span>
          </button>
        </div>
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {filtered.map((chapter) => (
          <li key={chapter.number}>
            <Link
              href={`/series/${slug}/capitulo/${chapter.number}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-secondary"
            >
              <span className="text-sm font-semibold">{`Capítulo ${chapter.number}`}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(chapter.releasedAt)}</span>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Nenhum capítulo encontrado com esse número.
        </p>
      )}

      {totalChapters > chapters.length && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {`Exibindo os ${chapters.length} capítulos mais recentes.`}
        </p>
      )}
    </section>
  )
}

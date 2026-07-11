'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Home, List } from 'lucide-react'
import type { Series } from '@/lib/data'
import { cn } from '@/lib/utils'

interface ReaderProps {
  series: Series
  chapterNumber: number
  pages: number
}

export function Reader({ series, chapterNumber, pages }: ReaderProps) {
  const router = useRouter()
  const [barsVisible, setBarsVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  const hasPrev = chapterNumber > 1
  const hasNext = chapterNumber < series.totalChapters
  const prevHref = `/series/${series.slug}/capitulo/${chapterNumber - 1}`
  const nextHref = `/series/${series.slug}/capitulo/${chapterNumber + 1}`

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement
      const total = doc.scrollHeight - doc.clientHeight
      setProgress(total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' && hasPrev) router.push(prevHref)
      if (e.key === 'ArrowRight' && hasNext) router.push(nextHref)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hasPrev, hasNext, prevHref, nextHref, router])

  const toggleBars = useCallback(() => setBarsVisible((v) => !v), [])

  return (
    <div className="min-h-screen bg-background">
      {/* Barra de progresso */}
      <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-secondary">
        <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      {/* Barra superior */}
      <header
        className={cn(
          'fixed inset-x-0 top-0.5 z-40 border-b border-border bg-background/95 backdrop-blur transition-transform duration-300',
          barsVisible ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        <div className="mx-auto flex h-14 max-w-4xl items-center gap-3 px-4">
          <Link
            href="/"
            className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Ir para o início"
          >
            <Home className="size-5" />
          </Link>
          <div className="min-w-0 flex-1 text-center">
            <p className="line-clamp-1 text-sm font-semibold">{series.title}</p>
            <p className="text-xs text-muted-foreground">{`Capítulo ${chapterNumber}`}</p>
          </div>
          <Link
            href={`/series/${series.slug}`}
            className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Ver lista de capítulos"
          >
            <List className="size-5" />
          </Link>
        </div>
      </header>

      {/* Páginas */}
      <main className="mx-auto max-w-3xl pb-24 pt-16">
        <button
          type="button"
          onClick={toggleBars}
          className="block w-full cursor-default text-left"
          aria-label={barsVisible ? 'Ocultar barras de navegação' : 'Mostrar barras de navegação'}
        >
          {Array.from({ length: pages }, (_, i) => (
            <div key={i} className="relative w-full">
              <Image
                src={`/placeholder.svg?height=1400&width=900`}
                alt={`Página ${i + 1} do capítulo ${chapterNumber} de ${series.title}`}
                width={900}
                height={1400}
                className="h-auto w-full"
                priority={i < 2}
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          ))}
        </button>

        {/* Navegação final */}
        <nav className="mt-8 flex flex-col items-center gap-4 px-4" aria-label="Navegação entre capítulos">
          <p className="text-sm text-muted-foreground">
            {`Você terminou o capítulo ${chapterNumber}.`}
          </p>
          <div className="flex w-full max-w-md gap-3">
            {hasPrev ? (
              <Link
                href={prevHref}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-secondary text-sm font-semibold transition-colors hover:bg-accent"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
                {`Cap. ${chapterNumber - 1}`}
              </Link>
            ) : (
              <span className="flex h-11 flex-1 items-center justify-center rounded-md border border-border text-sm text-muted-foreground">
                Primeiro capítulo
              </span>
            )}
            {hasNext ? (
              <Link
                href={nextHref}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {`Cap. ${chapterNumber + 1}`}
                <ChevronRight className="size-4" aria-hidden="true" />
              </Link>
            ) : (
              <span className="flex h-11 flex-1 items-center justify-center rounded-md border border-border text-sm text-muted-foreground">
                Último capítulo
              </span>
            )}
          </div>
        </nav>
      </main>

      {/* Barra inferior */}
      <footer
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur transition-transform duration-300',
          barsVisible ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-3 px-4">
          {hasPrev ? (
            <Link
              href={prevHref}
              className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-secondary px-4 text-sm font-medium transition-colors hover:bg-accent"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Anterior
            </Link>
          ) : (
            <span className="flex h-9 items-center rounded-md px-4 text-sm text-muted-foreground/50">
              Anterior
            </span>
          )}
          <span className="text-xs font-medium tabular-nums text-muted-foreground">
            {`${Math.round(progress)}%`}
          </span>
          {hasNext ? (
            <Link
              href={nextHref}
              className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Próximo
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          ) : (
            <span className="flex h-9 items-center rounded-md px-4 text-sm text-muted-foreground/50">
              Próximo
            </span>
          )}
        </div>
      </footer>
    </div>
  )
}

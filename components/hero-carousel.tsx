'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { BookOpen, Info, Star } from 'lucide-react'
import type { Series } from '@/lib/data'
import { cn } from '@/lib/utils'

interface HeroCarouselProps {
  items: Series[]
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback(
    (i: number) => setIndex(((i % items.length) + items.length) % items.length),
    [items.length],
  )

  useEffect(() => {
    if (paused || items.length <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 7000)
    return () => clearInterval(id)
  }, [paused, items.length])

  const current = items[index]

  return (
    <section
      className="relative h-[520px] overflow-hidden md:h-[580px]"
      aria-roledescription="carrossel"
      aria-label="Destaques da semana"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {items.map((series, i) => (
        <div
          key={series.slug}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            i === index ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          aria-hidden={i !== index}
        >
          <Image
            src={series.banner || '/placeholder.svg'}
            alt=""
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        </div>
      ))}

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 md:px-6 md:pb-20">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          {`#${index + 1} em destaque`}
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-tight text-balance md:text-6xl">
          {current.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
            {current.rating.toFixed(1).replace('.', ',')}
          </span>
          <span aria-hidden="true">•</span>
          <span>{current.type}</span>
          <span aria-hidden="true">•</span>
          <span>{`${current.totalChapters} capítulos`}</span>
          <span aria-hidden="true">•</span>
          <span>{current.genres.slice(0, 3).join(' · ')}</span>
        </div>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">
          {current.synopsis.length > 200 ? `${current.synopsis.slice(0, 200).trimEnd()}…` : current.synopsis}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/series/${current.slug}/capitulo/1`}
            className="flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <BookOpen className="size-4" aria-hidden="true" />
            Começar a ler
          </Link>
          <Link
            href={`/series/${current.slug}`}
            className="flex h-11 items-center gap-2 rounded-md border border-border bg-secondary/60 px-6 text-sm font-semibold backdrop-blur transition-colors hover:bg-secondary"
          >
            <Info className="size-4" aria-hidden="true" />
            Detalhes
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-2" role="tablist" aria-label="Selecionar destaque">
          {items.map((series, i) => (
            <button
              key={series.slug}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Ir para ${series.title}`}
              onClick={() => goTo(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === index ? 'w-8 bg-primary' : 'w-3 bg-muted-foreground/40 hover:bg-muted-foreground/70',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

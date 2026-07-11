'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { getRatingCount } from '@/lib/data'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'nexus-ratings-v1'

function loadRatings(): Record<string, number> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

function saveRating(slug: string, stars: number) {
  try {
    const all = loadRatings()
    all[slug] = stars
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    // armazenamento indisponível — avaliação vale só na sessão
  }
}

interface RatingWidgetProps {
  slug: string
  /** Nota média da obra (escala 0–10) */
  rating: number
}

export function RatingWidget({ slug, rating }: RatingWidgetProps) {
  const { user, loading } = useAuth()
  const [myRating, setMyRating] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [justRated, setJustRated] = useState(false)

  useEffect(() => {
    const saved = loadRatings()[slug]
    if (typeof saved === 'number') setMyRating(saved)
  }, [slug])

  function rate(stars: number) {
    setMyRating(stars)
    saveRating(slug, stars)
    setJustRated(true)
    window.setTimeout(() => setJustRated(false), 2500)
  }

  const ratingCount = getRatingCount(slug)
  const display = hovered ?? myRating ?? 0

  return (
    <section aria-labelledby="avaliacao" className="rounded-xl border border-border bg-card p-5">
      <h2 id="avaliacao" className="font-display text-lg font-bold">
        Avaliação
      </h2>

      <div className="mt-4 flex items-center gap-3">
        <span className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2">
          <Star className="size-5 fill-primary text-primary" aria-hidden="true" />
          <span className="font-display text-xl font-bold">
            {rating.toFixed(1).replace('.', ',')}
          </span>
          <span className="text-xs text-muted-foreground">/10</span>
        </span>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {`Média de ${ratingCount.toLocaleString('pt-BR')} avaliações da comunidade`}
        </p>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <p className="text-sm font-semibold">
          {myRating ? 'Sua avaliação' : 'Avalie esta obra'}
        </p>

        {!loading && !user ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            <Link href="/perfil" className="font-semibold text-primary hover:opacity-80">
              Entre na sua conta
            </Link>
            {' para avaliar esta obra.'}
          </p>
        ) : (
          <>
            <div
              className="mt-2 flex items-center gap-1"
              role="radiogroup"
              aria-label="Sua nota de 1 a 5 estrelas"
              onMouseLeave={() => setHovered(null)}
            >
              {[1, 2, 3, 4, 5].map((stars) => (
                <button
                  key={stars}
                  type="button"
                  role="radio"
                  aria-checked={myRating === stars}
                  aria-label={`${stars} ${stars === 1 ? 'estrela' : 'estrelas'}`}
                  onClick={() => rate(stars)}
                  onMouseEnter={() => setHovered(stars)}
                  onFocus={() => setHovered(stars)}
                  onBlur={() => setHovered(null)}
                  className="rounded p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      'size-7 transition-colors',
                      stars <= display
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground/40',
                    )}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
            <p className="mt-2 min-h-4 text-xs text-muted-foreground" role="status">
              {justRated
                ? 'Avaliação registrada. Obrigado!'
                : myRating
                  ? `Você deu ${myRating} ${myRating === 1 ? 'estrela' : 'estrelas'}. Clique para alterar.`
                  : hovered
                    ? `${hovered} ${hovered === 1 ? 'estrela' : 'estrelas'}`
                    : ''}
            </p>
          </>
        )}
      </div>
    </section>
  )
}

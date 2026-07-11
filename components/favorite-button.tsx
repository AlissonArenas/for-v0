'use client'

import { Heart } from 'lucide-react'
import { useFavorites } from '@/lib/favorites'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  slug: string
  /** 'icon' = coração compacto (cards); 'full' = botão com texto (página da obra) */
  variant?: 'icon' | 'full'
  className?: string
}

export function FavoriteButton({ slug, variant = 'icon', className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(slug)

  function onClick(e: React.MouseEvent) {
    // Impede navegação quando o botão está dentro de um <Link> (cards)
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(slug)
  }

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          'flex h-11 items-center gap-2 rounded-md border px-6 text-sm font-semibold transition-colors',
          active
            ? 'border-primary/60 bg-primary/15 text-primary hover:bg-primary/25'
            : 'border-border bg-secondary hover:bg-accent',
          className,
        )}
      >
        <Heart className={cn('size-4', active && 'fill-primary')} aria-hidden="true" />
        {active ? 'Favoritado' : 'Favoritar'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      title={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className={cn(
        'flex size-8 items-center justify-center rounded-full bg-background/85 backdrop-blur transition-colors',
        active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
        className,
      )}
    >
      <Heart className={cn('size-4', active && 'fill-primary')} aria-hidden="true" />
    </button>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { FavoriteButton } from '@/components/favorite-button'
import type { Series } from '@/lib/data'
import { cn } from '@/lib/utils'

interface SeriesCardProps {
  series: Series
  className?: string
}

export function SeriesCard({ series, className }: SeriesCardProps) {
  return (
    <Link
      href={`/series/${series.slug}`}
      className={cn('group flex flex-col gap-2.5', className)}
    >
      <div className="relative aspect-[7/10] overflow-hidden rounded-lg border border-border bg-card">
        <Image
          src={series.cover || '/placeholder.svg'}
          alt={`Capa de ${series.title}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 190px"
        />
        <span className="absolute left-2 top-2 rounded bg-background/85 px-1.5 py-0.5 text-[11px] font-semibold backdrop-blur">
          {series.type}
        </span>
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded bg-background/85 px-1.5 py-0.5 text-[11px] font-semibold backdrop-blur">
          <Star className="size-3 fill-primary text-primary" aria-hidden="true" />
          {series.rating.toFixed(1).replace('.', ',')}
        </span>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-background/90 to-transparent p-2 pt-8">
          <p className="text-[11px] font-medium text-muted-foreground">
            {`Cap. ${series.totalChapters}`}
          </p>
          <FavoriteButton slug={series.slug} />
        </div>
      </div>
      <div>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
          {series.title}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
          {series.genres.slice(0, 2).join(' · ')}
        </p>
      </div>
    </Link>
  )
}

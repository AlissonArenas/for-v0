import Image from 'next/image'
import Link from 'next/link'
import { Eye, Star } from 'lucide-react'
import { formatViews, getTopTen } from '@/lib/data'
import { cn } from '@/lib/utils'

export function TopTen() {
  const top = getTopTen()

  return (
    <ol className="flex flex-col">
      {top.map((series, i) => (
        <li key={series.slug}>
          <Link
            href={`/series/${series.slug}`}
            className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary/60"
          >
            <span
              className={cn(
                'w-8 shrink-0 text-center font-display text-2xl font-bold tabular-nums',
                i < 3 ? 'text-primary' : 'text-muted-foreground/50',
              )}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span className="sr-only">{`Posição ${i + 1}:`}</span>
            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded">
              <Image
                src={series.cover || '/placeholder.svg'}
                alt=""
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-1 text-sm font-semibold transition-colors group-hover:text-primary">
                {series.title}
              </h3>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="size-3 fill-primary text-primary" aria-hidden="true" />
                  {series.rating.toFixed(1).replace('.', ',')}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="size-3" aria-hidden="true" />
                  {formatViews(series.views)}
                </span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  )
}

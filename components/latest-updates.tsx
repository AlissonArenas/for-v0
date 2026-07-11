import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { getLatestUpdates, timeAgo } from '@/lib/data'

export function LatestUpdates() {
  const updates = getLatestUpdates().slice(0, 8)

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {updates.map(({ series, chapters }) => (
        <article
          key={series.slug}
          className="flex gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-muted-foreground/30"
        >
          <Link
            href={`/series/${series.slug}`}
            className="relative block h-28 w-20 shrink-0 overflow-hidden rounded-md"
          >
            <Image
              src={series.cover || '/placeholder.svg'}
              alt={`Capa de ${series.title}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            <Link href={`/series/${series.slug}`}>
              <h3 className="line-clamp-1 text-sm font-semibold transition-colors hover:text-primary">
                {series.title}
              </h3>
            </Link>
            <p className="mt-0.5 text-xs text-muted-foreground">{series.type}</p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {chapters.map((chapter) => (
                <li key={chapter.number}>
                  <Link
                    href={`/series/${series.slug}/capitulo/${chapter.number}`}
                    className="flex items-center justify-between gap-2 rounded bg-secondary/60 px-2 py-1 text-xs transition-colors hover:bg-secondary"
                  >
                    <span className="font-medium">{`Capítulo ${chapter.number}`}</span>
                    <span className="flex shrink-0 items-center gap-1 text-muted-foreground">
                      <Clock className="size-3" aria-hidden="true" />
                      {timeAgo(chapter.releasedAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  )
}

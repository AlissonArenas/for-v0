import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BookOpen, Eye, Star } from 'lucide-react'
import { ChapterList } from '@/components/chapter-list'
import { FavoriteButton } from '@/components/favorite-button'
import { RatingWidget } from '@/components/rating-widget'
import { SeriesCard } from '@/components/series-card'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { formatViews, getChapters, getSeries, seriesList } from '@/lib/data'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return seriesList.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const series = getSeries(slug)
  if (!series) return { title: 'Obra não encontrada' }
  return {
    title: series.title,
    description: series.synopsis.slice(0, 160),
  }
}

export default async function SeriesPage({ params }: PageProps) {
  const { slug } = await params
  const series = getSeries(slug)
  if (!series) notFound()

  const chapters = getChapters(slug)
  const related = seriesList
    .filter((s) => s.slug !== slug && s.genres.some((g) => series.genres.includes(g)))
    .slice(0, 6)

  return (
    <>
      <SiteHeader />
      <main>
        <div className="relative">
          <div className="absolute inset-0 h-80 overflow-hidden">
            <Image
              src={series.banner || '/placeholder.svg'}
              alt=""
              fill
              priority
              className="object-cover opacity-40"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pt-28 md:px-6 md:pt-36">
            <div className="flex flex-col gap-6 md:flex-row md:gap-8">
              <div className="relative aspect-[7/10] w-44 shrink-0 overflow-hidden rounded-xl border border-border shadow-2xl md:w-56">
                <Image
                  src={series.cover || '/placeholder.svg'}
                  alt={`Capa de ${series.title}`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 176px, 224px"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-end pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                    {series.type}
                  </span>
                  <span className="rounded bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                    {series.status}
                  </span>
                </div>
                <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-balance md:text-5xl">
                  {series.title}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">{series.altTitle}</p>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
                    {series.rating.toFixed(1).replace('.', ',')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="size-4" aria-hidden="true" />
                    {`${formatViews(series.views)} leituras`}
                  </span>
                  <span>{`${series.totalChapters} capítulos`}</span>
                  <span>{series.year}</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/series/${series.slug}/capitulo/1`}
                    className="flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <BookOpen className="size-4" aria-hidden="true" />
                    Ler capítulo 1
                  </Link>
                  <Link
                    href={`/series/${series.slug}/capitulo/${series.totalChapters}`}
                    className="flex h-11 items-center rounded-md border border-border bg-secondary px-6 text-sm font-semibold transition-colors hover:bg-accent"
                  >
                    {`Último capítulo (${series.totalChapters})`}
                  </Link>
                  <FavoriteButton slug={series.slug} variant="full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-8">
              <section aria-labelledby="sinopse" className="rounded-xl border border-border bg-card p-4 md:p-5">
                <h2 id="sinopse" className="font-display text-lg font-bold">
                  Sinopse
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {series.synopsis}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {series.genres.map((genre) => (
                    <Link
                      key={genre}
                      href={`/catalogo?genero=${encodeURIComponent(genre)}`}
                      className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              </section>

              <ChapterList slug={series.slug} chapters={chapters} totalChapters={series.totalChapters} />
            </div>

            <aside className="flex flex-col gap-6">
              <RatingWidget slug={series.slug} rating={series.rating} />

              <section aria-labelledby="ficha" className="rounded-xl border border-border bg-card p-5">
                <h2 id="ficha" className="font-display text-lg font-bold">
                  Ficha técnica
                </h2>
                <dl className="mt-4 flex flex-col gap-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Autor</dt>
                    <dd className="text-right font-medium">{series.author}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Arte</dt>
                    <dd className="text-right font-medium">{series.artist}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Ano</dt>
                    <dd className="text-right font-medium">{series.year}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className="text-right font-medium">{series.status}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Tipo</dt>
                    <dd className="text-right font-medium">{series.type}</dd>
                  </div>
                </dl>
              </section>

              {related.length > 0 && (
                <section aria-labelledby="relacionadas" className="rounded-xl border border-border bg-card p-5">
                  <h2 id="relacionadas" className="font-display text-lg font-bold">
                    Você também pode gostar
                  </h2>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {related.slice(0, 4).map((s) => (
                      <SeriesCard key={s.slug} series={s} />
                    ))}
                  </div>
                </section>
              )}
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

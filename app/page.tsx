import Link from 'next/link'
import { ArrowRight, Flame, LayoutGrid, TrendingUp } from 'lucide-react'
import { HeroCarousel } from '@/components/hero-carousel'
import { LatestUpdates } from '@/components/latest-updates'
import { SeriesCard } from '@/components/series-card'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { TopTen } from '@/components/top-ten'
import { getFeatured, getPopular } from '@/lib/data'

export default function HomePage() {
  const featured = getFeatured()
  const popular = getPopular().slice(0, 12)

  return (
    <>
      <SiteHeader />
      <main>
        <HeroCarousel items={featured} />

        <div className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-12">
              <section aria-labelledby="atualizacoes">
                <div className="mb-5 flex items-center justify-between">
                  <h2 id="atualizacoes" className="flex items-center gap-2 font-display text-xl font-bold md:text-2xl">
                    <Flame className="size-5 text-primary" aria-hidden="true" />
                    Atualizações recentes
                  </h2>
                  <Link
                    href="/catalogo"
                    className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Ver tudo
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
                <LatestUpdates />
              </section>

              <section aria-labelledby="populares">
                <div className="mb-5 flex items-center justify-between">
                  <h2 id="populares" className="flex items-center gap-2 font-display text-xl font-bold md:text-2xl">
                    <LayoutGrid className="size-5 text-primary" aria-hidden="true" />
                    Mais bem avaliados
                  </h2>
                  <Link
                    href="/catalogo"
                    className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Catálogo completo
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {popular.map((series) => (
                    <SeriesCard key={series.slug} series={series} />
                  ))}
                </div>
              </section>
            </div>

            <aside aria-labelledby="top-dez">
              <div className="sticky top-20 rounded-xl border border-border bg-card p-4">
                <h2 id="top-dez" className="flex items-center gap-2 px-2 font-display text-lg font-bold">
                  <TrendingUp className="size-5 text-primary" aria-hidden="true" />
                  Top 10 da semana
                </h2>
                <p className="mt-1 px-2 text-xs text-muted-foreground">
                  As obras mais lidas nos últimos 7 dias.
                </p>
                <div className="mt-3">
                  <TopTen />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

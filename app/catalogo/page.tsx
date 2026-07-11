import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CatalogBrowser } from '@/components/catalog-browser'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Catálogo',
  description:
    'Explore o catálogo completo de manhwas e manhuas traduzidos em português. Filtre por tipo, gênero e popularidade.',
}

export default function CatalogPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-24 md:px-6 md:pt-28">
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold text-balance md:text-4xl">Catálogo</h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Todas as obras disponíveis na plataforma. Use a busca e os filtros para encontrar sua
            próxima leitura.
          </p>
        </header>
        <Suspense>
          <CatalogBrowser />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  )
}

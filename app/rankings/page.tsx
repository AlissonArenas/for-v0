import type { Metadata } from 'next'
import { AuthGate } from '@/components/auth-gate'
import { RankingsView } from '@/components/rankings-view'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Rankings',
  description:
    'Top 10 usuários com mais capítulos lidos, obras mais vistas e obras com melhores avaliações.',
}

export default function RankingsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 pb-20 pt-24 md:px-6 md:pt-28">
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold text-balance md:text-4xl">Rankings</h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Os 10 maiores leitores da comunidade, as obras mais vistas e as mais bem avaliadas.
          </p>
        </header>
        <AuthGate title="Entre para ver os rankings">
          <RankingsView />
        </AuthGate>
      </main>
      <SiteFooter />
    </>
  )
}

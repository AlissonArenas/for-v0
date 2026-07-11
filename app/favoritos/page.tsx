import type { Metadata } from 'next'
import { AuthGate } from '@/components/auth-gate'
import { FavoritesTabs } from '@/components/favorites-tabs'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Favoritos',
  description:
    'Suas obras favoritas em um só lugar e as obras mais favoritadas pela comunidade. Receba avisos sempre que um novo capítulo for lançado.',
}

export default function FavoritesPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 pb-20 pt-24 md:px-6 md:pt-28">
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold text-balance md:text-4xl">Favoritos</h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
            As obras que você acompanha e as mais amadas pela comunidade. Sempre que sair um
            capítulo novo de um favorito seu, você recebe um aviso no sino de notificações.
          </p>
        </header>
        <AuthGate title="Entre para ver seus favoritos">
          <FavoritesTabs />
        </AuthGate>
      </main>
      <SiteFooter />
    </>
  )
}

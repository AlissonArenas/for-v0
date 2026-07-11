import Link from 'next/link'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <p className="font-display text-7xl font-bold text-primary">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-balance">
          Página não encontrada
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          A obra ou capítulo que você procura não existe ou foi removido do catálogo.
        </p>
        <Link
          href="/"
          className="mt-6 flex h-11 items-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Voltar ao início
        </Link>
      </main>
      <SiteFooter />
    </>
  )
}

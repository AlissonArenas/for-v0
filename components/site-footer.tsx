import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2" aria-label="Nexus Toons — Início">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary font-display text-lg font-bold text-primary-foreground">
                N
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                MANHWA<span className="text-primary">SOULS</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Sua central de manhwas e manhuas traduzidos em português. Capítulos novos toda
              semana, leitura em alta qualidade e sem custo.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Navegar</h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="transition-colors hover:text-foreground">
                  Catálogo completo
                </Link>
              </li>
              <li>
                <Link href="/catalogo?tipo=Manhwa" className="transition-colors hover:text-foreground">
                  Manhwa
                </Link>
              </li>
              <li>
                <Link href="/catalogo?tipo=Manhua" className="transition-colors hover:text-foreground">
                  Manhua
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Gêneros populares</h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/catalogo?genero=Ação" className="transition-colors hover:text-foreground">
                  Ação
                </Link>
              </li>
              <li>
                <Link href="/catalogo?genero=Fantasia" className="transition-colors hover:text-foreground">
                  Fantasia
                </Link>
              </li>
              <li>
                <Link href="/catalogo?genero=Cultivo" className="transition-colors hover:text-foreground">
                  Cultivo
                </Link>
              </li>
              <li>
                <Link href="/catalogo?genero=Murim" className="transition-colors hover:text-foreground">
                  Murim
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Manhwa Souls. Todos os direitos reservados.</p>
          <p>Feito para leitores, por leitores.</p>
        </div>
      </div>
    </footer>
  )
}

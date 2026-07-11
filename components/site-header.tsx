'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import { ChevronDown, Heart, Lock, Menu, Search, Trophy, User, X } from 'lucide-react'
import { NotificationsBell } from '@/components/notifications-bell'
import { UserAvatar } from '@/components/user-avatar'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/catalogo', label: 'Catálogo' },
]

const socialLinks = [
  {
    href: '/perfil',
    label: 'Perfil',
    description: 'Seus dados, nível e leituras',
    icon: User,
  },
  {
    href: '/rankings',
    label: 'Rankings',
    description: 'Top leitores e obras da comunidade',
    icon: Trophy,
  },
  {
    href: '/favoritos',
    label: 'Favoritos',
    description: 'Suas obras e as mais favoritadas',
    icon: Heart,
  },
]

function isLinkActive(href: string, pathname: string, tipo: string | null): boolean {
  const [linkPath, linkQuery] = href.split('?')
  if (linkPath !== pathname) return false
  if (linkPath === '/catalogo') {
    const linkTipo = new URLSearchParams(linkQuery ?? '').get('tipo')
    return (linkTipo ?? null) === (tipo ?? null)
  }
  return true
}

function NavLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tipo = searchParams.get('tipo')

  return (
    <>
      {navLinks.map((link) => {
        const active = isLinkActive(link.href, pathname, tipo)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              mobile
                ? 'block rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary'
                : 'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </>
  )
}

function SocialMenu() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<number | null>(null)

  const active = socialLinks.some((l) => l.href === pathname)

  function openMenu() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setOpen(true)
  }

  function scheduleClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 150)
  }

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          active || open ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        Social
        <ChevronDown
          className={cn('size-4 transition-transform duration-200', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      <div
        role="menu"
        aria-label="Menu social"
        className={cn(
          'absolute left-0 top-full w-72 pt-2 transition-all duration-200',
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1 opacity-0',
        )}
      >
        <div className="overflow-hidden rounded-xl border border-border bg-popover shadow-2xl">
          <div className="flex flex-col p-1.5">
            {socialLinks.map((link) => {
              const Icon = link.icon
              const isCurrent = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  aria-current={isCurrent ? 'page' : undefined}
                  className={cn(
                    'group/item flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary',
                    isCurrent && 'bg-secondary',
                  )}
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary transition-colors group-hover/item:bg-accent">
                    <Icon
                      className={cn(
                        'size-4',
                        isCurrent ? 'text-primary' : 'text-muted-foreground',
                      )}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        'block text-sm font-semibold',
                        isCurrent && 'text-primary',
                      )}
                    >
                      {link.label}
                    </span>
                    <span className="block text-xs leading-relaxed text-muted-foreground">
                      {link.description}
                    </span>
                  </span>
                </Link>
              )
            })}
          </div>
          {!user && (
            <div className="flex items-center gap-2 border-t border-border bg-secondary/50 px-4 py-2.5">
              <Lock className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <p className="text-xs text-muted-foreground">
                Entre ou cadastre-se para acessar essas áreas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setSearchOpen(false)
    setQuery('')
    router.push(`/catalogo?q=${encodeURIComponent(q)}`)
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled || menuOpen || searchOpen
          ? 'border-b border-border bg-background/95 backdrop-blur-md'
          : 'bg-gradient-to-b from-background/90 to-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Manhwa Souls — Início">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary font-display text-lg font-bold text-primary-foreground">
            N
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            MANHWA<span className="text-primary">SOULS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação principal">
          <Suspense>
            <NavLinks />
          </Suspense>
          <SocialMenu />
        </nav>

        <div className="ml-auto flex items-center gap-1">
          {searchOpen ? (
            <form onSubmit={submitSearch} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar obra..."
                className="h-9 w-44 rounded-md border border-input bg-secondary px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/50 sm:w-64"
                aria-label="Buscar obra"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Fechar busca"
              >
                <X className="size-5" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Abrir busca"
            >
              <Search className="size-5" />
            </button>
          )}

          <NotificationsBell />

          {user ? (
            <Link
              href="/perfil"
              className="ml-1 flex items-center gap-2 rounded-full py-1 pl-1 pr-1 transition-colors hover:bg-secondary md:pr-3"
              aria-label={`Perfil de ${user.name}`}
            >
              <UserAvatar name={user.name} hue={user.avatarHue} className="size-8 text-xs" />
              <span className="hidden text-sm font-semibold md:block">
                {user.name.length > 14 ? `${user.name.slice(0, 14)}…` : user.name}
              </span>
            </Link>
          ) : (
            <Link
              href="/perfil"
              className="ml-2 hidden h-9 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 md:flex"
            >
              Entrar
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground md:hidden"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-border px-4 py-3 md:hidden" aria-label="Navegação móvel">
          <div className="flex flex-col gap-1">
            <Suspense>
              <NavLinks mobile />
            </Suspense>
            <p className="mt-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Social
            </p>
            {socialLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary',
                    pathname === link.href
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {link.label}
                </Link>
              )
            })}
            {!user && (
              <p className="flex items-center gap-1.5 px-3 pt-1 text-xs text-muted-foreground">
                <Lock className="size-3" aria-hidden="true" />
                Requer login ou cadastro
              </p>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}

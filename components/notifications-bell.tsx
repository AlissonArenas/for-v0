'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Bell, BellRing } from 'lucide-react'
import { timeAgo } from '@/lib/data'
import { useFavorites, type ChapterNotification } from '@/lib/favorites'
import { cn } from '@/lib/utils'

function notifTimeAgo(releasedAt: number): string {
  const diffMin = Math.max(0, Math.floor((Date.now() - releasedAt) / 60000))
  if (diffMin < 1) return 'agora mesmo'
  if (diffMin < 60) return `há ${diffMin} min`
  return timeAgo(new Date(releasedAt).toISOString())
}

export function NotificationsBell() {
  const { notifications, unreadCount, markSeriesRead, markAllRead, favorites } = useFavorites()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'relative flex size-9 items-center justify-center rounded-md transition-colors',
          unreadCount > 0 ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
        )}
        aria-label={
          unreadCount > 0
            ? `Notificações: ${unreadCount} capítulo${unreadCount > 1 ? 's' : ''} novo${unreadCount > 1 ? 's' : ''}`
            : 'Notificações'
        }
        aria-expanded={open}
      >
        {unreadCount > 0 ? <BellRing className="size-5" /> : <Bell className="size-5" />}
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-bold">Notificações</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-medium text-primary hover:underline"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
              <p className="mt-2 text-sm font-medium">Nenhum capítulo novo</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {favorites.length === 0
                  ? 'Favorite uma obra para ser avisado quando sair capítulo novo.'
                  : 'Você será avisado aqui assim que sair capítulo novo das suas favoritas.'}
              </p>
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {notifications.map((n: ChapterNotification) => (
                <li key={`${n.slug}-${n.chapter}`} className="border-b border-border last:border-b-0">
                  <Link
                    href={`/series/${n.slug}`}
                    onClick={() => {
                      markSeriesRead(n.slug)
                      setOpen(false)
                    }}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary"
                  >
                    <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded border border-border">
                      <Image
                        src={n.cover || '/placeholder.svg'}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-semibold">{n.seriesTitle}</p>
                      <p className="mt-0.5 text-xs text-primary">
                        {`Capítulo ${n.chapter} disponível!`}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {notifTimeAgo(n.releasedAt)}
                      </p>
                    </div>
                    <span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/favoritos"
            onClick={() => setOpen(false)}
            className="block border-t border-border px-4 py-2.5 text-center text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Ver meus favoritos
          </Link>
        </div>
      )}
    </div>
  )
}

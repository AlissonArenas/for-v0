'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getSeries, type Series } from '@/lib/data'

// Como os dados do site são estáticos (mock), simulamos o lançamento de
// novos capítulos: cada obra favoritada "lança" um capítulo novo a cada
// intervalo abaixo, contado a partir do momento em que foi favoritada.
// Quando houver backend real, basta trocar `getLatestChapter` para ler a
// contagem real de capítulos.
const RELEASE_INTERVAL_MS = 2 * 60 * 1000 // 2 minutos
const POLL_INTERVAL_MS = 15 * 1000

const STORAGE_KEY = 'nexus-favorites-v1'

interface FavoriteEntry {
  slug: string
  addedAt: number // epoch ms
  lastSeenChapter: number
}

export interface ChapterNotification {
  slug: string
  seriesTitle: string
  cover: string
  chapter: number
  releasedAt: number // epoch ms
}

interface FavoritesContextValue {
  favorites: { series: Series; entry: FavoriteEntry }[]
  isFavorite: (slug: string) => boolean
  toggleFavorite: (slug: string) => void
  notifications: ChapterNotification[]
  unreadCount: number
  markSeriesRead: (slug: string) => void
  markAllRead: () => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

function loadEntries(): Record<string, FavoriteEntry> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return {}
    return parsed as Record<string, FavoriteEntry>
  } catch {
    return {}
  }
}

function saveEntries(entries: Record<string, FavoriteEntry>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // armazenamento indisponível (modo privado etc.) — favoritos valem só na sessão
  }
}

/** Último capítulo "lançado" da obra, incluindo os lançamentos simulados. */
function getLatestChapter(series: Series, entry: FavoriteEntry, now: number): number {
  const simulated = Math.floor(Math.max(0, now - entry.addedAt) / RELEASE_INTERVAL_MS)
  return series.totalChapters + simulated
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Record<string, FavoriteEntry>>({})
  const [now, setNow] = useState(() => Date.now())

  // Carrega do localStorage após montar (evita divergência de hidratação)
  useEffect(() => {
    setEntries(loadEntries())
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setEntries(loadEntries())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Relógio para detectar novos capítulos sem recarregar a página
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), POLL_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [])

  const persist = useCallback((next: Record<string, FavoriteEntry>) => {
    setEntries(next)
    saveEntries(next)
  }, [])

  const isFavorite = useCallback((slug: string) => slug in entries, [entries])

  const toggleFavorite = useCallback(
    (slug: string) => {
      const series = getSeries(slug)
      if (!series) return
      const next = { ...entries }
      if (next[slug]) {
        delete next[slug]
      } else {
        next[slug] = {
          slug,
          addedAt: Date.now(),
          lastSeenChapter: series.totalChapters,
        }
      }
      persist(next)
    },
    [entries, persist],
  )

  const favorites = useMemo(() => {
    return Object.values(entries)
      .map((entry) => {
        const series = getSeries(entry.slug)
        return series ? { series, entry } : null
      })
      .filter((f): f is { series: Series; entry: FavoriteEntry } => f !== null)
      .sort((a, b) => b.entry.addedAt - a.entry.addedAt)
  }, [entries])

  const notifications = useMemo(() => {
    const list: ChapterNotification[] = []
    for (const { series, entry } of favorites) {
      const latest = getLatestChapter(series, entry, now)
      for (let ch = entry.lastSeenChapter + 1; ch <= latest; ch++) {
        list.push({
          slug: series.slug,
          seriesTitle: series.title,
          cover: series.cover,
          chapter: ch,
          releasedAt: entry.addedAt + (ch - series.totalChapters) * RELEASE_INTERVAL_MS,
        })
      }
    }
    return list.sort((a, b) => b.releasedAt - a.releasedAt)
  }, [favorites, now])

  const markSeriesRead = useCallback(
    (slug: string) => {
      const entry = entries[slug]
      const series = getSeries(slug)
      if (!entry || !series) return
      const latest = getLatestChapter(series, entry, Date.now())
      if (latest === entry.lastSeenChapter) return
      persist({ ...entries, [slug]: { ...entry, lastSeenChapter: latest } })
    },
    [entries, persist],
  )

  const markAllRead = useCallback(() => {
    const nowMs = Date.now()
    const next: Record<string, FavoriteEntry> = {}
    for (const [slug, entry] of Object.entries(entries)) {
      const series = getSeries(slug)
      next[slug] = series
        ? { ...entry, lastSeenChapter: getLatestChapter(series, entry, nowMs) }
        : entry
    }
    persist(next)
  }, [entries, persist])

  const value = useMemo(
    () => ({
      favorites,
      isFavorite,
      toggleFavorite,
      notifications,
      unreadCount: notifications.length,
      markSeriesRead,
      markAllRead,
    }),
    [favorites, isFavorite, toggleFavorite, notifications, markSeriesRead, markAllRead],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites deve ser usado dentro de <FavoritesProvider>')
  return ctx
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Reader } from '@/components/reader'
import { getSeries } from '@/lib/data'

interface PageProps {
  params: Promise<{ slug: string; num: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, num } = await params
  const series = getSeries(slug)
  if (!series) return { title: 'Capítulo não encontrado' }
  return {
    title: `${series.title} — Capítulo ${num}`,
    description: `Leia o capítulo ${num} de ${series.title} online e de graça.`,
  }
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug, num } = await params
  const series = getSeries(slug)
  const chapterNumber = Number.parseInt(num, 10)

  if (
    !series ||
    Number.isNaN(chapterNumber) ||
    chapterNumber < 1 ||
    chapterNumber > series.totalChapters
  ) {
    notFound()
  }

  const pages = 8 + ((chapterNumber * 7) % 5)

  return <Reader series={series} chapterNumber={chapterNumber} pages={pages} />
}

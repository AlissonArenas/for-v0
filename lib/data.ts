export type SeriesType = 'Manhwa' | 'Manhua'
export type SeriesStatus = 'Em lançamento' | 'Completo' | 'Hiato'

export interface Chapter {
  number: number
  title?: string
  releasedAt: string // ISO date
  pages: number
}

export interface Series {
  slug: string
  title: string
  altTitle: string
  type: SeriesType
  status: SeriesStatus
  rating: number
  genres: string[]
  synopsis: string
  author: string
  artist: string
  year: number
  views: number
  cover: string
  banner: string
  totalChapters: number
  featured?: boolean
}

const day = 24 * 60 * 60 * 1000
const now = Date.now()

function iso(hoursAgo: number) {
  return new Date(now - hoursAgo * 60 * 60 * 1000).toISOString()
}

export const seriesList: Series[] = [
  {
    slug: 'a-lamina-do-cacador-sombrio',
    title: 'A Lâmina do Caçador Sombrio',
    altTitle: 'Dark Hunter Blade',
    type: 'Manhwa',
    status: 'Em lançamento',
    rating: 9.4,
    genres: ['Ação', 'Fantasia', 'Sistema'],
    synopsis:
      'Dez anos após a abertura dos Portais, Kang Jin-Woo continua sendo o caçador mais fraco do continente — até o dia em que morre dentro de uma masmorra dupla e desperta com um sistema que só ele consegue ver. Agora, cada inimigo derrotado o torna mais forte, e o mundo inteiro começará a temer o nome que antes ignorava.',
    author: 'Chu Sung-Hyun',
    artist: 'REDICE Studio',
    year: 2021,
    views: 4823000,
    cover: '/placeholder.svg?height=600&width=420',
    banner: '/placeholder.svg?height=720&width=1600',
    totalChapters: 187,
    featured: true,
  },
  {
    slug: 'o-retorno-do-mago-de-ferro',
    title: 'O Retorno do Mago de Ferro',
    altTitle: 'Return of the Iron Mage',
    type: 'Manhwa',
    status: 'Em lançamento',
    rating: 9.1,
    genres: ['Ação', 'Regressão', 'Magia'],
    synopsis:
      'Traído pelos próprios companheiros no último andar da Torre, o arquimago Lucas Traumen retorna 30 anos ao passado no corpo de um nobre decadente. Desta vez, ele vai subir a Torre do zero — e cobrar cada dívida com juros.',
    author: 'Yoo Sung-Ho',
    artist: 'Studio Kanna',
    year: 2022,
    views: 3610000,
    cover: '/placeholder.svg?height=600&width=420',
    banner: '/placeholder.svg?height=720&width=1600',
    totalChapters: 142,
    featured: true,
  },
  {
    slug: 'pico-marcial-supremo',
    title: 'Pico Marcial Supremo',
    altTitle: 'Supreme Martial Peak',
    type: 'Manhua',
    status: 'Em lançamento',
    rating: 8.7,
    genres: ['Cultivo', 'Ação', 'Aventura'],
    synopsis:
      'Yang Kai era apenas um discípulo encarregado de varrer o pátio da seita, até encontrar um livro negro sem páginas. O caminho até o pico marcial é solitário, longo e cruel — mas ele nunca soube recuar.',
    author: 'Momo',
    artist: 'Pikapi Studio',
    year: 2019,
    views: 5240000,
    cover: '/placeholder.svg?height=600&width=420',
    banner: '/placeholder.svg?height=720&width=1600',
    totalChapters: 3412,
  },
  {
    slug: 'leitor-onisciente',
    title: 'Leitor Onisciente',
    altTitle: 'Omniscient Reader Viewpoint',
    type: 'Manhwa',
    status: 'Em lançamento',
    rating: 9.6,
    genres: ['Fantasia', 'Apocalipse', 'Drama'],
    synopsis:
      'Kim Dokja era o único leitor de um web novel esquecido com 3.149 capítulos. Quando o mundo real se transforma no enredo da história, ele se torna a única pessoa que sabe como tudo termina.',
    author: 'Sing Shong',
    artist: 'Sleepy-C',
    year: 2020,
    views: 6115000,
    cover: '/placeholder.svg?height=600&width=420',
    banner: '/placeholder.svg?height=720&width=1600',
    totalChapters: 231,
    featured: true,
  },
  {
    slug: 'renascido-como-espadachim-celestial',
    title: 'Renascido como Espadachim Celestial',
    altTitle: 'Heavenly Sword Reborn',
    type: 'Manhwa',
    status: 'Em lançamento',
    rating: 8.9,
    genres: ['Murim', 'Ação', 'Reencarnação'],
    synopsis:
      'O Demônio Celestial, o homem mais forte do mundo marcial, é envenenado por seus discípulos. Cem anos depois, desperta no corpo de um jovem servo espancado — e o mundo marcial vai reaprender o significado de medo.',
    author: 'Han Jung-Wol',
    artist: 'Black Ajin',
    year: 2021,
    views: 2980000,
    cover: '/placeholder.svg?height=600&width=420',
    banner: '/placeholder.svg?height=720&width=1600',
    totalChapters: 168,
  },
  {
    slug: 'ascensao-do-rei-demonio',
    title: 'Ascensão do Rei Demônio',
    altTitle: 'Rise of the Demon King',
    type: 'Manhua',
    status: 'Em lançamento',
    rating: 8.4,
    genres: ['Cultivo', 'Fantasia', 'Vingança'],
    synopsis:
      'Xia Yan tinha tudo: talento, família e um futuro brilhante. Em uma noite, perdeu os três. Rejeitado pelos céus, ele decide cultivar o caminho proibido dos demônios para reescrever seu destino.',
    author: 'Wang Yu',
    artist: 'iCiyuan',
    year: 2020,
    views: 3105000,
    cover: '/placeholder.svg?height=600&width=420',
    banner: '/placeholder.svg?height=720&width=1600',
    totalChapters: 486,
  },
  {
    slug: 'academia-dos-cacadores',
    title: 'Academia dos Caçadores',
    altTitle: 'Hunter Academy',
    type: 'Manhwa',
    status: 'Em lançamento',
    rating: 8.8,
    genres: ['Escolar', 'Ação', 'Sistema'],
    synopsis:
      'Na Academia Yeongdo, apenas os 100 melhores alunos do ano ganham licença de caçador. Baek Yu-Seong, reprovado três vezes, acorda com a habilidade de ver o talento oculto de qualquer pessoa — inclusive o dele.',
    author: 'Gong Baek-Ryang',
    artist: 'Team B.A.O.',
    year: 2023,
    views: 1870000,
    cover: '/placeholder.svg?height=600&width=420',
    banner: '/placeholder.svg?height=720&width=1600',
    totalChapters: 94,
  },
  {
    slug: 'imperatriz-da-espada-gelada',
    title: 'Imperatriz da Espada Gelada',
    altTitle: 'Frost Sword Empress',
    type: 'Manhua',
    status: 'Em lançamento',
    rating: 8.6,
    genres: ['Cultivo', 'Romance', 'Fantasia'],
    synopsis:
      'Vendida pela própria família para uma seita menor, Lin Shuang jurou nunca mais depender de ninguém. Com uma espada quebrada e uma técnica de gelo herdada de uma imperatriz caída, ela vai congelar o caminho até o topo.',
    author: 'Qing He',
    artist: 'Manmanwu',
    year: 2022,
    views: 1540000,
    cover: '/placeholder.svg?height=600&width=420',
    banner: '/placeholder.svg?height=720&width=1600',
    totalChapters: 213,
  },
  {
    slug: 'o-necromante-de-elo-s',
    title: 'O Necromante de Elo S',
    altTitle: 'S-Rank Necromancer',
    type: 'Manhwa',
    status: 'Em lançamento',
    rating: 9.0,
    genres: ['Ação', 'Fantasia Sombria', 'Sistema'],
    synopsis:
      'Considerada a pior classe do despertar, a necromancia condenou Seo Jun-Ho ao ostracismo. Mas quando os mortos do maior cataclismo da história respondem apenas ao seu chamado, os mesmos que o desprezaram virão implorar por ajuda.',
    author: 'Im Dal-Young',
    artist: 'Studio Nine',
    year: 2022,
    views: 2440000,
    cover: '/placeholder.svg?height=600&width=420',
    banner: '/placeholder.svg?height=720&width=1600',
    totalChapters: 121,
    featured: true,
  },
  {
    slug: 'segunda-vida-do-rankeador',
    title: 'Segunda Vida do Rankeador',
    altTitle: 'Second Life Ranker',
    type: 'Manhwa',
    status: 'Completo',
    rating: 9.2,
    genres: ['Torre', 'Ação', 'Vingança'],
    synopsis:
      'Yeon-Woo descobre o diário do irmão gêmeo desaparecido — morto traído dentro do Obelisco, a torre que conecta os mundos. Com as memórias do irmão em mãos, ele entra na torre para terminar a escalada e enterrar os culpados.',
    author: 'Sadoyeon',
    artist: 'Daul',
    year: 2019,
    views: 4470000,
    cover: '/placeholder.svg?height=600&width=420',
    banner: '/placeholder.svg?height=720&width=1600',
    totalChapters: 180,
  },
  {
    slug: 'deus-marcial-renegado',
    title: 'Deus Marcial Renegado',
    altTitle: 'Renegade Martial God',
    type: 'Manhua',
    status: 'Em lançamento',
    rating: 8.2,
    genres: ['Cultivo', 'Ação', 'Comédia'],
    synopsis:
      'Depois de 3.000 anos selado sob uma montanha, o outrora Deus Marcial Ye Chen desperta em uma era onde seu nome virou lenda — e piada. Reconstruir a reputação vai ser fácil. Controlar o temperamento, nem tanto.',
    author: 'Feng Qing-Yang',
    artist: 'Ake Studio',
    year: 2021,
    views: 2210000,
    cover: '/placeholder.svg?height=600&width=420',
    banner: '/placeholder.svg?height=720&width=1600',
    totalChapters: 752,
  },
  {
    slug: 'flor-da-seita-do-norte',
    title: 'Flor da Seita do Norte',
    altTitle: 'Flower of the Northern Sect',
    type: 'Manhwa',
    status: 'Em lançamento',
    rating: 8.5,
    genres: ['Murim', 'Romance', 'Drama'],
    synopsis:
      'Herdeira da seita mais isolada do norte, Yeon Seol-Hwa desce a montanha pela primeira vez para investigar o massacre que órfã a deixou. O mundo marcial é mais bonito — e mais podre — do que os pergaminhos contavam.',
    author: 'Seo Hae-In',
    artist: 'Golem Factory',
    year: 2023,
    views: 1260000,
    cover: '/placeholder.svg?height=600&width=420',
    banner: '/placeholder.svg?height=720&width=1600',
    totalChapters: 76,
  },
  {
    slug: 'devorador-de-dungeons',
    title: 'Devorador de Dungeons',
    altTitle: 'Dungeon Devourer',
    type: 'Manhwa',
    status: 'Em lançamento',
    rating: 9.3,
    genres: ['Ação', 'Apocalipse', 'Sistema'],
    synopsis:
      'Quando uma dungeon aparece, caçadores a limpam. Quando Han Kyul aparece, a dungeon inteira desaparece — absorvida. Ele é a única pessoa no mundo capaz de devorar masmorras, e alguém muito poderoso acaba de notar isso.',
    author: 'Baek Do-Hyun',
    artist: 'Merle Studio',
    year: 2023,
    views: 2890000,
    cover: '/placeholder.svg?height=600&width=420',
    banner: '/placeholder.svg?height=720&width=1600',
    totalChapters: 88,
    featured: true,
  },
]

// Últimos capítulos por série (horas atrás, para "Atualizações recentes")
const latestReleases: Record<string, number[]> = {
  'devorador-de-dungeons': [2, 26, 50],
  'a-lamina-do-cacador-sombrio': [4, 28, 52],
  'leitor-onisciente': [7, 31, 55],
  'pico-marcial-supremo': [9, 21, 33],
  'o-retorno-do-mago-de-ferro': [12, 36, 60],
  'o-necromante-de-elo-s': [16, 40, 64],
  'academia-dos-cacadores': [20, 44, 68],
  'renascido-como-espadachim-celestial': [24, 48, 72],
  'ascensao-do-rei-demonio': [11, 23, 35],
  'imperatriz-da-espada-gelada': [30, 54, 78],
  'deus-marcial-renegado': [15, 27, 39],
  'flor-da-seita-do-norte': [45, 69, 93],
}

export function getSeries(slug: string): Series | undefined {
  return seriesList.find((s) => s.slug === slug)
}

export function getChapters(slug: string): Chapter[] {
  const series = getSeries(slug)
  if (!series) return []
  const recent = latestReleases[slug] ?? [6, 30, 54]
  const chapters: Chapter[] = []
  for (let i = 0; i < Math.min(series.totalChapters, 60); i++) {
    const number = series.totalChapters - i
    const hoursAgo = i < recent.length ? recent[i] : recent[recent.length - 1] + (i - recent.length + 1) * 84
    chapters.push({
      number,
      releasedAt: iso(hoursAgo),
      pages: 9 + ((number * 7) % 6),
    })
  }
  return chapters
}

export function getLatestUpdates() {
  return seriesList
    .map((series) => {
      const chapters = getChapters(series.slug).slice(0, 3)
      return { series, chapters }
    })
    .sort(
      (a, b) =>
        new Date(b.chapters[0].releasedAt).getTime() - new Date(a.chapters[0].releasedAt).getTime(),
    )
}

export function getFeatured(): Series[] {
  return seriesList.filter((s) => s.featured)
}

export function getTopTen(): Series[] {
  return [...seriesList].sort((a, b) => b.views - a.views).slice(0, 10)
}

export function getPopular(): Series[] {
  return [...seriesList].sort((a, b) => b.rating - a.rating)
}

// ---------------------------------------------------------------------------
// Rankings e comunidade (dados estáticos para simular a UI)
// ---------------------------------------------------------------------------

export interface RankedUser {
  id: string
  name: string
  chaptersRead: number
  level: number
  avatarHue: number // matiz do avatar gerado por iniciais
}

export const topReaders: RankedUser[] = [
  { id: 'u1', name: 'ShadowMonarch', chaptersRead: 12847, level: 42, avatarHue: 27 },
  { id: 'u2', name: 'Dokja_Kim', chaptersRead: 11302, level: 39, avatarHue: 210 },
  { id: 'u3', name: 'LâminaNegra', chaptersRead: 10554, level: 37, avatarHue: 150 },
  { id: 'u4', name: 'Cultivadora_Lin', chaptersRead: 9871, level: 35, avatarHue: 320 },
  { id: 'u5', name: 'MagoDeFerro', chaptersRead: 9243, level: 34, avatarHue: 60 },
  { id: 'u6', name: 'Yeon_Woo88', chaptersRead: 8610, level: 32, avatarHue: 190 },
  { id: 'u7', name: 'NecroSeo', chaptersRead: 7955, level: 30, avatarHue: 280 },
  { id: 'u8', name: 'PicoMarcial', chaptersRead: 7412, level: 29, avatarHue: 100 },
  { id: 'u9', name: 'SeolHwa_Flor', chaptersRead: 6890, level: 27, avatarHue: 350 },
  { id: 'u10', name: 'DevoraDungeon', chaptersRead: 6337, level: 26, avatarHue: 40 },
]

// Quantidade de usuários que favoritaram cada obra (mock)
const favoritesCount: Record<string, number> = {
  'leitor-onisciente': 48210,
  'a-lamina-do-cacador-sombrio': 45930,
  'devorador-de-dungeons': 39480,
  'segunda-vida-do-rankeador': 36110,
  'o-retorno-do-mago-de-ferro': 33470,
  'o-necromante-de-elo-s': 29840,
  'pico-marcial-supremo': 27210,
  'renascido-como-espadachim-celestial': 24580,
  'academia-dos-cacadores': 19940,
  'ascensao-do-rei-demonio': 17320,
  'imperatriz-da-espada-gelada': 14780,
  'deus-marcial-renegado': 12150,
  'flor-da-seita-do-norte': 9860,
}

export function getFavoritesCount(slug: string): number {
  return favoritesCount[slug] ?? 0
}

export function getMostFavorited(): { series: Series; count: number }[] {
  return [...seriesList]
    .map((series) => ({ series, count: getFavoritesCount(series.slug) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

export function getMostViewed(): Series[] {
  return [...seriesList].sort((a, b) => b.views - a.views).slice(0, 10)
}

export function getBestRated(): Series[] {
  return [...seriesList].sort((a, b) => b.rating - a.rating).slice(0, 10)
}

// Quantidade de avaliações por obra (mock, para o widget de avaliação)
export function getRatingCount(slug: string): number {
  const base = favoritesCount[slug] ?? 5000
  return Math.round(base * 0.36)
}

export const allGenres = Array.from(new Set(seriesList.flatMap((s) => s.genres))).sort((a, b) =>
  a.localeCompare(b, 'pt-BR'),
)

export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1).replace('.', ',')}M`
  if (views >= 1_000) return `${Math.round(views / 1_000)}K`
  return String(views)
}

export function timeAgo(isoDate: string): string {
  const diff = now - new Date(isoDate).getTime()
  const hours = Math.floor(diff / (60 * 60 * 1000))
  if (hours < 1) return 'agora mesmo'
  if (hours < 24) return `há ${hours}h`
  const days = Math.floor(diff / day)
  if (days === 1) return 'há 1 dia'
  if (days < 30) return `há ${days} dias`
  const months = Math.floor(days / 30)
  return months === 1 ? 'há 1 mês' : `há ${months} meses`
}

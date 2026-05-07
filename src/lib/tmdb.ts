import type { SearchResult } from '@/types'

const BASE = 'https://api.themoviedb.org/3'
const IMG = 'https://image.tmdb.org/t/p/w500'

async function fetchTmdb(path: string, query: string): Promise<any[]> {
  const key = process.env.TMDB_API_KEY
  const url = `${BASE}${path}?api_key=${key}&query=${encodeURIComponent(query)}&page=1`
  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()
  return data.results ?? []
}

export async function searchScreen(query: string): Promise<SearchResult[]> {
  const [movies, series] = await Promise.all([
    fetchTmdb('/search/movie', query),
    fetchTmdb('/search/tv', query),
  ])

  const movieResults: SearchResult[] = movies.map((m: any) => ({
    external_id: `movie-${m.id}`,
    type: 'movie' as const,
    title: m.title ?? 'Unknown',
    creator: '',
    cover_url: m.poster_path ? `${IMG}${m.poster_path}` : null,
    year: m.release_date ? m.release_date.slice(0, 4) : null,
  }))

  const seriesResults: SearchResult[] = series.map((s: any) => ({
    external_id: `series-${s.id}`,
    type: 'series' as const,
    title: s.name ?? 'Unknown',
    creator: '',
    cover_url: s.poster_path ? `${IMG}${s.poster_path}` : null,
    year: s.first_air_date ? s.first_air_date.slice(0, 4) : null,
  }))

  return [...movieResults, ...seriesResults]
}

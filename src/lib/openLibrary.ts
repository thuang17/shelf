import type { SearchResult } from '@/types'

export async function searchBooks(query: string): Promise<SearchResult[]> {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10&fields=key,title,author_name,cover_i,first_publish_year`
  const res = await fetch(url)
  if (!res.ok) return []

  const data = await res.json()
  return (data.docs ?? []).map((doc: any): SearchResult => ({
    external_id: doc.key,
    type: 'book',
    title: doc.title ?? 'Unknown',
    creator: doc.author_name?.[0] ?? 'Unknown',
    cover_url: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
      : null,
    year: doc.first_publish_year ? String(doc.first_publish_year) : null,
  }))
}

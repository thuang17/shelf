import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFetch = vi.fn()
global.fetch = mockFetch

import { searchBooks } from '@/lib/openLibrary'

describe('searchBooks', () => {
  beforeEach(() => { mockFetch.mockReset() })

  it('returns mapped results', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        docs: [{
          key: '/works/OL1234W',
          title: 'Atomic Habits',
          author_name: ['James Clear'],
          cover_i: 9876,
          first_publish_year: 2018,
        }],
      }),
    })

    const results = await searchBooks('atomic habits')

    expect(results).toHaveLength(1)
    expect(results[0]).toEqual({
      external_id: '/works/OL1234W',
      type: 'book',
      title: 'Atomic Habits',
      creator: 'James Clear',
      cover_url: 'https://covers.openlibrary.org/b/id/9876-L.jpg',
      year: '2018',
    })
  })

  it('returns empty array on fetch error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false })
    const results = await searchBooks('anything')
    expect(results).toEqual([])
  })

  it('handles missing cover gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        docs: [{ key: '/works/OL999W', title: 'No Cover', author_name: ['Unknown'] }],
      }),
    })
    const results = await searchBooks('no cover')
    expect(results[0].cover_url).toBeNull()
  })
})

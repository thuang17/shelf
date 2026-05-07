import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFetch = vi.fn()
global.fetch = mockFetch

import { searchScreen } from '@/lib/tmdb'

describe('searchScreen', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    process.env.TMDB_API_KEY = 'test-key'
  })

  it('returns combined movie and series results', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{
            id: 101,
            title: 'Past Lives',
            release_date: '2023-06-02',
            poster_path: '/abc.jpg',
          }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{
            id: 202,
            name: 'The Bear',
            first_air_date: '2022-06-23',
            poster_path: '/def.jpg',
          }],
        }),
      })

    const results = await searchScreen('bear')

    expect(results).toHaveLength(2)
    expect(results[0]).toMatchObject({ external_id: 'movie-101', type: 'movie', title: 'Past Lives' })
    expect(results[1]).toMatchObject({ external_id: 'series-202', type: 'series', title: 'The Bear' })
  })

  it('returns empty array if both fetches fail', async () => {
    mockFetch.mockResolvedValue({ ok: false })
    const results = await searchScreen('anything')
    expect(results).toEqual([])
  })
})

export type ItemType = 'book' | 'movie' | 'series'

export type ItemStatus =
  | 'reading'
  | 'watching'
  | 'finished'
  | 'want_to_read'
  | 'want_to_watch'

export interface Shelf {
  id: string
  slug: string
  owner_name: string
  edit_token: string
  created_at: string
}

export interface Item {
  id: string
  shelf_id: string
  type: ItemType
  external_id: string
  title: string
  creator: string
  cover_url: string | null
  year: string | null
  status: ItemStatus
  position: number
  created_at: string
}

export interface SearchResult {
  external_id: string
  type: ItemType
  title: string
  creator: string
  cover_url: string | null
  year: string | null
}

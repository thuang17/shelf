'use client'

import { useState } from 'react'
import type { Shelf, Item, ItemStatus } from '@/types'
import FilterBar, { type FilterValue } from '@/components/FilterBar'
import ShelfRow from '@/components/ShelfRow'
import AddItemModal from '@/components/AddItemModal'

function applyFilter(items: Item[], filter: FilterValue): Item[] {
  switch (filter) {
    case 'books':    return items.filter((i) => i.type === 'book')
    case 'movies':   return items.filter((i) => i.type === 'movie')
    case 'series':   return items.filter((i) => i.type === 'series')
    case 'reading':  return items.filter((i) => i.status === 'reading' || i.status === 'watching')
    case 'finished': return items.filter((i) => i.status === 'finished')
    case 'want':     return items.filter((i) => i.status === 'want_to_read' || i.status === 'want_to_watch')
    default:         return items
  }
}

interface Props {
  shelf: Shelf
  initialItems: Item[]
  isEditing: boolean
  editToken: string | null
}

export default function ShelfClient({ shelf, initialItems, isEditing, editToken }: Props) {
  const [items, setItems] = useState<Item[]>(initialItems)
  const [filter, setFilter] = useState<FilterValue>('all')
  const [showModal, setShowModal] = useState(false)

  const filtered = applyFilter(items, filter)
  const books  = filtered.filter((i) => i.type === 'book')
  const screen = filtered.filter((i) => i.type === 'movie' || i.type === 'series')

  async function handleDelete(id: string) {
    await fetch(`/api/items/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ editToken }),
    })
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  async function handleStatusChange(id: string, status: ItemStatus) {
    await fetch(`/api/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ editToken, status }),
    })
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
  }

  async function refreshItems() {
    const res = await fetch(`/api/shelf/${shelf.slug}`)
    const data = await res.json()
    if (data.items) setItems(data.items)
  }

  return (
    <>
      {/* Nav bar — glass */}
      <nav
        className="flex items-center justify-between px-8 py-3.5"
        style={{
          background: 'rgba(17,17,17,0.7)',
          backdropFilter: 'blur(20px) saturate(120%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.3px' }}>
          shelf
          <span style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontWeight: 400, fontSize: '13px', marginLeft: '6px' }}>/ {shelf.owner_name}</span>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing && (
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="text-[11px] font-medium transition-colors duration-200"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
            >
              Share
            </button>
          )}
          {isEditing && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-200"
              style={{
                background: '#f8fafc',
                color: '#080808',
                fontFamily: 'var(--font-body)',
              }}
            >
              + Add
            </button>
          )}
        </div>
      </nav>

      <div className="pt-6">
        <FilterBar active={filter} onChange={setFilter} />
      </div>

      {items.length === 0 ? (
        <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {isEditing ? 'Click + Add to start building your shelf.' : 'Nothing here yet.'}
          </p>
        </div>
      ) : (
        <>
          <ShelfRow
            title="Books"
            items={books}
            isEditing={isEditing}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
          <ShelfRow
            title="Movies & Series"
            items={screen}
            isEditing={isEditing}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </>
      )}

      {showModal && (
        <AddItemModal
          slug={shelf.slug}
          editToken={editToken!}
          onClose={() => setShowModal(false)}
          onAdded={refreshItems}
        />
      )}
    </>
  )
}

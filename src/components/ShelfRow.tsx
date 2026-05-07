'use client'

import type { Item, ItemStatus } from '@/types'
import MediaCard from './MediaCard'

interface ShelfRowProps {
  title: string
  items: Item[]
  isEditing: boolean
  onDelete?: (id: string) => void
  onStatusChange?: (id: string, status: ItemStatus) => void
}

export default function ShelfRow({ title, items, isEditing, onDelete, onStatusChange }: ShelfRowProps) {
  if (items.length === 0) return null

  return (
    <div className="mb-12">
      <div className="flex items-baseline gap-2 px-12 mb-4">
        <h2
          className="text-sm font-semibold"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
        >
          {title}
        </h2>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {items.length}
        </span>
      </div>
      <div
        className="grid px-12"
        style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '10px' }}
      >
        {items.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            isEditing={isEditing}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  )
}

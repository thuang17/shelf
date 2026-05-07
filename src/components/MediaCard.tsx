'use client'

import type { Item, ItemStatus } from '@/types'

const STATUS_LABELS: Record<ItemStatus, string> = {
  reading: 'Reading',
  watching: 'Watching',
  finished: 'Finished',
  want_to_read: 'Want to read',
  want_to_watch: 'Want to watch',
}

const STATUS_COLORS: Record<ItemStatus, string> = {
  reading: 'var(--accent-blue)',
  watching: 'var(--accent-blue)',
  finished: 'var(--accent-green)',
  want_to_read: 'var(--text-muted)',
  want_to_watch: 'var(--text-muted)',
}

interface MediaCardProps {
  item: Item
  isEditing: boolean
  onDelete?: (id: string) => void
  onStatusChange?: (id: string, status: ItemStatus) => void
}

export default function MediaCard({ item, isEditing, onDelete, onStatusChange }: MediaCardProps) {
  const isActive = item.status === 'reading' || item.status === 'watching'

  return (
    <div className="group relative">
      <div
        className="media-card-cover relative w-full rounded-lg overflow-hidden cursor-pointer"
        style={{
          aspectRatio: '2/3',
          background: 'linear-gradient(155deg, #1a1a2e, #16213e)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        }}
      >
        {item.cover_url && (
          <img
            src={item.cover_url}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Hover overlay */}
        <div
          className="media-card-overlay absolute inset-0 flex flex-col justify-end p-3"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)',
          }}
        >
          <p
            className="text-white font-semibold text-xs leading-snug mb-1"
            style={{ letterSpacing: '-0.01em' }}
          >
            {item.title}
          </p>
          {item.creator && (
            <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {item.creator}
            </p>
          )}
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: STATUS_COLORS[item.status] }}
            />
            <span className="text-xs" style={{ color: STATUS_COLORS[item.status] }}>
              {STATUS_LABELS[item.status]}
            </span>
          </div>

          {isEditing && (
            <div className="flex gap-1.5 mt-2">
              <select
                value={item.status}
                onChange={(e) => onStatusChange?.(item.id, e.target.value as ItemStatus)}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 text-xs rounded px-1 py-1 outline-none"
                style={{
                  background: 'rgba(0,0,0,0.7)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                {item.type === 'book' ? (
                  <>
                    <option value="reading">Reading</option>
                    <option value="finished">Finished</option>
                    <option value="want_to_read">Want to read</option>
                  </>
                ) : (
                  <>
                    <option value="watching">Watching</option>
                    <option value="finished">Finished</option>
                    <option value="want_to_watch">Want to watch</option>
                  </>
                )}
              </select>
              <button
                onClick={() => onDelete?.(item.id)}
                className="text-xs px-2 py-1 rounded"
                style={{
                  background: 'rgba(180,40,40,0.7)',
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Active status dot (visible without hover) */}
        {isActive && (
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{
              background: 'var(--accent-blue)',
              boxShadow: '0 0 6px rgba(79,163,224,0.7)',
            }}
          />
        )}
      </div>
    </div>
  )
}

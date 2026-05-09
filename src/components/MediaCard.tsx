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

const COVER_GRADIENTS = [
  'linear-gradient(155deg, #1a3a5c, #0f3460)',
  'linear-gradient(155deg, #3a1a3c, #1a1a2e)',
  'linear-gradient(155deg, #1a3c2a, #0f3460)',
  'linear-gradient(155deg, #3c2a1a, #16213e)',
  'linear-gradient(155deg, #2a1a3c, #1a1a2e)',
  'linear-gradient(155deg, #1a2a3c, #0f3460)',
  'linear-gradient(155deg, #3c1a2a, #16213e)',
]

interface MediaCardProps {
  item: Item
  isEditing: boolean
  onDelete?: (id: string) => void
  onStatusChange?: (id: string, status: ItemStatus) => void
}

export default function MediaCard({ item, isEditing, onDelete, onStatusChange }: MediaCardProps) {
  const isActive = item.status === 'reading' || item.status === 'watching'
  const gradient = COVER_GRADIENTS[item.title.charCodeAt(0) % COVER_GRADIENTS.length]

  return (
    <div className="group relative text-center">
      <div
        className="media-card relative w-full rounded-lg overflow-hidden cursor-pointer"
        style={{
          aspectRatio: '2/3',
          background: gradient,
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}
      >
        {item.cover_url && (
          <img
            src={item.cover_url}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Always-visible bottom gradient with title */}
        <div
          className="absolute inset-x-0 bottom-0 p-2.5"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 65%, transparent 100%)',
          }}
        >
          <p className="text-white font-semibold text-[10px] leading-snug mb-0.5 truncate">
            {item.title}
          </p>
          {item.creator && (
            <p className="text-[9px] truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {item.creator}
            </p>
          )}
        </div>

        {/* Active status dot */}
        {isActive && (
          <span
            className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
            style={{
              background: 'var(--accent-blue)',
              boxShadow: '0 0 6px rgba(79,163,224,0.6)',
            }}
          />
        )}

        {/* Edit overlay — only visible on hover in edit mode */}
        {isEditing && (
          <div
            className="media-card-edit-overlay absolute inset-0 flex flex-col justify-end p-2.5"
            style={{ background: 'rgba(0,0,0,0.75)' }}
          >
            <select
              value={item.status}
              onChange={(e) => onStatusChange?.(item.id, e.target.value as ItemStatus)}
              onClick={(e) => e.stopPropagation()}
              className="w-full text-[10px] rounded px-1.5 py-1 mb-1.5 outline-none"
              style={{
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.85)',
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
              className="w-full text-[10px] py-1 rounded text-center"
              style={{
                background: 'rgba(180,40,40,0.6)',
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Status label below card */}
      <div className="flex items-center justify-center gap-1 mt-1.5">
        <span
          className="inline-block w-1 h-1 rounded-full flex-shrink-0"
          style={{ background: STATUS_COLORS[item.status] }}
        />
        <span className="text-[10px]" style={{ color: STATUS_COLORS[item.status] }}>
          {STATUS_LABELS[item.status]}
        </span>
      </div>
    </div>
  )
}

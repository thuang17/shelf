'use client'

import { useState, useEffect, useRef } from 'react'
import type { SearchResult, ItemStatus, ItemType } from '@/types'

type SearchMode = 'books' | 'screen'

const STATUS_OPTIONS: Record<ItemType, { value: ItemStatus; label: string }[]> = {
  book: [
    { value: 'want_to_read', label: 'Want to read' },
    { value: 'reading', label: 'Reading' },
    { value: 'finished', label: 'Finished' },
  ],
  movie: [
    { value: 'want_to_watch', label: 'Want to watch' },
    { value: 'watching', label: 'Watching' },
    { value: 'finished', label: 'Finished' },
  ],
  series: [
    { value: 'want_to_watch', label: 'Want to watch' },
    { value: 'watching', label: 'Watching' },
    { value: 'finished', label: 'Finished' },
  ],
}

interface AddItemModalProps {
  slug: string
  editToken: string
  onClose: () => void
  onAdded: () => void
}

export default function AddItemModal({ slug, editToken, onClose, onAdded }: AddItemModalProps) {
  const [mode, setMode] = useState<SearchMode>('books')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selected, setSelected] = useState<SearchResult | null>(null)
  const [status, setStatus] = useState<ItemStatus>('want_to_read')
  const [searching, setSearching] = useState(false)
  const [adding, setAdding] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    setStatus(mode === 'books' ? 'want_to_read' : 'want_to_watch')
    setSelected(null)
    setResults([])
    setQuery('')
  }, [mode])

  async function handleSearch(q: string) {
    setQuery(q)
    if (q.length < 2) { setResults([]); return }
    setSearching(true)
    const endpoint = mode === 'books' ? '/api/search/books' : '/api/search/screen'
    const res = await fetch(`${endpoint}?q=${encodeURIComponent(q)}`)
    setResults(await res.json())
    setSearching(false)
  }

  async function handleAdd() {
    if (!selected) return
    setAdding(true)
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, editToken, item: { ...selected, status } }),
    })
    setAdding(false)
    onAdded()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-md rounded-xl overflow-hidden"
        style={{
          background: '#141414',
          border: '1px solid var(--border)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}
      >
        {/* Mode tabs */}
        <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
          {(['books', 'screen'] as SearchMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-3 text-xs font-medium transition-colors"
              style={{
                color: mode === m ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderBottom: mode === m ? '1px solid var(--text-primary)' : '1px solid transparent',
                background: 'transparent',
              }}
            >
              {m === 'books' ? 'Books' : 'Movies & Series'}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-4">
          <input
            ref={inputRef}
            type="text"
            placeholder={mode === 'books' ? 'Search books...' : 'Search movies & series...'}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="overflow-y-auto px-4 pb-2" style={{ maxHeight: '240px' }}>
            {results.slice(0, 8).map((r) => (
              <button
                key={r.external_id}
                onClick={() => setSelected(r)}
                className="w-full flex items-center gap-3 py-2 px-2 rounded-lg text-left"
                style={{
                  background: selected?.external_id === r.external_id
                    ? 'rgba(255,255,255,0.04)'
                    : 'transparent',
                }}
              >
                {r.cover_url ? (
                  <img
                    src={r.cover_url}
                    alt={r.title}
                    className="rounded flex-shrink-0"
                    style={{ width: '28px', height: '42px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="rounded flex-shrink-0"
                    style={{ width: '28px', height: '42px', background: 'var(--bg)' }}
                  />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {r.title}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: 'var(--text-secondary)' }}>
                    {[r.creator, r.year].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Status + Add */}
        {selected && (
          <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-medium mb-3 truncate" style={{ color: 'var(--text-primary)' }}>
              {selected.title}
            </p>
            <div className="flex gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ItemStatus)}
                className="flex-1 px-2 py-2 rounded-lg text-xs outline-none"
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                {STATUS_OPTIONS[selected.type].map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button
                onClick={handleAdd}
                disabled={adding}
                className="px-5 py-2 rounded-lg text-xs font-medium disabled:opacity-50"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: 'var(--text-primary)',
                }}
              >
                {adding ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

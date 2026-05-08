# Shelf UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Shelf's visual identity — dark editorial gallery with glass texture, cover-first layout, differentiated from list-based catalogs like Douban.

**Architecture:** All changes are UI-only modifications to existing components. No new files. No API changes. No database changes. Pure CSS + TSX restyling within the existing Next.js 15+ App Router structure.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS, CSS custom properties

---

## File Structure

```
src/
  app/
    globals.css                   # MODIFY: new color tokens, glass utility, card styles
    page.tsx                      # MODIFY: homepage redesign with glass card
    [slug]/
      ShelfClient.tsx             # MODIFY: glass nav, updated spacing
  components/
    MediaCard.tsx                 # MODIFY: always-visible text overlay, hover lift, edit overlay
    ShelfRow.tsx                  # MODIFY: section header styling, responsive grid
    FilterBar.tsx                 # MODIFY: pill buttons, glass active state
    AddItemModal.tsx              # MODIFY: glass modal styling
```

---

### Task 1: Global Styles

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace globals.css**

Replace the entire contents of `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #0a0a0b;
  --surface: #141414;
  --border: rgba(255, 255, 255, 0.06);
  --text-primary: rgba(255, 255, 255, 0.8);
  --text-secondary: rgba(255, 255, 255, 0.3);
  --text-muted: rgba(255, 255, 255, 0.15);
  --accent-blue: #4fa3e0;
  --accent-green: #4a9e6b;
}

* { box-sizing: border-box; }

body {
  background: var(--bg);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Glass surface — for nav bar and modals */
.glass {
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Card hover lift */
.media-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.media-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);
}

/* Edit overlay — only visible on hover in edit mode */
.media-card-edit-overlay {
  opacity: 0;
  transition: opacity 0.15s ease;
}
.media-card:hover .media-card-edit-overlay {
  opacity: 1;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.08); border-radius: 3px; }
```

- [ ] **Step 2: Verify dev server starts**

```bash
cd /Users/h3art/Documents/github/shelf && npm run dev &
sleep 3
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
kill %1 2>/dev/null
```
Expected: HTTP 200.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "refactor: dark gallery color system and glass utility styles"
```

---

### Task 2: Homepage Redesign

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace page.tsx**

Replace the entire contents of `src/app/page.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/shelf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Something went wrong')
      setLoading(false)
      return
    }

    router.push(`/${data.slug}?edit=${data.editToken}`)
  }

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-xs text-center">
        <h1
          className="mb-8"
          style={{
            fontSize: '36px',
            fontWeight: 200,
            color: 'var(--text-primary)',
            letterSpacing: '-0.8px',
          }}
        >
          shelf
        </h1>

        <form
          onSubmit={handleCreate}
          className="glass rounded-xl p-6"
          style={{ borderRadius: '14px' }}
        >
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            className="w-full text-center text-sm outline-none pb-2 mb-4"
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-primary)',
            }}
          />
          {error && (
            <p className="text-xs mb-3" style={{ color: '#e05555' }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-40"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: 'var(--text-primary)',
            }}
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/h3art/Documents/github/shelf && npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "refactor: homepage with glass card and minimal layout"
```

---

### Task 3: FilterBar Redesign

**Files:**
- Modify: `src/components/FilterBar.tsx`

- [ ] **Step 1: Replace FilterBar.tsx**

Replace the entire contents of `src/components/FilterBar.tsx`:

```tsx
'use client'

export type FilterValue = 'all' | 'books' | 'movies' | 'series' | 'reading' | 'finished' | 'want'

const TYPE_FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Books', value: 'books' },
  { label: 'Movies', value: 'movies' },
  { label: 'Series', value: 'series' },
]

const STATUS_FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'Reading', value: 'reading' },
  { label: 'Finished', value: 'finished' },
  { label: 'Want to', value: 'want' },
]

interface FilterBarProps {
  active: FilterValue
  onChange: (v: FilterValue) => void
}

export default function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-1.5 px-8 pb-8">
      {TYPE_FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className="px-3.5 py-1.5 text-xs rounded-full transition-colors"
          style={{
            background: active === f.value ? 'rgba(255,255,255,0.05)' : 'transparent',
            color: active === f.value ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: active === f.value ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
          }}
        >
          {f.label}
        </button>
      ))}
      <span className="inline-block w-px h-3.5 mx-1.5" style={{ background: 'var(--border)' }} />
      {STATUS_FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className="px-3.5 py-1.5 text-xs rounded-full transition-colors"
          style={{
            background: active === f.value ? 'rgba(255,255,255,0.05)' : 'transparent',
            color: active === f.value ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: active === f.value ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: TypeScript check**

```bash
cd /Users/h3art/Documents/github/shelf && npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/FilterBar.tsx
git commit -m "refactor: pill-shaped filter tabs with glass active state"
```

---

### Task 4: MediaCard Redesign

**Files:**
- Modify: `src/components/MediaCard.tsx`

- [ ] **Step 1: Replace MediaCard.tsx**

Replace the entire contents of `src/components/MediaCard.tsx`:

```tsx
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
```

- [ ] **Step 2: TypeScript check**

```bash
cd /Users/h3art/Documents/github/shelf && npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/MediaCard.tsx
git commit -m "refactor: MediaCard with always-visible overlay, hover lift, and edit overlay"
```

---

### Task 5: ShelfRow Update

**Files:**
- Modify: `src/components/ShelfRow.tsx`

- [ ] **Step 1: Replace ShelfRow.tsx**

Replace the entire contents of `src/components/ShelfRow.tsx`:

```tsx
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
      <div className="flex items-baseline gap-2 px-8 mb-3">
        <h2
          className="text-xs font-medium"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
        >
          {title}
        </h2>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {items.length}
        </span>
      </div>
      <div
        className="grid px-8"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '12px',
        }}
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
```

- [ ] **Step 2: TypeScript check**

```bash
cd /Users/h3art/Documents/github/shelf && npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ShelfRow.tsx
git commit -m "refactor: responsive ShelfRow with auto-fill grid"
```

---

### Task 6: AddItemModal Redesign

**Files:**
- Modify: `src/components/AddItemModal.tsx`

- [ ] **Step 1: Replace AddItemModal.tsx**

Replace the entire contents of `src/components/AddItemModal.tsx`:

```tsx
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
```

- [ ] **Step 2: TypeScript check**

```bash
cd /Users/h3art/Documents/github/shelf && npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/AddItemModal.tsx
git commit -m "refactor: glass-styled AddItemModal"
```

---

### Task 7: ShelfClient Redesign

**Files:**
- Modify: `src/app/[slug]/ShelfClient.tsx`

- [ ] **Step 1: Replace ShelfClient.tsx**

Replace the entire contents of `src/app/[slug]/ShelfClient.tsx`:

```tsx
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
        className="glass flex items-center justify-between px-8 py-3.5"
        style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
      >
        <div
          className="text-sm font-medium"
          style={{ letterSpacing: '-0.3px', color: 'var(--text-primary)' }}
        >
          shelf
          <span style={{ color: 'var(--text-muted)', fontWeight: 300 }}> / {shelf.owner_name}</span>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing && (
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="text-[11px]"
              style={{ color: 'var(--text-secondary)' }}
            >
              Share
            </button>
          )}
          {isEditing && (
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1.5 rounded-md text-[11px] font-medium"
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: 'var(--text-primary)',
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
```

- [ ] **Step 2: TypeScript check**

```bash
cd /Users/h3art/Documents/github/shelf && npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/\[slug\]/ShelfClient.tsx
git commit -m "refactor: ShelfClient with glass nav and updated layout"
```

---

### Task 8: Build Check + Deploy

**Files:** None

- [ ] **Step 1: Full build check**

```bash
cd /Users/h3art/Documents/github/shelf && npm run build
```
Expected: Build succeeds, all routes generated, no errors.

- [ ] **Step 2: Deploy to Vercel**

```bash
cd /Users/h3art/Documents/github/shelf && npx vercel --prod --yes
```
Expected: Successful production deployment.

- [ ] **Step 3: Verify live URL**

Open the production URL, create a shelf, verify:
- Homepage shows glass card centered on pure dark background (#0a0a0b)
- Shelf page shows glass nav bar
- Filter tabs are pill-shaped
- Cards show title/creator always visible
- Cards lift on hover
- Edit mode: hover shows edit overlay
- Modal has clean dark styling

- [ ] **Step 4: Final commit**

```bash
cd /Users/h3art/Documents/github/shelf && git add . && git commit -m "chore: UI redesign complete"
```

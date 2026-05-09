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
